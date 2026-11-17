"use client";
import { useTranslations } from "@/lib/i18n/client";
import type { SpecGroup } from "@/lib/content-types";

interface SpecTableProps { groups: readonly SpecGroup[]; }

/** All existing specification groups remain visible; no accordion or inner scrolling. */
export function SpecTable({ groups }: SpecTableProps) {
  const tx = useTranslations();
  if (groups.length === 0) return <p className="text-sm leading-relaxed text-ink-600">{tx("Detailed specifications for this model are supplied as a datasheet. Request a quote and we will send the current revision with the price.")}</p>;
  return (
    <div className="grid items-start gap-4 xl:grid-cols-2">
      {groups.map((group, index) => (
        <section key={`${group.title}-${index}`} className="overflow-hidden rounded-lg border border-ink-200 bg-white">
          <h3 className="border-b border-ink-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">{tx(group.title)}</h3>
          <dl>
            {group.rows.map((row, i) => (
              <div key={`${row.label}-${i}`} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-b border-ink-100 px-4 py-2.5 last:border-b-0">
                <dt className="break-words text-[12.5px] leading-relaxed text-ink-500">{tx(row.label)}</dt>
                <dd className="break-words text-[12.5px] font-medium leading-relaxed text-ink-900 tnum">{tx(row.value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
