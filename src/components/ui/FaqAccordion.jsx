"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ items, className = "" }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={`divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)] ${className}`}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.q}>
            <h2 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex w-full min-h-[3.25rem] items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] sm:px-6"
              >
                <span className="text-sm font-semibold text-[var(--foreground)] sm:text-base">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </button>
            </h2>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="px-5 pb-5 sm:px-6 sm:pb-6"
            >
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
