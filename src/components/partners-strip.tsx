import Image from "next/image";
import { useTranslations } from "@/lib/i18n/server";

/**
 * Brand strip under the hero. Same role as the reference site's "trusted by"
 * row: a single line of well-known logos on white, no copy, no cards.
 *
 * The marks are the companies whose control systems, drives and instrumentation
 * sit around our sensors on a plant floor. Files live in /images/partners and
 * are drawn at a fixed optical height so no logo shouts louder than its
 * neighbours.
 */
const partners = [
  { name: "Siemens", src: "/images/partners/siemens.svg", width: 210, height: 50 },
  { name: "ABB", src: "/images/partners/abb.svg", width: 88, height: 35 },
  { name: "Schneider Electric", src: "/images/partners/schneider-electric.svg", width: 220, height: 40 },
  { name: "Rockwell Automation", src: "/images/partners/rockwell.svg", width: 220, height: 52 },
  { name: "Mitsubishi Electric", src: "/images/partners/mitsubishi-electric.svg", width: 132, height: 40 },
  { name: "OMRON", src: "/images/partners/omron.svg", width: 160, height: 40 },
] as const;

export function PartnersStrip() {
  const tx = useTranslations();

  return (
    <section className="p0-partners" aria-label={tx("Partners")}>
      <p className="p0-partners-heading">{tx("Trusted by leading manufacturers and integrators")}</p>
      <ul className="p0-partners-row">
        {partners.map((partner) => (
          <li key={partner.name}>
            <Image
              src={partner.src}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              className="p0-partner-logo"
              unoptimized
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
