"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

const homeLenisOptions = {
  autoRaf: true,
  lerp: 0.18,
  anchors: true,
  respectReducedMotion: true,
};

/** Home-only Lenis root — snappy smooth wheel scroll. */
export default function HomeLenis({ children }) {
  return (
    <ReactLenis root options={homeLenisOptions}>
      {children}
    </ReactLenis>
  );
}
