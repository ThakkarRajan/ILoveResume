"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Compact disclosure list — hairline separators, no card chrome.
 */
export default function FaqAccordion({ items, className = "", allowMultiple = false, idPrefix = "faq" }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [openSet, setOpenSet] = useState(() => new Set([0]));

  const isOpen = (index) => (allowMultiple ? openSet.has(index) : openIndex === index);

  const toggle = (index) => {
    if (allowMultiple) {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
      return;
    }
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className={`faq-list ${className}`}>
      {items.map((item, index) => {
        const open = isOpen(index);
        const panelId = `${idPrefix}-panel-${index}`;
        const buttonId = `${idPrefix}-button-${index}`;
        return (
          <div key={item.q} className={`faq-item${open ? " is-open" : ""}`}>
            <h2 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="faq-trigger"
              >
                <span className="faq-question">{item.q}</span>
                <ChevronDown className="faq-chevron" strokeWidth={1.75} aria-hidden />
              </button>
            </h2>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`faq-panel${open ? " is-open" : ""}`}
              inert={open ? undefined : true}
            >
              <div className="faq-panel-inner">
                <p className="faq-answer">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
