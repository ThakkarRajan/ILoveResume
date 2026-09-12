"use client";

import { Plus, Trash2 } from "lucide-react";
import { showError } from "../../utils/toast";
import { unescapeHtml } from "../../utils/safeHtml";
import EditorSectionHeader from "./EditorSectionHeader";
import ScrollReveal from "../motion/ScrollReveal";
import { motionDistance } from "../motion/motionConfig";
import { skillCategoryIcon } from "../graphics/skillIcons";

function formatCategoryLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SkillsSectionEditor({
  skills = {},
  onAddCategory,
  onRemoveCategory,
  onRenameCategory,
  onChangeSkills,
}) {
  const entries = Object.entries(skills || {});

  return (
    <div className="editor-section-content">
      <ScrollReveal y={motionDistance.subtle}>
        <EditorSectionHeader
          label="Capabilities"
          title="Skills & expertise"
          description="Group skills by category. Keep primary stacks easy to scan."
          action={
            <button type="button" onClick={onAddCategory} className="btn btn-primary shrink-0 self-start">
              <Plus className="h-4 w-4" />
              Add category
            </button>
          }
        />
      </ScrollReveal>

      {entries.length === 0 ? (
        <p className="editor-empty-hint">Add categories such as Frontend, Backend, Cloud, or Tools.</p>
      ) : (
        <div className="skills-matrix">
          {entries.map(([category, skillList], index) => {
            const items = Array.isArray(skillList) ? skillList : [];
            const CategoryIcon = skillCategoryIcon(category);
            return (
              <ScrollReveal
                key={category}
                as="section"
                className="skills-matrix-col"
                delay={index * 0.05}
                y={motionDistance.item}
                amount={0.15}
              >
                <div className="skills-matrix-head">
                  <span className="skills-matrix-icon" aria-hidden>
                    <CategoryIcon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <input
                    defaultValue={category}
                    onBlur={(e) => {
                      const next = e.target.value.trim();
                      if (!next) {
                        e.target.value = category;
                        showError("Name the category first");
                        return;
                      }
                      if (next === category) return;
                      if (skills[next]) {
                        showError("That category already exists");
                        e.target.value = category;
                        return;
                      }
                      onRenameCategory(category, next);
                    }}
                    className="skills-matrix-title"
                    aria-label="Category name"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveCategory(category)}
                    className="editor-icon-btn editor-icon-btn-danger"
                    title="Remove category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <label className="editor-field-label">Skills (comma-separated)</label>
                <input
                  value={unescapeHtml(items.join(", "))}
                  onChange={(e) => onChangeSkills(category, e.target.value)}
                  className="input-field"
                  placeholder={`e.g. ${formatCategoryLabel(category)} skills…`}
                />
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
