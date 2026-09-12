"use client";

import { Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import EditorFieldLabel from "./EditorFieldLabel";
import ScrollReveal from "../motion/ScrollReveal";
import { motionDistance } from "../motion/motionConfig";

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
            <ScrollReveal key={idx} as="li" className="edu-row" delay={idx * 0.04} y={motionDistance.subtle}>
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
                  value={unescapeHtml(
                    (Array.isArray(edu.highlights) ? edu.highlights : []).join("\n")
                  )}
                  onChange={(e) => onChange(idx, "highlights", e.target.value.split("\n"))}
                  className="input-field resize-y leading-snug"
                  rows={3}
                  placeholder="Coursework, honors, or leadership (optional)"
                />
              </div>

              <button type="button" onClick={() => onRemove(idx)} className="btn btn-ghost text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                Remove entry
              </button>
            </ScrollReveal>
          ))}
        </ul>
      )}
    </div>
  );
}
