import Link from "next/link";

export default function BreadcrumbNav({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.href ?? item.label} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden className="text-[var(--border-strong)]">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="font-medium text-[var(--accent)] hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[var(--foreground)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
