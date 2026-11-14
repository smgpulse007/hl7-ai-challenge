'use strict';

const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const { createDemoState } = require('./demo-state.cjs');

function createDemoApp() {
  const app = express();
  const state = createDemoState();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    const host = req.get('host') || '';
    if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) {
      return res.status(403).json({ error: 'This demo is available on localhost only.' });
    }
    const origin = req.get('origin');
    if (!['GET', 'HEAD'].includes(req.method) && origin && origin !== `http://${host}`) {
      return res.status(403).json({ error: 'Cross-origin actions are disabled.' });
    }
    res.set('Cache-Control', 'no-store');
    res.set('X-Content-Type-Options', 'nosniff');
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  app.get('/health', (_req, res) => res.json({ status: 'healthy', mode: 'synthetic', persistence: 'memory', external_actions: false }));
  app.get(['/care-gaps', '/members'], (_req, res) => res.json(state.members));
  app.get('/care-management-stats', (_req, res) => res.json(state.statistics()));
  app.get('/demo/events', (_req, res) => res.json({ synthetic: true, events: state.events }));
  app.post('/demo/reset', (_req, res) => { state.reset(); res.json({ success: true, synthetic: true }); });
  app.use('/member/:memberId', (req, res, next) => {
    req.member = state.members.find(member => member.member_id === req.params.memberId);
    if (!req.member) return res.status(404).json({ error: 'Demo member not found.' });
    next();
  });
  app.get('/member/:memberId', (req, res) => res.json(req.member));
  const boundedText = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 500;
  app.post('/member/:memberId/alert', (req, res) => {
    const { alertType, message } = req.body || {};
    if (!['text', 'reminder'].includes(alertType) || !boundedText(message)) {
      return res.status(400).json({ error: 'Use text or reminder and a message of 1–500 characters.' });
    }
    if (state.full) return res.status(409).json({ error: 'Demo event limit reached. Export events, then reset.' });
    const event = state.append('outreach_simulated', { member_id: req.member.member_id, alert_type: alertType, message: message.trim(), status: 'simulated' });
    res.json({ success: true, message: 'Outreach simulated. No message was sent.', event });
  });
  app.post('/member/:memberId/close-gap', (req, res) => {
    const { measureType, closureReason, evidence } = req.body || {};
    if (measureType !== req.member.measure_type || !boundedText(closureReason) || !boundedText(evidence)) {
      return res.status(400).json({ error: 'A matching measure, review reason, and evidence of 1–500 characters are required.' });
    }
    if (req.member.gap_status === 'closed') {
      return res.json({ success: true, already_closed: true, closure: req.member.closure });
    }
    if (state.full) return res.status(409).json({ error: 'Demo event limit reached. Export events, then reset.' });
    const event = state.append('gap_closed', { member_id: req.member.member_id, measure_type: measureType, closure_reason: closureReason.trim(), evidence: evidence.trim(), status: 'closed' });
    req.member.gap_status = 'closed';
    req.member.closure = event;
    res.json({ success: true, already_closed: false, closure: event });
  });
  const build = path.resolve(__dirname, '../dashboard/build');
  if (fs.existsSync(path.join(build, 'index.html'))) app.use(express.static(build));
  app.use((_req, res) => res.status(404).json({ error: 'Route not found. Run npm run build:demo before opening the dashboard.' }));
  app.use((error, _req, res, _next) => {
    const status = error.type === 'entity.too.large' ? 413 : error.type === 'entity.parse.failed' ? 400 : 500;
    res.status(status).json({ error: status === 413 ? 'Request exceeds 16 KB.' : status === 400 ? 'Invalid JSON request.' : 'Demo request failed.' });
  });
  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4177);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535.');
  const server = createDemoApp().listen(port, '127.0.0.1', () => console.log(`Synthetic demo: http://127.0.0.1:${port} (memory only; no external actions)`));
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? 'Port already in use; choose another PORT.' : 'Unable to start demo server.'); process.exitCode = 1; });
}

module.exports = { createDemoApp };
