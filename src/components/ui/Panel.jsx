/**
 * Form / content panel — standard app surface.
 */
export default function Panel({ title, description, step, actions, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {(title || description) && (
        <div className="panel-header">
          <div className="min-w-0 flex-1">
            {step ? (
              <p className="mb-1 text-xs font-semibold tabular-nums text-blue-700">Step {step}</p>
            ) : null}
            {title ? <h2 className="panel-title">{title}</h2> : null}
            {description ? <p className="panel-desc">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}
