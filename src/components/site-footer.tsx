"use client";

import { useTranslations } from "@/lib/i18n/client";
import Link from "next/link";
import Image from "next/image";
import { mainNav, site } from "@/lib/site";
import { categories } from "@/lib/categories";

export function SiteFooter() {
  const tx = useTranslations();
  return (
    <footer className="p2-footer">
      <div className="p2-wrap">
        <div className="p2-footer-grid">
          <div className="p2-footer-brand">
            <Link href="/" aria-label={tx("HSM Sensors home")}><Image src="/brand/logo-white.png" alt="" width={52} height={41} /><strong>{tx("HSM Sensors")}</strong></Link>
            <p>{tx("Manufacturer of industrial flow, level, pressure, temperature and gas instrumentation. Every unit is assembled and calibrated in our own facility, and custom ranges are built to order.")}</p>
            <address>{tx(site.address.street)}<br />{tx(site.address.city)} {site.address.postalCode}, {tx(site.address.countryName)}</address>
            <a href={site.contact.phoneHref}>{site.contact.phone}</a><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a><p>{tx(site.contact.hours)}</p>
          </div>
          <div><h2>{tx("Products")}</h2><ul>{categories.map((c) => <li key={c.slug}><Link href={`/products/${c.slug}`}>{tx(c.shortName)}</Link></li>)}<li><Link href="/products">{tx("All products →")}</Link></li></ul></div>
          <div><h2>{tx("Company")}</h2><ul>{mainNav.filter((item) => item.href !== "/products").map((item) => <li key={item.href}><Link href={item.href}>{tx(item.label)}</Link></li>)}</ul></div>
          <div><h2>{tx("Resources")}</h2><ul><li><Link href="/resources">{tx("Selection guide")}</Link></li><li><Link href="/resources#outputs">{tx("Output signal guide")}</Link></li><li><Link href="/resources#catalogue">{tx("Datasheets, drawings and certificates")}</Link></li><li><Link href="/custom">{tx("Custom engineering")}</Link></li></ul></div>
        </div>
        <div className="p2-footer-bottom"><p>© {new Date().getFullYear()} {tx(site.legalName)}{tx(". All rights reserved.")}</p><div><Link href="/privacy">{tx("Privacy")}</Link><Link href="/terms">{tx("Terms")}</Link><span>{site.chineseName}</span></div></div>
      </div>
    </footer>
  );
}
