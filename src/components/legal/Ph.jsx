/**
 * Highlights a value you must replace (business email, address, legal name, etc.).
 * Replace the visible bracket text in the source files, or swap this component for plain text later.
 */
export function Ph({ children }) {
  return (
    <span className="inline max-w-full break-words rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[0.7rem] font-semibold text-amber-950 align-baseline">
      {children}
    </span>
  );
}
