"use client";
import { useTranslations } from "@/lib/i18n/client";
import Link from "next/link";
import { MediaFrame } from "@/components/media-frame";
import { site } from "@/lib/site";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
  breadcrumbs?: readonly { label: string; href?: string }[];
  actions?: readonly { label: string; href: string; primary?: boolean }[];
  compact?: boolean;
  image?: { src: string; alt?: string; preserveFraming?: boolean };
  reading?: boolean;
}

export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  actions,
  compact = false,
  image,
  reading = false,
}: PageHeroProps) {
  const tx = useTranslations();

  return (
    <section className={`p3-page-hero${image ? " p3-page-hero-media" : ""}${reading ? " p3-page-hero-reading" : ""}`}>
      {image && (
        <MediaFrame
          className="p3-page-hero-image"
          src={image.src}
          alt={image.alt ? tx(image.alt) : ""}
          sizes="(max-width: 767px) 100vw, 50vw"
          priority
          preserveFraming={image.preserveFraming}
        />
      )}
      <div className={`p3-page-hero-copy ${compact ? "p3-page-hero-compact" : ""}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label={tx("Breadcrumb")}  className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
              {breadcrumbs.map((b, i) => (
                <li key={`${b.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {b.href ? (
                    <Link href={b.href} className="transition-colors hover:text-white">
                      {tx(b.label)}
                    </Link>
                  ) : (
                    <span aria-current="page">{tx(b.label)}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}


        <h1
          className={`mt-3 max-w-4xl font-semibold tracking-tight text-white ${
            compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-[3.4rem]"
          }`}
        >
          {tx(title)}
        </h1>
        {lede && (
          <p className="mt-5 max-w-3xl text-[15.5px] leading-relaxed text-ink-300 sm:text-base">
            {tx(lede)}
          </p>
        )}

        {actions && actions.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map(({ label, href, primary }) => {
              const Action = href.startsWith("#") ? "a" : Link;
              const className = primary
                ? "rounded bg-brand-500 px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-400"
                : "rounded border border-white/25 px-5 py-3 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5";
              return <Action key={href + label} href={href} className={className}>{tx(label)}</Action>;
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function QuoteCta({
  title = "Need a model that is not in the catalogue?",
  body = "Send us the medium, range, thread and output you need.",
}: {
  title?: string;
  body?: string;
}) {
  const tx = useTranslations();

  return (
    <section className="border-y border-ink-200 bg-ink-50">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-[1.7rem]">
            {tx(title)}
          </h2>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-600">{tx(body)}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/contact?intent=quote"
            className="rounded bg-brand-600 px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-700"
          >
            {tx("Request a quote")} </Link>
          <a
            href={`mailto:${site.contact.email}`}
            className="rounded border border-ink-300 px-5 py-3 text-[14px] font-medium text-ink-800 transition-colors hover:border-ink-400 hover:bg-white"
          >
            {site.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
