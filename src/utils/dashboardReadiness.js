export function getDashboardReadiness({
  jobText,
  uploadMode,
  pdfFile,
  selectedResume,
  textResume,
  user,
  isOnline,
  jobMinChars = 500,
}) {
  const jobLen = jobText?.trim()?.length || 0;
  const jobReady = jobLen >= jobMinChars;
  const resumeReady =
    uploadMode === "text"
      ? Boolean(textResume?.trim())
      : Boolean(pdfFile || selectedResume);
  const authReady = Boolean(user?.email);
  const completed = [jobReady, resumeReady, authReady].filter(Boolean).length;
  const canSubmit = jobReady && resumeReady && isOnline !== false;

  let tip = "Add a job description to continue";
  if (!jobText?.trim()) tip = "Add a job description to continue";
  else if (!jobReady) {
    tip = `Job description needs at least ${jobMinChars.toLocaleString()} characters (now ${jobLen.toLocaleString()})`;
  } else if (!resumeReady) {
    tip =
      uploadMode === "pdf"
        ? "Upload or select a PDF to continue"
        : "Paste your resume text to continue";
  } else if (!authReady) tip = "Sign in with Google when you generate";
  else tip = "Ready to tailor your resume";

  return {
    jobReady,
    resumeReady,
    authReady,
    completed,
    total: 3,
    canSubmit,
    tip,
  };
}
