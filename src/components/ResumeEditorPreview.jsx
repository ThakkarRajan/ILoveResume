"use client";

import { unescapeHtml } from "../utils/safeHtml";
import { Eye } from "lucide-react";
import { toGithubUrl, toLinkedInUrl, toWebsiteUrl } from "../utils/resumeContactUrls.js";

const norm = (v) => (typeof v === "string" ? v.trim() : "");

const getEduProgram = (edu) =>
  (edu?.program || edu?.degree || edu?.area || edu?.studyType || "").trim() || "";
const getEduSchool = (edu) =>
  (edu?.school || edu?.institution || edu?.university || edu?.college || "").trim() || "";
const getEduLocation = (edu) => (edu?.location || edu?.city || "").trim() || "";
const getEduStart = (edu) => (edu?.start || edu?.startDate || "").trim() || "";
const getEduEnd = (edu) => (edu?.end || edu?.endDate || "").trim() || "";

const getNonEmptyExperiences = (data) => {
  const list = Array.isArray(data?.tailored_experience) ? data.tailored_experience : [];
  return list.filter((exp) => {
    if (!exp || typeof exp !== "object") return false;
    const hl = (exp.highlights || []).filter((h) => norm(h));
    return (
      norm(exp.company) ||
      norm(exp.title) ||
      norm(exp.location) ||
      norm(exp.start) ||
      norm(exp.end) ||
      hl.length > 0
    );
  });
};

const getSkillsEntries = (data) => {
  const skills = data?.tailored_skills;
  if (!skills || typeof skills !== "object" || Array.isArray(skills)) return [];
  return Object.entries(skills).filter(([cat, arr]) => {
    if (!norm(cat)) return false;
    const list = Array.isArray(arr) ? arr : [];
    return list.some((s) => norm(s));
  });
};

const getNonEmptyProjects = (data) => {
  const list = Array.isArray(data?.projects) ? data.projects : [];
  return list.filter((proj) => {
    if (!proj || typeof proj !== "object") return false;
    const techArr = Array.isArray(proj.tech)
      ? proj.tech.filter((t) => norm(t))
      : norm(proj.tech)
        ? [String(proj.tech).trim()]
        : [];
    const hl = (proj.highlights || []).filter((h) => norm(h));
    return norm(proj.title) || techArr.length > 0 || hl.length > 0;
  });
};

const getNonEmptyEducation = (data) => {
  const eduArray = Array.isArray(data?.education)
    ? data.education
    : Object.values(data?.education || {});
  return eduArray.filter((edu) => {
    const program = getEduProgram(edu);
    const school = getEduSchool(edu);
    const location = getEduLocation(edu);
    const start = getEduStart(edu);
    const end = getEduEnd(edu);
    const highlights = Array.isArray(edu?.highlights) ? edu.highlights.filter((h) => norm(h)) : [];
    return !!(program || school || location || start || end || highlights.length);
  });
};

const getNonEmptyCertificates = (data) => {
  const list = Array.isArray(data?.tailored_certificates) ? data.tailored_certificates : [];
  return list.filter((c) => norm(typeof c === "string" ? c : String(c ?? "")));
};

const hasSummary = (data) => norm(data?.tailored_summary).length > 0;
const hasExperience = (data) => getNonEmptyExperiences(data).length > 0;
const hasSkills = (data) => getSkillsEntries(data).length > 0;
const hasProjects = (data) => getNonEmptyProjects(data).length > 0;
const hasEducation = (data) => getNonEmptyEducation(data).length > 0;
const hasCertificates = (data) => getNonEmptyCertificates(data).length > 0;

/** Same segment order and separators as `handleDownloadPDF` in word-download/page.js */
function buildPdfContactSegments(contact) {
  const c = contact || {};
  const segments = [];
  if (norm(c.location)) segments.push({ text: c.location.trim(), url: null });
  if (norm(c.email)) segments.push({ text: c.email.trim(), url: null });
  if (norm(c.website)) {
    const t = c.website.trim();
    segments.push({ text: t, url: toWebsiteUrl(t) });
  }
  if (norm(c.phone)) segments.push({ text: c.phone.trim(), url: null });
  if (norm(c.github)) {
    const t = c.github.trim();
    segments.push({ text: t, url: toGithubUrl(t) });
  }
  if (norm(c.linkedin)) {
    const t = c.linkedin.trim();
    segments.push({ text: t, url: toLinkedInUrl(t) });
  }
  return segments;
}

function PdfSectionHeader({ title }) {
  return (
    <h5 className="mb-1 mt-3 border-b border-black pb-0.5 text-left text-[12pt] font-bold leading-tight text-black first:mt-0">
      {title}
    </h5>
  );
}

function PdfBullet({ children }) {
  return (
    <p className="flex gap-[0.35em] pl-[15px] text-left text-[10pt] leading-[12pt] text-black">
      <span className="shrink-0 select-none" aria-hidden>
        •
      </span>
      <span className="min-w-0 whitespace-pre-wrap">{children}</span>
    </p>
  );
}

