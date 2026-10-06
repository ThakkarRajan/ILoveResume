"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts, PDFName, PDFString } from "pdf-lib";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
} from "docx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  FileImage,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";
import AppPageLayout from "../../components/ui/AppPageLayout";
import AppPageHeader from "../../components/ui/AppPageHeader";
import ExportAccessGate, { canExportResume } from "../../components/legal/ExportAccessGate";
import "../../utils/firebase.js";
import { toGithubUrl, toLinkedInUrl, toWebsiteUrl } from "../../utils/resumeContactUrls.js";

const getEduProgram = (edu) => (edu?.program || edu?.degree || edu?.area || edu?.studyType || "").trim() || "";
const getEduSchool = (edu) => (edu?.school || edu?.institution || edu?.university || edu?.college || "").trim() || "";
const getEduLocation = (edu) => (edu?.location || edu?.city || "").trim() || "";
const getEduStart = (edu) => (edu?.start || edu?.startDate || "").trim() || "";
const getEduEnd = (edu) => (edu?.end || edu?.endDate || "").trim() || "";

const norm = (v) => (typeof v === "string" ? v.trim() : "");

/**
 * pdf-lib StandardFonts use WinAnsi. Newlines + many Unicode glyphs throw
 * "WinAnsi cannot encode" and abort PDF generation.
 */
const toPdfSafeText = (raw) =>
  String(raw ?? "")
    .replace(/\r\n|\r|\n|\t/g, " ")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u2022\u25CF\u25E6\u00B7]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "")
    .replace(/ {2,}/g, " ")
    .trim();

/** Non-empty sections only — used by Word + PDF export */
const hasSummary = (data) => norm(data?.tailored_summary).length > 0;

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

const hasExperience = (data) => getNonEmptyExperiences(data).length > 0;

const getSkillsEntries = (data) => {
  const skills = data?.tailored_skills;
  if (!skills || typeof skills !== "object" || Array.isArray(skills)) return [];
  return Object.entries(skills).filter(([cat, arr]) => {
    if (!norm(cat)) return false;
    const list = Array.isArray(arr) ? arr : [];
    return list.some((s) => norm(s));
  });
};

const hasSkills = (data) => getSkillsEntries(data).length > 0;

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

const hasProjects = (data) => getNonEmptyProjects(data).length > 0;

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

const hasEducation = (data) => getNonEmptyEducation(data).length > 0;

const getNonEmptyCertificates = (data) => {
  const list = Array.isArray(data?.tailored_certificates) ? data.tailored_certificates : [];
  return list.filter((c) => norm(typeof c === "string" ? c : String(c ?? "")));
};

const hasCertificates = (data) => getNonEmptyCertificates(data).length > 0;

