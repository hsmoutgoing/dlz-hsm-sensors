import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Run against a local Next server: node --test scripts/i18n-render.test.mjs
const origin = process.env.I18N_TEST_ORIGIN ?? 'http://localhost:3000';
const locales = ['zh', 'es', 'de', 'fr', 'ja'];
const dictionaries = Object.fromEntries(locales.map((locale) => [locale, JSON.parse(
  readFileSync(new URL(`../src/lib/i18n/messages/${locale}.json`, import.meta.url), 'utf8'),
)]));
const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
const normalize = (text) => text.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
  if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
  if (entity.startsWith('#')) return String.fromCodePoint(Number(entity.slice(1)));
  return entities[entity];
}).replace(/\s+/g, ' ').trim();

const cases = {
  '/': ['Compare measuring principles, output signals and environmental ratings', 'Dust-tight; protected against temporary immersion', 'Carousel controls', 'Play slideshow', 'carousel', 'HSM Sensors home'],
  '/industries': ['Leak detection on long lines', 'HSM laser methane detector'],
  '/about': ['Factory tour and project documents', 'Our factory configures measuring ranges'],
  '/resources': ['Industrial sensor output signals, their typical use', 'Request the datasheet, dimensioned drawing or certificates'],
  '/custom': ['We recommend a model, identify any changes needed'],
  '/products': ['The full catalogue'],
  '/products/flow': ['What it measures', 'Available outputs'],
  '/products/flow/hsm20-thermal-flow-switch-dual': [
    'The HSM20 is the HSM10 with two set-points instead of one.',
    'Two independent set-points — warning and trip from one probe',
  ],
  '/products/flow/hsm10-thermal-flow-switch': [
    'How it works',
    'Request the PDF datasheet',
    'Values are for the standard configuration',
    'The HSM10 detects flow by heating a probe',
    'No moving parts in the flow path',
    'Pump dry-run protection on water and coolant loops',
    'Relay, PNP, NPN or 4–20 mA (specify at order)',
  ],
  '/terms': ['These terms cover the website'],
};

async function render(path, locale, cookie = `hsm-locale=${locale}`) {
  const response = await fetch(new URL(path, origin), {
    headers: { Cookie: cookie },
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, new RegExp(`<html\\b[^>]*\\blang="${locale}"`));
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  const accessibleLabels = [...markup.matchAll(/\b(?:alt|aria-label|aria-roledescription)="([^"]*)"/g)]
    .map((match) => match[1]);
  const description = markup.match(/<meta\b[^>]*\bname="description"[^>]*\bcontent="([^"]*)"/i)?.[1] ?? '';
  return normalize([markup.replace(/<[^>]+>/g, ' '), description, ...accessibleLabels].join(' '));
}

test('the language switch sets the locale used on the next page request', async () => {
  const response = await fetch(new URL('/api/locale', origin), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: new URL(origin).origin },
    body: JSON.stringify({ locale: 'ja' }),
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie')?.split(';', 1)[0];
  assert.ok(cookie);
  const page = await render('/', 'ja', cookie);
  assert.ok(page.includes(dictionaries.ja['Request a quote']));
});

test('image surfaces omit captions in all supported languages', async () => {
  const paths = ['/', '/about', '/products', '/products/flow', '/products/flow/hsm10-thermal-flow-switch'];
  await Promise.all(['en', ...locales].map(async (locale) => {
    for (const path of paths) {
      const response = await fetch(new URL(path, origin), {
        headers: { Cookie: `hsm-locale=${locale}` },
        signal: AbortSignal.timeout(30_000),
      });
      assert.equal(response.status, 200);
      const markup = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
      assert.ok(markup.includes(`<html lang="${locale}"`), `${path} did not render ${locale}`);
      assert.equal(/\bscene-label\b/.test(markup), false, `${locale} ${path} renders an image caption`);
    }
  }));
});

test('Japanese product copy orders the model and category naturally', async () => {
  const page = await render('/products/flow/hsm10-thermal-flow-switch', 'ja');
  assert.ok(page.includes('HSM10の技術仕様'));
  assert.ok(page.includes('流量の全モデル'));
  assert.ok(page.includes('HSM10 熱式フロースイッチの画像1を表示'));
});

for (const [path, snippets] of Object.entries(cases)) {
  test(`${path} renders the requested language without known English fallbacks`, async () => {
    const english = await render(path, 'en');
    for (const snippet of snippets) {
      assert.ok(english.includes(snippet), `English control lacks “${snippet}”`);
    }

    const pages = await Promise.all(locales.map(async (locale) => [locale, await render(path, locale)]));
    const fallbacks = pages.flatMap(([locale, page]) => snippets
      .filter((snippet) => page.includes(snippet))
      .map((snippet) => `${locale}: ${snippet}`));
    assert.deepEqual(fallbacks, []);
    for (const [locale, page] of pages) {
      const messages = dictionaries[locale];
      for (const snippet of snippets) {
        const key = Object.hasOwn(messages, snippet) ? snippet
          : Object.keys(messages).find((candidate) => candidate.startsWith(snippet));
        assert.ok(key, `${locale} dictionary lacks “${snippet}”`);
        assert.ok(page.includes(normalize(messages[key])), `${locale} page lacks “${messages[key]}”`);
      }
    }
  });
}
