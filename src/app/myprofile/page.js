"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import AppPageLayout from "../../components/ui/AppPageLayout";
import AppPageHeader from "../../components/ui/AppPageHeader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

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
        showError("Need a valid http/https URL");
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
        showError("PDF too short");
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
        showError("Something broke");
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
      showError("Something broke");
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
    <AppPageLayout>
      <div className="mx-auto max-w-5xl">
        <AppPageHeader
          eyebrow="Account"
          title="Activity"
          description="Your Google account and past tailoring runs on this site."
          workflowSteps={[
            { id: "tailor", label: "Tailor" },
            { id: "edit", label: "Edit" },
            { id: "export", label: "Export" },
          ]}
          workflowCurrent={0}
        />

        <div className="panel mb-8">
          <div className="panel-body">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg border border-zinc-200 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100">
                  <User className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-zinc-900">{user?.displayName}</h2>
                <p className="text-sm text-zinc-600">{user?.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge variant="neutral">{submissions.length} runs</StatusBadge>
                  <StatusBadge variant="success">Active</StatusBadge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-zinc-900">Tailoring history</h2>

          {submissions.length === 0 ? (
            <div className="panel">
              <EmptyState
                icon={FileText}
                title="No activity yet"
                description="Tailor a resume from the dashboard to see it listed here."
                action={
                  <button type="button" onClick={() => router.push("/dashboard")} className="btn btn-primary">
                    Go to tailor
                  </button>
                }
              />
            </div>
          ) : (
            <div className="panel divide-y divide-zinc-200">
              {submissions.map((submission, index) => {
                const showMore = expanded[submission.id];
                const preview =
                  submission.jobText.length > 200 && !showMore
                    ? submission.jobText.slice(0, 200) + "…"
                    : submission.jobText;
                const dateLabel = submission.uploadedAt?.toDate
                  ? submission.uploadedAt.toDate().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Unknown date";

                return (
                  <article key={submission.id} className="panel-body">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-zinc-900">Run #{index + 1}</h3>
                          {submission.structured ? (
                            <StatusBadge variant="success">Ready</StatusBadge>
                          ) : (
                            <StatusBadge variant="warning">Processing needed</StatusBadge>
                          )}
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                          <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                          {dateLabel}
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">{preview}</p>
                        {submission.jobText.length > 200 && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(submission.id)}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:text-blue-800"
                          >
                            {showMore ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Show full job description
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                        {submission.resumeUrl ? (
                          <a
                            href={submission.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary w-full sm:w-auto"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View PDF
                          </a>
                        ) : submission.resumeText ? (
                          <span className="badge badge-neutral">Text resume</span>
                        ) : null}
                        <button type="button" onClick={() => handleView(submission)} className="btn btn-primary w-full sm:w-auto">
                          <Eye className="h-4 w-4" />
                          Open result
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-8 border-t border-zinc-200 pt-6">
          <SiteLegalLinks />
        </div>
      </div>
    </AppPageLayout>
  );
}