export default function WordDownloadPage() {
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [downloadType, setDownloadType] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tailoredResume");
      if (!stored) throw new Error("No resume data found.");
      const parsed = JSON.parse(stored);
      setResumeData(parsed);
      generateAndSetPdf(parsed).catch(() => {
        setError("Failed to prepare PDF preview. You can still try Download PDF.");
      });
    } catch (err) {
      setError("Failed to load resume. Redirecting...");
      setTimeout(() => router.push("/result"), 1500);
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const generateDocx = () => {
    const sectionHeader = (text) => [
      new Paragraph({
        spacing: { before: 200, after: 0 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 8,
            color: "000000",
          },
        },
        children: [new TextRun({ text, bold: true, size: 24 })],
      }),
    ];

    const sections = [];

    if (norm(resumeData.name)) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: resumeData.name, bold: true, size: 40 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        })
      );
    }

    const sep = () => new TextRun({ text: " | ", size: 20 });
    const contactChildren = [];
    const contact = resumeData.contact || {};
    const addPart = (child) => {
      if (contactChildren.length) contactChildren.push(sep());
      contactChildren.push(child);
    };
    if (contact.location) addPart(new TextRun({ text: contact.location, size: 20 }));
    if (contact.email) addPart(new TextRun({ text: contact.email, size: 20 }));
    if (contact.website) {
      const url = toWebsiteUrl(contact.website);
      addPart(
        url
          ? new ExternalHyperlink({
              children: [new TextRun({ text: contact.website, size: 20, style: "Hyperlink" })],
              link: url,
            })
          : new TextRun({ text: contact.website, size: 20 })
      );
    }
    if (contact.phone) addPart(new TextRun({ text: contact.phone, size: 20 }));
    if (contact.github) {
      const url = toGithubUrl(contact.github);
      addPart(
        url
          ? new ExternalHyperlink({
              children: [new TextRun({ text: contact.github, size: 20, style: "Hyperlink" })],
              link: url,
            })
          : new TextRun({ text: contact.github, size: 20 })
      );
    }
    if (contact.linkedin) {
      const url = toLinkedInUrl(contact.linkedin);
      addPart(
        url
          ? new ExternalHyperlink({
              children: [new TextRun({ text: contact.linkedin, size: 20, style: "Hyperlink" })],
              link: url,
            })
          : new TextRun({ text: contact.linkedin, size: 20 })
      );
    }

    if (contactChildren.length) sections.push(
      new Paragraph({
        children: contactChildren,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    if (hasSummary(resumeData)) {
      sections.push(...sectionHeader("SUMMARY"));
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: resumeData.tailored_summary || "", size: 20 })],
        })
      );
    }

    if (hasExperience(resumeData)) {
      sections.push(...sectionHeader("EXPERIENCE"));
      getNonEmptyExperiences(resumeData).forEach((exp) => {
        sections.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: exp.company || "", size: 20 }),
              new TextRun({
                text: `\t${exp.start || ""} – ${exp.end || ""}`,
                bold: true,
                size: 20,
              }),
            ],
          })
        );
        sections.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: exp.title || "", size: 20 }),
              new TextRun({ text: `\t${exp.location || ""}`, size: 20 }),
            ],
          })
        );
        (exp.highlights || [])
          .filter((hl) => norm(hl))
          .forEach((hl) =>
            sections.push(
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: hl, size: 20 })],
              })
            )
          );
      });
    }

    if (hasSkills(resumeData)) {
      sections.push(...sectionHeader("SKILLS"));
      getSkillsEntries(resumeData).forEach(([cat, skills]) => {
        const list = (Array.isArray(skills) ? skills : []).filter((s) => norm(s));
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${cat}: `, bold: true, size: 20 }),
              new TextRun({ text: list.join(", "), size: 20 }),
            ],
          })
        );
      });
    }

    if (hasProjects(resumeData)) {
      sections.push(...sectionHeader("PROJECTS"));
      getNonEmptyProjects(resumeData).forEach((proj) => {
        const techStr = Array.isArray(proj.tech)
          ? `Tech: ${proj.tech.filter((t) => norm(t)).join(", ")}`
          : norm(proj.tech)
            ? `Tech: ${proj.tech}`
            : "";
        sections.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: proj.title || "", bold: true, size: 20 }),
              new TextRun({ text: techStr ? `\t${techStr}` : "", size: 20 }),
            ],
          })
        );
        (proj.highlights || [])
          .filter((hl) => norm(hl))
          .forEach((hl) =>
            sections.push(
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: hl, size: 20 })],
              })
            )
          );
      });
    }

    if (hasEducation(resumeData)) {
      sections.push(...sectionHeader("EDUCATION"));
      getNonEmptyEducation(resumeData).forEach((edu) => {
        const program = getEduProgram(edu);
        const school = getEduSchool(edu);
        const location = getEduLocation(edu);
        const start = getEduStart(edu);
        const end = getEduEnd(edu);
        sections.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: program, italics: true, size: 20 }),
              new TextRun({
                text: `\t${start} – ${end}`,
                bold: true,
                size: 20,
              }),
            ],
          })
        );
        sections.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: school, bold: true, size: 20 }),
              new TextRun({ text: `\t${location}`, italics: true, size: 20 }),
            ],
          })
        );
      });
    }

    if (hasCertificates(resumeData)) {
      sections.push(...sectionHeader("CERTIFICATES"));
      getNonEmptyCertificates(resumeData).forEach((cert) => {
        sections.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: cert, size: 20 })],
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 567,
                bottom: 567,
                left: 1078,
                right: 1078,
                gutter: 0,
              },
            },
          },
          children: sections,
        },
      ],
    });
    return doc;
  };

  const generateAndSetPdf = async (data) => {
    const CM_TO_PT = 28.35;
    const MARGIN_TOP = CM_TO_PT * 1;
    const MARGIN_BOTTOM = CM_TO_PT * 1;
    const MARGIN_LEFT = CM_TO_PT * 1.0;
    const MARGIN_RIGHT = CM_TO_PT * 1.0;
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const usableWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    const LINE_SPACING = 12;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;
    const newPage = () => {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN_TOP;
    };

    const drawText = (text, opts = {}) => {
      const {
        size = 11,
        bold = false,
        italics = false,
        indent = 0,
        maxWidth = usableWidth,
        align = "left",
      } = opts;
      const safe = toPdfSafeText(text);
      if (!safe) return;
      const textFont = italics ? italicFont : bold ? boldFont : font;
      const words = safe.split(" ");
      let line = "";

      words.forEach((word, i) => {
        const testLine = line ? `${line} ${word}` : word;
        const testWidth = textFont.widthOfTextAtSize(testLine, size);

        if (testWidth > maxWidth && line) {
          if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
          const lineWidth = textFont.widthOfTextAtSize(line, size);
          const x0 =
            align === "center"
              ? MARGIN_LEFT + (usableWidth - lineWidth) / 2
              : MARGIN_LEFT + indent;
          page.drawText(line, {
            x: x0,
            y,
            size,
            font: textFont,
            color: rgb(0, 0, 0),
          });
          y -= LINE_SPACING;
          line = word;
        } else {
          line = testLine;
        }

        if (i === words.length - 1 && line) {
          if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
          const lineWidth = textFont.widthOfTextAtSize(line, size);
          const x0 =
            align === "center"
              ? MARGIN_LEFT + (usableWidth - lineWidth) / 2
              : MARGIN_LEFT + indent;
          page.drawText(line, {
            x: x0,
            y,
            size,
            font: textFont,
            color: rgb(0, 0, 0),
          });
          y -= LINE_SPACING;
        }
      });
    };

    const sectionHeader = (title) => {
      y -= 4;
      if (y < MARGIN_BOTTOM + LINE_SPACING * 3) newPage();
      drawText(title, { size: 12, bold: true });
      page.drawLine({
        start: { x: MARGIN_LEFT, y: y + 4 },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: y + 4 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      y -= 8;
    };

    if (norm(data.name)) {
      drawText(data.name, { size: 16, bold: true, align: "center" });
    }
    const contact = data.contact || {};
    const contactSegments = [];
    if (contact.location) contactSegments.push({ text: contact.location });
    if (contact.email) contactSegments.push({ text: contact.email });
    if (contact.website) {
      const url = toWebsiteUrl(contact.website);
      contactSegments.push({ text: contact.website, url });
    }
    if (contact.phone) contactSegments.push({ text: contact.phone });
    if (contact.github) {
      const url = toGithubUrl(contact.github);
      contactSegments.push({ text: contact.github, url });
    }
    if (contact.linkedin) {
      const url = toLinkedInUrl(contact.linkedin);
      contactSegments.push({ text: contact.linkedin, url });
    }
    if (contactSegments.length) {
      const size = 10;
      const sep = " | ";
      const sepWidth = font.widthOfTextAtSize(sep, size);
      const safeSegments = contactSegments
        .map((s) => ({ ...s, text: toPdfSafeText(s.text) }))
        .filter((s) => s.text);
      let totalWidth = Math.max(0, safeSegments.length - 1) * sepWidth;
      safeSegments.forEach((s) => {
        totalWidth += font.widthOfTextAtSize(s.text, size);
      });
      let x = MARGIN_LEFT + (usableWidth - totalWidth) / 2;
      if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
      const linkRefs = [];
      safeSegments.forEach((seg, i) => {
        if (i) x += sepWidth;
        const w = font.widthOfTextAtSize(seg.text, size);
        page.drawText(seg.text, { x, y, size, font, color: rgb(0, 0, 0) });
        if (seg.url) {
          const linkAnnot = pdfDoc.context.obj({
            Type: PDFName.of("Annot"),
            Subtype: PDFName.of("Link"),
            Rect: [x, y - 2, x + w, y + size + 2],
            Border: [0, 0, 0],
            A: {
              Type: PDFName.of("Action"),
              S: PDFName.of("URI"),
              URI: PDFString.of(seg.url),
            },
          });
          linkRefs.push(pdfDoc.context.register(linkAnnot));
        }
        x += w;
      });
      if (linkRefs.length) {
        page.node.set(PDFName.of("Annots"), pdfDoc.context.obj(linkRefs));
      }
      y -= LINE_SPACING;
    }

    if (hasSummary(data)) {
      sectionHeader("SUMMARY");
      drawText(data.tailored_summary || "", { size: 11 });
    }

    if (hasExperience(data)) {
      sectionHeader("EXPERIENCE");
      getNonEmptyExperiences(data).forEach((exp) => {
        drawText(`${exp.company || ""} (${exp.start || ""} - ${exp.end || ""})`, {
          size: 11,
          bold: true,
        });
        drawText(`${exp.title || ""} - ${exp.location || ""}`, { size: 11, italics: true });
        (exp.highlights || [])
          .filter((hl) => norm(hl))
          .forEach((hl) => drawText(`-  ${hl}`, { size: 10, indent: 15 }));
        y -= 4;
      });
    }

    if (hasSkills(data)) {
      sectionHeader("SKILLS");
      getSkillsEntries(data).forEach(([cat, skills]) => {
        const list = (Array.isArray(skills) ? skills : []).filter((s) => norm(s));
        const label = toPdfSafeText(`${cat}:`);
        const rest = toPdfSafeText(list.join(", "));
        if (!label && !rest) return;
        if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
        const size = 11;
        if (label) {
          page.drawText(label, {
            x: MARGIN_LEFT,
            y,
            size,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
        }
        if (rest) {
          const labelWidth = label ? boldFont.widthOfTextAtSize(`${label} `, size) : 0;
          const words = rest.split(" ");
          let line = "";
          let xPad = labelWidth;
          words.forEach((word, i) => {
            const testLine = line ? `${line} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, size);
            if (testWidth > usableWidth - xPad && line) {
              page.drawText(line, {
                x: MARGIN_LEFT + xPad,
                y,
                size,
                font,
                color: rgb(0, 0, 0),
              });
              y -= LINE_SPACING;
              if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
              xPad = 0;
              line = word;
            } else {
              line = testLine;
            }
            if (i === words.length - 1 && line) {
              page.drawText(line, {
                x: MARGIN_LEFT + xPad,
                y,
                size,
                font,
                color: rgb(0, 0, 0),
              });
              y -= LINE_SPACING;
            }
          });
        } else {
          y -= LINE_SPACING;
        }
      });
    }

    if (hasProjects(data)) {
      sectionHeader("PROJECTS");
      getNonEmptyProjects(data).forEach((proj) => {
        const techArray = Array.isArray(proj.tech)
          ? proj.tech.filter((t) => norm(t))
          : (proj.tech || "").split(",").map((t) => t.trim()).filter(Boolean);
        const techPart = techArray.length ? ` | Tech: ${techArray.join(", ")}` : "";
        drawText(`${proj.title || ""}${techPart}`, { size: 11, bold: true });
        (proj.highlights || [])
          .filter((hl) => norm(hl))
          .forEach((hl) => drawText(`-  ${hl}`, { size: 10, indent: 15 }));
        y -= 4;
      });
    }

    if (hasEducation(data)) {
      sectionHeader("EDUCATION");
      getNonEmptyEducation(data).forEach((edu) => {
        const program = getEduProgram(edu);
        const school = getEduSchool(edu);
        const location = getEduLocation(edu);
        const start = getEduStart(edu);
        const end = getEduEnd(edu);
        drawText(`${program} (${start} - ${end})`, { size: 11, bold: true });
        drawText(`${school} - ${location}`, { size: 11, italics: true });
        (edu.highlights || [])
          .filter((hl) => norm(hl))
          .forEach((hl) => drawText(`-  ${hl}`, { size: 10, indent: 15 }));
      });
    }

    if (hasCertificates(data)) {
      sectionHeader("CERTIFICATES");
      getNonEmptyCertificates(data).forEach((cert) =>
        drawText(`-  ${cert}`, { size: 10, indent: 15 })
      );
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const handleDownloadWord = async () => {
    if (!resumeData || !canExportResume(user)) return;
    setLoading(true);
    setDownloadType("word");
    
    try {
      const doc = generateDocx();
      const blob = await Packer.toBlob(doc);
      const firstName = resumeData.name?.split(' ')[0] || 'resume';
      const fileName = `${firstName}_resume.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      setError("Failed to generate Word document. Please try again.");
    } finally {
      setLoading(false);
      setDownloadType("");
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeData || !canExportResume(user)) return;
    setLoading(true);
    setDownloadType("pdf");

    try {
      const CM_TO_PT = 28.35;
      const MARGIN_TOP = CM_TO_PT * 1;
      const MARGIN_BOTTOM = CM_TO_PT * 1;
      const MARGIN_LEFT = CM_TO_PT * 1.0;
      const MARGIN_RIGHT = CM_TO_PT * 1.0;
      const PAGE_WIDTH = 595.28;
      const PAGE_HEIGHT = 841.89;
      const usableWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
      const LINE_SPACING = 12;

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

      let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = PAGE_HEIGHT - MARGIN_TOP;

      const newPage = () => {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN_TOP;
      };

      const drawText = (text, opts = {}) => {
        const {
          size = 11,
          bold = false,
          italics = false,
          indent = 0,
          maxWidth = usableWidth,
          align = "left",
        } = opts;
        const safe = toPdfSafeText(text);
        if (!safe) return;
        const textFont = italics ? italicFont : bold ? boldFont : font;
        const words = safe.split(" ");
        let line = "";

        words.forEach((word, i) => {
          const testLine = line ? `${line} ${word}` : word;
          const testWidth = textFont.widthOfTextAtSize(testLine, size);

          if (testWidth > maxWidth && line) {
            if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
            const lineWidth = textFont.widthOfTextAtSize(line, size);
            const x0 =
              align === "center"
                ? MARGIN_LEFT + (usableWidth - lineWidth) / 2
                : MARGIN_LEFT + indent;
            page.drawText(line, {
              x: x0,
              y,
              size,
              font: textFont,
              color: rgb(0, 0, 0),
            });
            y -= LINE_SPACING;
            line = word;
          } else {
            line = testLine;
          }

          if (i === words.length - 1 && line) {
            if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
            const lineWidth = textFont.widthOfTextAtSize(line, size);
            const x0 =
              align === "center"
                ? MARGIN_LEFT + (usableWidth - lineWidth) / 2
                : MARGIN_LEFT + indent;
            page.drawText(line, {
              x: x0,
              y,
              size,
              font: textFont,
              color: rgb(0, 0, 0),
            });
            y -= LINE_SPACING;
          }
        });
      };

      const sectionHeader = (title) => {
        y -= 4;
        if (y < MARGIN_BOTTOM + LINE_SPACING * 3) newPage();
        drawText(title, { size: 12, bold: true });
        page.drawLine({
          start: { x: MARGIN_LEFT, y: y + 4 },
          end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: y + 4 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        y -= 8;
      };

      if (norm(resumeData.name)) {
        drawText(resumeData.name, { size: 16, bold: true, align: "center" });
      }
      const contact = resumeData.contact || {};
      const contactSegments = [];
      if (contact.location) contactSegments.push({ text: contact.location });
      if (contact.email) contactSegments.push({ text: contact.email });
      if (contact.website) {
        const url = toWebsiteUrl(contact.website);
        contactSegments.push({ text: contact.website, url });
      }
      if (contact.phone) contactSegments.push({ text: contact.phone });
      if (contact.github) {
        const url = toGithubUrl(contact.github);
        contactSegments.push({ text: contact.github, url });
      }
      if (contact.linkedin) {
        const url = toLinkedInUrl(contact.linkedin);
        contactSegments.push({ text: contact.linkedin, url });
      }
      if (contactSegments.length) {
        const size = 10;
        const sep = " | ";
        const sepWidth = font.widthOfTextAtSize(sep, size);
        const safeSegments = contactSegments
          .map((s) => ({ ...s, text: toPdfSafeText(s.text) }))
          .filter((s) => s.text);
        let totalWidth = Math.max(0, safeSegments.length - 1) * sepWidth;
        safeSegments.forEach((s) => {
          totalWidth += font.widthOfTextAtSize(s.text, size);
        });
        let x = MARGIN_LEFT + (usableWidth - totalWidth) / 2;
        if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
        const linkRefs = [];
        safeSegments.forEach((seg, i) => {
          if (i) x += sepWidth;
          const w = font.widthOfTextAtSize(seg.text, size);
          page.drawText(seg.text, { x, y, size, font, color: rgb(0, 0, 0) });
          if (seg.url) {
            const linkAnnot = pdfDoc.context.obj({
              Type: PDFName.of("Annot"),
              Subtype: PDFName.of("Link"),
              Rect: [x, y - 2, x + w, y + size + 2],
              Border: [0, 0, 0],
              A: {
                Type: PDFName.of("Action"),
                S: PDFName.of("URI"),
                URI: PDFString.of(seg.url),
              },
            });
            linkRefs.push(pdfDoc.context.register(linkAnnot));
          }
          x += w;
        });
        if (linkRefs.length) {
          page.node.set(PDFName.of("Annots"), pdfDoc.context.obj(linkRefs));
        }
        y -= LINE_SPACING;
      }

      if (hasSummary(resumeData)) {
        sectionHeader("SUMMARY");
        drawText(resumeData.tailored_summary || "", { size: 11 });
      }

      if (hasExperience(resumeData)) {
        sectionHeader("EXPERIENCE");
        getNonEmptyExperiences(resumeData).forEach((exp) => {
          drawText(`${exp.company || ""} (${exp.start || ""} - ${exp.end || ""})`, {
            size: 11,
            bold: true,
          });
          drawText(`${exp.title || ""} - ${exp.location || ""}`, { size: 11, italics: true });
          (exp.highlights || [])
            .filter((hl) => norm(hl))
            .forEach((hl) => drawText(`-  ${hl}`, { size: 10, indent: 15 }));
          y -= 4;
        });
      }

      if (hasSkills(resumeData)) {
        sectionHeader("SKILLS");
        getSkillsEntries(resumeData).forEach(([cat, skills]) => {
          const list = (Array.isArray(skills) ? skills : []).filter((s) => norm(s));
          const label = toPdfSafeText(`${cat}:`);
          const rest = toPdfSafeText(list.join(", "));
          if (!label && !rest) return;
          if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
          const size = 11;
          if (label) {
            page.drawText(label, {
              x: MARGIN_LEFT,
              y,
              size,
              font: boldFont,
              color: rgb(0, 0, 0),
            });
          }
          if (rest) {
            const labelWidth = label ? boldFont.widthOfTextAtSize(`${label} `, size) : 0;
            const words = rest.split(" ");
            let line = "";
            let xPad = labelWidth;
            words.forEach((word, i) => {
              const testLine = line ? `${line} ${word}` : word;
              const testWidth = font.widthOfTextAtSize(testLine, size);
              if (testWidth > usableWidth - xPad && line) {
                page.drawText(line, {
                  x: MARGIN_LEFT + xPad,
                  y,
                  size,
                  font,
                  color: rgb(0, 0, 0),
                });
                y -= LINE_SPACING;
                if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
                xPad = 0;
                line = word;
              } else {
                line = testLine;
              }
              if (i === words.length - 1 && line) {
                page.drawText(line, {
                  x: MARGIN_LEFT + xPad,
                  y,
                  size,
                  font,
                  color: rgb(0, 0, 0),
                });
                y -= LINE_SPACING;
              }
            });
          } else {
            y -= LINE_SPACING;
          }
        });
      }

      if (hasProjects(resumeData)) {
        sectionHeader("PROJECTS");
        getNonEmptyProjects(resumeData).forEach((proj) => {
          const techArray = Array.isArray(proj.tech)
            ? proj.tech.filter((t) => norm(t))
            : (proj.tech || "").split(",").map((t) => t.trim()).filter(Boolean);
          const techPart = techArray.length ? ` | Tech: ${techArray.join(", ")}` : "";
          drawText(`${proj.title || ""}${techPart}`, { size: 11, bold: true });
          (proj.highlights || [])
            .filter((hl) => norm(hl))
            .forEach((hl) => drawText(`-  ${hl}`, { size: 10, indent: 15 }));
          y -= 4;
        });
      }

      if (hasEducation(resumeData)) {
        sectionHeader("EDUCATION");
        getNonEmptyEducation(resumeData).forEach((edu) => {
          const program = getEduProgram(edu);
          const school = getEduSchool(edu);
          const location = getEduLocation(edu);
          const start = getEduStart(edu);
          const end = getEduEnd(edu);
          drawText(`${program} (${start} - ${end})`, { size: 11, bold: true });
          drawText(`${school} - ${location}`, { size: 11, italics: true });
          (edu.highlights || [])
            .filter((hl) => norm(hl))
            .forEach((hl) => drawText(`-  ${hl}`, { size: 10, indent: 15 }));
        });
      }

      if (hasCertificates(resumeData)) {
        sectionHeader("CERTIFICATES");
        getNonEmptyCertificates(resumeData).forEach((cert) =>
          drawText(`-  ${cert}`, { size: 10, indent: 15 })
        );
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      const firstName = resumeData.name?.split(' ')[0] || 'resume';
      const fileName = `${firstName}_resume.pdf`;
      saveAs(blob, fileName);
    } catch (error) {
      setError("Failed to generate PDF document. Please try again.");
    } finally {
      setLoading(false);
      setDownloadType("");
    }
  };

  if (!resumeData && !error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
          <p className="text-sm font-medium text-[var(--foreground)]">Preparing download…</p>
        </motion.div>
      </div>
    );
  }

  const exportUnlocked = canExportResume(user);
  const resumeName = (resumeData?.name || "").trim() || "Your resume";

  return (
    <AppPageLayout className="page-canvas-grid">
      <div className="mx-auto max-w-5xl">
        <AppPageHeader
          eyebrow="Export"
          title="Download your resume"
          description="Pick a format. Word for edits; PDF when they want a fixed file."
          actions={
            <button type="button" onClick={() => router.push("/result")} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back to editor
            </button>
          }
        />

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" strokeWidth={1.75} />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </motion.div>
        ) : null}

        {!exportUnlocked ? (
          <div className="mb-4">
            <ExportAccessGate
              idPrefix="word-download"
              user={user}
              onUserChange={setUser}
              title="Before you download"
              description="Accept terms and sign in to unlock Word and PDF."
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Stage — context */}
          <motion.aside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="panel min-w-0 lg:col-span-5"
          >
            <div className="panel-body flex h-full flex-col gap-4">
              <div>
                <p className="eyebrow mb-1">Ready to export</p>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {resumeName}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  File uses the latest edits from the editor. Prefer Word for ATS tweaks; use PDF when the posting asks for it.
                </p>
              </div>

              <ul className="mt-auto space-y-2.5 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2} />
                  <span>Layout stays clean and recruiter-readable</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2} />
                  <span>Usually ready in a few seconds</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2} />
                  <span>Standard .docx and PDF</span>
                </li>
              </ul>
            </div>
          </motion.aside>

          {/* Actions */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="panel min-w-0 lg:col-span-7"
          >
            <div className="panel-body space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Choose format</h3>
                {!exportUnlocked ? (
                  <span className="badge badge-info">Locked</span>
                ) : (
                  <span className="badge badge-success">Unlocked</span>
                )}
              </div>

              {!exportUnlocked ? (
                <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--text-secondary)]">
                  Complete terms + sign-in above to enable downloads.
                </p>
              ) : null}

              <div className={`space-y-3 ${exportUnlocked ? "" : "pointer-events-none opacity-50"}`}>
                {/* Word — primary */}
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-muted)] ring-1 ring-[var(--accent-subtle)]">
                        <FileText className="h-5 w-5 text-[var(--accent-hover)]" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-semibold text-[var(--foreground)]">Word (.docx)</h4>
                          <span className="rounded-md bg-[var(--accent-muted)] px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--accent-hover)]">
                            Recommended
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                          Editable · ATS-friendly · best for most applications
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadWord}
                      disabled={loading || !exportUnlocked}
                      className="btn btn-primary w-full shrink-0 sm:w-auto"
                    >
                      {loading && downloadType === "word" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" strokeWidth={1.75} />
                          Download Word
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* PDF — secondary */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-[var(--border)]">
                        <FileImage className="h-5 w-5 text-[var(--foreground)]" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-[var(--foreground)]">PDF</h4>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                          Print-ready · fixed layout · when the employer asks
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      disabled={loading || !exportUnlocked}
                      className="btn btn-secondary w-full shrink-0 sm:w-auto"
                    >
                      {loading && downloadType === "pdf" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" strokeWidth={1.75} />
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {pdfUrl ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="border-t border-[var(--border)] pt-4"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[var(--muted)]" strokeWidth={1.75} />
                      <h4 className="text-sm font-semibold text-[var(--foreground)]">PDF preview</h4>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-inset)]">
                      <iframe src={pdfUrl} title="PDF Preview" className="h-80 w-full border-0 sm:h-96" />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        <div className="mt-5 border-t border-[var(--border)] pt-3 pb-2">
          <SiteLegalLinks />
        </div>
      </div>
    </AppPageLayout>
  );
}
