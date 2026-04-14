/**
 * Maps backend error messages to user-friendly UX messages.
 * Never exposes technical details to the user.
 */

const ERROR_MAP = [
  // POST /extract (PDF upload)
  ["No file provided or invalid file object.", "Please select a file."],
  ["Invalid file format. Please upload a PDF file.", "Only PDF files are supported."],
  ["File size too large. Please upload a PDF under 10MB.", "File is too large (max 10MB)."],
  ["Could not extract text from PDF.", "PDF could not be read. Try a different file or ensure it has selectable text."],
  ["Extracted text is too short.", "The PDF seems too short. Please upload a full resume."],
  ["The uploaded PDF doesn't appear to be a resume.", "This doesn't look like a resume. Please upload a resume PDF."],
  ["Error processing PDF", "We couldn't process this PDF. Try another file or a text-based PDF."],

  // POST /extract-from-url
  ["No URL provided.", "Please enter a PDF URL."],
  ["Invalid URL format. Please provide a valid HTTP/HTTPS URL.", "Please enter a valid HTTP or HTTPS URL."],
  ["Request timeout.", "Request timed out. Check the URL or try again later."],
  ["Failed to fetch file from URL", "Could not fetch the file. Check the URL."],
  ["URL does not point to a PDF file.", "The URL does not appear to point to a PDF."],
  ["File size too large. Please use a PDF under 10MB.", "File is too large (max 10MB)."],
  ["Error reading PDF", "Could not read the PDF from this URL."],
  ["Failed to read from URL", "Something went wrong. Please try again."],

  // POST /process-text (AI)
  ["resume_text", "Please provide both resume text and job description."],
  ["job_description", "Please provide both resume text and job description."],
  ["Pydantic validation", "Please provide both resume text and job description."],
  ["Resume text is too short.", "Resume text is too short (min 100 characters)."],
  ["Job description is too short.", "Job description is too short (min 50 characters)."],
  ["The provided text doesn't appear to be a resume.", "This doesn't look like resume text yet. Paste your full resume and try again."],
  ["AI service temporarily unavailable.", "Tailoring is temporarily unavailable. Please try again in a moment."],
  ["AI service temporarily unavailable", "Tailoring is temporarily unavailable. Please try again in a moment."],
  ["Invalid response from AI service.", "Something went wrong while generating suggestions. Please try again."],
  ["Empty response from AI service.", "We didn't get a complete response. Please try again."],
  ["Failed to parse AI response.", "Couldn't read the response. Please try again."],
  ["Incomplete or invalid response from AI service.", "The response looked incomplete. Please try again."],
  ["An unexpected error occurred.", "Something went wrong. Please try again."],
];

const FALLBACK_EXTRACT = "Something went wrong. Please try again.";
const FALLBACK_PROCESS = "Something went wrong. Please try again.";

/**
 * Returns a user-friendly error message. Never returns technical details.
 * @param {string} backendError - Raw error from response body (data?.error)
 * @param {'extract'|'process'} source - Optional hint for fallback message
 * @returns {string} User-friendly message
 */
export function getFriendlyError(backendError, source = "extract") {
  if (!backendError || typeof backendError !== "string") {
    return source === "process" ? FALLBACK_PROCESS : FALLBACK_EXTRACT;
  }
  const msg = backendError.trim();
  for (const [pattern, friendly] of ERROR_MAP) {
    if (msg.includes(pattern) || msg.startsWith(pattern)) {
      return friendly;
    }
  }
  return source === "process" ? FALLBACK_PROCESS : FALLBACK_EXTRACT;
}
