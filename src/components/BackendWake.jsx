"use client";

import { useEffect } from "react";
import { wakeBackend } from "../utils/api";

/** Silent backend warm-up on first page load. */
export default function BackendWake() {
  useEffect(() => {
    wakeBackend();
  }, []);

  return null;
}
