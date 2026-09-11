import WorkflowStepper from "./WorkflowStepper";

/**
 * App page header — left-aligned, task-focused (not marketing-centered).
 */
export default function AppPageHeader({
  eyebrow,
  title,
  description,
  actions,
  workflowSteps,
  workflowCurrent = 0,
}) {
  return (
    <header className="mb-5 border-b border-[var(--border)] pb-4 sm:mb-6">
      {workflowSteps?.length ? (
        <WorkflowStepper steps={workflowSteps} current={workflowCurrent} className="mb-3" />
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow mb-1">{eyebrow}</p> : null}
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl lg:text-[1.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="app-page-actions">{actions}</div> : null}
      </div>
    </header>
  );
}
