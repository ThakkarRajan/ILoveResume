"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import EditorFieldLabel from "./EditorFieldLabel";
import HighlightsEditor from "./HighlightsEditor";
import ScrollReveal from "../motion/ScrollReveal";
import { motionDistance, motionTransitions } from "../motion/motionConfig";

function ProjectShowcase({ proj, idx, fieldErrors, onChange, onRemove }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="proj-showcase"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
      transition={{ ...motionTransitions.reveal, delay: idx * 0.07 }}
    >
      <div className="proj-showcase-content">
        <EditorFieldLabel required>Project name</EditorFieldLabel>
        <input
          value={unescapeHtml(proj.title || "")}
          onChange={(e) => onChange(idx, "title", e.target.value)}
          className="input-field editor-title-input"
          placeholder="Project title"
          aria-required="true"
        />
        {fieldErrors[`project_title_${idx}`] ? (
          <p className="editor-field-error">{fieldErrors[`project_title_${idx}`]}</p>
        ) : null}

        <EditorFieldLabel className="mt-2">Technologies / project link</EditorFieldLabel>
        <input
          value={unescapeHtml(Array.isArray(proj.tech) ? proj.tech.join(", ") : proj.tech || "")}
          onChange={(e) => onChange(idx, "tech", e.target.value)}
          className="input-field"
          placeholder="React, Node.js — or https://github.com/you/project"
        />

        <EditorFieldLabel required className="mt-2">What you built & impact</EditorFieldLabel>
        <HighlightsEditor
          highlights={proj.highlights}
          onChange={(value) => onChange(idx, "highlights", value)}
          placeholder="Problem, what you built, result (one bullet per line)…"
        />
        {fieldErrors[`project_highlights_${idx}`] ? (
          <p className="editor-field-error">{fieldErrors[`project_highlights_${idx}`]}</p>
        ) : null}

        <button type="button" onClick={() => onRemove(idx)} className="btn btn-ghost mt-2 text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
          Remove project
        </button>
      </div>
    </motion.article>
  );
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
      <ScrollReveal y={motionDistance.section}>
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
      </ScrollReveal>

      {projects.length === 0 ? (
        <p className="editor-empty-hint">Add a project you can discuss in interviews.</p>
      ) : (
        <div className="proj-showcase-list">
          {projects.map((proj, idx) => (
            <ProjectShowcase
              key={idx}
              proj={proj}
              idx={idx}
              fieldErrors={fieldErrors}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
