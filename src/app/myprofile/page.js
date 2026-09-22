"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { User, FileText, Calendar, ChevronDown, ChevronUp } from "lucide-react";
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
                      {!submission.resumeUrl && submission.resumeText ? (
                        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                          <span className="badge badge-neutral">Text resume</span>
                        </div>
                      ) : null}
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
