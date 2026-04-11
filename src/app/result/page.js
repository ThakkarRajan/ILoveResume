"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { 
  showSuccess, 
  showError, 
  showLoading, 
  dismissToast,
  showSaveLoading,
  showSaveSuccess,
  showSaveError,
  showDownloadLoading,
  showDownloadSuccess,
  showDownloadError,
  showHighlightAdded,
  showExperienceAdded,
  showExperienceDeleted,
  showEducationAdded,
  showEducationDeleted,
  showProjectAdded,
  showProjectDeleted,
  showHighlightError
} from "../../utils/toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User,
  Mail,
  MapPin,
  Globe,
  Phone,
  Github,
  Linkedin,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Save,
  Download,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Edit3,
  Trash2,
  ArrowLeft,
  Star
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../utils/firebase.js";
import { unescapeHtml } from "../../utils/safeHtml";
import LegalConsentCheckbox from "../../components/legal/LegalConsentCheckbox";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";

// Utility to escape HTML special characters (display only, not inputs)
const escapeHtml = (unsafe) =>
  (typeof unsafe === "string" ? unsafe : String(unsafe ?? ""))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Highlights Editor Component
const HighlightsEditor = ({ highlights = [], onChange, placeholder = "Enter highlights..." }) => {
  const [inputValue, setInputValue] = useState("");
  
  // Ensure highlights is always an array
  const safeHighlights = Array.isArray(highlights) ? highlights : [];

  const handleAddKeyDown = (e) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    if (!inputValue.trim()) {
      showHighlightError();
      return;
    }
    const newHighlights = [...safeHighlights, inputValue.trim()];
    onChange(newHighlights);
    setInputValue("");
    const isCertificate = placeholder.toLowerCase().includes("certificate");
    showHighlightAdded(isCertificate);
  };

  const handleRemoveHighlight = (index) => {
    const newHighlights = safeHighlights.filter((_, i) => i !== index);
    onChange(newHighlights);
  };

  const handleEditHighlight = (index, newValue) => {
    const newHighlights = [...safeHighlights];
    newHighlights[index] = newValue;
    onChange(newHighlights);
  };

  const rowsForText = (text, { min = 4, max = 24 } = {}) =>
    Math.min(max, Math.max(min, (String(text || "").split("\n").length || 1) + 2));

  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="w-full min-w-0">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddKeyDown}
          rows={rowsForText(inputValue, { min: 3, max: 16 })}
          placeholder={placeholder}
          className="min-h-[4.5rem] w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 sm:text-[0.9375rem]"
        />
        <p className="mt-1.5 text-xs text-zinc-500">
          <span className="font-medium text-zinc-600">Enter</span> adds a bullet.{" "}
          <span className="font-medium text-zinc-600">Shift+Enter</span> for a new line in the same bullet.
        </p>
      </div>

      <div className="w-full min-w-0 space-y-3">
        {safeHighlights.map((highlight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex w-full min-w-0 items-start gap-3 group"
          >
            <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
            <div className="min-w-0 flex-1">
              <textarea
                value={unescapeHtml(highlight)}
                onChange={(e) => handleEditHighlight(index, e.target.value)}
                rows={rowsForText(highlight)}
                className="min-h-[6rem] w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-zinc-900 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 sm:text-[0.9375rem]"
                placeholder="Edit highlight..."
                spellCheck
              />
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRemoveHighlight(index)}
              className="mt-1 shrink-0 rounded-md p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              title="Remove highlight"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {safeHighlights.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No highlights yet. Type above, then press Enter to add one (Shift+Enter for a new line before adding).
        </div>
      )}
    </div>
  );
};

