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

test('model gallery precedes the product heading and links to related applications', async () => {
  const html = await page('/products/flow/hsm10-thermal-flow-switch');
  const gallery = html.indexOf('class="p3-gallery-main"');
  assert.ok(gallery >= 0 && gallery < html.indexOf('id="product-heading"'));
  assertJump(html, 'applications');
});

test('industry hub links to six standalone guides with a direct enquiry path', async () => {
  const html = await page('/industries');
  const routes = [...new Set([...html.matchAll(/href="(\/industries\/[a-z-]+)"/g)].map((m) => m[1]))];
  assert.equal(routes.length, 6);
  for (const route of routes) {
    const guide = await page(route);
    assert.equal(guide.match(/<h1\b/g)?.length, 1);
    assert.ok(guide.includes('href="/contact?intent=quote#enquiry"'));
  }
});

test('model enquiries keep the model across contact shortcuts', async () => {
  const product = await page('/products/flow/hsm10-thermal-flow-switch');
  assert.ok(product.includes('href="/contact?intent=datasheet&amp;model=HSM10#enquiry"'));
  assert.ok(/href="mailto:[^"]+\?subject=Datasheet%20request[^"]+HSM10"/.test(product));

  const contact = await page('/contact?intent=datasheet&model=HSM10');
  for (const intent of ['quote', 'custom', 'datasheet', 'support']) {
    assert.ok(contact.includes(`href="/contact?intent=${intent}&amp;model=HSM10#enquiry"`));
  }
});

test('enquiry pages offer email while the client form loads', async () => {
  for (const path of ['/contact', '/custom']) {
    const html = await page(path);
    assert.ok(/<form\b[^>]*\bhidden(?:="")?(?:\s|>)/.test(html));
    assert.ok(/<a\b[^>]*\bhref="mailto:[^"]+"[^>]*>Email an engineer/.test(html));
  }
});

test('pharmaceutical guide links to the HSM41 model', async () => {
  const html = await page('/industries/pharma');
  assert.ok(html.includes('href="/products/motion/hsm41-laser-displacement-sensor"'));
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
