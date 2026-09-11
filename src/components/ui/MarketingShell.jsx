import PageFooter from "./PageFooter";

/**
 * Standard wrapper for public marketing / content pages.
 */
export default function MarketingShell({
  children,
  className = "",
  narrow = false,
  showFooter = true,
  footerClassName = "mt-8",
}) {
  return (
    <div className={`page-canvas min-w-0 overflow-x-clip ${className}`}>
      <div className={`app-container min-w-0 section-y ${narrow ? "max-w-3xl" : ""}`}>
        {children}
        {showFooter ? <PageFooter className={footerClassName} /> : null}
      </div>
    </div>
  );
}
