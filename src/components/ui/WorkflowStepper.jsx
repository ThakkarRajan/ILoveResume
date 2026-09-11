/**
 * Horizontal step indicator for the tailor → edit → export flow.
 */
export default function WorkflowStepper({ steps, current = 0, className = "" }) {
  return (
    <div className={`workflow-stepper-wrap ${className}`}>
      <ol className="flex flex-nowrap items-center gap-1 sm:gap-2" aria-label="Application workflow">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id ?? step.label} className="flex shrink-0 items-center gap-1 sm:gap-2">
            {index > 0 ? (
              <span
                className={`h-px w-2 shrink-0 sm:w-4 ${done ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}
                aria-hidden
              />
            ) : null}
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-medium whitespace-nowrap sm:gap-2 sm:px-2.5 sm:text-xs ${
                active
                  ? "bg-[var(--accent-muted)] text-[var(--accent-hover)] ring-1 ring-[var(--accent-subtle)]"
                  : done
                    ? "bg-[var(--surface-inset)] text-[var(--foreground)]"
                    : "text-[var(--muted)]"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold tabular-nums sm:h-5 sm:w-5 sm:text-[10px] ${
                  active
                    ? "bg-[var(--accent)] text-white"
                    : done
                      ? "bg-[var(--foreground)] text-white"
                      : "bg-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              {step.label}
            </span>
          </li>
        );
      })}
      </ol>
    </div>
  );
}
