import { NextResponse } from 'next/server';
import { locales } from '@/lib/i18n/shared';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  // Next's development server can normalize request.url to localhost even
  // when the browser opened 127.0.0.1. Check the actual HTTP Host too.
  if (origin) {
    let validOrigin = false;
    try {
      const source = new URL(origin);
      const target = new URL(request.url);
      const host = request.headers.get('host');
      validOrigin = source.origin === target.origin ||
        (source.protocol === target.protocol && source.host === host);
    } catch { /* Malformed/opaque origins are not same-origin. */ }
    if (!validOrigin) return NextResponse.json({error:'Invalid origin'}, {status:403});
  }
  let locale: unknown;
  try { const payload: unknown = await request.json(); locale = payload && typeof payload === 'object' && 'locale' in payload ? payload.locale : undefined; } catch { return NextResponse.json({error:'Invalid request'}, {status:400}); }
  if (!locales.includes(locale as typeof locales[number])) return NextResponse.json({error:'Invalid locale'}, {status:400});
  const response = NextResponse.json({ok:true});
  response.cookies.set('hsm-locale', String(locale), {httpOnly:true, sameSite:'lax', path:'/', maxAge:31536000, secure:new URL(request.url).protocol === 'https:'});
  return response;
}
