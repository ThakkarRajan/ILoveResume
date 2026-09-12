"use client";

/**
 * Shared browser chrome — frames product/project previews consistently.
 */
export default function BrowserChrome({
  children,
  url = "iloveresumes.ca",
  className = "",
  compact = false,
}) {
  return (
    <div className={`browser-chrome ${compact ? "browser-chrome-compact" : ""} ${className}`}>
      <div className="browser-chrome-bar" aria-hidden>
        <span className="browser-chrome-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-chrome-url">{url}</span>
      </div>
      <div className="browser-chrome-body">{children}</div>
    </div>
  );
}
