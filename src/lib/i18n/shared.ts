export const locales = ['en', 'zh', 'es', 'de', 'fr', 'ja'] as const;
export type Locale = typeof locales[number];
export type Messages = Record<string, string>;
export const localeNames: Record<Locale, string> = { en: 'English', zh: '中文', es: 'Español', de: 'Deutsch', fr: 'Français', ja: '日本語' };
export function asLocale(value: unknown): Locale { return locales.includes(value as Locale) ? value as Locale : 'en'; }
export function createTranslator(messages: Messages) {
  const normalized = new Map(Object.entries(messages).map(([k,v]) => [k.replace(/\s+/g, ' ').trim(), v]));
  return function t<T>(value: T, params?: Readonly<Record<string, string | number>>): T {
    if (typeof value !== 'string' || !value.trim()) return value;
    // Never translate raw numeric values or standalone model/protocol identifiers.
    if (/^[\d\s.,+−–—/%°±×x:;()]+$/.test(value) || /^(?:[A-Z]+[-/]?\d+[A-Z\d-]*|RS485|Modbus|316L|SUS 316L)$/i.test(value.trim())) return value;
    const translated = messages[value] || normalized.get(value.replace(/\s+/g, ' ').trim());
    const message = typeof translated === 'string' && translated ? translated : value;
    return (params ? message.replace(/\{(\w+)\}/g, (placeholder: string, name: string) => (
      Object.hasOwn(params, name) ? String(params[name]) : placeholder
    )) : message) as T;
  };
}
