import { useTranslations, getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { ProductGallery } from "@/components/product-gallery";
import { generatedProductGallery } from "@/lib/generated-product-images";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SpecTable } from "@/components/spec-table";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { getCategory, isCategorySlug } from "@/lib/categories";
import { getProduct, getProductsByCategory, products } from "@/lib/products";
import { site } from "@/lib/site";
import { breadcrumbSchema, productSchema } from "@/lib/structured-data";
import type { Product } from "@/lib/content-types";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {t} = await getI18n();
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = `${product.model} ${t(product.name)}${product.variant ? ` — ${t(product.variant)}` : ""}`;
  const url = `/products/${product.category}/${product.slug}`;

  return {
    title,
    description: t(product.summary),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: t(product.summary),
      url,
      images: [{ url: product.image, alt: `${product.model} ${t(product.name)}` }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const tx = (await getI18n()).t;

  const { category: categorySlug, slug } = await params;
  const product = getProduct(slug);
  const category = getCategory(categorySlug);

  if (!product || !category || product.category !== categorySlug) notFound();

  const siblings = getProductsByCategory(category.slug).filter((p) => p.slug !== product.slug);
  const related = pickRelated(product, siblings);
  const gallery = [product.image, ...(product.gallery ?? []), ...generatedProductGallery(product.model)];

  return (
    <>
      <JsonLd data={productSchema(product, category)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.shortName, href: `/products/${category.slug}` },
          { label: product.model },
        ])}
      />

      {/* ========================= BREADCRUMB ========================= */}
      <nav aria-label={tx("Breadcrumb")}  className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-3.5 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.13em] text-ink-500">
            <li>
              <Link href="/" className="transition-colors hover:text-brand-600">
                {tx("Home")} </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="transition-colors hover:text-brand-600">
                {tx("Products")} </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/products/${category.slug}`}
                className="transition-colors hover:text-brand-600"
              >
                {tx(category.shortName)}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink-900" aria-current="page">
              {product.model}
            </li>
          </ol>
        </div>
      </nav>

      <section aria-labelledby="product-heading" className="p3-product-detail mx-auto grid max-w-[1400px] items-start gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:pb-16">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <h1 id="product-heading" className="text-balance font-semibold tracking-tight text-ink-900">
            {product.model} <span className="font-medium text-ink-600">{tx(product.name)}</span>
          </h1>
          {product.variant && <p className="mt-3 text-sm text-ink-600">{tx(product.variant)}</p>}
          <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-700">{tx(product.summary)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={{ pathname: "/contact", query: { intent: "quote", model: product.model }, hash: "enquiry" }}
              className="rounded bg-brand-600 px-5 py-3 text-sm font-medium text-white hover:bg-brand-700"
            >
              {tx("Request a quote")}
            </Link>
            <a href="#technical-data" className="rounded border border-ink-300 px-5 py-3 text-sm font-medium text-ink-800 hover:bg-ink-50">
              {tx("{model} technical data", { model: product.model })}
            </a>
          </div>
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ProductGallery images={gallery} name={`${product.model} ${tx(product.name)}`} />
        </div>
        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          {product.highlights.length > 0 && (
            <ul className="space-y-2.5 border-t border-ink-200 pt-6">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-700">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-brand-600"
                  >
                    <path
                      d="M3 8l3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{tx(h)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 text-sm leading-relaxed text-ink-600">
            {tx("Engineering reply · Evaluation samples available · Custom ranges built to order")}
          </p>
          <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Enquiry — ${product.model} ${product.name}`)}`} className="mt-3 inline-block text-sm font-medium text-brand-700 underline underline-offset-4">
            {tx("Email an engineer")}
          </a>
        </div>
      </section>

      <section id="technical-data" aria-labelledby="technical-data-heading" className="scroll-mt-24 border-t border-ink-200">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <h2 id="technical-data-heading" className="mb-6 scroll-mt-24 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            {tx("{model} technical data", { model: product.model })}
          </h2>
          <SpecTable groups={product.specs} />
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-600">
            {tx("Values are for the standard configuration. Ranges, threads, probe lengths and output types outside this table are available on request — the datasheet revision for a custom build is issued with the quotation.")}
          </p>
          <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Datasheet request — ${product.model}`)}`} className="mt-3 inline-block text-sm font-medium text-brand-700 underline underline-offset-4">
            {tx("Request the PDF datasheet →")}
          </a>
        </div>
      </section>

      {/* ========================== DETAIL ========================== */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">
                {tx("How it works")} </h2>
              <p className="mt-4 text-[14.5px] leading-[1.75] text-ink-700">{tx(product.intro)}</p>

              {product.notes && product.notes.length > 0 && (
                <div className="mt-8 rounded-lg border border-ink-200 bg-white px-5 py-4">
                  <h3 className="flex items-center gap-2 text-[12.5px] font-semibold tracking-tight text-ink-900">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-signal-400"
                      aria-hidden="true"
                    />
                    {tx("Ordering notes")} </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {product.notes.map((n) => (
                      <li key={n} className="text-[13px] leading-relaxed text-ink-700">
                        {tx(n)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">
                {tx("Typical applications")} </h2>
              {product.applications && product.applications.length > 0 ? (
                <ul className="mt-4 divide-y divide-ink-200 rounded-lg border border-ink-200 bg-white">
                  {product.applications.map((a) => (
                    <li key={a} className="flex gap-3 px-4 py-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                        aria-hidden="true"
                      />
                      <span className="text-[13px] leading-relaxed text-ink-700">{tx(a)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[14px] leading-relaxed text-ink-600">
                  {tx("Tell us the process conditions and we will confirm the right variant for your duty.")} </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= SELECTION HELP ======================= */}
      <section className="border-y border-ink-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-[1.35rem] font-semibold tracking-tight text-ink-900">
              {tx("Not certain {model} is the right unit?", { model: product.model })} </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
              {tx("Send the medium, range, process connection and the signal your control system accepts. We will confirm the model — or tell you which one fits better — before you commit to an order.")} </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href={`/products/${category.slug}`}
              className="rounded border border-ink-300 px-5 py-3 text-[14px] font-medium text-ink-800 transition-colors hover:border-ink-400 hover:bg-ink-50"
            >
              {tx("All {category} models", { category: tx(category.shortName) })} </Link>
            <Link
              href="/custom"
              className="rounded bg-brand-600 px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-700"
            >
              {tx("Custom engineering")} </Link>
          </div>
        </div>
      </section>

      {/* ========================== RELATED ========================== */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{tx("Same family")} </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900 sm:text-[1.9rem]">
                {tx("Other {category} instruments", { category: tx(category.shortName) })} </h2>
            </div>
            <Link
              href={`/products/${category.slug}`}
              className="text-[13.5px] font-medium text-brand-600 hover:text-brand-700"
            >
              {tx("View the family →")} </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

/**
 * Pull the four most decision-relevant rows out of the spec groups for the
 * summary strip. Order matters: range, output, wetted material and process
 * connection are the four facts an engineer checks before anything else.
 * Rows describing dynamics (drift, response time, timing) are skipped —
 * they matter, but not at a glance.
 */
function atGlance(product: Product): { label: string; value: string }[] {
  const all = product.specs
    .flatMap((g) => g.rows)
    .filter((r) => !/gradient|response|timing|consumption|drift/i.test(r.label));

  const preferred = [
    /measuring range|range —|^range$/i,
    /output|signal/i,
    /wetted material|material/i,
    /process connection|connection|thread/i,
    /maximum pressure|proof pressure/i,
    /medium temperature|ambient temperature/i,
    /ingress protection|protection/i,
    /accuracy/i,
  ];

  const picked: { label: string; value: string }[] = [];
  const take = (row: (typeof all)[number]) => {
    if (picked.length >= 4) return;
    if (picked.some((p) => p.label === row.label)) return;
    picked.push({ label: row.label, value: row.value });
  };

  for (const pattern of preferred) {
    if (picked.length === 4) break;
    const row = all.find((r) => pattern.test(r.label) && !picked.some((p) => p.label === r.label));
    if (row) take(row);
  }

  for (const row of all) {
    if (picked.length === 4) break;
    take(row);
  }

  return picked;
}

function pickRelated(product: Product, siblings: readonly Product[]): Product[] {
  const scored = siblings
    .map((p) => {
      // Prefer the same variant keyword, then the same model prefix.
      const samePrefix = p.model.slice(0, 3) === product.model.slice(0, 3) ? 2 : 0;
      const sameVariant =
        product.variant && p.variant && p.variant.split(/[\s/]/)[0] === product.variant.split(/[\s/]/)[0]
          ? 1
          : 0;
      return { p, score: samePrefix + sameVariant };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map((s) => s.p);
}
