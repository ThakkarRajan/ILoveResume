/**
 * Authenticated app page shell — consistent padding, max-width, background.
 */
export default function AppPageLayout({ children, className = "" }) {
  return (
    <div className={`app-shell min-h-dvh min-w-0 overflow-x-clip bg-[var(--background)] ${className}`}>
      <div className="app-container min-w-0 py-4 sm:py-6 lg:py-7">{children}</div>
    </div>
  );
}
