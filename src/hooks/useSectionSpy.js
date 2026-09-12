"use client";

import { useEffect, useRef } from "react";

/**
 * Highlights nav tab for whichever section is nearest the viewport top.
 */
export function useSectionSpy(sectionIds, setActiveSection, rootMargin = "-40% 0px -50% 0px") {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!sectionIds.length) return;

    const visible = new Map();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId = sectionIds[0];
        let bestRatio = -1;

        for (const id of sectionIds) {
          const key = `section-${id}`;
          const ratio = visible.get(key) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestRatio > 0) {
          setActiveSection(bestId);
        }
      },
      { rootMargin, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(`section-${id}`);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sectionIds, setActiveSection, rootMargin]);
}

export function scrollToSection(id, reduceMotion = false) {
  const el = document.getElementById(`section-${id}`);
  if (!el) return;
  el.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}
