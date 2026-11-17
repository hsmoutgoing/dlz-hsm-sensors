"use client";
import Link from "next/link";
import { HeroVisual } from "@/components/hero-visual";
import { useTranslations } from "@/lib/i18n/client";

export function HeroStage() {
  const t = useTranslations();
  return (
    <div className="relative h-[420px] lg:col-span-6 lg:h-[640px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(26,111,188,0.22),transparent_62%)]" aria-hidden="true" />
      <HeroVisual />
      <Link href="/products/flow/hsm10-thermal-flow-switch" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/25 bg-white/95 px-5 py-2.5 text-sm font-medium text-ink-900 shadow-xl transition-colors hover:bg-white">
        {t("View product")} <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
