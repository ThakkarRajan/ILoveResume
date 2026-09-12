"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, FileUp, ScanText, Sparkles, Wand2 } from "lucide-react";
import { motionEase } from "../motion/motionConfig";

const STEPS = [
  { id: "upload", label: "Upload", icon: FileUp },
  { id: "extract", label: "Extract", icon: ScanText },
  { id: "ai", label: "Tailor", icon: Wand2 },
];

const PHASE_COPY = {
  upload: {
    title: "Launching your resume",
    subtitle: "Secure upload in motion—your file is on its way.",
  },
  extract: {
    title: "Reading every line",
    subtitle: "Pulling skills, roles, and wins out of the PDF.",
  },
  ai: {
    title: "Tailoring to the job",
    subtitle: "Aligning your experience to this posting.",
  },
  idle: {
    title: "Working on it",
    subtitle: "Hang tight—we're lining everything up.",
  },
};

const TIPS = [
  "Mirror the job’s strongest verbs in your bullets.",
  "Specific numbers beat vague adjectives every time.",
  "One tailored resume beats ten generic uploads.",
  "ATS loves clean structure—you’re building that now.",
  "Lead with impact, then stack the proof.",
  "Swap buzzwords for what you actually shipped.",
  "Put the most relevant role first for this posting.",
  "Keep bullets tight: action → scope → result.",
  "Keywords from the JD belong in your summary too.",
  "Almost there—great resumes are worth the wait.",
  "We’re aligning your experience to this role’s language.",
  "Coffee-break length wait. Resume-career length payoff.",
];

const FLOAT_WORDS = [
  "Impact",
  "Owned",
  "Shipped",
  "Scaled",
  "Led",
  "Built",
  "ATS",
  "Keywords",
  "Clarity",
  "Results",
  "Metrics",
  "Scope",
];

