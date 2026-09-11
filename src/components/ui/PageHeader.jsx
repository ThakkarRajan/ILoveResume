/**
 * Shared page header for marketing / utility pages.
 */
export default function PageHeader({ eyebrow, title, description, align = "left", className = "" }) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <header className={`mb-6 border-b border-[var(--border)] pb-4 sm:mb-7 ${alignClass} ${className}`}>
      {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
      <h1 className="display-heading">{title}</h1>
      {description ? (
        <p className={`prose-lead mt-2 ${align === "center" ? "mx-auto" : ""}`}>{description}</p>
      ) : null}
    </header>
  );
}
