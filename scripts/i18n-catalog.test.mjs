import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const messagesDir = new URL('../src/lib/i18n/messages/', import.meta.url);
const productsDir = new URL('../src/lib/products/', import.meta.url);
const normalize = (text) => text.trim().replace(/\s+/g, ' ');
const locales = ['zh', 'es', 'de', 'fr', 'ja'];
const dictionaries = new Map(locales.map((locale) => {
  const file = new URL(`${locale}.json`, messagesDir);
  const entries = Object.entries(JSON.parse(readFileSync(file, 'utf8')));
  return [locale, new Map(entries.map(([key, value]) => [normalize(key), value]))];
}));
const proseFields = new Set(['name', 'summary', 'intro', 'highlights', 'applications', 'notes', 'title', 'label']);
// Some source fields mix prose with compact protocol and rating badges.
const invariantCopy = new Set(['ORP', 'H.264', 'H.265', 'IP68, Exib IIC T4', 'Exd IIC T6 Gb, IP68', '35 g', 'IP67, 38 g']);

function productCopy(filename) {
  const path = new URL(filename, productsDir);
  const source = ts.createSourceFile(filename, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  const copy = new Set();
  function visit(node) {
    if (ts.isPropertyAssignment(node) && proseFields.has(node.name.getText(source))) {
      const value = node.initializer;
      const entries = ts.isArrayLiteralExpression(value) ? value.elements : [value];
      for (const entry of entries) {
        if (ts.isStringLiteralLike(entry)) copy.add(normalize(entry.text));
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return [...copy];
}

for (const file of readdirSync(productsDir).filter((name) => name.endsWith('.ts') && name !== 'index.ts')) {
  test(`${file} product descriptions and specification labels have translations`, () => {
    const copy = productCopy(file);
    assert.ok(copy.length > 0);
    for (const [locale, dictionary] of dictionaries) {
      const missing = copy.filter((text) => !invariantCopy.has(text) && !dictionary.get(text)?.trim());
      assert.equal(missing.length, 0, `${locale} misses ${missing.length} keys: ${missing.slice(0, 5).join(' | ')}`);
    }
  });
}
