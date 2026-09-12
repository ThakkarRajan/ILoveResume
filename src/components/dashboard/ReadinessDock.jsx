"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Circle, Sparkles } from "lucide-react";

function Ring({ completed, total }) {
  const size = 72;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total ? completed / total : 0;
  const offset = c * (1 - pct);
  return (
    <div className="dash-ring relative inline-flex h-[72px] w-[72px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-sm font-semibold tabular-nums text-[var(--foreground)]">
        {completed}/{total}
      </span>
    </div>
  );
}

function CheckItem({ done, label }) {
  const Icon = done ? CheckCircle2 : Circle;
  return (
    <div className={`flex items-center gap-2 text-sm ${done ? "dash-check-done" : "dash-check-todo"}`}>
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span>{label}</span>
    </div>
  );
}

export default function ReadinessDock({ readiness, onGenerate }) {
  const { completed, total, jobReady, resumeReady, authReady, canSubmit, tip } = readiness;

  return (
    <>
      <aside className="dash-dock sticky top-[calc(var(--nav-height)+1rem)] hidden p-5 lg:block">
        <div className="mb-5 flex flex-col items-center text-center">
          <Ring completed={completed} total={total} />
          <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">Readiness</p>
          <p className="dash-muted mt-1 text-xs">Checklist before generate</p>
        </div>
        <div className="mb-5 space-y-2.5">
          <CheckItem done={jobReady} label="Job description" />
          <CheckItem done={resumeReady} label="Resume" />
          <CheckItem done={authReady} label="Signed in" />
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canSubmit}
          className="btn btn-primary w-full py-3.5 text-base disabled:opacity-45"
        >
          <Sparkles className="h-5 w-5" />
          Generate
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="dash-muted mt-3 flex items-start gap-2 text-xs">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{tip}</span>
        </p>
      </aside>

      <div className="dash-mobile-bar sticky-cta-bar fixed inset-x-0 bottom-0 z-40 px-3 py-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="origin-left shrink-0 scale-75">
            <Ring completed={completed} total={total} />
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canSubmit}
            className="btn btn-primary min-h-[44px] flex-1 disabled:opacity-45"
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </button>
        </div>
      </div>
    </>
  );
}
