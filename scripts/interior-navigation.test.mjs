import assert from 'node:assert/strict';
import { test } from 'node:test';

const origin = process.env.I18N_TEST_ORIGIN ?? 'http://localhost:3000';

async function page(path) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200);
  return (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function assertJump(html, id) {
  assert.ok(html.includes(`href="#${id}"`), `missing link to #${id}`);
  assert.equal(html.match(new RegExp(`\\bid="${id}"`, 'g'))?.length, 1, `expected one #${id} target`);
}

test('product overview and model-specific quote precede the technical data', async () => {
  const html = await page('/products/flow/hsm10-thermal-flow-switch');
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  const technicalData = html.indexOf('id="technical-data-heading"');
  const summary = html.indexOf('Thermal-dispersion flow switch with a single adjustable set-point');
  const quote = html.indexOf('href="/contact?intent=quote&amp;model=HSM10#enquiry"');
  assert.ok(summary >= 0 && technicalData > summary, 'overview should precede technical data');
  assert.ok(quote >= 0 && technicalData > quote, 'quote should precede technical data');
  assertJump(html, 'technical-data');
});

test('resource links jump to each guide', async () => {
  const html = await page('/resources');
  for (const id of ['outputs', 'level-principles', 'ingress-protection', 'catalogue']) {
    assertJump(html, id);
  }
});

test('catalogue, family and contact pages provide direct access to their primary content', async () => {
  for (const [path, id] of [['/products', 'catalogue'], ['/products/flow', 'models'], ['/contact', 'enquiry']]) {
    assertJump(await page(path), id);
  }
});
