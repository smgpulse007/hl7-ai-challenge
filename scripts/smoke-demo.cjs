const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createDemoApp } = require('../services/care-orchestration/demo-server.cjs');

(async () => {
  const server = createDemoApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(base);
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.match(html, /Care Gap Workflow Lab/);
    const asset = html.match(/src="([^"]+\.js)"/)[1];
    const script = await fetch(new URL(asset, base));
    assert.equal(script.status, 200);
    const source = await script.text();
    assert.match(source, /LOCAL SYNTHETIC DEMO/);
    assert.doesNotMatch(source, /XGBoost models trained on/);
    const members = await (await fetch(`${base}/care-gaps`)).json();
    assert.equal(members.length, 6);
    const response = await fetch(`${base}/member/demo-001/close-gap`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ measureType: 'CCS', closureReason: 'Synthetic review', evidence: 'Demo document' }),
    });
    assert.equal(response.status, 200);
    const stats = await (await fetch(`${base}/care-management-stats`)).json();
    assert.equal(stats.closed_gaps, 1);
    console.log('Built dashboard, bundled asset, six synthetic members, and real closure transition verified.');
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
