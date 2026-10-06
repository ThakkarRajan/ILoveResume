"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import EditorFieldLabel from "./EditorFieldLabel";
import ScrollReveal from "../motion/ScrollReveal";
import { motionDistance } from "../motion/motionConfig";

const removeBtnClass =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30";

function EducationEntryItem({ edu, idx, fieldErrors, onChange, onRemove }) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <ScrollReveal as="li" className="edu-row" delay={idx * 0.04} y={motionDistance.subtle}>
      <div className="edu-row-primary">
        <div className="edu-row-copy">
          <div className="edu-program-row">
            <span className="edu-school-mark" aria-hidden>
              {(edu.school || edu.program || "U").trim().charAt(0).toUpperCase() || "U"}
            </span>
            <div className="min-w-0 flex-1">
              <EditorFieldLabel required>Program / degree</EditorFieldLabel>
              <input
                value={unescapeHtml(edu.program || "")}
                onChange={(e) => onChange(idx, "program", e.target.value)}
                className="input-field editor-title-input"
                placeholder="B.Sc. Computer Science"
                aria-required="true"
              />
              {fieldErrors[`education_program_${idx}`] ? (
                <p className="editor-field-error">{fieldErrors[`education_program_${idx}`]}</p>
              ) : null}
            </div>
          </div>

          <EditorFieldLabel required>Institution</EditorFieldLabel>
          <input
            value={unescapeHtml(edu.school || "")}
            onChange={(e) => onChange(idx, "school", e.target.value)}
            className="input-field"
            placeholder="University or college"
            aria-required="true"
          />
          {fieldErrors[`education_school_${idx}`] ? (
            <p className="editor-field-error">{fieldErrors[`education_school_${idx}`]}</p>
          ) : null}
        </div>

        <div className="edu-row-meta">
          <div>
            <EditorFieldLabel required>Start</EditorFieldLabel>
            <input
              value={unescapeHtml(edu.start || "")}
              onChange={(e) => onChange(idx, "start", e.target.value)}
              className="input-field"
              placeholder="2015"
              aria-required="true"
            />
            {fieldErrors[`education_start_${idx}`] ? (
              <p className="editor-field-error">{fieldErrors[`education_start_${idx}`]}</p>
            ) : null}
          </div>
          <div>
            <EditorFieldLabel required>End</EditorFieldLabel>
            <input
              value={unescapeHtml(edu.end || "")}
              onChange={(e) => onChange(idx, "end", e.target.value)}
              className="input-field"
              placeholder="2019"
              aria-required="true"
            />
            {fieldErrors[`education_end_${idx}`] ? (
              <p className="editor-field-error">{fieldErrors[`education_end_${idx}`]}</p>
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <EditorFieldLabel required>Location</EditorFieldLabel>
            <input
              value={unescapeHtml(edu.location || "")}
              onChange={(e) => onChange(idx, "location", e.target.value)}
              className="input-field"
              placeholder="City, State / Province / Region"
              aria-required="true"
            />
            {fieldErrors[`education_location_${idx}`] ? (
              <p className="editor-field-error">{fieldErrors[`education_location_${idx}`]}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="edu-row-details">
        <EditorFieldLabel>Relevant details</EditorFieldLabel>
        <textarea
          value={unescapeHtml((Array.isArray(edu.highlights) ? edu.highlights : []).join("\n"))}
          onChange={(e) => onChange(idx, "highlights", e.target.value.split("\n"))}
          className="input-field resize-y leading-snug"
          rows={2}
          placeholder="Coursework, honors, or leadership (optional)"
        />
      </div>

      <div className="exp-item-actions">
        {confirmRemove ? (
          <div className="exp-remove-confirm" role="status">
            <p className="exp-remove-confirm-text">Are you sure you want to remove this entry?</p>
            <div className="exp-remove-confirm-actions">
              <button type="button" onClick={() => setConfirmRemove(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmRemove(false);
                  onRemove(idx);
                }}
                className={removeBtnClass}
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
            aria-label="Remove entry"
            className={removeBtnClass}
          >
            <Trash2 className="h-4 w-4" />
            Remove entry
          </button>
        )}
      </div>
    </ScrollReveal>
  );
}

export default function EducationSectionEditor({
  education = [],
  fieldErrors = {},
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="editor-section-content">
      <ScrollReveal y={motionDistance.subtle}>
        <EditorSectionHeader
          label="Academic"
          title="Education"
          description="Degrees and programs—kept compact compared to work history."
          action={
            <button type="button" onClick={onAdd} className="btn btn-primary shrink-0 self-start">
              <Plus className="h-4 w-4" />
              Add education
            </button>
          }
        />
      </ScrollReveal>

      {education.length === 0 ? (
        <p className="editor-empty-hint">Add a degree, diploma, or certification program.</p>
      ) : (
        <ul className="edu-list">
          {education.map((edu, idx) => (
            <EducationEntryItem
              key={idx}
              edu={edu}
              idx={idx}
              fieldErrors={fieldErrors}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
