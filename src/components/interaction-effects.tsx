'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: content is never hidden if scripting or motion is disabled. */
export function InteractionEffects() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('section-arrived');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('main > section').forEach((element, index) => {
      if (index > 0 && element.getBoundingClientRect().top > window.innerHeight) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
