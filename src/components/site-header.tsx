"use client";
import { LanguageSwitcher } from "@/components/language-switcher";

import { useTranslations } from "@/lib/i18n/client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/site";
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
  const mobileDialogRef = useRef<HTMLDialogElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const productsLinkRef = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counts = categoryCounts();
  const productsActive = pathname.startsWith("/products");

  // Close menus on route change
  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px) and (hover: hover)");
    function resetMenus() {
      setMobileOpen(false);
      setProductsOpen(false);
    }
    desktop.addEventListener("change", resetMenus);
    return () => {
      desktop.removeEventListener("change", resetMenus);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const dialog = mobileDialogRef.current;
    if (!dialog || !mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = mobileTriggerRef.current;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.getClientRects().length) trigger.focus();
      else if (productsLinkRef.current?.getClientRects().length) productsLinkRef.current.focus();
    };
  }, [mobileOpen]);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductsOpen(false), 160);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function closeSelectedCategory(href: string): void {
    cancelClose();
    if (pathname === href) productsLinkRef.current?.focus();
    setProductsOpen(false);
  }

  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!productsOpen) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (megaRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        productsLinkRef.current?.focus();
      }
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setProductsOpen(false);
    }
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [productsOpen]);

  return (
    <>
      <div className="p0-announcement">{tx("Factory-direct manufacturer · Xiamen, China · Exporting worldwide")}</div>

      <header className="site-header sticky top-0 z-50">
        <div className="site-header-bar">
          <Link
            href="/"
            className="site-header-brand"
            aria-label={tx("HSM Sensors home")}
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
          <div className="site-nav">
            <nav className="site-nav-list" aria-label={tx("Main")}>
              <div
                className="site-nav-item"
                onMouseEnter={() => {
                  cancelClose();
                  if (window.matchMedia("(hover: hover)").matches) setProductsOpen(true);
                }}
                onMouseLeave={() => {
                  if (!megaRef.current?.contains(document.activeElement)) scheduleClose();
                }}
                onBlur={(event) => {
                  if (event.currentTarget.contains(event.relatedTarget)) return;
                  cancelClose();
                  setProductsOpen(false);
                }}
              >
                <Link
                  href="/products"
                  ref={productsLinkRef}
                  className={`site-nav-link${productsOpen || productsActive ? " is-active" : ""}`}
                  aria-expanded={productsOpen}
                  aria-controls="products-mega"
                  onFocus={() => {
                    cancelClose();
                    setProductsOpen(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setProductsOpen(true);
                      requestAnimationFrame(() => megaRef.current?.querySelector("a")?.focus());
                    }
                  }}
                >
                  {tx("Products")}
                </Link>
                <div
                  id="products-mega"
                  ref={megaRef}
                  className={`site-mega${productsOpen ? " is-open" : ""}`}
                  aria-hidden={!productsOpen}
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
                                <Link href={`/products/${slug}`} tabIndex={productsOpen ? 0 : -1} onNavigate={() => closeSelectedCategory(`/products/${slug}`)}>
                                  {tx(category.name)}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        {groupIndex === productGroups.length - 1 && (
                          <ul className="site-mega-more">
                            <li>
                              <Link href="/products" tabIndex={productsOpen ? 0 : -1} onNavigate={() => closeSelectedCategory("/products")}>
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
              </div>

              {mainNav
                .filter((n) => n.href !== "/products")
                .map((item) => (
                  <div key={item.href} className="site-nav-item">
                    <Link
                      href={item.href}
                      className={`site-nav-link${pathname.startsWith(item.href) ? " is-active" : ""}`}
                    >
                      {tx(item.label)}
                    </Link>
                  </div>
                ))}

            </nav>
          </div>

          <div className="site-header-actions">
            <LanguageSwitcher />
            <Link href="/contact?intent=quote" className="site-header-cta">
              {tx("Request a quote")}
            </Link>
            <button
              type="button"
              ref={mobileTriggerRef}
              className="site-header-burger rounded border border-white/25 p-2.5"
              aria-label={tx(mobileOpen ? "Close menu" : "Open menu")}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              aria-controls="mobile-navigation"
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

      {mobileOpen && (
        <dialog
          id="mobile-navigation"
          ref={mobileDialogRef}
          className="site-mobile-dialog"
          aria-label={tx("Main")}
          onCancel={(event) => {
            event.preventDefault();
            setMobileOpen(false);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setMobileOpen(false);
          }}
        >
          <div className="site-mobile-sheet">
            <div className="site-mobile-heading">
              <strong>{tx("HSM Sensors")}</strong>
              <button type="button" aria-label={tx("Close menu")} onClick={() => setMobileOpen(false)}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <nav className="site-mobile-nav" aria-label={tx("Mobile")}>
              <details>
                <summary>{tx("Products")}</summary>
                <div className="site-mobile-groups">
                  <Link href="/products" onNavigate={() => setMobileOpen(false)}>{tx("All products →")}</Link>
                  {productGroups.map((group) => (
                    <details key={group.title}>
                      <summary>{tx(group.title)}</summary>
                      <ul>
                        {group.slugs.map((slug) => {
                          const category = categories.find((entry) => entry.slug === slug);
                          if (!category) return null;
                          return (
                            <li key={slug}>
                              <Link href={`/products/${slug}`} onNavigate={() => setMobileOpen(false)}>
                                {tx(category.name)}<span>{counts[category.slug]}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  ))}
                </div>
              </details>
              {mainNav.filter((item) => item.href !== "/products").map((item) => (
                <Link key={item.href} href={item.href} onNavigate={() => setMobileOpen(false)}>
                  {tx(item.label)}
                </Link>
              ))}
            </nav>
            <div className="site-mobile-actions">
              <Link href="/contact?intent=quote" onNavigate={() => setMobileOpen(false)}>
                {tx("Request a quote")}
              </Link>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
