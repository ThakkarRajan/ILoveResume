"use client";

import { motion, useReducedMotion } from "framer-motion";
import { motionDistance, motionTransitions, viewportDefaults } from "./motionConfig";

/**
 * Lightweight entrance on scroll — opacity + translate only.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = motionDistance.section,
  amount = viewportDefaults.amount,
  once = viewportDefaults.once,
  as = "div",
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as === "li" ? "li" : as === "article" ? "article" : "div";
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: viewportDefaults.margin }}
      transition={{ ...motionTransitions.reveal, delay }}
    >
      {children}
    </Component>
  );
}
