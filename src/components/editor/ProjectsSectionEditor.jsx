"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import HighlightsEditor from "./HighlightsEditor";

function parseTech(tech) {
  if (Array.isArray(tech)) return tech.filter(Boolean);
  if (typeof tech === "string") return tech.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

export default function ProjectsSectionEditor({
  projects = [],
  fieldErrors = {},
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="editor-section-content">
      <EditorSectionHeader
        label="Portfolio"
        title="Projects"
        description="Show what you built—give important work room to breathe."
        action={
          <button type="button" onClick={onAdd} className="btn btn-primary shrink-0 self-start">
            <Plus className="h-4 w-4" />
            Add project
          </button>
        }
      />

      {projects.length === 0 ? (
        <p className="editor-empty-hint">Add a project you can discuss in interviews.</p>
      ) : (
        <div className="proj-showcase-list">
          {projects.map((proj, idx) => {
            const techItems = parseTech(proj.tech);

            return (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="proj-showcase"
              >
                <label className="editor-field-label">Project name</label>
                <input
                  value={unescapeHtml(proj.title || "")}
                  onChange={(e) => onChange(idx, "title", e.target.value)}
                  className="input-field editor-title-input"
                  placeholder="Project title"
                />
                {fieldErrors[`project_title_${idx}`] ? (
                  <p className="editor-field-error">{fieldErrors[`project_title_${idx}`]}</p>
                ) : null}

                <label className="editor-field-label mt-2">Technologies</label>
                <input
                  value={unescapeHtml(Array.isArray(proj.tech) ? proj.tech.join(", ") : proj.tech || "")}
                  onChange={(e) => onChange(idx, "tech", e.target.value)}
                  className="input-field"
                  placeholder="React, Node.js, PostgreSQL…"
                />
                {techItems.length > 0 ? (
                  <ul className="proj-tech-tags">
                    {techItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                <label className="editor-field-label mt-2">What you built & impact</label>
                <HighlightsEditor
                  highlights={proj.highlights}
                  onChange={(value) => onChange(idx, "highlights", value)}
                  placeholder="Problem, what you built, result (one bullet per line)…"
                />

                <button type="button" onClick={() => onRemove(idx)} className="btn btn-ghost mt-2 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  Remove project
                </button>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
