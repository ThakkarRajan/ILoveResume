export default function EditorSectionHeader({ label, title, description, action, className = "" }) {
  return (
    <header className={`editor-section-header ${action ? "editor-section-header-with-action" : ""} ${className}`}>
      <div className="min-w-0 flex-1">
        {label ? <p className="editor-section-label">{label}</p> : null}
        <h2 className="editor-section-title">{title}</h2>
        {description ? <p className="editor-section-desc">{description}</p> : null}
      </div>
      {action ? <div className="editor-section-action shrink-0">{action}</div> : null}
    </header>
  );
}
