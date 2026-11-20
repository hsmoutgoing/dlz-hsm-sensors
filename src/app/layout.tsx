import { localizeMetadata } from "@/lib/i18n/metadata";
import type { Metadata, Viewport } from "next";
import { Poppins, Work_Sans, JetBrains_Mono } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema } from "@/lib/structured-data";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
import { InteractionEffects } from "@/components/interaction-effects";
import { getI18n } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-spec",
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
 const {t, locale} = await getI18n();
 const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
};
 return localizeMetadata(metadata, t, locale);
}

export const viewport: Viewport = {
  themeColor: "#0b4f8a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, messages, t } = await getI18n();
  return (
    <html lang={locale} className={`${poppins.variable} ${workSans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-white text-ink-900 antialiased">
        <I18nProvider locale={locale} messages={messages}>
        <JsonLd data={organizationSchema()} />
        <a href="#main" className="skip-link">
          {t("Skip to content")}
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <InteractionEffects />
        </I18nProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
