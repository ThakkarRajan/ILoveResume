"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import HighlightsEditor from "./HighlightsEditor";

export default function EducationSectionEditor({
  education = [],
  fieldErrors = {},
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="editor-section-content">
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

      {education.length === 0 ? (
        <p className="editor-empty-hint">Add a degree, diploma, or certification program.</p>
      ) : (
        <ul className="edu-list">
          {education.map((edu, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="edu-row"
            >
              <div className="edu-row-primary">
                <div className="edu-row-copy">
                  <label className="editor-field-label">Program / degree</label>
                  <input
                    value={unescapeHtml(edu.program || "")}
                    onChange={(e) => onChange(idx, "program", e.target.value)}
                    className="input-field editor-title-input"
                    placeholder="B.Sc. Computer Science"
                  />
                  {fieldErrors[`education_program_${idx}`] ? (
                    <p className="editor-field-error">{fieldErrors[`education_program_${idx}`]}</p>
                  ) : null}

                  <label className="editor-field-label">Institution</label>
                  <input
                    value={unescapeHtml(edu.school || "")}
                    onChange={(e) => onChange(idx, "school", e.target.value)}
                    className="input-field"
                    placeholder="University or college"
                  />
                  {fieldErrors[`education_school_${idx}`] ? (
                    <p className="editor-field-error">{fieldErrors[`education_school_${idx}`]}</p>
                  ) : null}
                </div>

                <div className="edu-row-meta">
                  <div>
                    <label className="editor-field-label">Start</label>
                    <input
                      value={unescapeHtml(edu.start || "")}
                      onChange={(e) => onChange(idx, "start", e.target.value)}
                      className="input-field"
                      placeholder="2015"
                    />
                  </div>
                  <div>
                    <label className="editor-field-label">End</label>
                    <input
                      value={unescapeHtml(edu.end || "")}
                      onChange={(e) => onChange(idx, "end", e.target.value)}
                      className="input-field"
                      placeholder="2019"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="editor-field-label">Location</label>
                    <input
                      value={unescapeHtml(edu.location || "")}
                      onChange={(e) => onChange(idx, "location", e.target.value)}
                      className="input-field"
                      placeholder="City, Province"
                    />
                  </div>
                </div>
              </div>

              <div className="edu-row-details">
                <label className="editor-field-label">Relevant details</label>
                <HighlightsEditor
                  highlights={edu.highlights}
                  onChange={(value) => onChange(idx, "highlights", value)}
                  placeholder="Coursework, honors, or leadership (one bullet per line)…"
                  variant="compact"
                />
              </div>

              <button type="button" onClick={() => onRemove(idx)} className="btn btn-ghost text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                Remove entry
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
