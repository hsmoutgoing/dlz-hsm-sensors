"use client";
import { LanguageSwitcher } from "@/components/language-switcher";

import { useTranslations } from "@/lib/i18n/client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { mainNav, site } from "@/lib/site";
import { categories } from "@/lib/categories";
import { categoryCounts } from "@/lib/products";

/**
 * Mega-menu column layout. Grouping mirrors the reference site: each column is
 * a blue uppercase heading with plain white links underneath, laid out as
 * equal-width flex columns rather than a card grid.
 */
const productGroups: readonly { title: string; slugs: readonly string[] }[] = [
  { title: "Process measurement", slugs: ["flow", "level", "pressure"] },
  { title: "Instrumentation", slugs: ["temperature", "ultrasonic", "gas"] },
  { title: "Analysis & monitoring", slugs: ["displacement", "analytical"] },
  { title: "Automation", slugs: ["iot", "motion"] },
];

export function SiteHeader() {
  const tx = useTranslations();

  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counts = categoryCounts();
  const productsActive = pathname.startsWith("/products");

  // Close menus on route change
  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProductsOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductsOpen(false), 160);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  // Keep the mega panel inside the viewport: translated language labels make
  // the first nav item sit further right, so a fixed left:0 panel can overflow.
  const megaRef = useRef<HTMLDivElement | null>(null);
  const [megaShift, setMegaShift] = useState(0);

  useLayoutEffect(() => {
    if (!productsOpen) return;
    function align() {
      const panel = megaRef.current;
      if (!panel) return;
      const { left, right } = panel.parentElement!.getBoundingClientRect();
      const width = panel.offsetWidth;
      const margin = 16;
      const overflowRight = left + width - (window.innerWidth - margin);
      const overflowLeft = margin - left;
      setMegaShift(overflowRight > 0 ? -overflowRight : overflowLeft > 0 ? overflowLeft : 0);
    }
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [productsOpen]);

  return (
    <>
      <div className="p0-announcement">{tx("Factory-direct manufacturer · Xiamen, China · Exporting worldwide")}</div>

      <header className="site-header sticky top-0 z-50">
        <div className="site-header-bar">
          <Link
            href="/"
            className="site-header-brand"
            aria-label={`${site.name} home`}
          >
            <Image
              src="/brand/logo.png"
              alt=""
              width={44}
              height={35}
              className="h-9 w-auto"
              priority
            />
            <span className="flex flex-col leading-none">
              <span className="text-[19px] font-semibold tracking-tight">{tx("HSM Sensors")}</span>
              <span className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
                {tx("Flow · Level · Pressure")}
              </span>
            </span>
          </Link>

          {/* Desktop navigation — full-height items, blue fill on hover */}
          <div className="site-nav" onMouseLeave={scheduleClose}>
            <nav className="site-nav-list" aria-label={tx("Main")}>
              <div
                className="site-nav-item"
                onMouseEnter={() => {
                  cancelClose();
                  setProductsOpen(true);
                }}
              >
                <Link
                  href="/products"
                  className={`site-nav-link${productsOpen || productsActive ? " is-active" : ""}`}
                  aria-expanded={productsOpen}
                  aria-haspopup="true"
                  aria-controls="products-mega"
                  onFocus={() => {
                    cancelClose();
                    setProductsOpen(true);
                  }}
                >
                  {tx("Products")}
                </Link>
              </div>

              {mainNav
                .filter((n) => n.href !== "/products")
                .map((item) => (
                  <div key={item.href} className="site-nav-item">
                    <Link
                      href={item.href}
                      className={`site-nav-link${pathname.startsWith(item.href) ? " is-active" : ""}`}
                      onMouseEnter={scheduleClose}
                      onFocus={scheduleClose}
                    >
                      {tx(item.label)}
                    </Link>
                  </div>
                ))}

              {/* Mega panel is anchored to the nav, not the item: the reference
                  panel starts at the left edge of the menu group. */}
              <div
                id="products-mega"
                ref={megaRef}
                className={`site-mega${productsOpen ? " is-open" : ""}`}
                style={{ "--mega-shift": `${megaShift}px` } as CSSProperties}
                aria-hidden={!productsOpen}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                <div className="site-mega-inner">
                  {productGroups.map((group, groupIndex) => (
                    <div key={group.title} className="site-mega-column">
                      <p className="site-mega-heading">{tx(group.title)}</p>
                      <ul>
                        {group.slugs.map((slug) => {
                          const category = categories.find((c) => c.slug === slug);
                          if (!category) return null;
                          return (
                            <li key={slug}>
                              <Link href={`/products/${slug}`} tabIndex={productsOpen ? 0 : -1}>
                                {tx(category.name)}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      {groupIndex === productGroups.length - 1 && (
                        <ul className="site-mega-more">
                          <li>
                            <Link href="/products" tabIndex={productsOpen ? 0 : -1}>
                              {tx("View all products →")}
                            </Link>
                          </li>
                          <li>
                            <Link href="/custom" tabIndex={productsOpen ? 0 : -1}>
                              {tx("Custom Engineering")}
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          <div className="site-header-actions">
            <LanguageSwitcher />
            <Link href="/contact?intent=quote" className="site-header-cta">
              {tx("Request a quote")}
            </Link>
            <button
              type="button"
              className="site-header-burger rounded border border-white/25 p-2.5 lg:hidden"
              aria-label={tx(mobileOpen ? "Close menu" : "Open menu")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                {mobileOpen ? (
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 6h14M3 10h14M3 14h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="p0-mobile-drawer fixed inset-0 top-0 z-40 overflow-y-auto bg-white pt-20 lg:hidden">
          <nav className="px-4 py-4" aria-label={tx("Mobile")}>
            <p className="eyebrow mb-2 px-2">{tx("Products")}</p>
            <ul className="mb-6 grid gap-0.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="flex items-center justify-between rounded px-2 py-2.5 text-[15px] text-ink-800 active:bg-ink-100"
                  >
                    {tx(c.name)}
                    <span className="font-mono text-[11px] text-ink-400">
                      {tx(counts[c.slug] ?? 0)}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="flex items-center px-2 py-2.5 text-[15px] font-medium text-brand-600"
                >
                  {tx("All products →")}
                </Link>
              </li>
            </ul>
            <p className="eyebrow mb-2 px-2">{tx("Company")}</p>
            <ul className="grid gap-0.5 border-t border-ink-200 pt-2">
              {mainNav
                .filter((n) => n.href !== "/products")
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded px-2 py-2.5 text-[15px] text-ink-800 active:bg-ink-100"
                    >
                      {tx(item.label)}
                    </Link>
                  </li>
                ))}
            </ul>
            <div className="mt-6 grid gap-2 border-t border-ink-200 pt-4">
              <Link
                href="/contact?intent=quote"
                className="rounded bg-brand-600 px-4 py-3 text-center text-[15px] font-medium text-white"
              >
                {tx("Request a quote")}
              </Link>
              <a
                href={`mailto:${site.contact.email}`}
                className="rounded border border-ink-200 px-4 py-3 text-center text-[15px] text-ink-800"
              >
                {site.contact.email}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
