"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Download,
  Edit3,
  FileText,
  FileUp,
  Trash2,
  Type,
} from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { PDF_MAX_LABEL } from "../../utils/pdfLimits.js";
import { unescapeHtml } from "../../utils/safeHtml";

export default function ResumePanel({
  uploadMode,
  onSwitchMode,
  pdfFile,
  textResume,
  onTextChange,
  textMax,
  fileInputRef,
  dragActive,
  onDrag,
  onDrop,
  onFileChange,
  uploadedResumes,
  selectedResume,
  onSelectResume,
  onClearPdfSelection: _onClearPdfSelection,
  onDownload,
  onConfirmDelete,
  isDeletingResume,
  showDeleteConfirm,
  escapeHtml,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="panel min-w-0 max-w-full"
    >
      <div className="panel-header !py-3">
        <h2 className="panel-title">Resume</h2>
      </div>
      <div className="panel-body">
        <div className="mb-6">
          <div className="flex flex-col gap-1 rounded-lg bg-zinc-100 p-1 sm:flex-row">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSwitchMode("pdf")}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:py-2 ${
                uploadMode === "pdf"
                  ? "bg-white text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]/80"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <FileUp className="h-4 w-4" />
              PDF
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSwitchMode("text")}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:py-2 ${
                uploadMode === "text"
                  ? "bg-white text-[var(--accent)] shadow-sm ring-1 ring-[var(--border)]/80"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Type className="h-4 w-4" />
              Paste text
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {uploadMode === "pdf" && (
            <motion.div
              key="pdf"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`relative rounded-2xl border-2 border-dashed p-4 text-center transition-all duration-200 sm:p-8 ${
                  dragActive
                    ? "border-[var(--accent)] bg-[var(--accent-muted)]/60"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={onFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
                    <FileText className="h-8 w-8 text-zinc-600" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 px-1">
                    <p
                      className="mb-2 break-words text-base font-medium text-gray-900 sm:text-xl"
                      title={pdfFile ? pdfFile.name : undefined}
                    >
                      {pdfFile ? pdfFile.name : "Drop a PDF here or click to browse"}
                    </p>
                    <p className="text-gray-500">
                      {pdfFile ? `Ready to process · up to ${PDF_MAX_LABEL}` : `Up to ${PDF_MAX_LABEL} · text-based PDFs work best`}
                    </p>
                  </div>
                  {pdfFile ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center text-[var(--accent-hover)]"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span className="text-sm font-medium">Ready to process</span>
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}

          {uploadMode === "text" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex min-w-0 items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:items-center">
                <Edit3 className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600 sm:mt-0" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900">Resume text</p>
                  <p className="text-xs text-zinc-600 sm:text-sm">
                    Paste your full resume (max {textMax.toLocaleString()} characters).
                  </p>
                </div>
              </div>

              <textarea
                className="input-field input-field-lg h-64 resize-none sm:text-lg"
                placeholder="Paste your full resume—experience, skills, education, and links. Clear section headings help us map your content accurately."
                value={unescapeHtml(textResume)}
                onChange={(e) => onTextChange(e.target.value.slice(0, textMax))}
                maxLength={textMax}
              />

              {textResume ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 text-sm ${
                    textResume.length >= textMax ? "text-amber-700" : "text-[var(--accent-hover)]"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="tabular-nums">
                    {textResume.length.toLocaleString()} / {textMax.toLocaleString()} characters
                  </span>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 border-t border-zinc-200 pt-8">
          <div className="mb-4">
            <h3 className="panel-title">Saved uploads</h3>
            <p className="panel-desc">
              {uploadedResumes.length} file{uploadedResumes.length === 1 ? "" : "s"} — select to reuse
            </p>
          </div>

          {uploadedResumes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No uploads yet"
              description="Upload a PDF above and it will appear here for reuse."
            />
          ) : (
            <div className="space-y-3">
              {uploadedResumes.map((resume) => (
                <motion.div
                  key={resume.path}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    selectedResume?.path === resume.path
                      ? "border-[var(--accent)] bg-[var(--accent-muted)]/50 shadow-sm"
                      : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                  onClick={() => onSelectResume(resume)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 flex-1 items-center space-x-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                        <FileText className="h-5 w-5 text-zinc-600" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1 pr-1">
                        <p className="truncate text-sm font-medium text-gray-900" title={resume.name}>
                          {escapeHtml(resume.name)}
                        </p>
                        <p className="text-xs text-gray-500">PDF</p>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-shrink-0 items-center gap-0.5 sm:gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(resume);
                        }}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isDeletingResume || showDeleteConfirm}
                        onClick={(e) => {
                          e.stopPropagation();
                          onConfirmDelete(resume);
                        }}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-red-500 disabled:pointer-events-none disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
