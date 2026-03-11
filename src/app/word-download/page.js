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
  Sparkles,
  Eye,
  Clock,
  Zap
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../utils/firebase.js";

// Normalize contact values to full URLs for hyperlinks
const toGithubUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = val.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://github.com/${v.replace(/^github\.com\/?/i, "")}`;
};
const toLinkedInUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = val.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://linkedin.com/in/${v.replace(/^linkedin\.com\/in\/?/i, "")}`;
};
const toWebsiteUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = val.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
};

const getEduProgram = (edu) => (edu?.program || edu?.degree || edu?.area || edu?.studyType || "").trim() || "";
const getEduSchool = (edu) => (edu?.school || edu?.institution || edu?.university || edu?.college || "").trim() || "";
const getEduLocation = (edu) => (edu?.location || edu?.city || "").trim() || "";
const getEduStart = (edu) => (edu?.start || edu?.startDate || "").trim() || "";
const getEduEnd = (edu) => (edu?.end || edu?.endDate || "").trim() || "";

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
      if (!firebaseUser) {
        router.push("/");
      } else {
        setUser(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

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

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: resumeData.name, bold: true, size: 40 }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );

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

    sections.push(...sectionHeader("SUMMARY"));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: resumeData.tailored_summary || "", size: 20 }),
        ],
      })
    );

    sections.push(...sectionHeader("EXPERIENCE"));
    (resumeData.tailored_experience || []).forEach((exp) => {
      sections.push(
        new Paragraph({
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
          children: [
            new TextRun({ text: exp.company, size: 20 }),
            new TextRun({
              text: `\t${exp.start} – ${exp.end}`,
              bold: true,
              size: 20,
            }),
          ],
        })
      );
      sections.push(
        new Paragraph({
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
          children: [
            new TextRun({ text: exp.title, size: 20 }),
            new TextRun({ text: `\t${exp.location}`, size: 20 }),
          ],
        })
      );
      (exp.highlights || []).forEach((hl) =>
        sections.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: hl, size: 20 })],
          })
        )
      );
    });

    sections.push(...sectionHeader("TECHNICAL SKILLS"));
    Object.entries(resumeData.tailored_skills || {}).forEach(
      ([cat, skills]) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${cat}: `, bold: true, size: 20 }),
              new TextRun({ text: skills.join(", "), size: 20 }),
            ],
          })
        );
      }
    );

    sections.push(...sectionHeader("PROJECTS"));
    (resumeData.projects || []).forEach((proj) => {
      sections.push(
        new Paragraph({
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 20,
            }),
            new TextRun({
              text:
                "\t" +
                (Array.isArray(proj.tech)
                  ? `Tech: ${proj.tech.join(", ")}`
                  : proj.tech || ""),
              size: 20,
            }),
          ],
        })
      );

      proj.highlights?.forEach((hl) =>
        sections.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: hl, size: 20 })],
          })
        )
      );
    });

    sections.push(...sectionHeader("EDUCATION"));
    const eduArray = Array.isArray(resumeData.education)
      ? resumeData.education
      : Object.values(resumeData.education || {});
    eduArray.forEach((edu) => {
      const program = getEduProgram(edu);
      const school = getEduSchool(edu);
      const location = getEduLocation(edu);
      const start = getEduStart(edu);
      const end = getEduEnd(edu);
      sections.push(
        new Paragraph({
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
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
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
          ],
          children: [
            new TextRun({ text: school, bold: true, size: 20 }),
            new TextRun({ text: `\t${location}`, italics: true, size: 20 }),
          ],
        })
      );
    });

    sections.push(...sectionHeader("CERTIFICATES"));
    (resumeData.tailored_certificates || []).forEach((cert) => {
      sections.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: cert, size: 20 })],
        })
      );
    });

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

    drawText(data.name || "", { size: 16, bold: true, align: "center" });
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

    sectionHeader("SUMMARY");
    drawText(data.tailored_summary || "", { size: 11 });

    sectionHeader("EXPERIENCE");
    (data.tailored_experience || []).forEach((exp) => {
      drawText(`${exp.company} (${exp.start} – ${exp.end})`, {
        size: 11,
        bold: true,
      });
      drawText(`${exp.title} — ${exp.location}`, { size: 11, italics: true });
      (exp.highlights || []).forEach((hl) =>
        drawText(`•     ${hl}`, { size: 10, indent: 15 })
      );
      y -= 4;
    });

    sectionHeader("TECHNICAL SKILLS");
    Object.entries(data.tailored_skills || {}).forEach(([cat, skills]) => {
      drawText(`${cat}: ${skills.join(", ")}`, { size: 11 });
    });

    sectionHeader("PROJECTS");
    (data.projects || []).forEach((proj) => {
      const techArray = Array.isArray(proj.tech)
        ? proj.tech
        : (proj.tech || "").split(",").map((t) => t.trim());

      drawText(proj.title + ` | Tech: ${techArray.join(", ")}`, {
        size: 11,
        bold: true,
      });

      proj.highlights?.forEach((hl) =>
        drawText(`•     ${hl}`, { size: 10, indent: 15 })
      );
      y -= 4;
    });
    sectionHeader("EDUCATION");
    const eduArray = Array.isArray(data.education)
      ? data.education
      : Object.values(data.education || {});
    eduArray.forEach((edu) => {
      const program = getEduProgram(edu);
      const school = getEduSchool(edu);
      const location = getEduLocation(edu);
      const start = getEduStart(edu);
      const end = getEduEnd(edu);
      drawText(`${program} (${start} – ${end})`, {
        size: 11,
        bold: true,
      });
      drawText(`${school} — ${location}`, { size: 11, italics: true });
    });

    sectionHeader("CERTIFICATES");
    (data.tailored_certificates || []).forEach((cert) =>
      drawText(`•     ${cert}`, { size: 10, indent: 15 })
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const handleDownloadWord = async () => {
    if (!resumeData) return;
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
    if (!resumeData) return;
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

      drawText(resumeData.name || "", { size: 16, bold: true, align: "center" });
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

      sectionHeader("SUMMARY");
      drawText(resumeData.tailored_summary || "", { size: 11 });

      sectionHeader("EXPERIENCE");
      (resumeData.tailored_experience || []).forEach((exp) => {
        drawText(`${exp.company} (${exp.start} – ${exp.end})`, {
          size: 11,
          bold: true,
        });
        drawText(`${exp.title} — ${exp.location}`, { size: 11, italics: true });
        (exp.highlights || []).forEach((hl) =>
          drawText(`•     ${hl}`, { size: 10, indent: 15 })
        );
        y -= 4;
      });

      sectionHeader("TECHNICAL SKILLS");
      Object.entries(resumeData.tailored_skills || {}).forEach(([cat, skills]) => {
        drawText(`${cat}: ${skills.join(", ")}`, { size: 11 });
      });

      sectionHeader("PROJECTS");
      (resumeData.projects || []).forEach((proj) => {
        const techArray = Array.isArray(proj.tech)
          ? proj.tech
          : (proj.tech || "").split(",").map((t) => t.trim());

        drawText(proj.title + ` | Tech: ${techArray.join(", ")}`, {
          size: 11,
          bold: true,
        });

        proj.highlights?.forEach((hl) =>
          drawText(`•     ${hl}`, { size: 10, indent: 15 })
        );
        y -= 4;
      });

      sectionHeader("EDUCATION");
      const eduArray = Array.isArray(resumeData.education)
        ? resumeData.education
        : Object.values(resumeData.education || {});
      eduArray.forEach((edu) => {
        const program = getEduProgram(edu);
        const school = getEduSchool(edu);
        const location = getEduLocation(edu);
        const start = getEduStart(edu);
        const end = getEduEnd(edu);
        drawText(`${program} (${start} – ${end})`, {
          size: 11,
          bold: true,
        });
        drawText(`${school} — ${location}`, { size: 11, italics: true });
      });

      sectionHeader("CERTIFICATES");
      (resumeData.tailored_certificates || []).forEach((cert) =>
        drawText(`•     ${cert}`, { size: 10, indent: 15 })
      );

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

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!resumeData && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-200/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-base sm:text-lg">Preparing your resume...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mb-4 sm:mb-6 shadow-lg">
            <Download className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Resume Ready!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">Download your AI-tailored resume in multiple formats</p>
          
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/result")}
            className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 px-3 sm:px-4 py-2 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back to Editor
          </motion.button>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl max-w-md"
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
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 w-full max-w-4xl"
        >
          {/* Download Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Word Document */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Word Document</h3>
                  <p className="text-gray-600 text-sm">Editable format</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Fully editable</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional formatting</span>
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
                disabled={loading}
                className={`w-full ${
                  loading && downloadType === "word"
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                } text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {loading && downloadType === "word" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
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
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileImage className="w-6 h-6 text-blue-600" />
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
                disabled={loading}
                className={`w-full ${
                  loading && downloadType === "pdf"
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                } text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {loading && downloadType === "pdf" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
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
                  <p className="text-sm font-medium text-green-900">AI-Optimized</p>
                  <p className="text-xs text-green-700">Tailored for your job</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Instant Download</p>
                  <p className="text-xs text-blue-700">No waiting time</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Professional</p>
                  <p className="text-xs text-purple-700">Industry standard</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
