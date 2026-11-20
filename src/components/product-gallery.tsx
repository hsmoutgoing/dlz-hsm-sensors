"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "@/lib/i18n/client";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const t = useTranslations();
  return (
    <div className="p3-gallery">
      <div className="p3-gallery-main"><Image src={images[selected]} alt={name} fill priority sizes="(max-width: 1024px) 100vw, 42vw" />{(images[selected].startsWith("/images/generated/") || images[selected].startsWith("/images/reference-style/")) && <span className="scene-label">{t("Illustrative image")}</span>}</div>
      {images.length > 1 && <div className="p3-gallery-thumbnails">{images.map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={t("View {name} {index}", { name, index: index + 1 })} aria-pressed={selected === index} onClick={() => setSelected(index)}><Image src={src} alt="" fill sizes="100px" /></button>)}</div>}
    </div>
  );
}
