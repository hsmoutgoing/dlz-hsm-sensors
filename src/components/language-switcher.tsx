'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from '@/lib/i18n/client';
import { locales, localeNames } from '@/lib/i18n/shared';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative shrink-0">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-500">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 6.5h14M5 17.5h14" />
      </svg>
      <select
        aria-label={t('Language')}
        aria-busy={busy}
        aria-describedby={failed ? 'language-error' : undefined}
        value={locale}
        disabled={busy}
        className="max-w-[132px] rounded border border-ink-200 bg-white pl-8 pr-2 py-2 text-[12px] text-ink-800 disabled:opacity-60"
        onChange={async (event) => {
          const selected = event.target.value;
          if (selected === locale) return;
          setBusy(true);
          setFailed(false);
          try {
            const response = await fetch('/api/locale', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ locale: selected }),
            });
            if (!response.ok) throw new Error('Locale update failed');
            window.location.reload();
          } catch {
            setBusy(false);
            setFailed(true);
          }
        }}
      >
        {locales.map((code) => <option key={code} value={code}>{localeNames[code]}</option>)}
      </select>
      {failed && <span id="language-error" role="alert" className="absolute right-0 top-full mt-1 w-48 rounded border border-ink-200 bg-white p-2 text-xs text-red-700 shadow">{t('Could not change language. Please try again.')}</span>}
    </div>
  );
}
