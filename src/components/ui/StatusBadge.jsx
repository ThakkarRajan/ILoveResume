const variants = {
  neutral: "badge-neutral",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  info: "badge-info",
};

export default function StatusBadge({ variant = "neutral", children }) {
  return <span className={`badge ${variants[variant] ?? variants.neutral}`}>{children}</span>;
}
