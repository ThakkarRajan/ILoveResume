import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildResumeUploadCache,
  getReusableResumeUpload,
  pdfFileCacheKey,
} from "./resumeUploadCache.js";

const fileA = { name: "resume.pdf", size: 1024, lastModified: 100 };
const fileB = { name: "resume.pdf", size: 1024, lastModified: 200 };

describe("resumeUploadCache", () => {
  it("builds cache keyed by name+size+lastModified", () => {
    const cache = buildResumeUploadCache(fileA, {
      fileURL: "https://example.com/a.pdf",
      fileName: "abc-resume.pdf",
      path: "resumes/u@x.com/abc-resume.pdf",
    });
    assert.equal(cache.key, pdfFileCacheKey(fileA));
    assert.equal(cache.fileURL, "https://example.com/a.pdf");
  });

  it("reuses upload for same File identity", () => {
    const cache = buildResumeUploadCache(fileA, {
      fileURL: "https://example.com/a.pdf",
      fileName: "abc-resume.pdf",
      path: "resumes/u@x.com/abc-resume.pdf",
    });
    const reused = getReusableResumeUpload(cache, fileA);
    assert.deepEqual(reused, {
      fileURL: "https://example.com/a.pdf",
      fileName: "abc-resume.pdf",
      path: "resumes/u@x.com/abc-resume.pdf",
    });
  });

  it("does not reuse when File identity changes", () => {
    const cache = buildResumeUploadCache(fileA, {
      fileURL: "https://example.com/a.pdf",
      fileName: "abc-resume.pdf",
      path: "resumes/u@x.com/abc-resume.pdf",
    });
    assert.equal(getReusableResumeUpload(cache, fileB), null);
    assert.equal(getReusableResumeUpload(null, fileA), null);
    assert.equal(getReusableResumeUpload(cache, null), null);
  });
});
