import { cache, use } from 'react';
import { cookies } from 'next/headers';
import zh from './messages/zh.json';
import es from './messages/es.json';
import de from './messages/de.json';
import fr from './messages/fr.json';
import ja from './messages/ja.json';
const dictionaries = { zh, es, de, fr, ja };
import { asLocale, createTranslator, type Messages } from './shared';
export const getI18n = cache(async () => {
  const locale = asLocale((await cookies()).get('hsm-locale')?.value);
  let messages: Messages = {};
  if (locale !== 'en') messages = dictionaries[locale];
  return { locale, messages, t: createTranslator(messages) };
});
/** React use supports synchronous Server Components without making client-facing components async. */
export function useTranslations() { return use(getI18n()).t; }
