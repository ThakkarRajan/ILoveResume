"use client";

import { motion } from "framer-motion";
import { unescapeHtml } from "../../utils/safeHtml";

export default function JobPanel({ jobText, onChange, maxChars }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="panel min-w-0 max-w-full"
    >
      <div className="panel-header !py-3">
        <h2 className="panel-title">Job</h2>
      </div>
      <div className="panel-body">
        <textarea
          className="input-field input-field-lg h-36 resize-none sm:h-44"
          placeholder="Paste the job posting…"
          value={unescapeHtml(jobText)}
          onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
          maxLength={maxChars}
        />
        {jobText ? (
          <div
            className={`mt-2 flex items-center gap-2 text-xs ${
              jobText.length >= maxChars ? "text-amber-700" : "text-[var(--muted)]"
            }`}
          >
            <span className="tabular-nums">
              {jobText.length.toLocaleString()} / {maxChars.toLocaleString()}
            </span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
