import { localizeMetadata } from "@/lib/i18n/metadata";
import { useTranslations, getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { site } from "@/lib/site";
import styles from "./about.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n();
  return localizeMetadata({
    title: "About HSM Sensors — Sensor Manufacturer in Xiamen, China",
    description: `HSM Sensors Technology (Xiamen) Co., Ltd. designs, assembles and calibrates industrial flow, level, pressure, temperature and gas instrumentation at its facility in Jimei District, Xiamen. ${products.length} catalogue models plus custom builds.`,
    alternates: { canonical: "/about" },
  }, t, locale);
}

const gallery = [
  { src: "/images/products/hsm10-thermal-flow-switch.jpg", alt: "HSM10 thermal flow switch" },
  { src: "/images/products/hps10-submersible-level-transmitter.jpg", alt: "HPS10 submersible level transmitter" },
  { src: "/images/products/pcc100-pressure-controller.jpg", alt: "PCC100 pressure controller" },
  { src: "/images/products/hsm300-wearable-methane-detector.jpg", alt: "HSM300 wearable laser methane detector" },
];

export default function AboutPage() {
  const tx = useTranslations();
  return (
    <div className={styles.about}>
      <section className={styles.intro}>
        <div className={styles.introImage}>
          <Image src="/images/about-illustrations/hero.webp" alt="" fill priority sizes="(max-width: 767px) 100vw, 50vw" />
          <span className="scene-label">{tx("Illustrative image")}</span>
        </div>
        <div className={styles.introCopy}>
          <h1>{tx("A sensor factory in Jimei District, Xiamen")}</h1>
          <p>{tx("We are a sensor manufacturer based in Xiamen, Fujian. The product range spans flow, level, pressure, temperature, ultrasonic, gas, displacement, analytical, motion and wireless instrumentation — the instruments that sit between a process and the control system that has to know what the process is doing.")}</p>
          <Link href="/products">{tx("Browse the catalogue")}</Link>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyHeader}>
          <h2>{tx("Factory-direct, not a trading desk")}</h2>
          <p>{tx("What that means for a buyer is narrow and practical: you are dealing with the factory. Ranges, threads, probe lengths, materials and output signals are set on the line, so a specification that does not match the catalogue is a conversation rather than a refusal.")}</p>
        </div>
        <div className={styles.storyImages}>
          <div className={styles.storyImage}><Image src="/images/about-illustrations/materials.webp" alt="" fill sizes="(max-width: 767px) 100vw, 35vw" /><span className="scene-label">{tx("Illustrative image")}</span></div>
          <div className={styles.storyImage}><Image src="/images/about-illustrations/workbench.webp" alt="" fill sizes="(max-width: 767px) 100vw, 60vw" /><span className="scene-label">{tx("Illustrative image")}</span></div>
        </div>
        <div className={styles.storyEnd}>
          <h2>{tx("Custom ranges")}</h2>
          <p>{tx("Non-standard lengths, threads, materials and output ranges are built to order, not refused.")}</p>
          <Link href="/custom">{tx("Talk to an engineer →")}</Link>
        </div>
      </section>

      <section className={styles.location}>
        <div className={styles.locationImage}><Image src="/images/about-illustrations/wide.webp" alt="" fill sizes="100vw" /><span className="scene-label">{tx("Illustrative image")}</span></div>
        <div className={styles.locationCopy}>
          <h2>{tx("A sensor factory in Jimei District, Xiamen")}</h2>
          <p>{tx(site.legalName)}</p>
          <address>{tx(site.address.street)}<br />{tx(site.address.city)}, {tx(site.address.region)}, {tx(site.address.countryName)}</address>
        </div>
      </section>

      <section className={styles.products}>
        <div className={styles.sectionHeading}>
          <h2>{tx("Ten measurement families")}</h2>
          <Link href="/products">{tx("View all products →")}</Link>
        </div>
        <div className={styles.gallery}>
          {gallery.map((image) => <div key={image.src} className={styles.productImage}><Image src={image.src} alt={tx(image.alt)} fill sizes="(max-width: 767px) 50vw, 25vw" /></div>)}
        </div>
        <div className={styles.categoryLinks}>{categories.map((category) => <Link key={category.slug} href={`/products/${category.slug}`}>{tx(category.name)} <span aria-hidden="true">↗</span></Link>)}</div>
      </section>

      <section className={styles.trust}>
        <div><h2>{tx("Documentation supplied per project")}</h2><p>{tx("Every unit is assembled and calibrated in our own facility. Test records, material certificates and CE or RoHS scans are supplied on request with the quotation, matched to the revision you are buying.")}</p></div>
        <div><h2>{tx("Want to audit the factory before you order?")}</h2><p>{tx("Ask for a video walk-through of the assembly and calibration areas, or request the documentation relevant to your project — standards conformity, material certificates or the certificate scans you need for import.")}</p><Link href="/contact?intent=quote">{tx("Request a quote")}</Link></div>
      </section>
    </div>
  );
}
