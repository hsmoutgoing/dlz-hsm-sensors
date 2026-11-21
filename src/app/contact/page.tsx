import { localizeMetadata } from "@/lib/i18n/metadata";
import { useTranslations, getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { INTENTS, type Intent } from "@/lib/contact-schema";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
 const {t, locale} = await getI18n();
 const metadata: Metadata = {
  title: "Contact — Request a Quote or Ask an Engineer",
  description:
    "Send your process conditions to the HSM Sensors engineering desk in Xiamen. Quotes, custom builds, datasheets and technical support — by form, email or phone.",
  alternates: { canonical: "/contact" },
};
 return localizeMetadata(metadata, t, locale);
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(input: string | string[] | undefined): string | undefined {
  if (Array.isArray(input)) return input[0];
  return input;
}

function parseIntent(input: string | undefined): Intent {
  return INTENTS.includes(input as Intent) ? (input as Intent) : "quote";
}

export default async function ContactPage({ searchParams }: PageProps) {
  const tx = (await getI18n()).t;

  const params = await searchParams;
  const intent = parseIntent(firstValue(params.intent));
  const modelCode = firstValue(params.model)?.slice(0, 60);

  // If the visitor arrived from a product page, resolve the family so the
  // form arrives pre-tagged and the enquiry can be routed without asking.
  const product = modelCode ? findByModelSymbol(modelCode) : undefined;

  return (
    <>
      <PageHero
        compact
        image={{ src: "/images/about-illustrations/materials.webp" }}
        eyebrow={tx("Contact")} 
        title={tx("Send the process conditions")} 
        lede={tx("Medium, pressure, temperature, pipe or vessel size, and the signal your control system accepts — that is enough for us to come back with a model, a price and a lead time.")} 
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        actions={[{ label: "Send the process conditions", href: "#enquiry", primary: true }, { label: "Direct contact", href: "#direct-contact" }]}
      />

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Form */}
          <div id="enquiry" tabIndex={-1} className="scroll-mt-24 lg:col-span-8">
            <ContactForm
              key={modelCode}
              showIntentShortcuts
              initialIntent={intent}
              initialModel={modelCode}
              initialCategory={product?.category}
            />
          </div>

          {/* Sidebar */}
          <aside id="direct-contact" tabIndex={-1} className="scroll-mt-24 lg:col-span-4">
            <div className="rounded-lg border border-ink-200 bg-ink-50 p-6">
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                {tx("Direct contact")} </h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[12px] text-ink-500">{tx("Email")} </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="break-all text-[14px] font-medium text-brand-600 hover:text-brand-700"
                    >
                      {site.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-500">{tx("Phone")} </dt>
                  <dd className="mt-0.5">
                    <a
                      href={site.contact.phoneHref}
                      className="text-[14px] font-medium text-ink-900 hover:text-brand-600"
                    >
                      {site.contact.phone}
                    </a>
                  </dd>
                </div>
                {site.contact.whatsapp && (
                  <div>
                    <dt className="text-[12px] text-ink-500">{tx("WhatsApp")} </dt>
                    <dd className="mt-0.5">
                      <a
                        href={`https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                        className="text-[14px] font-medium text-ink-900 hover:text-brand-600"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {tx("Message us")} </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[12px] text-ink-500">{tx("WeChat")} </dt>
                  <dd className="mt-0.5 font-mono text-[13.5px] text-ink-900">
                    {tx(site.contact.wechat)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-500">{tx("Hours")} </dt>
                  <dd className="mt-0.5 text-[13.5px] text-ink-800">{tx(site.contact.hours)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 rounded-lg border border-ink-200 bg-white p-6">
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                {tx("Factory")} </h2>
              <address className="mt-3 not-italic text-[13.5px] leading-relaxed text-ink-800">
                {tx(site.legalName)}
                <br />
                {tx(site.address.street)}
                <br />
                {tx(site.address.city)} {tx(site.address.postalCode)}, {tx(site.address.region)}
                <br />
                {tx(site.address.countryName)}
              </address>
            </div>

            <div className="mt-5 rounded-lg border border-ink-200 bg-white p-6">
              <h2 className="text-[14px] font-semibold tracking-tight text-ink-900">
                {tx("What speeds up a quote")} </h2>
              <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-ink-600">
                {[
                  "Medium and its concentration or viscosity",
                  "Operating temperature and pressure",
                  "Pipe size, thread standard or vessel depth",
                  "Control-system input: relay, 4–20 mA, 0–10 V or RS485",
                  "Quantity and required delivery date",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500"
                      aria-hidden="true"
                    />
                    <span>{tx(item)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-[12px] leading-relaxed text-ink-500">
              {tx("Already know the model?")} {tx(" ")} 
              <Link href="/products" className="font-medium text-brand-600 hover:text-brand-700">
                {tx("Find it in the catalogue")} </Link>{tx(" ")} 
              {tx("and the form arrives pre-filled.")} </p>
          </aside>
        </div>
      </section>
    </>
  );
}

/**
 * The catalogue keys on slug, but a product page passes the printed model
 * code (HSM10). Match on the model symbol so the family is pre-selected.
 */
function findByModelSymbol(code: string) {
  const needle = code.trim().toLowerCase();
  return products.find((p) => p.model.toLowerCase() === needle);
}
