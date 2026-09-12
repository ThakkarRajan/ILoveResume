"use client";

import { useState } from "react";
import { Award, Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import { showHighlightAdded, showHighlightError } from "../../utils/toast";
import ScrollReveal from "../motion/ScrollReveal";
import { motionDistance } from "../motion/motionConfig";

export default function CertificatesSectionEditor({ certificates = [], onChange }) {
  const [draft, setDraft] = useState("");
  const items = Array.isArray(certificates) ? certificates : [];

  const addCertificate = () => {
    const value = draft.trim();
    if (!value) {
      showHighlightError();
      return;
    }
    onChange([...items, value]);
    setDraft("");
    showHighlightAdded(true);
  };

  return (
    <div className="editor-section-content">
      <ScrollReveal y={motionDistance.subtle}>
        <EditorSectionHeader
          label="Credentials"
          title="Certificates"
          description="Compact list—name, issuer, and date on one line each."
        />
      </ScrollReveal>

      <div className="cert-composer">
        <label className="editor-field-label" htmlFor="cert-draft">
          Add certificate
        </label>
        <div className="cert-composer-row">
          <input
            id="cert-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCertificate();
              }
            }}
            className="input-field"
            placeholder="AWS Cloud Practitioner — Amazon Web Services — 2024"
          />
          <button type="button" onClick={addCertificate} className="btn btn-secondary shrink-0">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="editor-empty-hint">No certificates yet. Example: “PMP — PMI — 2023”.</p>
      ) : (
        <ul className="cert-list">
          {items.map((cert, idx) => (
            <ScrollReveal key={idx} as="li" className="cert-row" delay={idx * 0.03} y={6} amount={0.1}>
              <Award className="cert-row-icon" strokeWidth={1.75} aria-hidden />
              <input
                value={unescapeHtml(cert)}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                className="input-field cert-row-input"
                aria-label={`Certificate ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="editor-icon-btn editor-icon-btn-danger"
                title="Remove certificate"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </ScrollReveal>
          ))}
        </ul>
      )}
    </div>
  );
}