export default function ResultPage() {
  // All hooks at the top
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved"); // "saving", "saved", "error"
  const [showDownloadSkeleton, setShowDownloadSkeleton] = useState(false);
  const [exportLegalConsent, setExportLegalConsent] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/");
      } else {
        setUser(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Ensure list fields (education, experience, projects) are always arrays
  const normalizeList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "object") return Object.values(val);
    return [];
  };

  // Map backend alternate keys (degree, institution, etc.) to our schema
  const normalizeEducationEntry = (edu) => {
    if (!edu || typeof edu !== "object") return { program: "", school: "", location: "", start: "", end: "", highlights: ["", ""] };
    const program = (edu.program || edu.degree || edu.area || edu.studyType || "").trim();
    const school = (edu.school || edu.institution || edu.university || edu.college || "").trim();
    const location = (edu.location || edu.city || "").trim();
    const start = (edu.start || edu.startDate || "").trim();
    const end = (edu.end || edu.endDate || "").trim();
    const highlights = Array.isArray(edu.highlights) ? edu.highlights : (edu.courses ? [].concat(edu.courses) : ["", ""]);
    return { program, school, location, start, end, highlights };
  };

  // Load resumeData from localStorage after user is authenticated
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem("tailoredResume");
    if (!stored) {
      setError("No resume data found. Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 3000);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || Object.keys(parsed).length === 0) {
        setError("Empty resume data. Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 3000);
        return;
      }
      // Normalize list fields (backend may return objects with numeric keys)
      const normalized = { ...parsed };
      normalized.education = normalizeList(parsed.education).map(normalizeEducationEntry);
      normalized.tailored_experience = normalizeList(parsed.tailored_experience);
      normalized.projects = normalizeList(parsed.projects);
      normalized.tailored_certificates = Array.isArray(parsed.tailored_certificates)
        ? parsed.tailored_certificates
        : Array.isArray(parsed.certificates)
          ? parsed.certificates
          : [];
      setResumeData(normalized);
    } catch (err) {
      setError("Resume is corrupted. Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 3000);
    }
  }, [user, router]);

  // Only after all hooks:
  if (!user) {
    return <div>Loading user...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!resumeData) {
    return <div>Loading result...</div>;
  }

  // ✅ Rendering logic AFTER hooks
  if (showDownloadSkeleton) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Download className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-base sm:text-lg">Preparing your Word document...</p>
        </motion.div>
      </div>
    );
  }

  const validateResume = () => {
    const errors = {};
    const errorSections = new Set();

    // Experience validation
    if (Array.isArray(resumeData.tailored_experience)) {
      resumeData.tailored_experience.forEach((exp, index) => {
        if (!exp.company) {
          errors[`experience_company_${index}`] = "Company name is required.";
          errorSections.add("Experience");
        }
        if (!exp.title) {
          errors[`experience_title_${index}`] = "Job title is required.";
          errorSections.add("Experience");
        }
        if (!exp.location) {
          errors[`experience_location_${index}`] = "Location is required.";
          errorSections.add("Experience");
        }
        if (!exp.start) {
          errors[`experience_start_${index}`] = "Start date is required.";
          errorSections.add("Experience");
        }
        if (!exp.end) {
          errors[`experience_end_${index}`] = "End date is required.";
          errorSections.add("Experience");
        }
        if (!exp.highlights || exp.highlights.some((h) => !h.trim())) {
          errors[`experience_highlights_${index}`] = "Complete all highlights.";
          errorSections.add("Experience");
        }
      });
    }

    // Education validation (accept program/degree/area and school/institution)
    if (Array.isArray(resumeData.education)) {
      resumeData.education.forEach((edu, index) => {
        const program = (edu.program || edu.degree || edu.area || edu.studyType || "").trim();
        const school = (edu.school || edu.institution || edu.university || edu.college || "").trim();
        const location = (edu.location || edu.city || "").trim();
        const start = (edu.start || edu.startDate || "").trim();
        const end = (edu.end || edu.endDate || "").trim();
        if (!program) {
          errors[`education_program_${index}`] = "Program or degree is required.";
          errorSections.add("Education");
        }
        if (!school) {
          errors[`education_school_${index}`] = "School or institution is required.";
          errorSections.add("Education");
        }
        if (!location) {
          errors[`education_location_${index}`] = "Location is required.";
          errorSections.add("Education");
        }
        if (!start) {
          errors[`education_start_${index}`] = "Start date is required.";
          errorSections.add("Education");
        }
        if (!end) {
          errors[`education_end_${index}`] = "End date is required.";
          errorSections.add("Education");
        }
      });
    }

    // Project validation
    if (Array.isArray(resumeData.projects)) {
      resumeData.projects.forEach((proj, index) => {
        if (!proj.title) {
          errors[`project_title_${index}`] = "Project title is required.";
          errorSections.add("Projects");
        }
        if (!proj.tech || proj.tech.length === 0) {
          errors[`project_tech_${index}`] = "Project tech stack is required.";
          errorSections.add("Projects");
        }
        if (
          !Array.isArray(proj.highlights) ||
          proj.highlights.some((h) => !h.trim())
        ) {
          errors[`project_highlights_${index}`] =
            "Complete all project highlights.";
          errorSections.add("Projects");
        }
      });
    }

    setFieldErrors(errors);

    if (errorSections.size > 0) {
      const sectionOrder = ["Experience", "Education", "Projects"];
      const firstErrorSection = sectionOrder.find((s) => errorSections.has(s));
      if (firstErrorSection) {
        setActiveSection(firstErrorSection.toLowerCase());
      }
      const sectionIdMap = { Experience: "experience", Education: "education", Projects: "projects" };
      const details = Array.from(errorSections).map((section) => {
        const prefix = sectionIdMap[section] ? `${sectionIdMap[section]}_` : "";
        const fields = Object.keys(errors)
          .filter((k) => k.startsWith(prefix))
          .map((k) => {
            const m = k.replace(prefix, "").match(/^(\w+)_\d+$/);
            return m ? m[1].replace(/^\w/, (c) => c.toUpperCase()) : null;
          })
          .filter(Boolean);
        const unique = [...new Set(fields)];
        return unique.length > 0 ? `${section} (${unique.join(", ")} required)` : section;
      });
      showError(
        `Please fix: ${details.join(" • ")}`,
        {
          style: {
            borderRadius: "10px",
            background: "#fee2e2",
            color: "#b91c1c",
            fontWeight: "bold",
            fontSize: "16px",
          },
          duration: 5000,
          position: "top-center",
        }
      );
      return false;
    }

    return true;
  };

  const handleChange = (section, key, value, index) => {
    setResumeData((prev) => {
      const updated = { ...prev };
      if (section === "contact") {
        updated.contact = updated.contact || {};
        updated.contact[key] = value;
      }
      else if (
        section === "education" ||
        section === "tailored_experience" ||
        section === "projects"
      ) {
        updated[section][index][key] = value;
      } else if (section === "tailored_skills") {
        updated[section][key] = value.split(",").map((s) => s.trim());
      } else if (section === "tailored_certificates") {
        // Handle certificates as array directly from HighlightsEditor
        updated[section] = value;
      } else {
        updated[section] = value;
      }
      
      // Auto-save to localStorage on every change
      try {
        localStorage.setItem("tailoredResume", JSON.stringify(updated));
        
        // Update recent result in dashboard
        const email = user?.email;
        if (email) {
          const existing = localStorage.getItem(`recentResults_${email}`);
          if (existing) {
            const recentResults = JSON.parse(existing);
            if (recentResults.length > 0) {
              recentResults[0].resultData = updated;
              recentResults[0].timestamp = new Date().toISOString();
              localStorage.setItem(`recentResults_${email}`, JSON.stringify(recentResults));
            }
          }
        }
        
        setAutoSaveStatus("saved");
      } catch (updateError) {
        setAutoSaveStatus("error");
        // Don't fail the operation if localStorage update fails
      }
      
      return updated;
    });
  };

  const handleInputChange = (section, index, key, value) => {
    setResumeData((prev) => {
      const updated = { ...prev };
      updated[section][index][key] = value;
      
      // Auto-save to localStorage on every change
      try {
        localStorage.setItem("tailoredResume", JSON.stringify(updated));
        
        // Update recent result in dashboard
        const email = user?.email;
        if (email) {
          const existing = localStorage.getItem(`recentResults_${email}`);
          if (existing) {
            const recentResults = JSON.parse(existing);
            if (recentResults.length > 0) {
              recentResults[0].resultData = updated;
              recentResults[0].timestamp = new Date().toISOString();
              localStorage.setItem(`recentResults_${email}`, JSON.stringify(recentResults));
            }
          }
        }
        
        setAutoSaveStatus("saved");
      } catch (updateError) {
        setAutoSaveStatus("error");
        // Don't fail the operation if localStorage update fails
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    const valid = validateResume();
    if (!valid) return;

    setIsSaving(true);
    
    try {
      // Show loading toast
      const loadingToast = showSaveLoading();

      // Save data to localStorage
      localStorage.setItem("tailoredResume", JSON.stringify(resumeData));
      
      // Update recent results in dashboard
      try {
        const email = user?.email;
        if (email) {
          const existing = localStorage.getItem(`recentResults_${email}`);
          let recentResults = existing ? JSON.parse(existing) : [];
          
          // Find and update the most recent result
          if (recentResults.length > 0) {
            recentResults[0].resultData = resumeData;
            recentResults[0].timestamp = new Date().toISOString();
            localStorage.setItem(`recentResults_${email}`, JSON.stringify(recentResults));
          }
        }
      } catch (updateError) {
        // Don't fail the save operation if recent results update fails
      }
      
      await new Promise(resolve => setTimeout(resolve, 150));
      // Dismiss loading toast
      dismissToast(loadingToast);
      
      // Show success popup
      setShowSavePopup(true);
    } catch (error) {
      showSaveError();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    const valid = validateResume();
    if (!valid) return;
    if (!exportLegalConsent) {
      showError("Please agree to the Terms & Conditions and Privacy Policy before continuing to export.");
      return;
    }

    setIsDownloading(true);
    setShowDownloadSkeleton(true);
    try {
      // Show loading toast
      const loadingToast = showDownloadLoading();

      localStorage.setItem("tailoredResume", JSON.stringify(resumeData));
      await new Promise(resolve => setTimeout(resolve, 150));
      // Dismiss loading toast
      dismissToast(loadingToast);
      // Show success toast
      showDownloadSuccess();
      // Navigate to download page
      router.push("/word-download");
    } catch (error) {
      showDownloadError();
    } finally {
      setIsDownloading(false);
    }
  };

  const getContactIcon = (key) => {
    const icons = {
      email: Mail,
      phone: Phone,
      location: MapPin,
      website: Globe,
      github: Github,
      linkedin: Linkedin
    };
    return icons[key] || Mail;
  };

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "skills", label: "Skills", icon: Star },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: Code },
    { id: "certificates", label: "Certificates", icon: Award }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-50">

      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
            <Edit3 className="h-7 w-7 text-blue-700" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">Resume editor</h1>
          <p className="mt-2 text-sm text-zinc-600 md:text-base">Review and edit your tailored resume before export.</p>
          
          {/* Auto-save Status */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {autoSaveStatus === "saving" && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Saving...</span>
              </div>
            )}
            {autoSaveStatus === "saved" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">All changes saved</span>
              </div>
            )}
            {autoSaveStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Save failed</span>
              </div>
            )}
          </div>
          
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {!error && resumeData && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:top-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Sections</h3>
                <div className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        type="button"
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-zinc-900 font-medium text-white shadow-sm"
                            : "text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
                        <span>{section.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-2 border-t border-zinc-100 pt-6">
                  <motion.button
                    type="button"
                    whileTap={{ scale: isSaving || isDownloading ? 1 : 0.99 }}
                    onClick={handleSave}
                    disabled={isSaving || isDownloading}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition-colors ${
                      isSaving
                        ? "cursor-not-allowed bg-emerald-600/80 text-white"
                        : isDownloading
                          ? "cursor-not-allowed bg-emerald-600/50 text-white"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Resume
                      </>
                    )}
                  </motion.button>

                  <div className="pt-2">
                    <LegalConsentCheckbox
                      id="result-export-consent"
                      checked={exportLegalConsent}
                      onChange={setExportLegalConsent}
                      disabled={isDownloading || isSaving}
                    />
                  </div>
                  
                  <motion.button
                    type="button"
                    whileTap={{ scale: isDownloading || isSaving ? 1 : 0.99 }}
                    onClick={handleDownload}
                    disabled={isDownloading || isSaving || !exportLegalConsent}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50 ${
                      isDownloading ? "border-blue-200 bg-blue-50/50" : ""
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="min-w-0 lg:col-span-3"
            >
              <div className="responsive-card min-w-0 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <AnimatePresence mode="wait">
                  {/* Personal Info Section */}
                  {activeSection === "personal" && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                          <User className="h-6 w-6 text-blue-700" strokeWidth={1.75} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                          <p className="text-gray-500">Update your contact details</p>
                        </div>
                      </div>

                      <div
                        className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                        role="status"
                      >
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                        <p className="leading-relaxed text-emerald-900">
                          Review your contact details and profile links before continuing. Make sure your name, email, phone number, GitHub, and LinkedIn are accurate. Use your full profile URLs or correct usernames, since your Word and PDF exports will use this information exactly as entered.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
              </label>
              <input
                value={unescapeHtml(resumeData.name || "")}
                onChange={(e) => handleChange("name", null, e.target.value)}
                                                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all duration-200 text-gray-900 placeholder-gray-500"
                             placeholder="Enter your full name"
                          />
                        </div>

                        {Object.entries(resumeData.contact || {}).map(([key, val]) => {
                          const Icon = getContactIcon(key);
                          const placeholder =
                            key === "github"
                              ? "GitHub username or profile URL"
                              : key === "linkedin"
                                ? "LinkedIn username or profile URL"
                                : `Enter your ${key}`;
                          return (
                  <div key={key}>
                              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key}
                    </label>
                              <div className="relative">
                                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      value={unescapeHtml(val)}
                                  onChange={(e) => handleChange("contact", key, e.target.value)}
                                                                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all duration-200 text-gray-900 placeholder-gray-500"
                                   placeholder={placeholder}
                    />
                  </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Summary Section */}
                  {activeSection === "summary" && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">Professional Summary</h2>
                          <p className="text-gray-500">Write a compelling summary of your experience</p>
                        </div>
              </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Summary
                        </label>
              <textarea
                value={unescapeHtml(resumeData.tailored_summary || "")}
                          onChange={(e) => handleChange("tailored_summary", null, e.target.value)}
                                                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all duration-200 resize-none text-gray-900 placeholder-gray-500"
                           rows={6}
                           placeholder="Write a compelling professional summary..."
              />
                      </div>
                    </motion.div>
                  )}

                  {/* Skills Section */}
                  {activeSection === "skills" && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">Skills & Expertise</h2>
                          <p className="text-gray-500">Organize your skills by category</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {Object.entries(resumeData.tailored_skills || {}).map(([category, skills]) => (
                          <div key={category} className="bg-gray-50 rounded-xl p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                              {category}
                            </label>
                    <input
                      value={unescapeHtml(skills.join(", "))}
                              onChange={(e) => handleChange("tailored_skills", category, e.target.value)}
                                                             className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all duration-200 text-gray-900 placeholder-gray-500"
                               placeholder={`Enter ${category} skills separated by commas`}
                    />
                  </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Experience Section */}
                  {activeSection === "experience" && (
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Work Experience</h2>
                            <p className="text-gray-500">Manage your professional experience</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setResumeData((prev) => ({
                          ...prev,
                          tailored_experience: [
                                ...(Array.isArray(prev.tailored_experience) ? prev.tailored_experience : []),
                            {
                              company: "",
                              title: "",
                              location: "",
                              start: "",
                              end: "",
                              highlights: ["", "", "", ""],
                            },
                          ],
                        }));
                        showExperienceAdded();
                      }}
                          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
                    >
                          <Plus className="w-4 h-4" />
                        Add Experience
                        </motion.button>
                  </div>

                      <div className="space-y-6">
                        {Array.isArray(resumeData.tailored_experience) &&
                          resumeData.tailored_experience.map((exp, idx) => (
                            <motion.div
                      key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative bg-gray-50 rounded-2xl p-6 border border-gray-200"
                    >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setResumeData((prev) => {
                            const updated = [...prev.tailored_experience];
                            updated.splice(idx, 1);
                            return { ...prev, tailored_experience: updated };
                          });
                          showExperienceDeleted();
                        }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-all duration-200"
                                title="Remove experience"
                      >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {Object.entries(exp).map(([key, val]) => (
                        <div key={key} className={key === "highlights" ? "md:col-span-2" : ""}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {key}
                          </label>
                          {key === "highlights" ? (
                            <HighlightsEditor
                              highlights={val}
                              onChange={(newHighlights) =>
                                handleChange(
                                  "tailored_experience",
                                  key,
                                  newHighlights,
                                  idx
                                )
                              }
                              placeholder="Enter job highlights (one per line)"
                            />
                          ) : (
                            <input
                              value={unescapeHtml(val)}
                              onChange={(e) =>
                                          handleChange("tailored_experience", key, e.target.value, idx)
                              }
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder={`Enter ${key}`}
                            />
                          )}
                          {fieldErrors[`experience_${key}_${idx}`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {fieldErrors[`experience_${key}_${idx}`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                            </motion.div>
                  ))}
                      </div>
                    </motion.div>
              )}

                  {/* Education Section */}
                  {activeSection === "education" && (
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Education</h2>
                            <p className="text-gray-500">Add your educational background</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setResumeData((prev) => ({
                      ...prev,
                      education: [
                                ...(Array.isArray(prev.education) ? prev.education : []),
                        {
                          program: "",
                          school: "",
                          location: "",
                          start: "",
                          end: "",
                                  highlights: ["", ""],
                        },
                      ],
                    }));
                    showEducationAdded();
                  }}
                          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
                >
                          <Plus className="w-4 h-4" />
                          Add Education
                        </motion.button>
              </div>

                      <div className="space-y-6">
              {Array.isArray(resumeData.education) &&
                resumeData.education.map((edu, idx) => (
                            <motion.div
                    key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative bg-gray-50 rounded-2xl p-6 border border-gray-200"
                  >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setResumeData((prev) => {
                          const updated = [...prev.education];
                          updated.splice(idx, 1);
                          return { ...prev, education: updated };
                        });
                        showEducationDeleted();
                      }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-all duration-200"
                                title="Remove education"
                    >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(edu).map(([key, val]) => (
                                  <div key={key} className={key === "highlights" ? "md:col-span-2" : ""}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key}
                        </label>
                                    {key === "highlights" ? (
                                      <HighlightsEditor
                                        highlights={val}
                                        onChange={(newHighlights) =>
                                          handleInputChange(
                                            "education",
                                            idx,
                                            key,
                                            newHighlights
                                          )
                                        }
                                        placeholder="Enter education highlights/achievements (one per line)"
                                      />
                                    ) : (
                                      <input
                                        value={unescapeHtml(val)}
                                        onChange={(e) =>
                                          handleInputChange("education", idx, key, e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder={`Enter ${key}`}
                        />
                                    )}
                        {fieldErrors[`education_${key}_${idx}`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {fieldErrors[`education_${key}_${idx}`]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
              )}

                  {/* Projects Section */}
                  {activeSection === "projects" && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <Code className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
                            <p className="text-gray-500">Showcase your projects and achievements</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setResumeData((prev) => ({
                          ...prev,
                          projects: [
                                ...(Array.isArray(prev.projects) ? prev.projects : []),
                            {
                              title: "",
                              tech: [],
                              highlights: ["", ""],
                            },
                          ],
                        }));
                        showProjectAdded();
                      }}
                          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
                    >
                          <Plus className="w-4 h-4" />
                          Add Project
                        </motion.button>
                  </div>

                      <div className="space-y-6">
                        {Array.isArray(resumeData.projects) &&
                          resumeData.projects.map((proj, idx) => (
                            <motion.div
                      key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative bg-gray-50 rounded-2xl p-6 border border-gray-200"
                    >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setResumeData((prev) => {
                            const updated = [...prev.projects];
                            updated.splice(idx, 1);
                            return { ...prev, projects: updated };
                          });
                          showProjectDeleted();
                        }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-all duration-200"
                                title="Remove project"
                      >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>

                              <div className="space-y-4">
                      {Object.entries(proj).map(([key, val]) => (
                        <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {key}
                          </label>
                          {key === "highlights" ? (
                                      <HighlightsEditor
                                        highlights={val}
                                        onChange={(newHighlights) =>
                                          handleChange(
                                            "projects",
                                            key,
                                            newHighlights,
                                            idx
                                          )
                                        }
                                        placeholder="Enter project highlights (one per line)"
                                      />
                                    ) : (
                            <input
                              value={unescapeHtml(val)}
                              onChange={(e) =>
                                          handleChange("projects", key, e.target.value, idx)
                              }
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 transition-all duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder={`Enter ${key}`}
                            />
                          )}
                                    {fieldErrors[`project_${key}_${idx}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                        {fieldErrors[`project_${key}_${idx}`]}
                              </p>
                            )}
                        </div>
                      ))}
                    </div>
                            </motion.div>
                  ))}
                      </div>
                    </motion.div>
              )}

                  {/* Certificates Section */}
                  {activeSection === "certificates" && (
                    <motion.div
                      key="certificates"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">Certificates</h2>
                          <p className="text-gray-500">List your professional certifications</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificates
                        </label>
                        <HighlightsEditor
                          highlights={resumeData.tailored_certificates || []}
                          onChange={(newCertificates) =>
                            handleChange("tailored_certificates", null, newCertificates)
                          }
                          placeholder="Enter your certificates"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
            </motion.div>
          </div>
        )}

        <div className="mt-12 border-t border-zinc-200 pt-10 pb-6">
          <SiteLegalLinks />
        </div>
      </div>

      {/* Save Success Popup */}
      <AnimatePresence>
      {showSavePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle className="h-7 w-7 text-emerald-600" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900">Changes saved</h2>
              <p className="mt-2 text-sm text-zinc-600">Your resume is updated in this session.</p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowSavePopup(false)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
              >
                Continue editing
              </motion.button>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