export default function ResumeEditorPreview({ data }) {
  if (!data) return null;

  const name = norm(data.name);
  const contactSegments = buildPdfContactSegments(data.contact);
  const summary = norm(data.tailored_summary);
  const experiences = getNonEmptyExperiences(data);
  const skillsPairs = getSkillsEntries(data);
  const projects = getNonEmptyProjects(data);
  const education = getNonEmptyEducation(data);
  const certificates = getNonEmptyCertificates(data);

  const hasBody =
    summary ||
    contactSegments.length ||
    experiences.length ||
    skillsPairs.length ||
    projects.length ||
    education.length ||
    certificates.length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-4 py-2.5">
        <Eye className="h-4 w-4 text-blue-700" strokeWidth={1.75} aria-hidden />
        <h3 className="text-sm font-semibold text-zinc-900">Preview</h3>
      </div>
      <div className="max-h-[min(65vh,680px)] overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
        {/* A4-ish width (~595pt) and side margins similar to PDF (1.0cm) */}
        <div
          className="mx-auto w-full max-w-[595px] bg-white px-[clamp(0.75rem,3vw,28px)] py-[clamp(1.25rem,3vw,28px)] font-serif text-black shadow-md ring-1 ring-zinc-200/80"
          style={{ fontFamily: 'Times, "Times New Roman", Georgia, serif' }}
        >
          {name ? (
            <h4 className="text-center text-[16pt] font-bold leading-tight tracking-tight">{unescapeHtml(name)}</h4>
          ) : (
            <h4 className="text-center text-[16pt] font-bold leading-tight text-zinc-400">Your name</h4>
          )}

          {contactSegments.length > 0 ? (
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-0 text-center text-[10pt] leading-snug text-black">
              {contactSegments.map((seg, i) => (
                <span key={`${seg.text}-${i}`} className="inline-flex items-center">
                  {i > 0 ? <span className="text-black"> | </span> : null}
                  {seg.url ? (
                    <a href={seg.url} className="text-black underline decoration-zinc-400 underline-offset-2">
                      {unescapeHtml(seg.text)}
                    </a>
                  ) : (
                    <span>{unescapeHtml(seg.text)}</span>
                  )}
                </span>
              ))}
            </p>
          ) : (
            <p className="mt-1 text-center text-[10pt] italic text-zinc-400">Contact line (PDF order: location · email · …)</p>
          )}

          {!name && !hasBody && (
            <p className="mt-6 text-center text-[10pt] text-zinc-500">Edit the resume—this page updates like the PDF export.</p>
          )}

          {hasSummary(data) && (
            <section>
              <PdfSectionHeader title="SUMMARY" />
              <p className="mt-1 whitespace-pre-wrap text-left text-[11pt] leading-[14pt] text-black">
                {unescapeHtml(data.tailored_summary || "")}
              </p>
            </section>
          )}

          {hasExperience(data) && (
            <section>
              <PdfSectionHeader title="EXPERIENCE" />
              <div className="mt-1 space-y-3">
                {experiences.map((exp, i) => (
                  <div key={i}>
                    <p className="text-left text-[11pt] font-bold leading-snug text-black">
                      {unescapeHtml(exp.company || "")}{" "}
                      <span className="font-bold">
                        ({unescapeHtml(exp.start || "")} – {unescapeHtml(exp.end || "")})
                      </span>
                    </p>
                    <p className="text-left text-[11pt] italic leading-snug text-black">
                      {unescapeHtml(exp.title || "")} — {unescapeHtml(exp.location || "")}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {(exp.highlights || [])
                        .filter((hl) => norm(hl))
                        .map((hl, j) => (
                          <PdfBullet key={j}>{unescapeHtml(hl)}</PdfBullet>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasSkills(data) && (
            <section>
              <PdfSectionHeader title="TECHNICAL SKILLS" />
              <div className="mt-1 space-y-1">
                {skillsPairs.map(([cat, arr]) => {
                  const list = (Array.isArray(arr) ? arr : []).filter((s) => norm(s));
                  return (
                    <p key={cat} className="text-left text-[11pt] leading-snug text-black">
                      <strong>{unescapeHtml(cat)}:</strong>{" "}
                      {list.map((s) => unescapeHtml(s)).join(", ")}
                    </p>
                  );
                })}
              </div>
            </section>
          )}

          {hasProjects(data) && (
            <section>
              <PdfSectionHeader title="PROJECTS" />
              <div className="mt-1 space-y-3">
                {projects.map((proj, i) => {
                  const techArray = Array.isArray(proj.tech)
                    ? proj.tech.filter((t) => norm(t))
                    : (proj.tech || "")
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                  const techPart =
                    techArray.length > 0
                      ? ` | Tech: ${techArray.map((t) => unescapeHtml(t)).join(", ")}`
                      : "";
                  return (
                    <div key={i}>
                      <p className="text-left text-[11pt] font-bold leading-snug text-black">
                        {unescapeHtml(proj.title || "")}
                        {techPart ? <span className="font-bold">{techPart}</span> : null}
                      </p>
                      <div className="mt-1 space-y-0.5">
                        {(proj.highlights || [])
                          .filter((hl) => norm(hl))
                          .map((hl, j) => (
                            <PdfBullet key={j}>{unescapeHtml(hl)}</PdfBullet>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {hasEducation(data) && (
            <section>
              <PdfSectionHeader title="EDUCATION" />
              <div className="mt-1 space-y-2">
                {education.map((edu, i) => {
                  const program = getEduProgram(edu);
                  const school = getEduSchool(edu);
                  const location = getEduLocation(edu);
                  const start = getEduStart(edu);
                  const end = getEduEnd(edu);
                  return (
                    <div key={i}>
                      <p className="text-left text-[11pt] font-bold leading-snug text-black">
                        {unescapeHtml(program)} ({unescapeHtml(start)} – {unescapeHtml(end)})
                      </p>
                      <p className="text-left text-[11pt] italic leading-snug text-black">
                        {unescapeHtml(school)} — {unescapeHtml(location)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {hasCertificates(data) && (
            <section>
              <PdfSectionHeader title="CERTIFICATES" />
              <div className="mt-1 space-y-0.5">
                {certificates.map((c, i) => (
                  <PdfBullet key={i}>{unescapeHtml(typeof c === "string" ? c : String(c))}</PdfBullet>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
