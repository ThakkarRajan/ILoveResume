"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { storage, db } from "../../utils/firebase.js";
import { Toaster } from "react-hot-toast";
import { 
  showSuccess, 
  showError, 
  showLoading, 
  dismissToast,
  showValidationError,
  showNetworkError,
  showNetworkRetry,
  showAIProcessingError,
  showFormCleared,
  showFileUploadSuccess,
  showFileUploadError,
  showFileDeleteSuccess,
  showFileDeleteError
} from "../../utils/toast";
import { getFriendlyError } from "../../utils/errorMessages.js";
import { motion, AnimatePresence } from "framer-motion";
import { query, where, getDocs, deleteDoc } from "firebase/firestore";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Sparkles, 
  User, 
  Briefcase,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Clock,
  FileCheck,
  Zap,
  ArrowRight,
  Download,
  Type,
  FileUp,
  Edit3,
  Home,
  Loader2,
} from "lucide-react";
import { getAuth, signInWithCredential, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { wakeBackend, API_BASE, processText } from "../../utils/api.js";
import { getEmptyResumeDraft } from "../../utils/emptyResumeDraft.js";
import { unescapeHtml } from "../../utils/safeHtml";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";

const JOB_DESCRIPTION_MAX_CHARS = 15_000;
const RESUME_TEXT_MAX_CHARS = 50_000;

export default function Dashboard() {
  const router = useRouter();
  const [jobText, setJobText] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [textResume, setTextResume] = useState("");
  const [uploadMode, setUploadMode] = useState("pdf"); // "pdf" or "text"
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeletingResume, setIsDeletingResume] = useState(false);
  const [showResultSkeleton, setShowResultSkeleton] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [showRecentResults, setShowRecentResults] = useState(false);
  const [recentResults, setRecentResults] = useState([]);
  const fileInputRef = useRef(null);
  const [loadingPhase, setLoadingPhase] = useState('idle'); // 'idle' | 'upload' | 'extract' | 'ai'
  const [uploadAttempts, setUploadAttempts] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/");
      } else {
        setUser(firebaseUser);
        wakeBackend(); // Ensure backend is awake before user submits resume
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => { 
    if (user) {
      fetchUploadedResumes();
      loadRecentResults();
    }
  }, [user]);

  // Cleanup effect to reset states when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup function to reset states
      setJobText("");
      setPdfFile(null);
      setTextResume("");
      setSelectedResume(null);
      setUploadMode("pdf");
      setDragActive(false);
      setShowFilePreview(false);
      setLoading(false);
      setProgress(0);
      setShowResultSkeleton(false);
      setAiData(null);
      setShowRecentResults(false);
    };
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchUploadedResumes = async () => {
    if (!user?.email) return;

    try {
      const folderRef = ref(
        storage,
        `resumes/${user.email.toLowerCase()}/`
      );
      const result = await listAll(folderRef);

      if (!result?.items?.length) {
        setUploadedResumes([]);
        return;
      }

      const files = await Promise.all(
        result.items.map(async (item) => {
          try {
            const url = await getDownloadURL(item);
            return {
              name: item.name,
              fullName: item.name,
              path: item.fullPath,
              url,
            };
          } catch (err) {
            return null;
          }
        })
      );

      setUploadedResumes(files.filter(Boolean));
    } catch (error) {
      showError("We couldn't load your uploaded files. Refresh and try again.");
      setUploadedResumes([]);
    }
  };

  const handleDelete = async (file) => {
    try {
      await deleteObject(ref(storage, file.path));

      const email = user.email.toLowerCase();
      const entriesRef = collection(db, `submissions/${email}/entries`);
      const q = query(entriesRef, where("fileName", "==", file.name));
      const snapshot = await getDocs(q);

      const batchDeletes = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(batchDeletes);

      showFileDeleteSuccess();
      setSelectedResume(null);
      fetchUploadedResumes();
    } catch (error) {
      showFileDeleteError();
    }
  };

  const confirmDelete = (file) => {
    if (isDeletingResume || showDeleteConfirm) return;
    setFileToDelete(file);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!fileToDelete || isDeletingResume) return;
    setIsDeletingResume(true);
    try {
      await handleDelete(fileToDelete);
    } finally {
      setIsDeletingResume(false);
      setShowDeleteConfirm(false);
      setFileToDelete(null);
    }
  };

  const cancelDelete = () => {
    if (isDeletingResume) return;
    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  const simulateProgress = () => {
    const duration = 3000;
    const intervalTime = 450;
    let p = 0;

    const interval = setInterval(() => {
      p += 1;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
      }
      setProgress(p);
    }, intervalTime);
  };

  // Refactored: Upload resume (PDF or text)
  const uploadResume = async () => {
    let fileURL = "";
    let fileName = "";
    let resumeText = "";
    if (uploadMode === "pdf") {
      if (pdfFile) {
        setLoadingPhase("upload");
        setUploadAttempts(1);
        const userEmail = user.email.toLowerCase();
        fileName = pdfFile.name;
        const storageRef = ref(storage, `resumes/${userEmail}/${fileName}`);
        const uploadToast = showLoading("Uploading your PDF…");
        let uploadSuccess = false;
        let uploadAttemptsLocal = 0;
        while (!uploadSuccess && uploadAttemptsLocal < 3) {
          try {
            await uploadBytes(storageRef, pdfFile);
            fileURL = await getDownloadURL(storageRef);
            if (!fileURL) throw new Error("File upload failed. Please try again.");
            dismissToast(uploadToast);
            showFileUploadSuccess();
            await new Promise(resolve => setTimeout(resolve, 150));
            uploadSuccess = true;
          } catch (uploadError) {
            uploadAttemptsLocal++;
            setUploadAttempts(uploadAttemptsLocal + 1);
            if (uploadAttemptsLocal >= 3) {
              dismissToast(uploadToast);
              showFileUploadError();
              setLoading(false);
              setProgress(0);
              setLoadingPhase('idle');
              setUploadAttempts(0);
              return { success: false };
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * (uploadAttemptsLocal + 1)));
          }
        }
        setUploadAttempts(0);
        if (!uploadSuccess || !fileURL) {
          showFileUploadError("No valid file URL. Please try again.");
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          return { success: false };
        }
      } else if (selectedResume) {
        setLoadingPhase("extract");
        try {
          const fileRef = ref(storage, selectedResume.path);
          const url = await getDownloadURL(fileRef);
          fileURL = url;
          fileName = selectedResume.name;
          if (!fileURL) throw new Error("Selected file not accessible. Please try again.");
        } catch (urlError) {
          showFileUploadError("Selected file not accessible. Please try again.");
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          return { success: false };
        }
      }
      if (!fileURL) {
        showFileUploadError("No valid file URL. Please try again.");
        setLoading(false);
        setProgress(0);
        setLoadingPhase('idle');
        return { success: false };
      }
      const firestoreEmail = user?.email?.toLowerCase();
      try {
        await addDoc(collection(db, `submissions/${firestoreEmail}/entries`), {
          jobText,
          resumeUrl: fileURL,
          uploadedAt: Timestamp.now(),
          fileName: fileName,
        });
      } catch (firestoreError) {}
      return { success: true, fileURL, fileName };
    } else {
      // Text resume
      fileName = `text-resume-${Date.now()}.txt`;
      const email = user?.email?.toLowerCase();
      try {
        await addDoc(collection(db, `submissions/${email}/entries`), {
          jobText,
          resumeText: textResume,
          uploadedAt: Timestamp.now(),
          fileName: fileName,
        });
      } catch (firestoreError) {}
      return { success: true, fileName };
    }
  };

  // Refactored: Extract resume text
  const extractResumeText = async ({ fileURL, fileName }) => {
    let resumeText = "";
    if (uploadMode === "pdf") {
      if (pdfFile) {
        setLoadingPhase("extract");
        const extractToast = showLoading("Reading your PDF…");
        try {
          if (!navigator.onLine) throw new Error("No internet connection. Please check your network.");
          if (pdfFile.size > 10 * 1024 * 1024) throw new Error("File size too large. Please upload a PDF under 10MB.");
          const formData = new FormData();
          formData.append("file", pdfFile);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000);
          const extractRes = await fetch(`${API_BASE}/extract`, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (!extractRes.ok) {
            const errData = await extractRes.json().catch(() => ({}));
            showFileUploadError(getFriendlyError(errData?.error, "extract"));
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          const json = await extractRes.json();
          if (!json.text || json.text.trim() === '') {
            showFileUploadError("PDF could not be read. Try a different file or ensure it has selectable text.");
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          if (json.text.trim().length < 100) {
            showFileUploadError("The PDF seems too short. Please upload a full resume.");
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          resumeText = json.text;
          const resumeKeywords = ["resume", "experience", "skills", "education", "projects", "summary", "work", "employment"];
          const textLower = json.text.toLowerCase();
          const keywordMatches = resumeKeywords.filter(keyword => textLower.includes(keyword));
          if (keywordMatches.length < 2) {
            showFileUploadError("This doesn't look like a resume. Please upload a resume PDF.");
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          dismissToast(extractToast);
        } catch (extractError) {
          dismissToast(extractToast);
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          if (extractError.name === 'AbortError') {
            showError("Request timed out. Please try again.");
          } else if (extractError.message.includes('network') || extractError.message.includes('fetch') || extractError.name === 'TypeError') {
            showNetworkRetry();
          } else {
            showError("Something went wrong. Please try again.");
          }
          return { success: false };
        }
      } else if (selectedResume) {
        setLoadingPhase("extract");
        const extractToast = showLoading("Reading your selected PDF…");
        try {
          if (!navigator.onLine) throw new Error("No internet connection. Please check your network.");
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000);
          const extractRes = await fetch(`${API_BASE}/extract-from-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: fileURL }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (!extractRes.ok) {
            const errData = await extractRes.json().catch(() => ({}));
            showError(getFriendlyError(errData?.error, "extract"));
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          const json = await extractRes.json();
          if (!json.text || json.text.trim() === '') {
            showError("PDF could not be read. Try a different file or ensure it has selectable text.");
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          if (json.text.trim().length < 100) {
            showError("The PDF seems too short. Please upload a full resume.");
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          resumeText = json.text;
          const resumeKeywords = ["resume", "experience", "skills", "education", "projects", "summary", "work", "employment"];
          const textLower = json.text.toLowerCase();
          const keywordMatches = resumeKeywords.filter(keyword => textLower.includes(keyword));
          if (keywordMatches.length < 2) {
            showError("This doesn't look like a resume. Please upload a resume PDF.");
            dismissToast(extractToast);
            setLoading(false);
            setProgress(0);
            setLoadingPhase('idle');
            return { success: false };
          }
          dismissToast(extractToast);
        } catch (extractError) {
          dismissToast(extractToast);
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          if (extractError.name === 'AbortError') {
            showError("Request timed out. Please try again.");
          } else if (extractError.message.includes('network') || extractError.message.includes('fetch') || extractError.name === 'TypeError') {
            showNetworkRetry();
          } else {
            showError("Something went wrong. Please try again.");
          }
          return { success: false };
        }
      }
      return { success: true, resumeText, fileName };
    } else {
      // Text resume
      return { success: true, resumeText: textResume, fileName };
    }
  };

  // Refactored: Run AI
  const runAI = async (resumeText, jobText, fileName) => {
    setLoadingPhase("ai");
    let aiData = null;
    let retryCount = 0;
    const maxRetries = 5;
    const aiToast = showLoading("Tailoring your resume to this posting…");
    while (retryCount < maxRetries) {
      try {
        const processRes = await processText(resumeText, jobText);
        if (!processRes.ok) {
          const errData = await processRes.json().catch(() => ({}));
          const msg = getFriendlyError(errData?.error, "process");
          if (processRes.status === 503) {
            retryCount++;
            if (retryCount >= maxRetries) {
              dismissToast(aiToast);
              showError(msg);
              setLoading(false);
              setProgress(0);
              setLoadingPhase('idle');
              return { success: false };
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            showError(msg);
            continue;
          }
          dismissToast(aiToast);
          showError(msg);
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          return { success: false };
        }
        aiData = await processRes.json();
        if (!aiData?.structured) {
          dismissToast(aiToast);
          showError("Something went wrong. Please try again.");
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          return { success: false };
        }
        const structured = aiData.structured;
        if (structured.certificates !== undefined && structured.tailored_certificates === undefined) {
          structured.tailored_certificates = structured.certificates;
        }
        const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : Object.values(v));
        const normEdu = (edu) => {
          if (!edu || typeof edu !== "object") return { program: "", school: "", location: "", start: "", end: "", highlights: ["", ""] };
          return {
            program: (edu.program || edu.degree || edu.area || edu.studyType || "").trim(),
            school: (edu.school || edu.institution || edu.university || edu.college || "").trim(),
            location: (edu.location || edu.city || "").trim(),
            start: (edu.start || edu.startDate || "").trim(),
            end: (edu.end || edu.endDate || "").trim(),
            highlights: Array.isArray(edu.highlights) ? edu.highlights : edu.courses ? [].concat(edu.courses) : ["", ""],
          };
        };
        structured.education = toArray(structured.education).map(normEdu);
        structured.tailored_experience = toArray(structured.tailored_experience);
        structured.projects = toArray(structured.projects);
        dismissToast(aiToast);
        break;
      } catch (processError) {
        retryCount++;
        if (retryCount >= maxRetries) {
          dismissToast(aiToast);
          showAIProcessingError();
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          return { success: false };
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        showError("Please try again in a moment.");
      }
    }
    localStorage.setItem("tailoredResume", JSON.stringify(aiData.structured));
    setAiData(aiData.structured);
    saveToRecentResults(aiData.structured, jobText);
    setShowResultSkeleton(true);
    setLoadingPhase('idle');
    setTimeout(() => router.push("/result"), 400);
    return { success: true };
  };

  // Refactored handleSubmit
  const handleSubmit = async () => {
    if (!jobText.trim()) return showValidationError("Add a job description to continue.");
    if (uploadMode === "pdf" && !pdfFile && !selectedResume) {
      return showValidationError("Upload or select a PDF to continue.");
    }
    if (uploadMode === "text" && !textResume.trim()) {
      return showValidationError("Paste your resume text to continue.");
    }
    if (!navigator.onLine) {
      showNetworkError();
      return;
    }
    setLoading(true);
    setLoadingPhase(uploadMode === "pdf" && pdfFile ? "upload" : uploadMode === "pdf" ? "extract" : "ai");
    setProgress(0);
    simulateProgress();
    try {
      // 1. Upload
      const uploadResult = await uploadResume();
      if (!uploadResult?.success) return;
      // 2. Extract
      const extractResult = await extractResumeText(uploadResult);
      if (!extractResult?.success) return;
      // 3. AI
      await runAI(extractResult.resumeText, jobText, extractResult.fileName);
    } catch (err) {
      setLoadingPhase('idle');
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        showNetworkRetry();
      } else {
        showAIProcessingError();
      }
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showFileUploadError("Max 3MB PDF only.");
      return;
    }

    if (file.type !== "application/pdf") {
      showFileUploadError("Only PDF files are allowed.");
      return;
    }

    setPdfFile(file);
    setSelectedResume(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" && file.size <= 3 * 1024 * 1024) {
        setPdfFile(file);
        setSelectedResume(null);
        showFileUploadSuccess();
      } else {
        showFileUploadError("Please upload a valid PDF file under 3MB.");
      }
    }
  };

  const clearForm = () => {
    // Reset all form states
    setJobText("");
    setPdfFile(null);
    setTextResume("");
    setSelectedResume(null);
    setUploadMode("pdf"); // Reset to default mode
    setDragActive(false);
    setShowFilePreview(false);
    setShowResultSkeleton(false);
    setAiData(null);
    
    // Clear file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Reset progress and loading states
    setProgress(0);
    setLoading(false);
    
    // Show success message
    showFormCleared();
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      // Force re-render by updating a dummy state
      setJobText("");
    }, 100);
  };

  const switchUploadMode = (mode) => {
    // Clear all form data when switching modes
    setUploadMode(mode);
    setPdfFile(null);
    setTextResume("");
    setSelectedResume(null);
    setDragActive(false);
    setShowFilePreview(false);
    
    // Clear file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Reset progress and loading states
    setProgress(0);
    setLoading(false);
  };

  // Load recent results from localStorage
  const loadRecentResults = () => {
    try {
      const stored = localStorage.getItem(`recentResults_${user?.email}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentResults(parsed);
      }
    } catch (error) {
      setRecentResults([]);
    }
  };

  // Save result to recent results (only keep the latest one)
  const saveToRecentResults = (resultData, jobText, fileNameOverride = null) => {
    try {
      const email = user?.email;
      if (!email) return;

      const newResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        jobText: jobText,
        resultData: resultData,
        fileName: fileNameOverride || pdfFile?.name || `text-resume-${Date.now()}.txt`
      };

      // Store only the latest result
      localStorage.setItem(`recentResults_${email}`, JSON.stringify([newResult]));
      setRecentResults([newResult]);
    } catch (error) {
      // console.error("Error saving recent result:", error);
    }
  };

  // Load the recent result
  const loadRecentResult = () => {
    try {
      if (recentResults.length === 0) return;
      
      const result = recentResults[0];
      localStorage.setItem("tailoredResume", JSON.stringify(result.resultData));
      setAiData(result.resultData);
      setShowResultSkeleton(true);
      setTimeout(() => router.push("/result"), 400);
    } catch (error) {
      showError("Couldn't open that draft. Try again.");
    }
  };

  // Delete the recent result
  const deleteRecentResult = () => {
    try {
      const email = user?.email;
      if (!email) return;

      localStorage.removeItem(`recentResults_${email}`);
      setRecentResults([]);
      showSuccess("Draft removed from this device");
    } catch (error) {
      showError("Couldn't remove that draft.");
    }
  };

  const openScratchEditor = () => {
    const draft = getEmptyResumeDraft();
    localStorage.setItem("tailoredResume", JSON.stringify(draft));
    saveToRecentResults(draft, "Sample resume (no job posting yet)", "scratch-resume-draft");
    setShowResultSkeleton(true);
    setTimeout(() => router.push("/result"), 400);
  };

  const escapeHtml = (unsafe) =>
    (typeof unsafe === "string" ? unsafe : String(unsafe ?? ""))
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Loading your workspace…
      </div>
    );
  }

  if (loading) {
    const phaseLabel =
      loadingPhase === "upload"
        ? "Uploading your file"
        : loadingPhase === "extract"
          ? "Reading your PDF"
          : loadingPhase === "ai"
            ? "Tailoring with AI"
            : "Working on it";

    return (
      <div className="fixed inset-0 z-[9999] flex min-h-screen w-full items-center justify-center bg-zinc-50/95 px-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm"
        >
          <Image
            src="/logo.png"
            alt=""
            width={1017}
            height={850}
            className="mx-auto h-12 w-auto max-w-[3rem] rounded-lg border border-zinc-200 object-contain"
            priority
          />
          <h2 className="mt-6 text-lg font-semibold text-zinc-900">{phaseLabel}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Longer resumes or detailed postings may take up to a minute—we&apos;ll keep this screen updated.
          </p>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <motion.div
              className="h-full rounded-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-xs font-medium tabular-nums text-zinc-500">{progress}%</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-left text-xs text-zinc-600">
            {[
              { id: "upload", label: "Upload" },
              { id: "extract", label: "Extract" },
              { id: "ai", label: "Tailor" },
            ].map((step) => (
              <span
                key={step.id}
                className={`rounded-full border px-2.5 py-1 ${
                  loadingPhase === step.id ? "border-blue-200 bg-blue-50 text-blue-900" : "border-zinc-200 bg-zinc-50 text-zinc-500"
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResultSkeleton) {
    return (
      <div className="fixed inset-0 z-[9999] flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-zinc-900">Draft ready</h2>
          <p className="mt-2 text-sm text-zinc-500">Opening your editor—almost there.</p>
          <div className="mt-8 space-y-3 text-left">
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-100" />
            <div className="h-3 w-32 animate-pulse rounded bg-zinc-200" />
            <div className="h-24 w-full animate-pulse rounded-lg bg-zinc-100" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-w-0 bg-zinc-50">
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
      
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        whileTap={{ scale: 0.97 }}
        onClick={clearForm}
        className="group fixed z-40 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-md transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] sm:bottom-[max(2rem,env(safe-area-inset-bottom))] sm:right-[max(2rem,env(safe-area-inset-right))]"
        title="Clear all fields"
      >
        <Plus className="h-6 w-6 transition-transform group-hover:rotate-45" strokeWidth={1.75} />
      </motion.button>
      
      <div className="mx-auto max-w-7xl px-page py-5 sm:py-8">
        {/* Network Status Warning */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-red-200 bg-red-50/90 p-3 sm:mb-6 sm:p-4"
          >
            <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 sm:mt-0 sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-red-800 sm:text-base">You&apos;re offline</p>
                <p className="text-xs text-red-700 sm:text-sm">Reconnect to upload files and run AI tailoring.</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mb-10 text-center sm:mb-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm sm:mb-5 sm:h-14 sm:w-14">
            <Home className="h-6 w-6 text-blue-700 sm:h-7 sm:w-7" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            Welcome back{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">
            Add a job description and your resume to generate a tailored draft—or open the editor with sample sections you can
            replace in minutes.
          </p>
          <div className="mt-6 flex w-full max-w-md flex-col items-stretch justify-center gap-2 min-[420px]:max-w-none min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4 sm:mt-8">
            <button
              type="button"
              onClick={openScratchEditor}
              className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 min-[420px]:w-auto min-[420px]:px-4"
            >
              <Edit3 className="h-4 w-4 shrink-0 text-blue-700" strokeWidth={1.75} />
              <span className="text-center">Start from a sample resume</span>
            </button>
            {recentResults.length > 0 && (
              <button
                type="button"
                onClick={() => setShowRecentResults(true)}
                className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 min-[420px]:w-auto min-[420px]:px-4"
              >
                <Clock className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.75} />
                Recent draft
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Job Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="min-w-0 max-w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-8"
            >
              <div className="mb-4 flex items-start justify-between gap-2 sm:mb-6 sm:gap-3 sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:items-center sm:gap-3 sm:mr-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 sm:mt-0 sm:h-12 sm:w-12">
                    <Briefcase className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Job description</h2>
                    <p className="text-sm text-gray-500 sm:text-base">
                      Paste the full posting: role overview, requirements, and responsibilities (max{" "}
                      {JOB_DESCRIPTION_MAX_CHARS.toLocaleString()} characters).
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearForm}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-red-500 sm:h-12 sm:w-12"
                  title="Clear job description field"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>

        <textarea
                className="h-40 w-full resize-none rounded-lg border border-zinc-200 p-4 text-base text-zinc-900 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 sm:h-48 sm:p-5 sm:text-lg"
                placeholder="Paste the job description here—including must-have skills, tools, and responsibilities."
          value={unescapeHtml(jobText)}
          onChange={(e) => setJobText(e.target.value.slice(0, JOB_DESCRIPTION_MAX_CHARS))}
          maxLength={JOB_DESCRIPTION_MAX_CHARS}
        />

              {jobText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 flex items-center gap-2 text-sm ${jobText.length >= JOB_DESCRIPTION_MAX_CHARS ? "text-amber-600" : "text-green-600"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{jobText.length.toLocaleString()} / {JOB_DESCRIPTION_MAX_CHARS.toLocaleString()} characters</span>
                </motion.div>
              )}
            </motion.div>

            {/* Resume Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="min-w-0 max-w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-8"
            >
              <div className="mb-5 flex items-start gap-2.5 sm:mb-6 sm:items-center sm:gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                  <Upload className="h-6 w-6 text-green-600" />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Your resume</h2>
                  <p className="text-sm text-gray-500">Upload a PDF or paste the full text of your resume.</p>
                </div>
              </div>

              {/* Upload Mode Toggle */}
              <div className="mb-6">
                <div className="flex flex-col gap-1 rounded-xl bg-gray-100 p-1 sm:flex-row">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => switchUploadMode("pdf")}
                    className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:py-2 ${
                      uploadMode === "pdf"
                        ? "bg-white text-blue-700 shadow-sm ring-1 ring-zinc-200/80"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <FileUp className="w-4 h-4" />
                    PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => switchUploadMode("text")}
                    className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:py-2 ${
                      uploadMode === "text"
                        ? "bg-white text-blue-700 shadow-sm ring-1 ring-zinc-200/80"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    Paste text
                  </motion.button>
            </div>
        </div>

              {/* PDF Upload Mode */}
              <AnimatePresence mode="wait">
                {uploadMode === "pdf" && (
                  <motion.div
                    key="pdf"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-200 sm:p-8 ${
                        dragActive 
                          ? "border-blue-500 bg-blue-50/60"
                          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
                          <FileText className="h-8 w-8 text-zinc-600" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0 px-1">
                          <p
                            className="mb-2 break-words text-base font-medium text-gray-900 sm:text-xl"
                            title={pdfFile ? pdfFile.name : undefined}
                          >
                            {pdfFile ? pdfFile.name : "Drop a PDF here or click to browse"}
                          </p>
                          <p className="text-gray-500">
                            {pdfFile ? "Ready to process · up to 10MB" : "Up to 10MB · text-based PDFs work best"}
                          </p>
                        </div>
                        {pdfFile && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center text-green-600"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Ready to process</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text Input Mode */}
                {uploadMode === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex min-w-0 items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:items-center">
                      <Edit3 className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600 sm:mt-0" strokeWidth={1.75} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900">Resume text</p>
                        <p className="text-xs text-zinc-600 sm:text-sm">Paste your full resume (max {RESUME_TEXT_MAX_CHARS.toLocaleString()} characters).</p>
                      </div>
        </div>

                    <textarea
                      className="h-64 w-full resize-none rounded-lg border border-zinc-200 p-5 text-base text-zinc-900 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 sm:text-lg"
                      placeholder="Paste your full resume—experience, skills, education, and links. Clear section headings help us map your content accurately."
                      value={unescapeHtml(textResume)}
                      onChange={(e) => setTextResume(e.target.value.slice(0, RESUME_TEXT_MAX_CHARS))}
                      maxLength={RESUME_TEXT_MAX_CHARS}
                    />
                    
                    {textResume && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-2 text-sm ${textResume.length >= RESUME_TEXT_MAX_CHARS ? "text-amber-600" : "text-green-600"}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{textResume.length.toLocaleString()} / {RESUME_TEXT_MAX_CHARS.toLocaleString()} characters</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Previous Resumes Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="min-w-0 max-w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="mb-5 flex items-start gap-2.5 sm:mb-6 sm:items-center sm:gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="min-w-0 text-left">
                    <h2 className="text-xl font-semibold text-gray-900">Your uploads</h2>
                    <p className="text-gray-500">{uploadedResumes.length} files</p>
                    <p className="text-sm text-gray-500">Select a file to reuse for the next tailored version.</p>
                </div>
              </div>

              {uploadedResumes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No PDFs uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedResumes.map((resume) => (
                    <motion.div
                      key={resume.path}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedResume?.path === resume.path
                          ? "border-blue-500 bg-blue-50/50 shadow-sm"
                          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                      onClick={() => {
                        setSelectedResume(resume);
                        setPdfFile(null);
                        setTextResume("");
                        setUploadMode("pdf");
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                            <FileText className="h-5 w-5 text-zinc-600" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1 pr-1">
                            <p className="truncate text-sm font-medium text-gray-900" title={resume.name}>
                              {escapeHtml(resume.name)}
                            </p>
                            <p className="text-xs text-gray-500">PDF</p>
                          </div>
                        </div>
                        <div className="ml-2 flex flex-shrink-0 items-center gap-0.5 sm:gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(resume.url, '_blank');
                            }}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-blue-500"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
        <button
                            type="button"
                            disabled={isDeletingResume || showDeleteConfirm}
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(resume);
                            }}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-red-500 disabled:pointer-events-none disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
        </button>
      </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={
                  !jobText.trim() ||
                  (uploadMode === "pdf" && !pdfFile && !selectedResume) ||
                  (uploadMode === "text" && !textResume.trim())
                }
                className="w-full rounded-lg bg-zinc-900 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2 sm:py-4 sm:text-lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Tailor my resume</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
              </div>
              
              {(!jobText.trim() || (uploadMode === "pdf" && !pdfFile && !selectedResume) || (uploadMode === "text" && !textResume.trim())) && (
          <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <div className="flex items-start gap-2 sm:items-center">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 sm:mt-0" />
                    <p className="min-w-0 text-sm font-medium text-amber-800">
                      {!jobText.trim()
                        ? "Add a job description to continue"
                        : uploadMode === "pdf"
                          ? "Upload or select a PDF to continue"
                          : "Paste your resume text to continue"}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-10 pb-6">
          <SiteLegalLinks />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
              className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl"
              aria-busy={isDeletingResume}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <Trash2 className="h-7 w-7 text-red-600" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">Delete resume</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Delete &quot;{escapeHtml(fileToDelete?.name)}&quot;? This removes the file from your account. This
                  can&apos;t be undone.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    disabled={isDeletingResume}
                    className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void executeDelete()}
                    disabled={isDeletingResume}
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/30 disabled:cursor-wait disabled:opacity-90"
                  >
                    {isDeletingResume ? (
                      <>
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                        Deleting…
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Result Modal */}
      <AnimatePresence>
        {showRecentResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-3 backdrop-blur-[2px] sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl sm:max-w-lg"
            >
              <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-zinc-50/80 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white">
                    <Clock className="h-5 w-5 text-blue-700" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-zinc-900 sm:text-lg">Recent drafts</h3>
                    <p className="text-xs text-zinc-500 sm:text-sm">
                      Saved locally on this device—another browser may not show the same list.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecentResults(false)}
                  className="shrink-0 rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 py-6 sm:px-6">
                {recentResults.length === 0 ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                      <Clock className="h-7 w-7 text-zinc-400" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-base font-semibold text-zinc-900">No drafts saved here yet</h4>
                    <p className="mt-2 text-sm text-zinc-600">Tailor a resume to see it listed here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentResults.map((result) => (
                      <div key={result.id} className="relative rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5">
                        <button
                          type="button"
                          onClick={deleteRecentResult}
                          className="absolute right-3 top-3 rounded-md p-2 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/20"
                          title="Delete result"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-start gap-3 pr-10">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-zinc-200">
                            <FileText className="h-5 w-5 text-zinc-600" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate font-medium text-zinc-900">{escapeHtml(result.fileName)}</h4>
                            <p className="text-xs text-zinc-500">
                              {new Date(result.timestamp).toLocaleDateString()} · {new Date(result.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3">
                          <p className="text-xs font-medium text-zinc-500">Job description</p>
                          <p className="mt-1 text-sm text-zinc-700">
                            {escapeHtml(result.jobText).length > 120 ? `${escapeHtml(result.jobText).slice(0, 120)}…` : escapeHtml(result.jobText)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={loadRecentResult}
                          className="mt-4 w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
                        >
                          Open in editor
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 border-t border-zinc-200 bg-zinc-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-zinc-500">
                  {recentResults.length > 0 ? `Updated ${new Date(recentResults[0].timestamp).toLocaleString()}` : "—"}
                </p>
                <button
                  type="button"
                  onClick={() => setShowRecentResults(false)}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
