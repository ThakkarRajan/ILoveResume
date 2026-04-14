"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { API_BASE, processText } from "../../utils/api.js";
import { showError } from "../../utils/toast.js";
import { getFriendlyError } from "../../utils/errorMessages.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  FileText, 
  Calendar, 
  Eye, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  Settings,
  Briefcase
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../utils/firebase.js";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";

export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const router = useRouter();

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
    if (user) fetchUserSubmissions();
  }, [user]);

  const fetchUserSubmissions = async () => {
    try {
      const email = user?.email?.toLowerCase();
      if (!email) return;
      const entriesRef = collection(db, `submissions/${email}/entries`);
      const snapshot = await getDocs(entriesRef);
      const fetched = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setSubmissions(fetched);
    } catch (err) {
      // console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const simulateProgress = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 5) + 1;
      setProgress(Math.min(p, 100));
      if (p >= 100) clearInterval(interval);
    }, 60000 / 100);
  };

  const handleView = async (submission) => {
    try {
      if (submission.structured) {
        localStorage.setItem(
          "tailoredResume",
          JSON.stringify(submission.structured)
        );
        router.push("/result");
        return;
      }

      setProcessing(true);
      setProgress(0);
      simulateProgress();

      // Sanitize the resumeUrl before sending to backend
      const isValidUrl = (url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      };
      if (!isValidUrl(submission.resumeUrl)) {
        showError("Please enter a valid HTTP or HTTPS URL.");
        setProcessing(false);
        return;
      }

      const extractRes = await fetch(`${API_BASE}/extract-from-url`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: submission.resumeUrl }),
        }
      );
      const extractData = await extractRes.json();
      if (!extractRes.ok) {
        showError(getFriendlyError(extractData?.error, "extract"));
        setProcessing(false);
        return;
      }
      const resumeText = extractData?.text;
      if (!resumeText || resumeText.trim().length < 100) {
        showError("The PDF seems too short. Please upload a full resume.");
        setProcessing(false);
        return;
      }

      const processRes = await processText(resumeText, submission.jobText);
      const aiData = await processRes.json();
      if (!processRes.ok) {
        showError(getFriendlyError(aiData?.error, "process"));
        setProcessing(false);
        return;
      }
      if (!aiData?.structured) {
        showError("Something went wrong. Please try again.");
        setProcessing(false);
        return;
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

      localStorage.setItem("tailoredResume", JSON.stringify(structured));
      router.push("/result");
    } catch (error) {
      showError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  if (processing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-900/70 px-4 backdrop-blur-[2px]">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600" />
          <Sparkles className="mx-auto mb-4 h-6 w-6 text-blue-600" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-zinc-900">Processing resume</h3>
          <p className="mt-1 text-sm text-zinc-500">This may take a few moments.</p>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <motion.div className="h-full rounded-full bg-blue-600" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
          <p className="mt-2 text-xs tabular-nums text-zinc-500">{progress}%</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mb-10 text-center sm:mb-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm sm:mb-5 sm:h-14 sm:w-14">
            <User className="h-6 w-6 text-blue-700 sm:h-7 sm:w-7" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Profile</h1>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">Your Google account and tailoring activity on this site.</p>
        </motion.div>

        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-2xl border-4 border-white shadow-lg"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100">
                  <User className="h-10 w-10 text-zinc-600" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {user?.displayName}
              </h2>
              <p className="text-gray-600 mb-3">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
                  <FileText className="h-4 w-4 text-zinc-600" strokeWidth={1.75} />
                  <span className="text-sm font-medium text-zinc-800">{submissions.length} runs</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submissions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Activity</h2>
                <p className="text-gray-600">Each entry is a job description you ran with a resume from the dashboard.</p>
              </div>
            </div>
          </div>

          {submissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600 mb-6">Tailor a resume from the dashboard to see it listed here.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/dashboard")}
                className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
              >
                Go to dashboard
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {submissions.map((submission, index) => {
                const showMore = expanded[submission.id];
                const preview =
                  submission.jobText.length > 120 && !showMore
                    ? submission.jobText.slice(0, 120) + "..."
                    : submission.jobText;

                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                            <FileText className="h-5 w-5 text-zinc-600" strokeWidth={1.75} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Tailoring #{index + 1}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {submission.uploadedAt?.toDate
                                  ? submission.uploadedAt
                                      .toDate()
                                      .toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })
                                  : "Unknown date"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.structured && (
                            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-medium text-green-700">Processed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <h4 className="font-medium text-gray-900">Job Description</h4>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                            {preview}
                          </p>
                          {submission.jobText.length > 120 && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleExpand(submission.id)}
                              className="mt-2 flex items-center gap-1 text-sm font-medium text-blue-700 transition-colors hover:text-blue-800"
                            >
                              {showMore ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Show More
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Resume Section */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <h4 className="font-medium text-gray-900">Resume</h4>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          {submission.resumeUrl ? (
                            <motion.a
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              href={submission.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="text-sm font-medium">View PDF</span>
                            </motion.a>
                          ) : (
                            <div className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-xl">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">Text Resume</span>
                            </div>
                          )}
                          {submission.resumeText && (
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Text Input</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleView(submission)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Result</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <div className="mt-12 border-t border-zinc-200 pt-10 pb-8">
          <SiteLegalLinks />
        </div>
      </div>
    </div>
  );
}
