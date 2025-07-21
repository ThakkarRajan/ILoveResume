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
  Home
} from "lucide-react";
import { getAuth, signInWithCredential, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";


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
      showError("Failed to load your resumes.");
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
    setFileToDelete(file);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (fileToDelete) {
      await handleDelete(fileToDelete);
      setShowDeleteConfirm(false);
      setFileToDelete(null);
    }
  };

  const cancelDelete = () => {
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
        const uploadToast = showLoading('Uploading PDF ...');
        let uploadSuccess = false;
        let uploadAttemptsLocal = 0;
        while (!uploadSuccess && uploadAttemptsLocal < 3) {
          try {
            await uploadBytes(storageRef, pdfFile);
            fileURL = await getDownloadURL(storageRef);
            if (!fileURL) throw new Error("File upload failed. Please try again.");
            dismissToast(uploadToast);
            showFileUploadSuccess();
            await new Promise(resolve => setTimeout(resolve, 500));
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
        const extractToast = showLoading('Extracting text from PDF...');
        try {
          if (!navigator.onLine) throw new Error("No internet connection. Please check your network.");
          if (pdfFile.size > 10 * 1024 * 1024) throw new Error("File size too large. Please upload a PDF under 10MB.");
          const formData = new FormData();
          formData.append("file", pdfFile);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000);
          const extractRes = await fetch(
            "https://jobdraftai-backend-production.up.railway.app/extract",
            { method: "POST", body: formData, signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (!extractRes.ok) throw new Error("Please try again.");
          const json = await extractRes.json();
          if (!json.text || json.text.trim() === '') throw new Error("No text extracted from PDF. Please ensure the PDF contains readable text.");
          if (json.text.trim().length < 100) throw new Error("Extracted text is too short. Please ensure the PDF contains a complete resume.");
          resumeText = json.text;
          const resumeKeywords = ["resume", "experience", "skills", "education", "projects", "summary", "work", "employment"];
          const textLower = json.text.toLowerCase();
          const keywordMatches = resumeKeywords.filter(keyword => textLower.includes(keyword));
          if (keywordMatches.length < 2) throw new Error("The uploaded file doesn't appear to be a resume. Please upload a valid resume PDF.");
          dismissToast(extractToast);
        } catch (extractError) {
          dismissToast(extractToast);
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          if (extractError.name === 'AbortError') {
            showAIProcessingError();
          } else if (extractError.message.includes('network') || extractError.message.includes('fetch') || extractError.name === 'TypeError') {
            showNetworkRetry();
          } else {
            showAIProcessingError();
          }
          return { success: false };
        }
      } else if (selectedResume) {
        setLoadingPhase("extract");
        const extractToast = showLoading('Extracting text from selected resume...');
        try {
          if (!navigator.onLine) throw new Error("No internet connection. Please check your network.");
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000);
          const extractRes = await fetch(
            "https://jobdraftai-backend-production.up.railway.app/extract-from-url",
            { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: fileURL }), signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (!extractRes.ok) throw new Error("Please try again.");
          const json = await extractRes.json();
          if (!json.text || json.text.trim() === '') throw new Error("No text extracted from resume. Please try a different file.");
          if (json.text.trim().length < 100) throw new Error("Extracted text is too short. Please ensure the file contains a complete resume.");
          resumeText = json.text;
          const resumeKeywords = ["resume", "experience", "skills", "education", "projects", "summary", "work", "employment"];
          const textLower = json.text.toLowerCase();
          const keywordMatches = resumeKeywords.filter(keyword => textLower.includes(keyword));
          if (keywordMatches.length < 2) throw new Error("The uploaded file doesn't appear to be a resume. Please upload a valid resume PDF.");
          dismissToast(extractToast);
        } catch (extractError) {
          dismissToast(extractToast);
          setLoading(false);
          setProgress(0);
          setLoadingPhase('idle');
          if (extractError.name === 'AbortError') {
            showAIProcessingError();
          } else if (extractError.message.includes('network') || extractError.message.includes('fetch') || extractError.name === 'TypeError') {
            showNetworkRetry();
          } else {
            showAIProcessingError();
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
    const aiToast = showLoading('AI is analyzing your resume and job description...');
    while (retryCount < maxRetries) {
      try {
        const processRes = await fetch(
          "https://jobdraftai-backend-production.up.railway.app/process-text",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `Resume:\n${resumeText}\n\nJob Description:\n${jobText}`,
            }),
          }
        );
        if (!processRes.ok) throw new Error("Please try again.");
        aiData = await processRes.json();
        if (!aiData?.structured) throw new Error("Invalid AI response structure");
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
        showAIProcessingError(retryCount, maxRetries);
      }
    }
    localStorage.setItem("tailoredResume", JSON.stringify(aiData.structured));
    setAiData(aiData.structured);
    saveToRecentResults(aiData.structured, jobText);
    setShowResultSkeleton(true);
    setLoadingPhase('idle');
    setTimeout(() => {
      router.push("/result");
    }, 2000);
    return { success: true };
  };

  // Refactored handleSubmit
  const handleSubmit = async () => {
    if (!jobText.trim()) return showValidationError("Please enter job description.");
    if (uploadMode === "pdf" && !pdfFile && !selectedResume) {
      return showValidationError("Please upload or select a PDF resume.");
    }
    if (uploadMode === "text" && !textResume.trim()) {
      return showValidationError("Please enter your resume text.");
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
      console.error("Error loading recent results:", error);
      setRecentResults([]);
    }
  };

  // Save result to recent results (only keep the latest one)
  const saveToRecentResults = (resultData, jobText) => {
    try {
      const email = user?.email;
      if (!email) return;

      const newResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        jobText: jobText,
        resultData: resultData,
        fileName: pdfFile?.name || `text-resume-${Date.now()}.txt`
      };

      // Store only the latest result
      localStorage.setItem(`recentResults_${email}`, JSON.stringify([newResult]));
      setRecentResults([newResult]);
    } catch (error) {
      console.error("Error saving recent result:", error);
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
      
      // Redirect after showing skeleton for 2 seconds
      setTimeout(() => {
        router.push("/result");
      }, 2000);
    } catch (error) {
      console.error("Error loading recent result:", error);
      showError("Failed to load recent result");
    }
  };

  // Delete the recent result
  const deleteRecentResult = () => {
    try {
      const email = user?.email;
      if (!email) return;

      localStorage.removeItem(`recentResults_${email}`);
      setRecentResults([]);
      showSuccess("Recent result deleted");
    } catch (error) {
      console.error("Error deleting recent result:", error);
      showError("Failed to delete recent result");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <>
        {/* Enhanced AI Processing Loading Screen - Responsive */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 z-[9999] flex flex-col items-center justify-center overflow-hidden min-h-screen w-full">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          {/* Loading Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center relative z-10 max-w-xs sm:max-w-2xl mx-auto px-2 sm:px-6"
          >
            {/* Enhanced Logo and Brand */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-10"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <Image
                  src="/logo.png"
                  alt="I Love Resumes Logo"
                  width={70}
                  height={70}
                  priority
                  className="relative z-10 rounded-3xl shadow-2xl w-16 h-16 sm:w-[100px] sm:h-[100px]"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <Image
                  src="/Iloveresumelogotext.png"
                  alt="I Love Resumes Logo"
                  width={180}
                  height={50}
                  priority
                  className="h-10 sm:h-20 object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">AI-Powered Resume Builder</span>
                </div>
              </div>
            </motion.div>
            {/* Enhanced Loading Spinner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative w-28 h-28 sm:w-40 sm:h-40 mb-6 sm:mb-8 mx-auto"
            >
              <div className="absolute inset-0 w-full h-full border-4 border-purple-200/30 rounded-full"></div>
              <div className="absolute inset-0 w-full h-full border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 sm:w-32 sm:h-32 m-auto border-4 border-pink-200/30 rounded-full"></div>
              <div className="absolute inset-0 w-20 h-20 sm:w-32 sm:h-32 m-auto border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-white animate-pulse" />
                </div>
              </div>
            </motion.div>
            {/* Enhanced Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-3 sm:space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {loadingPhase === 'upload' && 'Uploading PDF...'}
                  {loadingPhase === 'extract' && 'Extracting Resume Text...'}
                  {loadingPhase === 'ai' && 'AI is crafting your resume...'}
                  {loadingPhase === 'idle' && 'Processing...'}
                </h3>
                <p className="text-gray-600 text-base sm:text-xl">This may take a few moments</p>
              </div>
              {/* Enhanced Progress Bar */}
              <div className="w-full max-w-xs sm:max-w-md mx-auto">
                <div className="bg-gray-200/50 backdrop-blur-sm rounded-full h-3 sm:h-4 mb-2 sm:mb-3 shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 sm:h-4 rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{progress}% complete</p>
              </div>
            </motion.div>
            {/* Enhanced Loading Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm"
            >
              <div className={`flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg ${loadingPhase === 'upload' ? 'ring-2 ring-purple-400' : ''}`}>
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse ${loadingPhase === 'upload' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span className="font-medium text-gray-700">Uploading PDF/Text</span>
              </div>
              <div className={`flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg ${loadingPhase === 'extract' ? 'ring-2 ring-purple-400' : ''}`}>
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse ${loadingPhase === 'extract' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span className="font-medium text-gray-700">Extracting Text</span>
              </div>
              <div className={`flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg ${loadingPhase === 'ai' ? 'ring-2 ring-purple-400' : ''}`}>
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse ${loadingPhase === 'ai' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <span className="font-medium text-gray-700">AI Processing</span>
              </div>
            </motion.div>
            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50"
            >
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Processing time varies based on content length</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </>
    );
  }

  if (showResultSkeleton) {
    return (
      <>
        {/* Result Skeleton Loading Screen - Responsive */}
        <div className="inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 z-[9999] flex flex-col items-center justify-center overflow-hidden min-h-screen w-full pt-4 sm:pt-8">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div> 
            <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          {/* Skeleton Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center relative z-10 w-full max-w-xs sm:max-w-4xl mx-auto px-2 sm:px-6 pt-4 sm:pt-8"
          >
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-12"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative z-10 w-14 h-14 sm:w-24 sm:h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl shadow-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Resume Generated Successfully!
                </h2>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">AI-Powered Results Ready</span>
                </div>
              </div>
            </motion.div>
            {/* Result Page Skeleton - Matching Actual Result Page */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full max-w-xs sm:max-w-7xl mx-auto"
            >
              {/* Responsive Skeleton Layout */}
              <div className="flex flex-col gap-6 sm:gap-8 w-full">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center text-center mb-4 sm:mb-8 gap-2 sm:gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl mb-2 sm:mb-4 animate-pulse"></div>
                  <div className="h-8 sm:h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg animate-pulse mx-auto w-32 sm:w-64 mb-1 sm:mb-3"></div>
                  <div className="h-4 sm:h-6 bg-gray-200 rounded animate-pulse mx-auto w-24 sm:w-48 mb-2 sm:mb-6"></div>
                  <div className="h-8 sm:h-10 bg-white/80 backdrop-blur-sm rounded-xl animate-pulse mx-auto w-20 sm:w-40"></div>
                </div>
                {/* Main Content Skeleton */}
                <div className="flex flex-col gap-4 sm:gap-8 w-full">
                  {/* Name Field */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-16 sm:w-24 mb-1"></div>
                    <div className="h-8 sm:h-12 bg-gray-200 rounded-xl animate-pulse w-full"></div>
                  </div>
                  {/* Contact Fields */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex flex-col gap-1">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-14 sm:w-20 mb-1"></div>
                        <div className="relative">
                          <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-5 sm:h-5 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-8 sm:h-12 bg-gray-200 rounded-xl animate-pulse pl-6 sm:pl-10 w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Summary Section */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-16 sm:w-24 mb-1"></div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-3/6"></div>
                    </div>
                  </div>
                  {/* Skills Section */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-32 mb-1"></div>
                    <div className="bg-gray-50 rounded-xl p-2 sm:p-4 flex flex-col gap-2">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-16 sm:w-24 mb-1"></div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                          <div key={item} className="h-4 sm:h-6 bg-gray-200 rounded-full animate-pulse w-12 sm:w-16"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Experience Section */}
                  <div className="flex flex-col gap-2 sm:gap-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-2 sm:mb-4 gap-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-2xl animate-pulse"></div>
                        <div>
                          <div className="h-5 sm:h-7 bg-gray-200 rounded animate-pulse w-24 sm:w-40 mb-1"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-16 sm:w-32"></div>
                        </div>
                      </div>
                      <div className="h-8 sm:h-10 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl animate-pulse w-16 sm:w-32"></div>
                    </div>
                    {/* Experience Card */}
                    <div className="bg-gray-50 rounded-2xl p-3 sm:p-6 border border-gray-200 flex flex-col gap-2">
                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="flex flex-col gap-1">
                            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-14 sm:w-20 mb-1"></div>
                            <div className="h-8 sm:h-12 bg-gray-200 rounded-xl animate-pulse w-full"></div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-32 mb-1"></div>
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="flex items-center gap-1 sm:gap-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6 sm:mt-8 space-y-2 sm:space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-green-600">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-xs sm:text-sm">Preparing your results...</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">Redirecting to results page in a moment</p>
            </motion.div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      {/* Enhanced Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={clearForm}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center z-40 transition-all duration-300 group"
        title="Clear all form data"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
      </motion.button>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Network Status Warning */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <div>
                <p className="text-red-800 font-medium text-sm sm:text-base">You're currently offline</p>
                <p className="text-red-700 text-xs sm:text-sm">Please check your internet connection to use AI features</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-4 sm:mb-6 shadow-lg">
            <Home className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Welcome back, {user?.name}!
        </h1>
          <p className="text-gray-600 text-base sm:text-xl">Let's create your perfect resume</p>
          
          {/* Quick Stats */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-8 mt-6 sm:mt-8">
            
            {recentResults.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowRecentResults(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 sm:px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Recent Result</span>
              </motion.button>
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-3 sm:mr-4">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Job Description</h2>
                    <p className="text-gray-500 text-sm sm:text-base">Paste the job posting details here</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearForm}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear job description"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>

        <textarea
                className="w-full h-40 sm:h-48 p-4 sm:p-6 border border-gray-200 rounded-2xl text-gray-900 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg"
                placeholder="Copy and paste the job description, requirements, and responsibilities here..."
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
        />

              {jobText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 text-sm text-green-600"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{jobText.length} characters entered</span>
                </motion.div>
              )}
            </motion.div>

            {/* Resume Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Upload Resume</h2>
                    <p className="text-gray-500 text-sm">Choose between PDF upload or text input</p>
                  </div>
                </div>
              </div>

              {/* Upload Mode Toggle */}
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => switchUploadMode("pdf")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      uploadMode === "pdf"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FileUp className="w-4 h-4" />
                    PDF Upload
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => switchUploadMode("text")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      uploadMode === "text"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    Text Input
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
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                        dragActive 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
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
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                          <FileText className="w-10 h-10 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xl font-medium text-gray-900 mb-2">
                            {pdfFile ? pdfFile.name : "Choose a PDF file"}
                          </p>
                          <p className="text-gray-500">
                            {pdfFile ? "File selected successfully!" : "or drag and drop here"}
                          </p>
                        </div>
                        {pdfFile && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center text-green-600"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">File uploaded</span>
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
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                      <Edit3 className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Text Resume Input</p>
                        <p className="text-sm text-purple-700">Type or paste your resume content directly</p>
                      </div>
        </div>

                    <textarea
                      className="w-full h-64 p-6 border border-gray-200 rounded-2xl text-gray-900 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                      placeholder="Enter your resume content here... Include your experience, skills, education, and any other relevant information..."
                      value={textResume}
                      onChange={(e) => setTextResume(e.target.value)}
                    />
                    
                    {textResume && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{textResume.length} characters entered</span>
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Previous Resumes</h2>
                    <p className="text-gray-500">{uploadedResumes.length} files</p>
                    <p className="text-sm text-gray-500">  Choose a resume to continue editing</p>
                  </div>
                </div>
              </div>

              {uploadedResumes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No resumes uploaded yet</p>
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
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedResume(resume);
                        setPdfFile(null);
                        setTextResume("");
                        setUploadMode("pdf");
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {resume.name}
                            </p>
                            <p className="text-xs text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(resume.url, '_blank');
                            }}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(resume);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!jobText.trim() || (uploadMode === "pdf" && !pdfFile && !selectedResume) || (uploadMode === "text" && !textResume.trim())}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-5 px-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Generate AI Resume</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
              
              {(!jobText.trim() || (uploadMode === "pdf" && !pdfFile && !selectedResume) || (uploadMode === "text" && !textResume.trim())) && (
          <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <p className="text-amber-800 text-sm font-medium">
                      {!jobText.trim() 
                        ? "Please enter a job description" 
                        : uploadMode === "pdf" 
                          ? "Please upload or select a PDF resume"
                          : "Please enter your resume text"
                      }
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Delete Resume
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={executeDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </motion.button>
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
            className="fixed inset-0 bg-gradient-to-br from-blue-200/60 via-purple-200/60 to-pink-200/60 backdrop-blur-[6px] z-50 flex items-center justify-center p-2 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/60 rounded-3xl w-full max-w-xs sm:max-w-2xl p-0 overflow-hidden relative"
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pt-6 pb-3 border-b border-gray-200 bg-gradient-to-r from-purple-100/60 to-pink-100/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Recent Result</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">Your last generated resume</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowRecentResults(false)}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded-full transition-colors self-end sm:self-auto"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              {/* Content */}
              <div className="p-5 sm:p-8">
                {recentResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mb-4 animate-pulse-slow shadow-lg">
                      <Clock className="w-10 h-10 text-purple-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">No Recent Result</h4>
                    <p className="text-gray-500 text-base">Generate your first resume to see it here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-white/90 to-purple-50/80 rounded-2xl border border-purple-100 shadow-lg p-5 sm:p-7 flex flex-col gap-4 hover:shadow-2xl transition-shadow duration-300 relative"
                      >
                        {/* Delete button in top right */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={deleteRecentResult}
                          className="absolute top-3 right-3 p-2 text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-400 hover:to-pink-500 rounded-full transition-colors font-bold shadow-sm z-10"
                          title="Delete result"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-md animate-pulse-slow">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-gray-900 truncate max-w-[180px] sm:max-w-xs">{result.fileName}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/80 rounded-xl p-4 border border-purple-50 mb-2 shadow-sm">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-purple-700">Job Description:</span> {result.jobText.length > 120 ? `${result.jobText.slice(0, 120)}...` : result.jobText}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={loadRecentResult}
                            className="flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-md hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl transition-all duration-200 text-base"
                          >
                            Continue Editing
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-purple-50/80 to-pink-50/80">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Last updated: {recentResults.length > 0 ? new Date(recentResults[0].timestamp).toLocaleString() : 'Never'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowRecentResults(false)}
                    className="px-5 py-2 sm:px-8 sm:py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold text-sm sm:text-base shadow-sm"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
