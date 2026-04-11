# ILoveResume — Full Technical Audit Report

**Date:** March 11, 2026  
**Scope:** Production-ready code review at scale  
**Framework:** Next.js 16 (App Router) + Firebase + Railway backend

---

## Fixes Applied (Post-Audit Update)

The following fixes have been implemented:

| Issue | Fix | File(s) |
|-------|-----|---------|
| My Profile submissions never load | Added `toLowerCase()` and null guard for email | `myprofile/page.js` |
| escapeHtml on controlled inputs | Removed from all `value=` props; kept for display | `contact/page.js`, `dashboard/page.js`, `result/page.js` |
| Hardcoded Firebase config | Moved to `NEXT_PUBLIC_FIREBASE_*` env vars | `firebase.js` |
| Hardcoded EmailJS credentials | Moved to `NEXT_PUBLIC_EMAILJS_*` env vars | `contact/page.js` |
| handleChange contact throw | Added `updated.contact \|\| {}` guard | `result/page.js` |
| Word/PDF highlights crash | `(exp.highlights \|\| []).forEach` at 3 call sites | `word-download/page.js` |
| Blob URL memory leak | Added `useEffect` cleanup with `URL.revokeObjectURL` | `word-download/page.js` |
| Dead router.events code | Removed (App Router has no `router.events`) | `result/page.js` |

**Required action:** Create `.env.local` from `.env.example` and add your Firebase and EmailJS values. The app will throw on startup until these are set.

---

## Executive Summary

The ILoveResume codebase has **several critical and high-severity issues** that must be addressed before production deployment. The most dangerous problems are: **hardcoded secrets** (Firebase API key, EmailJS credentials), **broken My Profile submissions** (email case mismatch), **escapeHtml misuse** causing input corruption, **no server-side route protection**, and **memory leaks** from blob URLs. Dependency audit is clean (0 vulnerabilities), but the architecture has significant gaps for high-scale operation.

---

## 1. Bug Detection

### 1.1 My Profile: Submissions Never Load (Critical)

**Location:** `src/app/myprofile/page.js` lines 53–57

**Problem:**  
`fetchUserSubmissions` uses `user?.email` as-is, while the dashboard stores data under `user.email.toLowerCase()`. Firestore paths are case-sensitive.

```javascript
// myprofile/page.js — WRONG
const email = user?.email;
const entriesRef = collection(db, `submissions/${email}/entries`);
```

```javascript
// dashboard/page.js — Storage path
const firestoreEmail = user?.email?.toLowerCase();
await addDoc(collection(db, `submissions/${firestoreEmail}/entries`), {...});
```

**Impact:** Users with uppercase letters in their email (e.g. `John@Gmail.com`) see "No submissions yet" even when they have data.

**Fix:**

```javascript
// src/app/myprofile/page.js
const fetchUserSubmissions = async () => {
  try {
    const email = user?.email?.toLowerCase(); // ← Add toLowerCase()
    if (!email) return;
    const entriesRef = collection(db, `submissions/${email}/entries`);
    // ...
  } catch (err) {
    // ...
  }
};
```

---

### 1.2 escapeHtml on Controlled Inputs Corrupts User Input (Critical)

**Locations:**  
- `src/app/contact/page.js` lines 337, 354, 368, 379  
- `src/app/dashboard/page.js` lines 736, 858, 908  
- `src/app/result/page.js` lines 732, 749, 786, 822, etc.

**Problem:**  
`value={escapeHtml(formData.name)}` converts `&` → `&amp;`, `<` → `&lt;`, etc. When a user types `&`, the input shows `&amp;` and state becomes corrupted. escapeHtml is for **output**, not for controlled inputs.

**Why it's dangerous:**  
Users cannot reliably enter `&`, `<`, `>`, or quotes; resume content is corrupted.

**Fix:**  
Remove `escapeHtml` from controlled input `value`. Use raw state:

```javascript
// BEFORE (broken)
<input value={escapeHtml(formData.name)} onChange={handleInputChange} />

// AFTER (correct)
<input value={formData.name} onChange={handleInputChange} />
```

Reserve escapeHtml for safe rendering only (e.g. `dangerouslySetInnerHTML` or where you inject into HTML). For controlled inputs, React already treats values as text.

---

### 1.3 Result Page: handleChange for Contact Can Throw

**Location:** `src/app/result/page.js` line 357

**Problem:**  
If `resumeData.contact` is missing, `updated.contact[key] = value` throws:

```javascript
if (section === "contact") updated.contact[key] = value;
```

**Fix:**

