import { getBlogCasualLine } from "../../data/blog-visuals";

export default function BlogCasualAside({ slug, category }) {
  const line = getBlogCasualLine(slug, category);

  return (
    <div
      className="mb-8 flex gap-3 rounded-xl border border-violet-200/90 bg-gradient-to-br from-violet-50/95 via-white to-amber-50/70 px-4 py-3.5 text-sm text-zinc-800 shadow-sm sm:px-5 sm:py-4"
      role="note"
    >
      <span className="select-none text-lg leading-none" aria-hidden>
        ✨
      </span>
      <p className="min-w-0 leading-relaxed">
        <span className="font-semibold text-zinc-900">Quick vibe check.</span> {line}
      </p>
    </div>
  );
}
