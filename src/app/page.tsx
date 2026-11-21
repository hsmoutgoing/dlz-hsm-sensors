import { localizeMetadata } from "@/lib/i18n/metadata";
import { useTranslations, getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeHero } from "@/components/home-hero";
import { categories } from "@/lib/categories";
import { featuredProducts } from "@/lib/products";
import { industries } from "@/lib/industries";
import { trustPoints } from "@/lib/site";
import { MediaFrame } from "@/components/media-frame";
import { PartnersStrip } from "@/components/partners-strip";

export async function generateMetadata(): Promise<Metadata> {
 const {t, locale} = await getI18n();
 const metadata: Metadata = {
  title: "Industrial Sensors — Flow, Level, Pressure, Temperature | HSM Sensors",
  description:
    "Factory-direct manufacturer of industrial flow switches, level transmitters, pressure transmitters, RTD sensors, ultrasonic and gas detectors. 4-20 mA, RS485 and relay outputs, custom ranges, worldwide shipping from Xiamen, China.",
  alternates: { canonical: "/" },
};
 return localizeMetadata(metadata, t, locale);
}

const guides = [
  { title: "Which output do you need?", href: "/resources#outputs", image: "/images/reference-style/guide-output.webp" },
  { title: "Six level principles, and when each one fails", href: "/resources#level-principles", image: "/images/reference-style/guide-level.webp" },
  { title: "Reading an IP code", href: "/resources#ingress-protection", image: "/images/reference-style/guide-ip.webp" },
];

export default function HomePage() {
  const tx = useTranslations();


  return (
    <>
      <HomeHero />
      <PartnersStrip />

      {/* P1: alternating product features, applications and capabilities */}
      <section className="p1-feature p1-feature-light">
        <MediaFrame className="p1-feature-image" src="/images/reference-style/feature-flow.webp" alt={tx("HSM20 Thermal Flow Switch")} sizes="(max-width: 767px) 100vw, 58vw" />
        <div className="p1-feature-copy">
          <h2>{tx(categories[0].name)}</h2>
          <p>{tx(categories[0].tagline)}</p>
          <p>{tx("Flow, level, pressure, temperature, ultrasonic and gas instrumentation for plant engineers and machine builders.")}</p>
          <div className="p1-actions"><Link href="/products/flow">{tx("View all products →")}</Link><Link href="/contact?intent=quote">{tx("Request a quote")}</Link></div>
        </div>
      </section>
      <section className="p1-feature p1-feature-dark">
        <div className="p1-feature-copy">
          <h2>{tx(categories[1].name)}</h2>
          <p>{tx(categories[1].tagline)}</p>
          <p>{tx("We build to order with custom lengths, threads, materials and output ranges.")}</p>
          <div className="p1-actions"><Link href="/products/level">{tx("View all products →")}</Link><Link href="/contact?intent=quote">{tx("Request a quote")}</Link></div>
        </div>
        <MediaFrame className="p1-feature-image" src="/images/reference-style/feature-level.webp" alt={tx("HPS10 submersible level transmitter")} sizes="(max-width: 767px) 100vw, 58vw" />
      </section>
      <section className="p1-applications">
        <div className="p1-wrap">
          <h2>{tx("Where these instruments run")}</h2>
          <div className="home-industry-grid">
            {industries.map((industry) => (
              <Link key={industry.id} className="home-industry-link group" href={`/industries/${industry.id}`}>
                <MediaFrame className="aspect-[16/10]" src={industry.image} alt="" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
                <h3>{tx(industry.name)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="p2-guides p2-wrap">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <h2>{tx("Selection guide")}</h2>
          <Link className="text-sm font-semibold text-brand-700 underline underline-offset-4" href="/resources">{tx("Resources")}</Link>
        </div>
        <p className="mb-6 max-w-prose text-ink-600">{tx("Compare measuring principles, output signals and environmental ratings to find a sensor for your application.")}</p>
        <div className="p2-guide-grid">
          {guides.map(({ title, href, image }) => (
            <article key={href}>
              <Link className="block" href={href}>
                <MediaFrame className="p2-guide-image" src={image} alt="" sizes="(max-width: 767px) 100vw, 33vw" />
                <div className="px-5 py-4"><h3>{tx(title)}</h3></div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="p2-stories p2-wrap">
        {trustPoints.slice(0, 2).map((point, index) => (
          <article key={point.title}>
            <MediaFrame className="p2-story-image" src={index === 0 ? "/images/reference-style/story-factory.webp" : "/images/reference-style/story-custom.webp"} alt="" sizes="(max-width: 767px) 100vw, 50vw" />
            <div className="p2-story-copy">
              <h2>{tx(point.title)}</h2>
              <p>{tx(point.body)}</p>
              <Link href={index === 0 ? "/about" : "/custom"}>{tx(index === 0 ? "About the company" : "Talk to an engineer →")}</Link>
            </div>
          </article>
        ))}
      </section>
      <section className="p2-products">
        <div className="p2-wrap"><h2>{tx("Workhorse models")}</h2><div className="p2-product-grid">{featuredProducts.filter((product) => product.model === "HSM10" || product.model === "HPS10").map((product) => <article key={product.slug}><MediaFrame className="p2-product-image" src={product.model === "HSM10" ? "/images/reference-style/product-flow.webp" : "/images/reference-style/product-level.webp"} alt={product.model + " " + tx(product.name)} sizes="(max-width: 767px) 100vw, 50vw" /><div className="p2-product-copy"><h3>{product.model} {tx(product.name)}</h3><p>{tx(product.summary)}</p><Link href={`/products/${product.category}/${product.slug}`}>{tx("View specifications")}</Link></div></article>)}</div></div>
      </section>
    </>
  );
}
