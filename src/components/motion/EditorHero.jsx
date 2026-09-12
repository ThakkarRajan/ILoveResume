"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motionTransitions } from "./motionConfig";

/**
 * Hero zone — scroll-linked scale, opacity, and subtle lift on profile panel.
 */
export default function EditorHero({ children, className = "", role, "aria-labelledby": ariaLabelledBy }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.62]);
  const scale = useTransform(scrollYProgress, [0, 0.75], [1, 0.985]);
  const y = useTransform(scrollYProgress, [0, 0.75], [0, -10]);
  const backdropOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0]);
  const sectionProps = {
    ref,
    id: "section-hero",
    className: `editor-hero-zone ${className}`,
    style: { position: "relative" },
    ...(role ? { role } : {}),
    ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
  };

  if (reduceMotion) {
    return <section {...sectionProps}>{children}</section>;
  }

  return (
    <section {...sectionProps}>
      <motion.div className="editor-hero-backdrop" style={{ opacity: backdropOpacity }} aria-hidden />
      <motion.div
        className="editor-hero-inner"
        style={{ opacity, scale, y }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransitions.hero}
      >
        {children}
      </motion.div>
    </section>
  );
}
