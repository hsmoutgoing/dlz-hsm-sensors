import { localizeMetadata } from "@/lib/i18n/metadata";
import { useTranslations, getI18n } from "@/lib/i18n/server";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { adminCookie, isAdminConfigured, isValidSession } from "@/lib/inquiries/admin-auth";
import { getInquiryStore, isStoreConfigured, type InquiryRecord } from "@/lib/inquiries/store";
import { AdminLogin } from "@/components/admin-login";
import { AdminList } from "@/components/admin-list";

export async function generateMetadata(): Promise<Metadata> {
 const {t, locale} = await getI18n();
 const metadata: Metadata = {
  title: "Inquiries",
  robots: { index: false, follow: false },
};
 return localizeMetadata(metadata, t, locale);
}

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const tx = (await getI18n()).t;

  if (!isAdminConfigured()) {
    return (
      <Notice title={tx("Admin access is not configured")} >
        {tx("Set")} <code className="font-mono text-[13px]">{tx("ADMIN_PASSWORD")} </code> {tx("(at least 12 characters) in the environment, then reload. The enquiry form itself works without this — only this list is gated.")} </Notice>
    );
  }

  const jar = await cookies();
  const authorised = isValidSession(jar.get(adminCookie.name)?.value);

  if (!authorised) {
    return <AdminLogin />;
  }

  let records: readonly InquiryRecord[] = [];
  let loadError = "";

  try {
    records = await getInquiryStore().list(200);
  } catch (error: unknown) {
    loadError = error instanceof Error ? error.message : "Could not load inquiries.";
  }

  const counts = {
    new: records.filter((r) => r.status === "new").length,
    quoted: records.filter((r) => r.status === "quoted").length,
    replied: records.filter((r) => r.status === "replied").length,
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{tx("Internal")} </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
            {tx("Inbound inquiries")} </h1>
        </div>
        <dl className="flex gap-6">
          {[
            { k: "New", v: counts.new },
            { k: "Quoted", v: counts.quoted },
            { k: "Replied", v: counts.replied },
            { k: "Total", v: records.length },
          ].map((s) => (
            <div key={s.k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                {tx(s.k)}
              </dt>
              <dd className="font-mono text-xl font-medium text-ink-900 tnum">{tx(s.v)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {!isStoreConfigured() && (
        <p className="mt-6 rounded border border-signal-400/50 bg-signal-400/10 px-4 py-3 text-[12.5px] leading-relaxed text-ink-800">
          <strong className="font-semibold">{tx("Development mode.")} </strong>{tx(" ")} 
          <code className="font-mono">{tx("SUPABASE_URL")} </code> {tx("and")} {tx(" ")} 
          <code className="font-mono">{tx("SUPABASE_SERVICE_ROLE_KEY")} </code> {tx("are not set, so submissions are held in memory and will disappear when the server restarts.")} </p>
      )}

      {loadError && (
        <p className="mt-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-[12.5px] text-red-800">
          {tx(loadError)}
        </p>
      )}

      <AdminList records={records} />
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  const tx = useTranslations();

  return (
    <div className="mx-auto max-w-[720px] px-4 py-20 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{tx(title)}</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-600">{tx(children)}</p>
    </div>
  );
}
