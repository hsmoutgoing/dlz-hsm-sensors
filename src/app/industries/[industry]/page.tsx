import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { industries } from "@/lib/industries";
import { getI18n } from "@/lib/i18n/server";
import { localizeMetadata } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

interface IndustryPageProps {
  params: Promise<{ industry: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { industry: string }[] {
  return industries.map(({ id }) => ({ industry: id }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = industries.find(({ id }) => id === slug);
  if (!industry) return {};
  const { t, locale } = await getI18n();
  const url = `/industries/${industry.id}`;
  const images = [{ url: industry.image, alt: t(industry.imageAlt) }];
  return localizeMetadata({
    title: industry.name,
    description: industry.lede,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: industry.name,
      description: industry.lede,
      url,
      images,
    },
    twitter: { title: t(industry.name), description: t(industry.lede), images, card: "summary_large_image" },
  }, t, locale);
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { industry: slug } = await params;
  const industry = industries.find(({ id }) => id === slug);
  if (!industry) notFound();
  const { t } = await getI18n();

  return (
    <>
      <PageHero
        eyebrow="Applications"
        title={industry.name}
        lede={industry.lede}
        image={{ src: industry.image, alt: industry.imageAlt, preserveFraming: true }}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: industry.name }]}
        actions={[
          { label: "Typical applications", href: "#applications", primary: true },
          { label: "Request a quote", href: "/contact?intent=quote#enquiry" },
        ]}
      />
      <section id="applications" tabIndex={-1} className="mx-auto grid max-w-[1400px] scroll-mt-24 gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:py-20">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t("Typical applications")}</h2>
          {industry.problems.map(({ title, body }) => (
            <article key={title} className="mt-6 border-t border-ink-200 pt-5">
              <h3 className="text-xl font-semibold">{t(title)}</h3>
              <p className="mt-3 max-w-prose leading-relaxed text-ink-600">{t(body)}</p>
            </article>
          ))}
        </div>
        <aside className="self-start bg-ink-50 p-6">
          <h2 className="text-xl font-semibold">{t("Products")}</h2>
          <ul className="mt-4 divide-y divide-ink-200">
            {industry.products.map(({ label, href }) => (
              <li key={href}><Link href={href} className="block py-3 font-medium text-brand-700 hover:underline">{t(label)}</Link></li>
            ))}
          </ul>
          <Link href="/industries" className="mt-6 inline-block text-sm font-semibold text-brand-700 underline underline-offset-4">{t("Industries")}</Link>
        </aside>
      </section>
    </>
  );
}
