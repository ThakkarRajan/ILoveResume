import { getBlogCasualLine } from "../../data/blog-visuals";

export default function BlogCasualAside({ slug, category }) {
  const line = getBlogCasualLine(slug, category);

  return (
    <div
      className="mb-8 flex gap-3 rounded-xl border border-zinc-200 bg-blue-50/50 px-4 py-3.5 text-sm text-zinc-800 sm:px-5 sm:py-4"
      role="note"
    >
      <p className="min-w-0 leading-relaxed">
        <span className="font-semibold text-zinc-900">Quick note.</span> {line}
      </p>
    </div>
  );
}
