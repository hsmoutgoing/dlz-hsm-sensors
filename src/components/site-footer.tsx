"use client";
import { useTranslations } from "@/lib/i18n/client";
import Link from "next/link";
import Image from "next/image";
import { mainNav, site } from "@/lib/site";
import { categories } from "@/lib/categories";

const industries = [
  { label: "Oil & gas", href: "/industries#oil-gas" },
  { label: "Chemical & petrochemical", href: "/industries#chemical" },
  { label: "Water & wastewater", href: "/industries#water" },
  { label: "Power generation", href: "/industries#power" },
  { label: "Food & beverage", href: "/industries#food" },
  { label: "Pharmaceutical", href: "/industries#pharma" },
];

const resources = [
  { label: "Selection guide", href: "/resources" },
  { label: "Output signal guide", href: "/resources#outputs" },
  { label: "Custom engineering", href: "/custom" },
  { label: "Download catalogue", href: "/resources#catalogue" },
];

export function SiteFooter() {
  const tx = useTranslations();

  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-200 bg-ink-900 text-ink-300">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-white.png"
                alt=""
                width={52}
                height={41}
                className="h-11 w-auto"
              />
              <div className="flex flex-col leading-none">
                <span className="text-[19px] font-semibold tracking-tight text-white">
                  {tx("HSM Sensors")} </span>
                <span className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400">
                  {tx(site.founded ? `Xiamen · Since ${site.founded}` : "Xiamen · Factory-direct")}
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-ink-400">
              {tx("Manufacturer of industrial flow, level, pressure, temperature and gas instrumentation. Every unit is assembled and calibrated in our own facility, and custom ranges are built to order.")} </p>
            <address className="mt-5 not-italic text-[13px] leading-relaxed text-ink-400">
              {tx(site.address.street)}
              <br />
              {tx(site.address.city)} {tx(site.address.postalCode)}, {tx(site.address.countryName)}
            </address>
            <div className="mt-4 space-y-1 text-[13px]">
              <a
                href={site.contact.phoneHref}
                className="block text-ink-300 transition-colors hover:text-white"
              >
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="block text-ink-300 transition-colors hover:text-white"
              >
                {site.contact.email}
              </a>
              <p className="text-ink-500">{tx(site.contact.hours)}</p>
            </div>
          </div>

          {/* Product columns */}
          <div className="lg:col-span-3">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              {tx("Products")} </h2>
            <ul className="grid gap-2 text-[13.5px]">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="text-ink-400 transition-colors hover:text-white"
                  >
                    {tx(c.shortName)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-ink-400 transition-colors hover:text-white">
                  {tx("All")} {tx(categories.reduce((n, c) => n, 0) > 0 ? "" : "")}{tx("products →")} </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              {tx("More ranges")} </h2>
            <ul className="grid gap-2 text-[13.5px]">
              {categories.slice(6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="text-ink-400 transition-colors hover:text-white"
                  >
                    {tx(c.shortName)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + resources */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              {tx("Company")} </h2>
            <ul className="grid gap-2 text-[13.5px]">
              {mainNav
                .filter((n) => !["/products", "/contact"].includes(n.href))
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-ink-400 transition-colors hover:text-white"
                    >
                      {tx(item.label)}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/contact" className="text-ink-400 transition-colors hover:text-white">
                  {tx("Contact")} </Link>
              </li>
            </ul>
            <h2 className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              {tx("Resources")} </h2>
            <ul className="grid gap-2 text-[13.5px]">
              {resources.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-ink-400 transition-colors hover:text-white">
                    {tx(r.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Industry strip */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
            {tx("Industries served")} </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
            {industries.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-ink-400 transition-colors hover:text-white">
                  {tx(i.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12.5px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {tx(year)} {tx(site.legalName)}{tx(". All rights reserved.")} </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">
              {tx("Privacy")} </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              {tx("Terms")} </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em]">
              {tx(site.chineseName)}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
