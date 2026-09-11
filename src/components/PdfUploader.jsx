"use client";

import { useState } from "react";
import { API_BASE } from "../utils/api.js";
import { showError } from "../utils/toast.js";
import { getFriendlyError } from "../utils/errorMessages.js";

export default function PdfUploader({ onExtract }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const res = await fetch(`${API_BASE}/extract`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        showError(getFriendlyError(data?.error, "extract"));
        return;
      }
      onExtract(data.text || "No selectable text found in this PDF. Try a text-based export or paste your resume as text.");
    } catch (error) {
      showError("Something broke");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label htmlFor="resume">Resume PDF</label>
      <input
        id="resume"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: "block", marginTop: "10px" }}
      />

      <button
        onClick={handleUpload}
        disabled={!pdfFile || loading}
        style={{
          marginTop: "10px",
          padding: "12px 25px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          fontSize: "1rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Extracting text…" : "Extract text"}
      </button>
    </div>
  );
}
