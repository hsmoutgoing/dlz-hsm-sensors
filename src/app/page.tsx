import { localizeMetadata } from "@/lib/i18n/metadata";
import { useTranslations, getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/categories";
import { featuredProducts } from "@/lib/products";
import { generatedProductImage } from "@/lib/generated-product-images";
import { trustPoints } from "@/lib/site";

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

const applications = [
  {
    title: "Oil & gas",
    body: "Differential pressure, level and methane detection for separators, storage and gathering lines.",
    metric: "ATEX-grade housings",
  },
  {
    title: "Water & wastewater",
    body: "Submersible level, thermal flow switches and dissolved oxygen for treatment and networks.",
    metric: "IP68 submersible",
  },
  {
    title: "Chemical & petrochemical",
    body: "Capacitive and magnetic level plus pressure control for aggressive and coating media.",
    metric: "316L wetted parts",
  },
  {
    title: "Power generation",
    body: "Fibre-optic hotspot sensing, steam-side pressure and boiler level instrumentation.",
    metric: "100 kV rated",
  },
  {
    title: "Food & beverage",
    body: "Sanitary PEEK and stainless level switches, RTD probes and pH/DO analysis.",
    metric: "Hygienic designs",
  },
  {
    title: "Machine building",
    body: "Ultrasonic, laser and encoder feedback for automation and packaging equipment.",
    metric: "OEM quantities",
  },
];

export default function HomePage() {
  const tx = useTranslations();


  return (
    <>
      <HomeHero />
      <section className="p0-trust" aria-label={tx("Factory-direct")}>
        <div className="p0-trust-inner">
          {trustPoints.map((point) => <div key={point.title}><h2>{tx(point.title)}</h2><p>{tx(point.body)}</p></div>)}
        </div>
      </section>

      {/* P1: alternating product features, applications and capabilities */}
      <section className="p1-feature p1-feature-light">
        <div className="p1-feature-image"><Image src="/images/reference-style/feature-flow.webp" alt={tx("HSM20 Thermal Flow Switch")} fill sizes="(max-width: 767px) 100vw, 58vw" /><span className="scene-label">{tx("Illustrative image")}</span></div>
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
          <p>{tx("Non-standard lengths, threads, materials and output ranges are built to order, not refused.")}</p>
          <div className="p1-actions"><Link href="/products/level">{tx("View all products →")}</Link><Link href="/contact?intent=quote">{tx("Request a quote")}</Link></div>
        </div>
        <div className="p1-feature-image"><Image src="/images/reference-style/feature-level.webp" alt={tx("HPS10 submersible level transmitter")} fill sizes="(max-width: 767px) 100vw, 58vw" /><span className="scene-label">{tx("Illustrative image")}</span></div>
      </section>
      <section className="p1-applications">
        <div className="p1-wrap">
          <h2>{tx("Where these instruments run")}</h2>
          <div className="p1-application-grid">
            {applications.slice(0, 4).map((application) => <article key={application.title}>
              <h3>{tx(application.title)}</h3><p>{tx(application.body)}</p><Link href="/industries">{tx("Industry applications →")}</Link>
            </article>)}
          </div>
          <div className="p1-capabilities">
            <h2>{tx("You are dealing with the factory, not a trading desk")}</h2>
            <p>{tx("Everything in this catalogue is assembled, calibrated and tested in Jimei District, Xiamen. The engineering team that answers your enquiry is the same team that sets the production parameters — which is why a non-standard thread or a 450 °C version is a normal order rather than an exception.")}</p>
            <div className="p1-capability-grid">{trustPoints.slice(0, 3).map((point) => <article key={point.title}><h3>{tx(point.title)}</h3><p>{tx(point.body)}</p><Link href={point.title === "Factory-direct" ? "/about" : point.title === "Custom ranges" ? "/custom" : "/contact?intent=quote"}>{tx(point.title === "Factory-direct" ? "About the company" : point.title === "Custom ranges" ? "Talk to an engineer →" : "Request a quote")}</Link></article>)}</div>
          </div>
        </div>
      </section>

      {/* P2: company capabilities, guides and product highlights */}
      <section className="p2-stories p2-wrap">
        {trustPoints.slice(0, 2).map((point, index) => <article key={point.title}><div className="p2-story-image"><Image src={index === 0 ? "/images/reference-style/story-factory.webp" : "/images/reference-style/story-custom.webp"} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" /><span className="scene-label">{tx("Illustrative image")}</span></div><div className="p2-story-copy"><h2>{tx(point.title)}</h2><p>{tx(point.body)}</p><Link href={point.title === "Factory-direct" ? "/about" : "/custom"}>{tx(point.title === "Factory-direct" ? "About the company" : "Talk to an engineer →")}</Link></div></article>)}
      </section>
      <section className="p2-banner">
        <div><h2>{tx("Specifying an instrument without a sales call")}</h2><p>{tx("Three things decide most sensor orders: the measuring principle, the output signal your panel accepts, and the environmental rating. These pages cover all three, so an enquiry can start from a shortlist rather than a blank page.")}</p><Link href="/resources">{tx("Selection guide")}</Link></div>
        <div className="p2-banner-image"><Image src="/images/reference-style/resource-banner.webp" alt="" fill sizes="(max-width: 767px) 100vw, 50vw" /><span className="scene-label">{tx("Illustrative image")}</span></div>
      </section>
      <section className="p2-guides p2-wrap">
        <h2>{tx("Resources")}</h2>
        <div className="p2-guide-grid">
          {[{title:"Which output do you need?", text:"The output is usually the first thing to fix, because it decides what the control system has to do with the measurement — and whether you need a control system at all.", href:"/resources#outputs", image:"/images/reference-style/guide-output.webp"}, {title:"Six level principles, and when each one fails", text:"Float, magnetic, capacitive, submersible and magnetostrictive level measurement", href:"/resources", image:"/images/reference-style/guide-level.webp"}, {title:"Reading an IP code", text:"Dust-tight; protected against temporary immersion to 1 m for 30 minutes.", href:"/resources", image:"/images/reference-style/guide-ip.webp"}].map((guide) => <article key={guide.title}><div className="p2-guide-image"><Image src={guide.image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" /><span className="scene-label">{tx("Illustrative image")}</span></div><div><h3>{tx(guide.title)}</h3><p>{tx(guide.text)}</p><Link href={guide.href}>{tx("Selection guide")}</Link></div></article>)}
        </div>
      </section>
      <section className="p2-products">
        <div className="p2-wrap"><h2>{tx("Workhorse models")}</h2><div className="p2-product-grid">{featuredProducts.filter((product) => product.model === "HSM10" || product.model === "HPS10").map((product) => <article key={product.slug}><div className={`p2-product-image${generatedProductImage(product.model) ? " p2-scene" : ""}`}><Image src={product.model === "HSM10" ? "/images/reference-style/product-flow.webp" : "/images/reference-style/product-level.webp"} alt={product.model + " " + tx(product.name)} fill sizes="(max-width: 767px) 100vw, 50vw" />{generatedProductImage(product.model) && <span className="scene-label">{tx("Illustrative image")}</span>}</div><div className="p2-product-copy"><h3>{product.model} {tx(product.name)}</h3><p>{tx(product.summary)}</p><Link href={`/products/${product.category}/${product.slug}`}>{tx("View specifications")}</Link></div></article>)}</div></div>
      </section>
    </>
  );
}