function ProgressBackdrop({ reduceMotion }) {
  return (
    <div className="tailor-progress-atmosphere" aria-hidden>
      <span className="tailor-progress-blob tailor-progress-blob--a" />
      <span className="tailor-progress-blob tailor-progress-blob--b" />
      <span className="tailor-progress-blob tailor-progress-blob--c" />
      <span className="tailor-progress-grid" />
      <div className="tailor-progress-float-layer">
        {FLOAT_WORDS.map((word, i) => (
          <motion.span
            key={word}
            className={`tailor-progress-float-word tailor-progress-float-word--${(i % 6) + 1}`}
            initial={reduceMotion ? false : { opacity: 0.15, y: 12 }}
            animate={
              reduceMotion
                ? { opacity: 0.22 }
                : {
                    opacity: [0.12, 0.4, 0.12],
                    y: [10, -14, 10],
                    x: [0, (i % 2 === 0 ? 8 : -8), 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 7 + (i % 5),
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "easeInOut",
                  }
            }
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function stepStatus(stepId, phase) {
  const order = ["upload", "extract", "ai"];
  const phaseIndex = Math.max(0, order.indexOf(phase === "idle" ? "upload" : phase));
  const stepIndex = order.indexOf(stepId);
  if (stepIndex < phaseIndex) return "done";
  if (stepIndex === phaseIndex) return "active";
  return "upcoming";
}

function PhaseStage({ phase, reduceMotion }) {
  return (
    <div className="tailor-progress-stage" aria-hidden>
      <div className="tailor-progress-paper">
        <span className="tailor-progress-paper-line" />
        <span className="tailor-progress-paper-line short" />
        <span className="tailor-progress-paper-line" />
        <span className="tailor-progress-paper-line mid" />
        <span className="tailor-progress-paper-line short" />

        {phase === "extract" || phase === "idle" ? (
          <motion.span
            className="tailor-progress-scan"
            initial={reduceMotion ? false : { top: "8%" }}
            animate={reduceMotion ? undefined : { top: ["8%", "88%", "8%"] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ) : null}

        {phase === "upload" ? (
          <motion.div
            className="tailor-progress-float-file"
            initial={reduceMotion ? false : { y: 18, opacity: 0.4 }}
            animate={reduceMotion ? undefined : { y: [18, -6, 18], opacity: [0.45, 1, 0.45] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 2.1, repeat: Infinity, ease: motionEase }
            }
          >
            <FileUp className="h-5 w-5" strokeWidth={1.75} />
          </motion.div>
        ) : null}

        {phase === "ai" ? (
          <div className="tailor-progress-chips">
            {FLOAT_WORDS.slice(0, 5).map((word, i) => (
              <motion.span
                key={word}
                className="tailor-progress-chip"
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.92 }}
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: [0.35, 1, 0.35],
                        y: [8, 0, 8],
                        scale: [0.94, 1, 0.94],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 2.2,
                        repeat: Infinity,
                        delay: i * 0.18,
                        ease: motionEase,
                      }
                }
              >
                {word}
              </motion.span>
            ))}
          </div>
        ) : null}
      </div>

      <motion.div
        className="tailor-progress-orb"
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1.06, 1], opacity: [0.55, 0.85, 0.55] }
        }
        transition={
          reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}

/**
 * Full-screen tailor progress overlay.
 * Props: phase = upload | extract | ai | idle, progress = 0–100
 */
export default function TailorProgressScreen({
  phase = "idle",
  progress = 0,
  title,
  subtitle,
}) {
  const reduceMotion = useReducedMotion();
  const [tipIndex, setTipIndex] = useState(0);
  const copy = PHASE_COPY[phase] || PHASE_COPY.idle;
  const heading = title || copy.title;
  const body = subtitle || copy.subtitle;
  const safeProgress = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="tailor-progress-overlay" role="status" aria-live="polite" aria-busy="true">
      <ProgressBackdrop reduceMotion={reduceMotion} />
      <motion.div
        className="tailor-progress-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: motionEase }}
      >
        <div className="tailor-progress-brand">
          <Image
            src="/logo.png"
            alt=""
            width={512}
            height={454}
            className="tailor-progress-logo"
            priority
          />
          <Image
            src="/logo-text.png"
            alt="I Love Resumes"
            width={900}
            height={95}
            className="tailor-progress-wordmark"
            priority
          />
        </div>

        <PhaseStage phase={phase} reduceMotion={reduceMotion} />

        <AnimatePresence mode="wait">
          <motion.div
            key={phase + heading}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: motionEase }}
            className="tailor-progress-copy"
          >
            <p className="tailor-progress-kicker">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              In progress
            </p>
            <h2 className="tailor-progress-title">{heading}</h2>
            <p className="tailor-progress-subtitle">{body}</p>
          </motion.div>
        </AnimatePresence>

        <div
          className="tailor-progress-meter"
          aria-label={`${safeProgress} percent complete`}
        >
          <div className="tailor-progress-track" aria-hidden>
            <motion.div
              className="tailor-progress-fill"
              initial={false}
              animate={{ width: `${safeProgress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            {!reduceMotion ? <span className="tailor-progress-sheen" /> : null}
          </div>
          <p className="tailor-progress-percent" aria-hidden>
            {safeProgress}%
          </p>
        </div>

        <ol className="tailor-progress-steps">
          {STEPS.map((step, index) => {
            const status = stepStatus(step.id, phase);
            const Icon = step.icon;
            return (
              <li key={step.id} className={`tailor-progress-step tailor-progress-step--${status}`}>
                {index > 0 ? <span className="tailor-progress-step-rail" aria-hidden /> : null}
                <span className="tailor-progress-step-icon" aria-hidden>
                  {status === "done" ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                </span>
                <span className="tailor-progress-step-label">{step.label}</span>
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            className="tailor-progress-tip"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease: motionEase }}
          >
            {TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function DraftReadyScreen() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="tailor-progress-overlay tailor-progress-overlay--ready" role="status" aria-live="polite">
      <ProgressBackdrop reduceMotion={reduceMotion} />
      <motion.div
        className="tailor-progress-panel tailor-progress-panel--ready"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: motionEase }}
      >
        <motion.div
          className="tailor-progress-ready-burst"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: motionEase }}
          aria-hidden
        >
          <Check className="h-8 w-8" strokeWidth={2.25} />
        </motion.div>
        <h2 className="tailor-progress-title">Draft unlocked</h2>
        <p className="tailor-progress-subtitle">Opening your editor—time to polish and ship.</p>
        <div className="tailor-progress-ready-skeleton" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </motion.div>
    </div>
  );
}

/** Compact in-page loader for /result (same visual system). */
export function ResultProgressScreen({ title, subtitle }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="tailor-progress-overlay tailor-progress-overlay--embed" role="status" aria-live="polite" aria-busy="true">
      <ProgressBackdrop reduceMotion={reduceMotion} />
      <motion.div
        className="tailor-progress-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: motionEase }}
      >
        <div className="tailor-progress-brand">
          <Image
            src="/logo.png"
            alt=""
            width={512}
            height={454}
            className="tailor-progress-logo"
            priority
          />
          <Image
            src="/logo-text.png"
            alt="I Love Resumes"
            width={900}
            height={95}
            className="tailor-progress-wordmark"
            priority
          />
        </div>
        <PhaseStage phase="ai" reduceMotion={reduceMotion} />
        <div className="tailor-progress-copy">
          <p className="tailor-progress-kicker">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Almost there
          </p>
          <h2 className="tailor-progress-title">{title}</h2>
          <p className="tailor-progress-subtitle">{subtitle}</p>
        </div>
        <div className="tailor-progress-ready-skeleton" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </motion.div>
    </div>
  );
}