```javascript
if (section === "contact") {
  updated.contact = updated.contact || {};
  updated.contact[key] = value;
}
```

---

### 1.4 Word/PDF Generation Crashes on Missing highlights

**Locations:**  
- `src/app/word-download/page.js` lines 149–157, 198–206, 375–377, 417–419

**Problem:**  
`exp.highlights.forEach(...)` and `proj.highlights?.forEach(...)` — experience uses `.forEach` without optional chaining; if `highlights` is undefined, it throws.

**Fix:**

```javascript
(exp.highlights || []).forEach((hl) =>
  sections.push(new Paragraph({ ... }))
);
```

Apply the same `|| []` guard wherever `highlights` is iterated.

---

### 1.5 Result Page: Dead Code (Next.js App Router)

**Location:** `src/app/result/page.js` lines 205–214

**Problem:**  
`router.events?.on("routeChangeStart", ...)` does not exist on App Router’s `useRouter()`. It’s a Pages Router API. The effect is dead.

**Fix:**  
Remove the block or use App Router equivalents (e.g. `usePathname` + `useEffect` if you need path-based side effects).

---

### 1.6 Word Download: generateAndSetPdf Dependency Array

**Location:** `src/app/word-download/page.js` lines 53–64

**Problem:**  
`useEffect` calls `generateAndSetPdf(parsed)` but the effect depends on `[router]` only. If `resumeData` comes from localStorage and `generateAndSetPdf` reads it, the dependency list is incomplete. More importantly, `generateAndSetPdf` uses `data` from its argument, not from state, so this is fine — but the effect runs only once. If `stored` changes (e.g. from another tab), it won’t re-run. Low priority, but worth clarifying dependencies.

---

### 1.7 Dashboard: fetchUploadedResumes Before user Defined

**Location:** `src/app/dashboard/page.js` lines 91–96

**Problem:**  
`useEffect` depends on `[user]` and calls `fetchUploadedResumes()` when `user` is set. `fetchUploadedResumes` uses `user?.email` — correct. But `loadRecentResults` uses `user?.email` in `localStorage.getItem(\`recentResults_${user?.email}\`)`. If `user` is briefly undefined during re-renders, this can be inconsistent. Generally safe, but worth ensuring `user` is stable before running.

---

## 2. Security Vulnerabilities

### 2.1 Hardcoded Firebase Config (Critical)

**Location:** `src/utils/firebase.js` lines 6–14

**Problem:**  
Firebase `apiKey`, `projectId`, `authDomain`, etc. are hardcoded. While Firebase client keys are not secret in the traditional sense, hardcoding prevents environment-specific config and makes rotation difficult.

**Exploitation:**  
Keys are exposed in client bundles. Anyone can use them to access your Firebase project if rules are misconfigured. Rotation requires code changes and redeploy.

**Fix:**  
Move config to environment variables:

```javascript
// src/utils/firebase.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

if (!firebaseConfig.apiKey) {
  throw new Error("Missing Firebase config. Check .env.local");
}
```

Create `.env.local` (gitignored) with the real values.

---

### 2.2 Hardcoded EmailJS Credentials (Critical)

**Location:** `src/app/contact/page.js` lines 95–97

**Problem:**  
`serviceId`, `templateId`, and `publicKey` are hardcoded.

**Exploitation:**  
Anyone can use your EmailJS account to send emails, potentially for spam or phishing. Keys appear in client bundles.

**Fix:**  
Use environment variables:

```javascript
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

if (!serviceId || !templateId || !publicKey) {
  toast.error("Email service not configured.");
  return;
}
```

---

### 2.3 No Server-Side Route Protection (High)

**Problem:**  
All “protected” routes (dashboard, contact, myprofile, result, word-download) rely on client-side `onAuthStateChanged`. There is no middleware or server-side auth.

**Exploitation:**  
- Initial HTML for protected pages is still sent before redirect.  
- Bots or scripts can hit routes directly.  
- No protection if JavaScript is disabled.

**Fix:**  
Add Next.js middleware that checks Firebase Auth token or session:

```javascript
// middleware.js (at project root)
import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/contact", "/myprofile", "/result", "/word-download"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  
  if (isProtected) {
    // Check for auth cookie/token set by client after login
    const token = request.cookies.get("firebase-auth-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}
```

You’d need to set the cookie when the user signs in (client-side) and validate it server-side or via a server action.

---

### 2.4 External API URL Hardcoded (Medium)

**Locations:**  
Dashboard, myprofile, PdfUploader — `https://jobdraftai-backend-production.up.railway.app`

