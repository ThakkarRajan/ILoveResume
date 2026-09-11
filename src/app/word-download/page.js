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
  Clock,
  Zap
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
      generateAndSetPdf(parsed);
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
      sections.push(...sectionHeader("TECHNICAL SKILLS"));
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
    const MARGIN_LEFT = CM_TO_PT * 1.9;
    const MARGIN_RIGHT = CM_TO_PT * 1.9;
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
      const textFont = italics ? italicFont : bold ? boldFont : font;
      const words = text.split(" ");
      let line = "";

      words.forEach((word, i) => {
        const testLine = line ? `${line} ${word}` : word;
        const testWidth = textFont.widthOfTextAtSize(testLine, size);

        if (testWidth > maxWidth) {
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

        if (i === words.length - 1) {
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
      let totalWidth = (contactSegments.length - 1) * sepWidth;
      contactSegments.forEach((s) => {
        totalWidth += font.widthOfTextAtSize(s.text, size);
      });
      let x = MARGIN_LEFT + (usableWidth - totalWidth) / 2;
      if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
      const linkRefs = [];
      contactSegments.forEach((seg, i) => {
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
        drawText(`${exp.company || ""} (${exp.start || ""} – ${exp.end || ""})`, {
          size: 11,
          bold: true,
        });
        drawText(`${exp.title || ""} — ${exp.location || ""}`, { size: 11, italics: true });
        (exp.highlights || [])
          .filter((hl) => norm(hl))
          .forEach((hl) => drawText(`•     ${hl}`, { size: 10, indent: 15 }));
        y -= 4;
      });
    }

    if (hasSkills(data)) {
      sectionHeader("TECHNICAL SKILLS");
      getSkillsEntries(data).forEach(([cat, skills]) => {
        const list = (Array.isArray(skills) ? skills : []).filter((s) => norm(s));
        drawText(`${cat}: ${list.join(", ")}`, { size: 11 });
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
          .forEach((hl) => drawText(`•     ${hl}`, { size: 10, indent: 15 }));
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
        drawText(`${program} (${start} – ${end})`, { size: 11, bold: true });
        drawText(`${school} — ${location}`, { size: 11, italics: true });
      });
    }

    if (hasCertificates(data)) {
      sectionHeader("CERTIFICATES");
      getNonEmptyCertificates(data).forEach((cert) =>
        drawText(`•     ${cert}`, { size: 10, indent: 15 })
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
      const MARGIN_LEFT = CM_TO_PT * 1.9;
      const MARGIN_RIGHT = CM_TO_PT * 1.9;
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
        const textFont = italics ? italicFont : bold ? boldFont : font;
        const words = text.split(" ");
        let line = "";

        words.forEach((word, i) => {
          const testLine = line ? `${line} ${word}` : word;
          const testWidth = textFont.widthOfTextAtSize(testLine, size);

          if (testWidth > maxWidth) {
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

          if (i === words.length - 1) {
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
        let totalWidth = (contactSegments.length - 1) * sepWidth;
        contactSegments.forEach((s) => {
          totalWidth += font.widthOfTextAtSize(s.text, size);
        });
        let x = MARGIN_LEFT + (usableWidth - totalWidth) / 2;
        if (y < MARGIN_BOTTOM + LINE_SPACING) newPage();
        const linkRefs = [];
        contactSegments.forEach((seg, i) => {
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
          drawText(`${exp.company || ""} (${exp.start || ""} – ${exp.end || ""})`, {
            size: 11,
            bold: true,
          });
          drawText(`${exp.title || ""} — ${exp.location || ""}`, { size: 11, italics: true });
          (exp.highlights || [])
            .filter((hl) => norm(hl))
            .forEach((hl) => drawText(`•     ${hl}`, { size: 10, indent: 15 }));
          y -= 4;
        });
      }

      if (hasSkills(resumeData)) {
        sectionHeader("TECHNICAL SKILLS");
        getSkillsEntries(resumeData).forEach(([cat, skills]) => {
          const list = (Array.isArray(skills) ? skills : []).filter((s) => norm(s));
          drawText(`${cat}: ${list.join(", ")}`, { size: 11 });
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
            .forEach((hl) => drawText(`•     ${hl}`, { size: 10, indent: 15 }));
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
          drawText(`${program} (${start} – ${end})`, { size: 11, bold: true });
          drawText(`${school} — ${location}`, { size: 11, italics: true });
        });
      }

      if (hasCertificates(resumeData)) {
        sectionHeader("CERTIFICATES");
        getNonEmptyCertificates(resumeData).forEach((cert) =>
          drawText(`•     ${cert}`, { size: 10, indent: 15 })
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] sm:mb-5 sm:h-12 sm:w-12" />
          <p className="text-sm font-medium text-[var(--foreground)] sm:text-base">Preparing download…</p>
        </motion.div>
      </div>
    );
  }

  const exportUnlocked = canExportResume(user);

  return (
    <AppPageLayout>
      <div className="mx-auto max-w-3xl">
        <AppPageHeader
          eyebrow="Export"
          title="Download your resume"
          description="Word for edits and ATS-friendly tweaks; PDF when the employer asks for a fixed layout."
          actions={
            <button type="button" onClick={() => router.push("/result")} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back to editor
            </button>
          }
        />

        {!exportUnlocked ? (
          <div className="mb-8">
            <ExportAccessGate idPrefix="word-download" user={user} onUserChange={setUser} />
          </div>
        ) : null}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 max-w-md rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="panel w-full"
        >
          <div className="panel-body">
          {!exportUnlocked ? (
            <p className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              Complete the terms and sign-in step above to unlock Word and PDF downloads.
            </p>
          ) : null}
          {/* Download Options */}
          <div className={`grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8 md:grid-cols-2 ${exportUnlocked ? "" : "pointer-events-none opacity-50"}`}>
            {/* Word Document */}
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white ring-1 ring-zinc-200">
                  <FileText className="h-6 w-6 text-zinc-700" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Word Document</h3>
                  <p className="text-gray-600 text-sm">Editable format</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Fully editable in Word</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Clean, recruiter-ready layout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ATS-friendly</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadWord}
                disabled={loading || !exportUnlocked}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 px-6 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 ${
                  loading && downloadType === "word" ? "cursor-not-allowed bg-zinc-400" : "bg-zinc-900 hover:bg-zinc-800"
                }`}
              >
                {loading && downloadType === "word" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Generating…</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Word</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* PDF Document */}
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <FileImage className="h-6 w-6 text-[var(--accent)]" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">PDF Document</h3>
                  <p className="text-gray-600 text-sm">Print-ready format</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Print-ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Consistent formatting</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Universal compatibility</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadPDF}
                disabled={loading || !exportUnlocked}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 px-6 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 ${
                  loading && downloadType === "pdf" ? "cursor-not-allowed bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading && downloadType === "pdf" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Generating…</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* PDF Preview */}
          {pdfUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-gray-200 pt-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  className="w-full h-96 border-0"
                />
              </div>
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <Zap className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Posting-aligned</p>
                  <p className="text-xs text-green-700">Tailored to your job description</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Fast export</p>
                  <p className="text-xs text-[var(--accent)]">Usually ready in seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                <CheckCircle className="h-5 w-5 text-zinc-600" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-medium text-zinc-900">Standard formats</p>
                  <p className="text-xs text-zinc-600">.docx and PDF</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <SiteLegalLinks />
          </div>
          </div>
        </motion.div>
      </div>
    </AppPageLayout>
  );
}
