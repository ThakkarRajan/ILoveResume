"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { motionDistance, motionTransitions } from "./motionConfig";

/**
 * Homepage hero — scroll-linked fade/scale on copy; panel drifts at a slightly different rate.
 * Mobile uses smaller travel so scroll stays light on phones.
 */
export default function HomeHero({ copy, panel, className = "" }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const copyFadeEnd = compact ? 0.82 : 0.55;
  const copyLift = compact ? -6 : -12;
  const panelDrift = compact ? 8 : 18;
  const panelFadeEnd = compact ? 0.82 : 0.72;

  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, copyFadeEnd]);
  const copyScale = useTransform(scrollYProgress, [0, 0.7], [1, compact ? 0.992 : 0.985]);
  const copyY = useTransform(scrollYProgress, [0, 0.7], [0, copyLift]);
  const panelY = useTransform(scrollYProgress, [0, 0.7], [0, panelDrift]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.7], [1, panelFadeEnd]);
  const backdropOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0]);

  if (reduceMotion) {
    return (
      <section
        ref={ref}
        className={`home-hero-zone grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-10 ${className}`}
        style={{ position: "relative" }}
      >
        <div className="min-w-0">{copy}</div>
        <div className="min-w-0">{panel}</div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`home-hero-zone grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-10 ${className}`}
      style={{ position: "relative" }}
    >
      <motion.div className="home-hero-backdrop" style={{ opacity: backdropOpacity }} aria-hidden />

      <motion.div
        className="relative min-w-0"
        style={{ opacity: copyOpacity, scale: copyScale, y: copyY }}
        initial={{ opacity: 0, y: motionDistance.hero }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransitions.hero}
      >
        {copy}
      </motion.div>

      <motion.div
        className="relative min-w-0"
        style={{ y: panelY, opacity: panelOpacity }}
        initial={{ opacity: 0, y: motionDistance.section + 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...motionTransitions.hero, delay: 0.12 }}
      >
        {panel}
      </motion.div>
    </section>
  );
}
