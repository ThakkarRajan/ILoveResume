"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import { showHighlightAdded, showHighlightError } from "../../utils/toast";

export default function HighlightsEditor({
  highlights = [],
  onChange,
  placeholder = "Add a bullet: action, scope, outcome…",
  variant = "default",
}) {
  const [inputValue, setInputValue] = useState("");
  const safeHighlights = Array.isArray(highlights) ? highlights : [];

  const handleAddKeyDown = (e) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    if (!inputValue.trim()) {
      showHighlightError();
      return;
    }
    onChange([...safeHighlights, inputValue.trim()]);
    setInputValue("");
    showHighlightAdded(/certific/i.test(placeholder));
  };

  const rowsForText = (text, { min = 2, max = 10 } = {}) =>
    Math.min(max, Math.max(min, (String(text || "").split("\n").length || 1) + 1));

  const listClass = variant === "compact" ? "editor-bullet-list editor-bullet-list-compact" : "editor-bullet-list";

  return (
    <div className="w-full min-w-0 space-y-1.5">
      <div className="w-full min-w-0">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddKeyDown}
          rows={rowsForText(inputValue)}
          placeholder={placeholder}
          className="input-field leading-snug"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">
          <span className="font-medium text-[var(--text-secondary)]">Enter</span> saves a bullet.{" "}
          <span className="font-medium text-[var(--text-secondary)]">Shift+Enter</span> for a line break.
        </p>
      </div>

      <div className={listClass}>
        {safeHighlights.map((highlight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="editor-bullet-item group"
          >
            <span className="editor-bullet-marker" aria-hidden />
            <div className="min-w-0 flex-1">
              <textarea
                value={unescapeHtml(highlight)}
                onChange={(e) => {
                  const next = [...safeHighlights];
                  next[index] = e.target.value;
                  onChange(next);
                }}
                rows={rowsForText(highlight)}
                className="input-field leading-snug"
                placeholder="Edit bullet…"
                spellCheck
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(safeHighlights.filter((_, i) => i !== index))}
              className="editor-icon-btn editor-icon-btn-danger"
              title="Remove bullet"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {safeHighlights.length === 0 ? (
        <p className="editor-empty-hint">No bullets yet. Type above and press Enter.</p>
      ) : null}
    </div>
  );
}
