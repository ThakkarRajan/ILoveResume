"use client";

import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";

const variantStyles = {
  success: "border-l-emerald-500",
  error: "border-l-red-500",
  loading: "border-l-blue-500",
  warning: "border-l-amber-500",
  info: "border-l-zinc-400",
};

export function AppToast({ t, variant = "info", message }) {
  return (
    <div
      className={`pointer-events-auto flex w-[min(100vw-2rem,22rem)] items-start gap-3 rounded-xl border border-zinc-200 border-l-[3px] bg-white px-3.5 py-3 shadow-[0_8px_30px_rgb(24_24_27/0.12)] transition-all duration-200 ${variantStyles[variant] || variantStyles.info} ${
        t.visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      {variant === "loading" ? (
        <span
          className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800"
          aria-hidden
        />
      ) : null}
      <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-zinc-800">{message}</p>
      {variant !== "loading" ? (
        <button
          type="button"
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      containerClassName="!top-4 sm:!top-5"
      gutter={8}
      toastOptions={{
        duration: 3200,
        className: "!bg-transparent !p-0 !shadow-none",
      }}
    />
  );
}
