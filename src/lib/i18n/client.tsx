'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createTranslator, type Locale, type Messages } from './shared';
const Context = createContext<{ locale: Locale; messages: Messages }>({locale: 'en', messages: {}});
export function I18nProvider({ locale, messages, children }: {locale: Locale; messages: Messages; children: ReactNode}) {
  const value = useMemo(() => ({locale, messages}), [locale, messages]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLocale() { return useContext(Context).locale; }
export function useTranslations() { const {messages} = useContext(Context); return useMemo(() => createTranslator(messages), [messages]); }
