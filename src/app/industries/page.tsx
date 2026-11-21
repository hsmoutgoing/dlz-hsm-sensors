import { localizeMetadata } from "@/lib/i18n/metadata";
import { useTranslations, getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { MediaFrame } from "@/components/media-frame";
import { industries } from "@/lib/industries";
import type { Metadata } from "next";
import { PageHero, QuoteCta } from "@/components/page-hero";

export async function generateMetadata(): Promise<Metadata> {
 const {t, locale} = await getI18n();
 const metadata: Metadata = {
  title: "Industries — Oil & Gas, Water, Chemical, Power, Food",
  description:
    "How HSM industrial sensors are specified for oil and gas, chemical, water treatment, power generation, food and beverage, and pharmaceutical duties — including hazardous area, sanitary and high-pressure variants.",
  alternates: { canonical: "/industries" },
};
 return localizeMetadata(metadata, t, locale);
}

export default function IndustriesPage() {
  const tx = useTranslations();
  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Where these instruments run"
        lede="Choose an industry to explore typical measurement tasks and the instruments used for them."
        image={{ src: "/images/reference-style/guide-level.webp" }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        actions={[
          { label: "Applications", href: "#industry-guides", primary: true },
          { label: "Browse the catalogue", href: "/products" },
        ]}
      />
      <section id="industry-guides" tabIndex={-1} className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-14 sm:px-8 lg:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-ink-900">{tx("Applications")}</h2>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <article id={industry.id} key={industry.id} className="scroll-mt-24">
              <Link className="group block" href={`/industries/${industry.id}`}>
                <MediaFrame className="aspect-[16/10] rounded-sm" src={industry.image} alt={tx(industry.imageAlt)} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
                <h3 className="mt-4 text-xl font-semibold group-hover:text-brand-700">{tx(industry.name)}</h3>
              </Link>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-600">{tx(industry.lede)}</p>
            </article>
          ))}
        </div>
      </section>
      <QuoteCta />
    </>
  );
}
