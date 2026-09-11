import { FileText } from "lucide-react";

export default function EmptyState({ icon: Icon = FileText, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden>
        <Icon className="h-6 w-6 text-zinc-500" strokeWidth={1.75} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description ? <p className="empty-state-desc">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
