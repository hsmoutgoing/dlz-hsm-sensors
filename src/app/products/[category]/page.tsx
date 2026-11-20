import { useTranslations, getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero, QuoteCta } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { categories, getCategory } from "@/lib/categories";
import { categoryCounts, getProductsByCategory, products } from "@/lib/products";

interface PageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {t} = await getI18n();
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const count = getProductsByCategory(category.slug).length;

  return {
    title: t(category.name),
    description: `${t(category.tagline)}. ${t("{count} models, factory-direct from Xiamen.", { count })}`,
    alternates: { canonical: `/products/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const tx = (await getI18n()).t;

  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = getProductsByCategory(category.slug);
  const others = categories.filter((c) => c.slug !== category.slug);
  const counts = categoryCounts();

  return (
    <>
      <PageHero
        eyebrow={`${tx("Product family")} · ${items.length} ${tx("models")}`}
        title={category.name}
        lede={category.intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.shortName },
        ]}
        actions={[{ label: "All models", href: "#models", primary: true }]}
      />

      {/* Measured quantities and outputs */}
      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                {tx("What it measures")} </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {category.measures.map((m) => (
                  <li
                    key={m}
                    className="rounded-sm border border-brand-200 bg-brand-50 px-2.5 py-1 text-[12.5px] font-medium text-brand-800"
                  >
                    {tx(m)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
                {tx("Available outputs")} </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {category.outputs.map((o) => (
                  <li
                    key={o}
                    className="rounded-sm border border-ink-200 bg-ink-50 px-2.5 py-1 font-mono text-[11.5px] text-ink-700"
                  >
                    {tx(o)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Model list */}
      <section id="models" className="scroll-mt-24 mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-[1.9rem]">
            {tx(items.length)} {tx(items.length === 1 ? "model" : "models")} {tx("in this family")} </h2>
          <p className="text-[13px] text-ink-500">
            {tx("Sorted by typical duty — workhorse models first")} </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* Cross-navigation */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500">
            {tx("Other product families")} </h2>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-lg border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((c) => (
              <li key={c.slug} className="bg-white">
                <Link
                  href={`/products/${c.slug}`}
                  className="group flex items-baseline justify-between gap-3 px-5 py-4 transition-colors hover:bg-brand-50"
                >
                  <span className="text-[14px] font-medium text-ink-900 group-hover:text-brand-700">
                    {tx(c.name)}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-ink-400">
                    {tx(counts[c.slug] ?? 0)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] text-ink-600">
            {tx("Looking across the whole catalogue instead?")} {tx(" ")} 
            <Link href="/products" className="font-medium text-brand-600 hover:text-brand-700">
              {tx("See all")} {tx(products.length)} {tx("models →")} </Link>
          </p>
        </div>
      </section>

      <QuoteCta />
    </>
  );
}
