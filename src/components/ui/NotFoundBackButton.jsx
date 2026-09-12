"use client";

import { ArrowLeft } from "lucide-react";

export default function NotFoundBackButton() {
  return (
    <button type="button" onClick={() => window.history.back()} className="btn btn-secondary">
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Go back
    </button>
  );
}
