export default function EditorFieldLabel({
  children,
  required = false,
  className = "",
  htmlFor,
}) {
  return (
    <label
      className={`editor-field-label${className ? ` ${className}` : ""}`}
      htmlFor={htmlFor}
    >
      {children}
      {required ? (
        <>
          <span className="editor-field-required" aria-hidden="true">
            {" "}
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : null}
    </label>
  );
}
