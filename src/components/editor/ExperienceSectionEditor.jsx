"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import EditorFieldLabel from "./EditorFieldLabel";
import HighlightsEditor from "./HighlightsEditor";
import ScrollReveal from "../motion/ScrollReveal";
import { motionEase, motionTransitions } from "../motion/motionConfig";

function TimelineLine({ isLast, active }) {
  const reduceMotion = useReducedMotion();
  if (isLast) return null;

  return (
    <span className="exp-timeline-line" aria-hidden>
      <motion.span
        className="exp-timeline-line-fill"
        initial={false}
        animate={{ scaleY: reduceMotion || active ? 1 : 0.12 }}
        transition={{ duration: 0.55, ease: motionEase }}
      />
    </span>
  );
}

function ExperienceTimelineItem({
  exp,
  idx,
  isLast,
  fieldErrors,
  onChange,
  onRemove,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, margin: "-8% 0px" });
  const reduceMotion = useReducedMotion();
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <motion.li
      ref={ref}
      className={`exp-timeline-item${inView && !reduceMotion ? " exp-timeline-item-active" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
      transition={{ ...motionTransitions.stagger, delay: idx * 0.06 }}
    >
      <div className="exp-timeline-rail" aria-hidden>
        <motion.span
          className="exp-timeline-dot"
          initial={false}
          animate={{
            scale: inView && !reduceMotion ? 1.08 : 1,
            backgroundColor: inView && !reduceMotion ? "var(--accent)" : "var(--surface)",
          }}
          transition={{ duration: 0.35, ease: motionEase }}
        />
        <TimelineLine isLast={isLast} active={inView} />
      </div>

      <div className="exp-timeline-body">
        <div className="exp-timeline-top">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="exp-role-heading">
              <span className="exp-company-mark" aria-hidden>
                {(exp.company || exp.title || "R").trim().charAt(0).toUpperCase() || "R"}
              </span>
              <div className="min-w-0 flex-1">
                <EditorFieldLabel required>Job title</EditorFieldLabel>
                <input
                  value={unescapeHtml(exp.title || "")}
                  onChange={(e) => onChange(idx, "title", e.target.value)}
                  className="input-field editor-title-input"
                  placeholder="Senior Software Engineer"
                  aria-required="true"
                />
                {fieldErrors[`experience_title_${idx}`] ? (
                  <p className="editor-field-error">{fieldErrors[`experience_title_${idx}`]}</p>
                ) : null}
              </div>
            </div>
            <div className="exp-meta-grid">
              <div>
                <EditorFieldLabel required>Company</EditorFieldLabel>
                <input
                  value={unescapeHtml(exp.company || "")}
                  onChange={(e) => onChange(idx, "company", e.target.value)}
                  className="input-field"
                  placeholder="Company name"
                  aria-required="true"
                />
                {fieldErrors[`experience_company_${idx}`] ? (
                  <p className="editor-field-error">{fieldErrors[`experience_company_${idx}`]}</p>
                ) : null}
              </div>
              <div>
                <EditorFieldLabel required>Location</EditorFieldLabel>
                <input
                  value={unescapeHtml(exp.location || "")}
                  onChange={(e) => onChange(idx, "location", e.target.value)}
                  className="input-field"
                  placeholder="City, State / Province / Region or Remote"
                  aria-required="true"
                />
                {fieldErrors[`experience_location_${idx}`] ? (
                  <p className="editor-field-error">{fieldErrors[`experience_location_${idx}`]}</p>
                ) : null}
              </div>
            </div>
          </div>

          <motion.div
            className="exp-date-stack"
            initial={false}
            animate={{ opacity: inView || reduceMotion ? 1 : 0.55 }}
            transition={{ duration: 0.4, ease: motionEase }}
          >
            <div>
              <EditorFieldLabel required>Start</EditorFieldLabel>
              <input
                value={unescapeHtml(exp.start || "")}
                onChange={(e) => onChange(idx, "start", e.target.value)}
                className="input-field"
                placeholder="Jan 2022"
                aria-required="true"
              />
              {fieldErrors[`experience_start_${idx}`] ? (
                <p className="editor-field-error">{fieldErrors[`experience_start_${idx}`]}</p>
              ) : null}
            </div>
            <div>
              <EditorFieldLabel required>End</EditorFieldLabel>
              <input
                value={unescapeHtml(exp.end || "")}
                onChange={(e) => onChange(idx, "end", e.target.value)}
                className="input-field"
                placeholder="Present"
                aria-required="true"
              />
              {fieldErrors[`experience_end_${idx}`] ? (
                <p className="editor-field-error">{fieldErrors[`experience_end_${idx}`]}</p>
              ) : null}
            </div>
          </motion.div>
        </div>

        <div className="exp-highlights-block">
          <EditorFieldLabel required>Achievements & responsibilities</EditorFieldLabel>
          <HighlightsEditor
            highlights={exp.highlights}
            onChange={(value) => onChange(idx, "highlights", value)}
            placeholder="Add a win: action, scope, measurable outcome…"
          />
          {fieldErrors[`experience_highlights_${idx}`] ? (
            <p className="editor-field-error">{fieldErrors[`experience_highlights_${idx}`]}</p>
          ) : null}
        </div>

        <div className="exp-item-actions">
          {confirmRemove ? (
            <div className="exp-remove-confirm" role="status">
              <p className="exp-remove-confirm-text">Are you sure you want to remove this role?</p>
              <div className="exp-remove-confirm-actions">
                <button
                  type="button"
                  onClick={() => setConfirmRemove(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmRemove(false);
                    onRemove(idx);
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Yes, remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRemove(true)}
              aria-label="Remove Above Role"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30"
            >
              <Trash2 className="h-4 w-4" />
              Remove Above Role
            </button>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default function ExperienceSectionEditor({
  experiences = [],
  fieldErrors = {},
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="editor-section-content">
      <ScrollReveal y={10}>
        <EditorSectionHeader
          label="Career"
          title="Work experience"
          description="Roles, impact, and outcomes recruiters scan first."
          action={
            <button type="button" onClick={onAdd} className="btn btn-primary shrink-0 self-start">
              <Plus className="h-4 w-4" />
              Add role
            </button>
          }
        />
      </ScrollReveal>

      {experiences.length === 0 ? (
        <p className="editor-empty-hint">No roles yet. Add your most recent position to start the timeline.</p>
      ) : (
        <ol className="exp-timeline">
          {experiences.map((exp, idx) => (
            <ExperienceTimelineItem
              key={idx}
              exp={exp}
              idx={idx}
              isLast={idx === experiences.length - 1}
              fieldErrors={fieldErrors}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
