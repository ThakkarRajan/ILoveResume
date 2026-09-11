"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Star
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../utils/firebase.js";
import { unescapeHtml } from "../../utils/safeHtml";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";
import ExportAccessGate, { canExportResume } from "../../components/legal/ExportAccessGate";
import ExperienceSectionEditor from "../../components/editor/ExperienceSectionEditor";
import SkillsSectionEditor from "../../components/editor/SkillsSectionEditor";
import EducationSectionEditor from "../../components/editor/EducationSectionEditor";
import ProjectsSectionEditor from "../../components/editor/ProjectsSectionEditor";
import CertificatesSectionEditor from "../../components/editor/CertificatesSectionEditor";

// Utility to escape HTML special characters (display only, not inputs)
const escapeHtml = (unsafe) =>
  (typeof unsafe === "string" ? unsafe : String(unsafe ?? ""))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function ResultLoadingScreen({ title, subtitle, icon: Icon = FileText }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-page py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="card-elevated w-full max-w-md p-8 text-center sm:p-10"
      >
        <Image
          src="/logo.png"
          alt=""
          width={1017}
          height={850}
          className="mx-auto h-[52px] w-auto max-w-[3.25rem] rounded-xl border border-zinc-200 bg-white object-contain"
          priority
        />
        <div className="relative mx-auto mt-8 h-[4.5rem] w-[4.5rem]">
          <div
            className="absolute inset-0 rounded-full border-[3px] border-[var(--border)] border-t-[var(--accent)] animate-spin"
            style={{ animationDuration: "0.9s" }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-7 w-7 text-[var(--accent)]" strokeWidth={1.65} aria-hidden />
          </div>
        </div>
        <h2 className="mt-8 text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{subtitle}</p>
        <div className="mx-auto mt-8 flex max-w-[240px] flex-col items-center gap-2">
          <div className="h-1.5 w-full animate-pulse rounded-full bg-zinc-100" />
          <div className="h-1.5 w-[88%] animate-pulse rounded-full bg-zinc-100" />
          <div className="h-1.5 w-[64%] animate-pulse rounded-full bg-zinc-100" />
        </div>
      </motion.div>
    </div>
  );
}

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
  const [showExportGate, setShowExportGate] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const normalizeList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "object") return Object.values(val);
    return [];
  };

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

  // Load resumeData from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tailoredResume");
    if (!stored) {
      setError("We couldn't find a resume draft. Returning you to the dashboard…");
      setTimeout(() => router.push("/dashboard"), 3000);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || Object.keys(parsed).length === 0) {
        setError("Your draft looks empty. Returning you to the dashboard…");
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
      setError("We couldn't read this draft. Returning you to the dashboard…");
      setTimeout(() => router.push("/dashboard"), 3000);
    }
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-page py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="w-full max-w-md rounded-2xl border border-red-200/90 bg-white p-8 text-center shadow-lg shadow-zinc-300/30 sm:p-10"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
            <AlertCircle className="h-7 w-7 text-red-600" strokeWidth={1.75} aria-hidden />
          </div>
          <p className="mt-6 text-sm font-medium leading-relaxed text-red-900">{error}</p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push("/dashboard")}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Back to dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }
  if (!resumeData) {
    return (
      <ResultLoadingScreen
        title="Loading your draft"
        subtitle="Retrieving your resume from this browser session."
        icon={FileText}
      />
    );
  }

  // ✅ Rendering logic AFTER hooks
  if (showDownloadSkeleton) {
    return (
      <ResultLoadingScreen
        title="Preparing your download"
        subtitle="Next: choose Word (editable) or PDF (share-ready)."
        icon={Download}
      />
    );
  }

  const validateResume = () => {
    const errors = {};
    const errorSections = new Set();

    // Experience validation
    if (Array.isArray(resumeData.tailored_experience)) {
      resumeData.tailored_experience.forEach((exp, index) => {
        if (!exp.company) {
          errors[`experience_company_${index}`] = "Add a company name.";
          errorSections.add("Experience");
        }
        if (!exp.title) {
          errors[`experience_title_${index}`] = "Add a job title.";
          errorSections.add("Experience");
        }
        if (!exp.location) {
          errors[`experience_location_${index}`] = "Add a location.";
          errorSections.add("Experience");
        }
        if (!exp.start) {
          errors[`experience_start_${index}`] = "Add a start date.";
          errorSections.add("Experience");
        }
        if (!exp.end) {
          errors[`experience_end_${index}`] = "Add an end date.";
          errorSections.add("Experience");
        }
        if (!exp.highlights || exp.highlights.some((h) => !h.trim())) {
          errors[`experience_highlights_${index}`] = "Fill in every bullet for this role.";
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
          errors[`education_program_${index}`] = "Add a program or degree.";
          errorSections.add("Education");
        }
        if (!school) {
          errors[`education_school_${index}`] = "Add a school or institution.";
          errorSections.add("Education");
        }
        if (!location) {
          errors[`education_location_${index}`] = "Add a location.";
          errorSections.add("Education");
        }
        if (!start) {
          errors[`education_start_${index}`] = "Add a start date.";
          errorSections.add("Education");
        }
        if (!end) {
          errors[`education_end_${index}`] = "Add an end date.";
          errorSections.add("Education");
        }
      });
    }

    // Project validation
    if (Array.isArray(resumeData.projects)) {
      resumeData.projects.forEach((proj, index) => {
        if (!proj.title) {
          errors[`project_title_${index}`] = "Add a project title.";
          errorSections.add("Projects");
        }
        if (!proj.tech || proj.tech.length === 0) {
          errors[`project_tech_${index}`] = "Add at least one technology.";
          errorSections.add("Projects");
        }
        if (
          !Array.isArray(proj.highlights) ||
          proj.highlights.some((h) => !h.trim())
        ) {
          errors[`project_highlights_${index}`] = "Fill in every project bullet.";
          errorSections.add("Projects");
        }
      });
    }

    setFieldErrors(errors);

    if (errorSections.size > 0) {
      const sectionOrder = ["Experience", "Education", "Projects"];
      const firstErrorSection = sectionOrder.find((s) => errorSections.has(s));
      const sectionIdMap = { Experience: "experience", Education: "education", Projects: "projects" };
      if (firstErrorSection) {
        setActiveSection(sectionIdMap[firstErrorSection]);
      }
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
      showError(`Missing: ${details.join(", ")}`, { duration: 5000 });
      return false;
    }

    return true;
  };

  const persistTailoredResume = (updated) => {
    try {
      localStorage.setItem("tailoredResume", JSON.stringify(updated));
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
    } catch {
      setAutoSaveStatus("error");
    }
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
        updated[section] = { ...(updated[section] || {}) };
        updated[section][key] = value.split(",").map((s) => s.trim());
      } else if (section === "tailored_certificates") {
        // Handle certificates as array directly from HighlightsEditor
        updated[section] = value;
      } else {
        updated[section] = value;
      }

      persistTailoredResume(updated);
      return updated;
    });
  };

  const handleInputChange = (section, index, key, value) => {
    setResumeData((prev) => {
      const updated = { ...prev };
      updated[section][index][key] = value;

      persistTailoredResume(updated);
      return updated;
    });
  };

  const addSkillCategory = () => {
    setResumeData((prev) => {
      const skills = { ...(prev.tailored_skills || {}) };
      const base = "New category";
      let name = base;
      let i = 2;
      while (skills[name]) {
        name = `${base} ${i}`;
        i += 1;
      }
      skills[name] = [];
      const updated = { ...prev, tailored_skills: skills };
      persistTailoredResume(updated);
      return updated;
    });
  };

  const removeSkillCategory = (categoryKey) => {
    setResumeData((prev) => {
      const skills = { ...(prev.tailored_skills || {}) };
      delete skills[categoryKey];
      const updated = { ...prev, tailored_skills: skills };
      persistTailoredResume(updated);
      return updated;
    });
  };

  const renameSkillCategory = (oldKey, newKeyRaw) => {
    const newKey = newKeyRaw.trim();
    if (!newKey || newKey === oldKey) return;
    setResumeData((prev) => {
      const skills = { ...(prev.tailored_skills || {}) };
      if (!skills[oldKey]) return prev;
      if (skills[newKey]) return prev;
      const arr = skills[oldKey];
      delete skills[oldKey];
      skills[newKey] = Array.isArray(arr) ? arr : [];
      const updated = { ...prev, tailored_skills: skills };
      persistTailoredResume(updated);
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

    if (!canExportResume(user)) {
      setShowExportGate(true);
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
    { id: "personal", label: "Profile", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "skills", label: "Skills", icon: Star },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: Code },
    { id: "certificates", label: "Certificates", icon: Award },
  ];

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--background)]">
      <div className="relative z-10 mx-auto min-w-0 max-w-7xl px-page py-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-4 lg:py-5">
        <div className="editor-workspace">
          <div className="editor-sticky-stack">
            <div className="panel min-w-0 max-w-full">
              <div className="editor-toolbar-body">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="btn btn-ghost px-2"
                    aria-label="Back to dashboard"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold text-zinc-900 sm:text-base">Resume editor</h1>
                    <p className="text-xs text-zinc-500">Edit your tailored draft before export</p>
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  {autoSaveStatus === "saving" && <span className="badge badge-info">Saving…</span>}
                  {autoSaveStatus === "saved" && <span className="badge badge-success">Saved</span>}
                  {autoSaveStatus === "error" && <span className="badge badge-error">Save failed</span>}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || isDownloading}
                    className="btn btn-secondary flex-1 px-3 sm:flex-none"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading || isSaving}
                    className="btn btn-primary flex-1 px-3 sm:flex-none"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? "Preparing…" : "Export"}
                  </button>
                </div>
              </div>
            </div>

            <div className="panel min-w-0 max-w-full">
              <div className="editor-tabs-body">
                <div className="section-tabs editor-section-tabs" role="tablist" aria-label="Resume sections">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      role="tab"
                      aria-selected={activeSection === section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`section-tab ${activeSection === section.id ? "section-tab-active" : ""}`}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      {section.label}
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="min-w-0 pt-10"
          >
            <div className="panel min-w-0 max-w-full">
              <div className="editor-panel-body ">
                <AnimatePresence mode="wait">
                  {activeSection === "personal" && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="editor-section-content"
                    >
                      <div className="editor-section-header">
                        <h2 className="editor-section-title">Profile & contact</h2>
                        <p className="editor-section-desc">Name, email, and links used in your exports</p>
                      </div>

                      <div className="editor-callout" role="status">
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                        <p>
                          Double-check your name, email, phone, GitHub, and LinkedIn—Word and PDF exports use this
                          information exactly as you enter it. Prefer full profile URLs where possible.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="form-label">
                            Full Name
              </label>
              <input
                value={unescapeHtml(resumeData.name || "")}
                onChange={(e) => handleChange("name", null, e.target.value)}
                                                         className="input-field"
                             placeholder="Full name as it should appear on your resume"
                          />
                        </div>

                        {Object.entries(resumeData.contact || {}).map(([key, val]) => {
                          const Icon = getContactIcon(key);
                          const placeholder =
                            key === "github"
                              ? "GitHub username or profile URL"
                              : key === "linkedin"
                                ? "LinkedIn username or profile URL"
                                : `Add your ${key}`;
                          return (
                  <div key={key}>
                              <label className="form-label capitalize">
                      {key}
                    </label>
                              <div className="relative">
                                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      value={unescapeHtml(val)}
                                  onChange={(e) => handleChange("contact", key, e.target.value)}
                                                                     className="input-field input-field-icon"
                                   placeholder={placeholder}
                    />
                  </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "summary" && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="editor-section-content"
                    >
                      <div className="editor-section-header">
                        <h2 className="editor-section-title">Professional summary</h2>
                        <p className="editor-section-desc">Role, years of experience, top skills, and the impact you want next</p>
                      </div>

                      <div>
                        <label className="form-label">
                          Summary
                        </label>
              <textarea
                value={unescapeHtml(resumeData.tailored_summary || "")}
                          onChange={(e) => handleChange("tailored_summary", null, e.target.value)}
                                                     className="input-field resize-y"
                           rows={2}
                           placeholder="Tight summary: who you are, what you ship best, and what you're targeting next…"
              />
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "skills" && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <SkillsSectionEditor
                        skills={resumeData.tailored_skills || {}}
                        onAddCategory={addSkillCategory}
                        onRemoveCategory={removeSkillCategory}
                        onRenameCategory={renameSkillCategory}
                        onChangeSkills={(category, value) => handleChange("tailored_skills", category, value)}
                      />
                    </motion.div>
                  )}

                  {activeSection === "experience" && (
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <ExperienceSectionEditor
                        experiences={resumeData.tailored_experience || []}
                        fieldErrors={fieldErrors}
                        onAdd={() => {
                          setResumeData((prev) => {
                            const updated = {
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
                            };
                            persistTailoredResume(updated);
                            return updated;
                          });
                          showExperienceAdded();
                        }}
                        onRemove={(idx) => {
                          setResumeData((prev) => {
                            const updated = [...prev.tailored_experience];
                            updated.splice(idx, 1);
                            const next = { ...prev, tailored_experience: updated };
                            persistTailoredResume(next);
                            return next;
                          });
                          showExperienceDeleted();
                        }}
                        onChange={(idx, key, value) => handleChange("tailored_experience", key, value, idx)}
                      />
                    </motion.div>
                  )}

                  {activeSection === "education" && (
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <EducationSectionEditor
                        education={resumeData.education || []}
                        fieldErrors={fieldErrors}
                        onAdd={() => {
                          setResumeData((prev) => {
                            const updated = {
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
                            };
                            persistTailoredResume(updated);
                            return updated;
                          });
                          showEducationAdded();
                        }}
                        onRemove={(idx) => {
                          setResumeData((prev) => {
                            const updated = [...prev.education];
                            updated.splice(idx, 1);
                            const next = { ...prev, education: updated };
                            persistTailoredResume(next);
                            return next;
                          });
                          showEducationDeleted();
                        }}
                        onChange={(idx, key, value) => handleInputChange("education", idx, key, value)}
                      />
                    </motion.div>
                  )}

                  {activeSection === "projects" && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <ProjectsSectionEditor
                        projects={resumeData.projects || []}
                        fieldErrors={fieldErrors}
                        onAdd={() => {
                          setResumeData((prev) => {
                            const updated = {
                              ...prev,
                              projects: [
                                ...(Array.isArray(prev.projects) ? prev.projects : []),
                                { title: "", tech: [], highlights: ["", ""] },
                              ],
                            };
                            persistTailoredResume(updated);
                            return updated;
                          });
                          showProjectAdded();
                        }}
                        onRemove={(idx) => {
                          setResumeData((prev) => {
                            const updated = [...prev.projects];
                            updated.splice(idx, 1);
                            const next = { ...prev, projects: updated };
                            persistTailoredResume(next);
                            return next;
                          });
                          showProjectDeleted();
                        }}
                        onChange={(idx, key, value) => {
                          const nextValue =
                            key === "tech" && typeof value === "string"
                              ? value.split(",").map((s) => s.trim()).filter(Boolean)
                              : value;
                          handleChange("projects", key, nextValue, idx);
                        }}
                      />
                    </motion.div>
                  )}

                  {activeSection === "certificates" && (
                    <motion.div
                      key="certificates"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <CertificatesSectionEditor
                        certificates={resumeData.tailored_certificates || []}
                        onChange={(value) => handleChange("tailored_certificates", null, value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 border-t border-zinc-200 pt-5 pb-4">
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
              className="modal-panel mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-xl sm:p-8"
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

      <AnimatePresence>
        {showExportGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-[2px]"
            onClick={() => setShowExportGate(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="modal-panel w-full max-w-lg rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ExportAccessGate
                idPrefix="result-export"
                user={user}
                onUserChange={setUser}
                title="Before you export"
                description="Accept our terms and sign in to download Word or PDF."
                onReady={() => {
                  setShowExportGate(false);
                  localStorage.setItem("tailoredResume", JSON.stringify(resumeData));
                  router.push("/word-download");
                }}
              />
              <button
                type="button"
                onClick={() => setShowExportGate(false)}
                className="btn btn-ghost mt-3 w-full"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
