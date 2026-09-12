"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "../motion/ScrollReveal";
import { motionDistance } from "../motion/motionConfig";

export default function GuideCardGrid({ guides, className = "" }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 lg:gap-4 ${className}`}>
      {guides.map(({ href, name, description }, index) => (
        <ScrollReveal
          key={href}
          as="li"
          delay={Math.min(index * 0.04, 0.28)}
          y={motionDistance.item}
          amount={0.12}
        >
          <Link
            href={href}
            className="card-interactive group flex h-full min-h-[4.5rem] flex-col justify-between gap-3 p-4 sm:p-5"
          >
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] sm:text-base">{name}</h3>
              {description ? (
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
              ) : null}
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
              Read guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
            </span>
          </Link>
        </ScrollReveal>
      ))}
    </ul>
  );
}
