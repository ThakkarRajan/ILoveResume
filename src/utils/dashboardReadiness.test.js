import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDashboardReadiness } from "./dashboardReadiness.js";

const base = {
  jobText: "",
  uploadMode: "pdf",
  pdfFile: null,
  selectedResume: null,
  textResume: "",
  user: null,
  isOnline: true,
};

const readyJob = "x".repeat(500);

describe("getDashboardReadiness", () => {
  it("starts empty at 0/3", () => {
    const r = getDashboardReadiness(base);
    assert.equal(r.completed, 0);
    assert.equal(r.canSubmit, false);
    assert.match(r.tip, /job/i);
  });

  it("marks job ready when trimmed text meets min length", () => {
    const short = getDashboardReadiness({ ...base, jobText: "  Engineer  " });
    assert.equal(short.jobReady, false);
    assert.equal(short.completed, 0);

    const r = getDashboardReadiness({ ...base, jobText: `  ${readyJob}  ` });
    assert.equal(r.jobReady, true);
    assert.equal(r.completed, 1);
  });

  it("marks resume ready for pdf file or selected resume", () => {
    const withFile = getDashboardReadiness({
      ...base,
      jobText: readyJob,
      pdfFile: { name: "a.pdf" },
    });
    assert.equal(withFile.resumeReady, true);
    assert.equal(withFile.completed, 2);

    const withSelected = getDashboardReadiness({
      ...base,
      jobText: readyJob,
      selectedResume: { path: "p" },
    });
    assert.equal(withSelected.resumeReady, true);
  });

  it("marks resume ready for paste mode text", () => {
    const r = getDashboardReadiness({
      ...base,
      uploadMode: "text",
      jobText: readyJob,
      textResume: "experience",
    });
    assert.equal(r.resumeReady, true);
  });

  it("counts auth when user present", () => {
    const r = getDashboardReadiness({
      ...base,
      jobText: readyJob,
      pdfFile: { name: "a.pdf" },
      user: { email: "a@b.com" },
    });
    assert.equal(r.authReady, true);
    assert.equal(r.completed, 3);
    assert.equal(r.canSubmit, true);
  });

  it("allows canSubmit without auth when job+resume ready and online", () => {
    const r = getDashboardReadiness({
      ...base,
      jobText: readyJob,
      pdfFile: { name: "a.pdf" },
      user: null,
    });
    assert.equal(r.authReady, false);
    assert.equal(r.canSubmit, true);
  });

  it("blocks canSubmit when offline", () => {
    const r = getDashboardReadiness({
      ...base,
      jobText: readyJob,
      pdfFile: { name: "a.pdf" },
      isOnline: false,
    });
    assert.equal(r.canSubmit, false);
  });
});
