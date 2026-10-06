/**
 * Maps backend error messages to short user-facing copy.
 */

const ERROR_MAP = [
  ["No file provided or invalid file object.", "Pick a file"],
  ["Invalid file format. Please upload a PDF file.", "PDF only"],
  ["File size too large. Please upload a PDF under 5MB.", "Too big (5MB max)"],
  ["File too large (max 5MB)", "Too big (5MB max)"],
  ["Could not extract text from PDF.", "Couldn't read PDF"],
  ["Extracted text is too short.", "PDF too short"],
  ["The uploaded PDF doesn't appear to be a resume.", "Not a resume?"],
  ["Error processing PDF", "Couldn't process PDF"],

  ["No URL provided.", "Paste a URL"],
  ["Invalid URL format. Please provide a valid HTTP/HTTPS URL.", "Need a valid http/https URL"],
  ["Request timeout.", "Timed out"],
  ["Failed to fetch file from URL", "Couldn't fetch file"],
  ["URL does not point to a PDF file.", "URL isn't a PDF"],
  ["File size too large. Please use a PDF under 5MB.", "Too big (5MB max)"],
  ["Error reading PDF", "Couldn't read PDF"],
  ["Failed to read from URL", "Something broke"],

  ["resume_text", "Need resume + job description"],
  ["job_description", "Need resume + job description"],
  ["Pydantic validation", "Need resume + job description"],
  ["Resume text is too short.", "Resume too short"],
  ["Job description is too short.", "Job post too short"],
  ["The provided text doesn't appear to be a resume.", "Not resume text"],
  ["AI service temporarily unavailable.", "Tailoring's down — retry soon"],
  ["AI service temporarily unavailable", "Tailoring's down — retry soon"],
  ["Invalid response from AI service.", "Bad response — retry"],
  ["Empty response from AI service.", "Empty response — retry"],
  ["Failed to parse AI response.", "Couldn't read response"],
  ["Incomplete or invalid response from AI service.", "Incomplete response"],
  ["An unexpected error occurred.", "Something broke"],
];

const FALLBACK = "Something broke";

export function getFriendlyError(backendError, source = "extract") {
  if (!backendError || typeof backendError !== "string") {
    return FALLBACK;
  }
  const msg = backendError.trim();
  for (const [pattern, friendly] of ERROR_MAP) {
    if (msg.includes(pattern) || msg.startsWith(pattern)) {
      return friendly;
    }
  }
  return FALLBACK;
}
