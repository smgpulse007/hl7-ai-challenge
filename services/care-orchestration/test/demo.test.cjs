const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const http = require('node:http');
const { createDemoApp } = require('../demo-server.cjs');

async function fixture(t) {
  const server = createDemoApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  return async (route, body, headers = {}) => {
    if (headers.Host) {
      return new Promise((resolve, reject) => {
        const request = http.get(base + route, { headers }, response => {
          let content = '';
          response.on('data', chunk => { content += chunk; });
          response.on('end', () => resolve({ status: response.statusCode, data: JSON.parse(content) }));
        });
        request.on('error', reject);
      });
    }
    const response = await fetch(base + route, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) });
    return { status: response.status, data: await response.json() };
  };
}
const closure = { measureType: 'CCS', closureReason: 'Synthetic review', evidence: 'Demo document inspected' };

test('health and six synthetic members are real HTTP responses', async t => {
  const request = await fixture(t);
  assert.equal((await request('/health')).data.external_actions, false);
  const { data } = await request('/care-gaps');
  assert.equal(data.length, 6);
  assert.ok(data.every(m => m.synthetic && m.gap_status === 'open'));
  assert.equal((await request('/care-management-stats')).data.high_risk, 2);
});
test('closure changes state and counts, repeated closure is idempotent', async t => {
  const request = await fixture(t);
  assert.equal((await request('/member/demo-001/close-gap', closure)).data.already_closed, false);
  assert.equal((await request('/member/demo-001')).data.gap_status, 'closed');
  assert.equal((await request('/care-management-stats')).data.closed_gaps, 1);
  assert.equal((await request('/member/demo-001/close-gap', closure)).data.already_closed, true);
  assert.equal((await request('/demo/events')).data.events.length, 1);
});
test('closure requires matching measure and nonempty bounded review evidence', async t => {
  const request = await fixture(t);
  for (const body of [{}, { ...closure, measureType: 'COL' }, { ...closure, evidence: ' ' }, { ...closure, closureReason: 7 }, { ...closure, evidence: 'x'.repeat(501) }]) {
    assert.equal((await request('/member/demo-001/close-gap', body)).status, 400);
  }
  assert.equal((await request('/demo/events')).data.events.length, 0);
});
test('concurrent repeated closure creates exactly one event', async t => {
  const request = await fixture(t);
  const results = await Promise.all(Array.from({ length: 8 }, () => request('/member/demo-001/close-gap', closure)));
  assert.ok(results.every(result => result.status === 200));
  assert.equal(results.filter(result => !result.data.already_closed).length, 1);
  assert.equal((await request('/demo/events')).data.events.length, 1);
});
test('malformed JSON returns the visible error contract without changing state', async t => {
  const request = await fixture(t);
  const result = await request('/member/demo-001/close-gap', '{broken');
  assert.equal(result.status, 400);
  assert.deepEqual(result.data, { error: 'Invalid JSON request.' });
  assert.equal((await request('/demo/events')).data.events.length, 0);
});
test('unknown members are rejected for reads and both actions', async t => {
  const request = await fixture(t);
  assert.equal((await request('/member/nope')).status, 404);
  assert.equal((await request('/member/nope/alert', { alertType: 'text', message: 'demo' })).status, 404);
  assert.equal((await request('/member/nope/close-gap', closure)).status, 404);
});
test('outreach is explicitly simulated and exportable; invalid alerts do not create events', async t => {
  const request = await fixture(t);
  assert.equal((await request('/member/demo-001/alert', { alertType: 'email', message: 'demo' })).status, 400);
  assert.equal((await request('/member/demo-001/alert', { alertType: 'text', message: '' })).status, 400);
  const result = await request('/member/demo-001/alert', { alertType: 'text', message: 'demo' });
  assert.equal(result.data.event.status, 'simulated');
  assert.equal((await request('/demo/events')).data.events.length, 1);
});
test('reset restores members and clears the event history', async t => {
  const request = await fixture(t);
  await request('/member/demo-001/close-gap', closure);
  assert.equal((await request('/demo/reset', {})).status, 200);
  assert.equal((await request('/member/demo-001')).data.gap_status, 'open');
  assert.deepEqual((await request('/demo/events')).data.events, []);
});
test('separate app instances do not share demo state', async t => {
  const first = await fixture(t);
  const second = await fixture(t);
  await first('/member/demo-001/close-gap', closure);
  assert.equal((await second('/member/demo-001')).data.gap_status, 'open');
});
test('cross-origin mutation and unexpected Host are rejected', async t => {
  const request = await fixture(t);
  assert.equal((await request('/demo/reset', {}, { Origin: 'https://example.org' })).status, 403);
  assert.equal((await request('/health', undefined, { Host: 'example.org' })).status, 403);
});
test('request size and event limits are enforced', async t => {
  const request = await fixture(t);
  assert.equal((await request('/member/demo-001/alert', { message: 'x'.repeat(20000) })).status, 413);
  for (let i = 0; i < 100; i++) assert.equal((await request('/member/demo-001/alert', { alertType: 'text', message: 'synthetic' })).status, 200);
  assert.equal((await request('/member/demo-001/alert', { alertType: 'text', message: 'overflow' })).status, 409);
  assert.equal((await request('/member/demo-001/close-gap', closure)).status, 409);
  assert.equal((await request('/demo/events')).data.events.length, 100);
});
