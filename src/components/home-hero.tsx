"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n/client";
import { MediaFrame } from "@/components/media-frame";

const slides = [
  { title: "Industrial sensors,", second: "built in our own factory.", description: "Flow, level, pressure, temperature, ultrasonic and gas instrumentation for plant engineers and machine builders.", image: "/images/reference-style/hero-flow.webp", alt: "HSM10 thermal flow switch", href: "/products/flow" },
  { title: "Level Sensors", second: "Custom ranges", description: "We build to order with custom lengths, threads, materials and output ranges.", image: "/images/reference-style/hero-level.webp", alt: "HPS10 submersible level transmitter", href: "/products/level" },
  { title: "Pressure Sensors", second: "Factory-direct", description: "We assemble and calibrate every unit at our factory in Xiamen.", image: "/images/reference-style/story-custom.webp", alt: "PCC100 pressure controller", href: "/products/pressure" },
];

export function HomeHero() {
  const t = useTranslations();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [playing]);

  const slide = slides[active];
  return (
    <section className="p0-hero" aria-roledescription={t("carousel")} aria-label={t("Industrial sensors,")}>
      <div className="p0-hero-copy">
        <div className="p0-hero-content">
          <h1>{t(slide.title)} <span>{t(slide.second)}</span></h1>
          <p>{t(slide.description)}</p>
          <div className="p0-hero-actions">
            <Link href={slide.href}>{t("Browse the catalogue")}</Link>
            <Link href="/contact?intent=quote">{t("Request a quote")}</Link>
          </div>
        </div>
        <div className="p0-carousel-controls" aria-label={t("Carousel controls")}>
          {slides.map((item, index) => (
            <button key={item.image} type="button" className={index === active ? "is-active" : ""} aria-label={`${index + 1} / ${slides.length}: ${t(item.title)}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)}><span /></button>
          ))}
          <button type="button" className="p0-play" aria-label={t(playing ? "Pause slideshow" : "Play slideshow")} onClick={() => setPlaying(!playing)}>{playing ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3h3v10H4zm5 0h3v10H9z" fill="currentColor" /></svg> : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10l8-5z" fill="currentColor" /></svg>}</button>
        </div>
      </div>
      <MediaFrame preserveFraming className="p0-hero-image" src={slide.image} alt={t(slide.alt)} priority={active === 0} sizes="(max-width: 767px) 100vw, 40vw" />
    </section>
  );
}