**Problem:**  
No env-based config; switching environments or backends requires code edits.

**Fix:**

```javascript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://jobdraftai-backend-production.up.railway.app";
```

---

### 2.5 URL Validation Incomplete (Medium)

**Location:** `src/app/myprofile/page.js` lines 95–107

**Problem:**  
`isValidUrl` only checks `http:` or `https:`. It doesn’t restrict to your domains (e.g. Firebase Storage). A malicious `fileURL` could point the backend at arbitrary URLs (SSRF risk on the backend).

**Fix:**  
Validate against your storage domain:

```javascript
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const allowedHosts = ["firebasestorage.googleapis.com", "resumecreation-fbc67.firebaseapp.com"];
    return allowedHosts.some((h) => parsed.hostname.endsWith(h));
  } catch {
    return false;
  }
};
```

---

### 2.6 CSP Allows unsafe-inline and unsafe-eval (Medium)

**Location:** `next.config.mjs` line 26

**Problem:**  
`script-src 'self' 'unsafe-inline' 'unsafe-eval'` weakens XSS protection.

**Fix:**  
Use nonces or hashes for inline scripts. If you rely on Next.js’ default scripts, consider a stricter CSP that still allows required hashes (often requires framework support for nonces).

---

### 2.7 Contact Form: No Rate Limiting

**Problem:**  
Client-side submission can be spammed. No server-side rate limiting or CAPTCHA.

**Fix:**  
Add a Next.js API route as a proxy to EmailJS and enforce rate limits there. Optionally add CAPTCHA before sending.

---

## 3. Architecture Problems

### 3.1 No API Route Layer

**Problem:**  
Client calls external services directly. No abstraction, caching, or request logging.

**Fix:**  
Introduce Next.js API routes (e.g. `/api/extract`, `/api/process-text`) that proxy to Railway. This allows:  
- Hiding backend URLs  
- Request validation and rate limiting  
- Centralized error handling and logging  

---

### 3.2 Duplicated Auth Logic

**Problem:**  
Each protected page implements its own `onAuthStateChanged` + redirect. Logic is copy-pasted.

**Fix:**  
Create an `AuthGuard` or `useRequireAuth` hook:

```javascript
// hooks/useRequireAuth.js
export function useRequireAuth() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => {
      if (!u) router.push("/");
      else setUser(u);
    });
    return unsub;
  }, [router]);
  return user;
}
```

Use it in each protected page instead of duplicating logic.

---

### 3.3 localStorage as Primary Data Store

**Problem:**  
`tailoredResume` and `recentResults_{email}` live only in localStorage. No persistence to Firestore, no sync, no backup.

**Fix:**  
Consider saving `tailoredResume` to Firestore per user when generating or editing. Use localStorage as cache only.

---

### 3.4 Typo in Directory Name

**Location:** `src/stlyes/` (should be `styles/`)

---

## 4. Performance Problems

### 4.1 PDF Blob URL Not Revoked (Memory Leak)

**Location:** `src/app/word-download/page.js` — `URL.createObjectURL(blob)` at lines 319, 422

**Problem:**  
`createObjectURL` allocates a blob URL. It’s never revoked with `URL.revokeObjectURL(url)`. With many PDF generations or navigations, this leaks memory.

**Fix:**

```javascript
useEffect(() => {
  return () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  };
}, [pdfUrl]);
```

---

### 4.2 Duplicate drawText Logic in Word Download

**Location:** `src/app/word-download/page.js` — `drawText` and PDF generation logic are duplicated in `generateAndSetPdf` and `handleDownloadPDF`.

**Fix:**  
Extract shared PDF generation into a single function and reuse it.

---

### 4.3 No Request Deduplication

**Problem:**  
Rapid clicks on “Generate AI Resume” could trigger multiple submissions.

**Fix:**  
Disable the button during loading and/or debounce the handler.

---

## 5. Code Quality Issues

### 5.1 Unused Component

**Location:** `src/components/PdfUploader.jsx` — not imported anywhere.

**Fix:**  
Remove or integrate it. If unused, delete it.

---

### 5.2 Redundant Dependency

**Problem:**  
`react-router-dom` is installed but Next.js App Router handles routing. It adds bundle size without benefit.

**Fix:**  
Remove from `package.json` and any imports.

---

### 5.3 Duplicate escapeHtml

**Problem:**  
`escapeHtml` is defined in `contact/page.js`, `dashboard/page.js`, and `result/page.js`.

**Fix:**  
Move to `src/utils/escapeHtml.js` and import once. Remember to use it only for output, not controlled inputs.

