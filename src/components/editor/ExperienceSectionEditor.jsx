"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import HighlightsEditor from "./HighlightsEditor";

export default function ExperienceSectionEditor({
  experiences = [],
  fieldErrors = {},
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="editor-section-content">
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

      {experiences.length === 0 ? (
        <p className="editor-empty-hint">No roles yet. Add your most recent position to start the timeline.</p>
      ) : (
        <ol className="exp-timeline">
          {experiences.map((exp, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="exp-timeline-item"
            >
              <div className="exp-timeline-rail" aria-hidden>
                <span className="exp-timeline-dot" />
                {idx < experiences.length - 1 ? <span className="exp-timeline-line" /> : null}
              </div>

              <div className="exp-timeline-body">
                <div className="exp-timeline-top">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <label className="editor-field-label">Job title</label>
                      <input
                        value={unescapeHtml(exp.title || "")}
                        onChange={(e) => onChange(idx, "title", e.target.value)}
                        className="input-field editor-title-input"
                        placeholder="Senior Software Engineer"
                      />
                      {fieldErrors[`experience_title_${idx}`] ? (
                        <p className="editor-field-error">{fieldErrors[`experience_title_${idx}`]}</p>
                      ) : null}
                    </div>
                    <div className="exp-meta-grid">
                      <div>
                        <label className="editor-field-label">Company</label>
                        <input
                          value={unescapeHtml(exp.company || "")}
                          onChange={(e) => onChange(idx, "company", e.target.value)}
                          className="input-field"
                          placeholder="Company name"
                        />
                        {fieldErrors[`experience_company_${idx}`] ? (
                          <p className="editor-field-error">{fieldErrors[`experience_company_${idx}`]}</p>
                        ) : null}
                      </div>
                      <div>
                        <label className="editor-field-label">Location</label>
                        <input
                          value={unescapeHtml(exp.location || "")}
                          onChange={(e) => onChange(idx, "location", e.target.value)}
                          className="input-field"
                          placeholder="City, Province or Remote"
                        />
                        {fieldErrors[`experience_location_${idx}`] ? (
                          <p className="editor-field-error">{fieldErrors[`experience_location_${idx}`]}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="exp-date-stack">
                    <div>
                      <label className="editor-field-label">Start</label>
                      <input
                        value={unescapeHtml(exp.start || "")}
                        onChange={(e) => onChange(idx, "start", e.target.value)}
                        className="input-field"
                        placeholder="Jan 2022"
                      />
                      {fieldErrors[`experience_start_${idx}`] ? (
                        <p className="editor-field-error">{fieldErrors[`experience_start_${idx}`]}</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="editor-field-label">End</label>
                      <input
                        value={unescapeHtml(exp.end || "")}
                        onChange={(e) => onChange(idx, "end", e.target.value)}
                        className="input-field"
                        placeholder="Present"
                      />
                      {fieldErrors[`experience_end_${idx}`] ? (
                        <p className="editor-field-error">{fieldErrors[`experience_end_${idx}`]}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="exp-highlights-block">
                  <label className="editor-field-label">Achievements & responsibilities</label>
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
                  <button type="button" onClick={() => onRemove(idx)} className="btn btn-ghost text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Remove role
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  );
}
