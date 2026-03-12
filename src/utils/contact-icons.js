/**
 * Contact icons for PDF and Word - drawn with Canvas API (no SVG/Image loading).
 * Works reliably in all environments.
 */

const ICON_SIZE = 22;
const ICON_PT = 14;
const S = 56; // canvas size
const s = (v) => (v / 24) * S; // scale from 24 viewBox
const lw = S / 12; // line width

function drawToPng(drawFn) {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser only"));
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("No canvas"));

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = Math.max(2, lw);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawFn(ctx);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("No blob"));
        const reader = new FileReader();
        reader.onloadend = () => resolve(new Uint8Array(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(blob);
      },
      "image/png",
      1
    );
  });
}

const drawers = {
  location(ctx) {
    // Map pin - teardrop + dot
    ctx.beginPath();
    ctx.moveTo(s(12), s(4));
    ctx.quadraticCurveTo(s(20), s(8), s(20), s(14));
    ctx.quadraticCurveTo(s(20), s(20), s(12), s(22));
    ctx.quadraticCurveTo(s(4), s(20), s(4), s(14));
    ctx.quadraticCurveTo(s(4), s(8), s(12), s(4));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s(12), s(10), s(2.5), 0, Math.PI * 2);
    ctx.fill();
  },
  email(ctx) {
    // Envelope
    ctx.strokeRect(s(2), s(4), s(20), s(16));
    ctx.beginPath();
    ctx.moveTo(s(2), s(8));
    ctx.lineTo(s(12), s(14));
    ctx.lineTo(s(22), s(8));
    ctx.stroke();
  },
  phone(ctx) {
    // Smartphone
    ctx.strokeRect(s(5), s(2), s(14), s(20));
    ctx.beginPath();
    ctx.arc(s(12), s(18), s(1.5), 0, Math.PI * 2);
    ctx.fill();
  },
  website(ctx) {
    // Globe
    ctx.beginPath();
    ctx.arc(s(12), s(12), s(10), 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s(2), s(12));
    ctx.lineTo(s(22), s(12));
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(s(12), s(12), s(10), s(4), 0, 0, Math.PI * 2);
    ctx.stroke();
  },
  github(ctx) {
    // Simplified GitHub mark: head + body + arms
    ctx.beginPath();
    ctx.arc(s(12), s(7), s(2.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s(12), s(9.5));
    ctx.quadraticCurveTo(s(6), s(9), s(6), s(14));
    ctx.quadraticCurveTo(s(6), s(18), s(10), s(18));
    ctx.moveTo(s(12), s(9.5));
    ctx.quadraticCurveTo(s(18), s(9), s(18), s(14));
    ctx.quadraticCurveTo(s(18), s(18), s(14), s(18));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s(12), s(20), s(3.5), 0, Math.PI * 2);
    ctx.fill();
  },
  linkedin(ctx) {
    // LinkedIn "in" - left bar, head circle, right badge
    ctx.fillRect(s(2), s(9), s(4), s(12));
    ctx.beginPath();
    ctx.arc(s(4), s(5), s(2.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s(16), s(9));
    ctx.lineTo(s(20), s(9));
    ctx.lineTo(s(20), s(21));
    ctx.lineTo(s(16), s(21));
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(s(16), s(15), s(4), s(2));
  },
};

export async function loadContactIconPngs() {
  if (typeof window === "undefined") return {};
  const result = {};
  for (const key of Object.keys(drawers)) {
    try {
      result[key] = await drawToPng(drawers[key]);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Icon ${key} failed:`, e);
      }
    }
  }
  return result;
}

export { ICON_SIZE, ICON_PT };
