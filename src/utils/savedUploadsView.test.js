import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SAVED_UPLOADS_PREVIEW,
  getSavedUploadsView,
} from "./savedUploadsView.js";

const files = (n) =>
  Array.from({ length: n }, (_, i) => ({ path: `p${i}`, name: `f${i}.pdf` }));

describe("getSavedUploadsView", () => {
  it("exports preview of 3", () => {
    assert.equal(SAVED_UPLOADS_PREVIEW, 3);
  });

  it("shows all when length <= 3", () => {
    const list = files(3);
    const r = getSavedUploadsView(list, false);
    assert.deepEqual(r.visible, list);
    assert.equal(r.needsToggle, false);
    assert.equal(r.hiddenCount, 0);
  });

  it("collapses to 3 when length > 3 and not expanded", () => {
    const list = files(5);
    const r = getSavedUploadsView(list, false);
    assert.equal(r.visible.length, 3);
    assert.deepEqual(r.visible, list.slice(0, 3));
    assert.equal(r.needsToggle, true);
    assert.equal(r.hiddenCount, 2);
  });

  it("shows all when expanded", () => {
    const list = files(5);
    const r = getSavedUploadsView(list, true);
    assert.deepEqual(r.visible, list);
    assert.equal(r.needsToggle, true);
    assert.equal(r.hiddenCount, 2);
  });

  it("treats non-array as empty", () => {
    const r = getSavedUploadsView(null, false);
    assert.deepEqual(r.visible, []);
    assert.equal(r.needsToggle, false);
    assert.equal(r.hiddenCount, 0);
  });
});