---

### 5.4 Inconsistent Error Handling

**Problem:**  
Some `catch` blocks are empty or only `console.error`. Users see generic messages.

**Fix:**  
Use consistent error reporting (e.g. toast + optional logging) and differentiate network vs validation vs server errors.

---

## 6. Production Risks

### 6.1 No Centralized Error Boundary

**Problem:**  
Uncaught errors can crash the whole app without a fallback UI.

**Fix:**  
Add a root `error.js` (App Router) and optional `global-error.js` for catastrophic failures.

---

### 6.2 No Request Timeout for AI/Extract

**Location:**  
Dashboard uses 45s timeout for extract; `process-text` has no timeout.

**Fix:**  
Add `AbortController` and timeout for all fetches to the backend.

---

### 6.3 Firestore Writes Can Fail Silently

**Location:** `src/app/dashboard/page.js` lines 293–302, 307–314

**Problem:**  
`addDoc` is in try/catch with empty `catch`. Users assume data is saved when it might not be.

**Fix:**  
Surface failures via toasts and optionally retry or show a clear error.

---

## 7. Edge Cases

| Scenario | Current Behavior | Risk |
|----------|------------------|------|
| User email has uppercase | My Profile shows no submissions | **Critical** |
| User types `&` in contact form | Input becomes `&amp;` | **Critical** |
| `resumeData.contact` missing | Result page handleChange throws | **High** |
| `exp.highlights` undefined | Word/PDF generation crashes | **High** |
| Empty/malformed `tailoredResume` in localStorage | Result page may crash or show empty | **Medium** |
| Very long job description | Possible backend timeouts | **Medium** |
| User switches tabs during upload | Unclear; no explicit handling | **Low** |

---

## 8. Dependency Review

| Package | Version | Notes |
|---------|---------|-------|
| next | ^16.1.6 | Current |
| react | ^19.0.0 | Current |
| firebase | ^11.6.0 | Current |
| react-router-dom | ^7.5.0 | **Remove** — redundant with Next.js |
| docx | ^9.3.0 | OK |
| pdf-lib | ^1.17.1 | OK |
| @emailjs/browser | ^4.4.1 | OK |

**npm audit:** 0 vulnerabilities.

---

## 9. Exact Fixes (Priority Order)

### P0 — Do Immediately

1. **My Profile email case**  
   In `myprofile/page.js` `fetchUserSubmissions`, use `user?.email?.toLowerCase()`.

2. **Remove escapeHtml from controlled inputs**  
   Change `value={escapeHtml(...)}` to `value={...}` everywhere for inputs/textarea.

3. **Move secrets to env vars**  
   Firebase and EmailJS config in `.env.local` and `process.env.NEXT_PUBLIC_*`.

### P1 — Before Production

4. **handleChange contact guard**  
   Use `updated.contact = updated.contact || {}` before `updated.contact[key] = value`.

5. **Word/PDF highlights guard**  
   Use `(exp.highlights || []).forEach(...)` and similar for projects.

6. **Revoke blob URLs**  
   Add `useEffect` cleanup that calls `URL.revokeObjectURL(pdfUrl)`.

7. **Add middleware** (or equivalent) for protected routes.

### P2 — Soon After

8. Extract shared auth logic into `useRequireAuth`.  
9. Add API routes as a proxy to the backend.  
10. Store resume data in Firestore; use localStorage as cache only.

---

## 10. Final Severity Report

| Severity | Count | Issues |
|----------|-------|--------|
| **Critical** | 3 | My Profile email case, escapeHtml on inputs, hardcoded secrets |
| **High** | 5 | No server-side auth, handleChange contact throw, Word/PDF highlights crash, EmailJS hardcoded, blob URL leak |
| **Medium** | 8 | API URL hardcoded, URL validation, CSP, rate limiting, duplicate auth, localStorage as store, error handling, Firestore silent failure |
| **Low** | 5 | Dead router.events, unused PdfUploader, react-router-dom redundant, typo stlyes, duplicate escapeHtml |

---

## Top 5 Issues to Fix First

1. **My Profile submissions not loading** — use `email.toLowerCase()` for Firestore path.  
2. **Hardcoded Firebase and EmailJS credentials** — move to `.env.local`.  
3. **escapeHtml on controlled inputs** — remove; use raw state for `value`.  
4. **Word/PDF crash when highlights missing** — add `(exp.highlights || []).forEach`.  
5. **No server-side route protection** — add middleware or server-side auth check for protected routes.

---

*Report generated by technical audit. Re-validate after applying fixes.*
