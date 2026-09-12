"use client";

import BrowserChrome from "./BrowserChrome";

/**
 * Product-accurate hero composition: resume preview + job post fragment.
 * Decorative — does not replace CTA copy. aria-hidden on the whole graphic.
 */
export default function HeroProductGraphic({ className = "" }) {
  return (
    <div className={`hero-product-graphic ${className}`} aria-hidden>
      <div className="hero-product-stack">
        <BrowserChrome url="iloveresumes.ca/result" className="hero-product-main">
          <div className="hero-resume-sheet">
            <div className="hero-resume-name">Jordan Lee</div>
            <div className="hero-resume-meta">Remote · jordan.lee@email.com · LinkedIn</div>
            <div className="hero-resume-rule" />
            <div className="hero-resume-label">Summary</div>
            <div className="hero-resume-lines">
              <span style={{ width: "100%" }} />
              <span style={{ width: "92%" }} />
              <span style={{ width: "78%" }} />
            </div>
            <div className="hero-resume-label">Experience</div>
            <div className="hero-resume-role">
              <strong>Senior Software Engineer</strong>
              <em>Acme · 2022–Present</em>
            </div>
            <div className="hero-resume-lines hero-resume-lines-tight">
              <span style={{ width: "96%" }} />
              <span style={{ width: "88%" }} />
              <span style={{ width: "70%" }} />
            </div>
          </div>
        </BrowserChrome>

        <aside className="hero-job-card">
          <p className="hero-job-eyebrow">Job posting</p>
          <p className="hero-job-title">Frontend Engineer</p>
          <ul className="hero-job-keywords">
            <li>TypeScript</li>
            <li>React</li>
            <li>ATS keywords</li>
          </ul>
          <div className="hero-job-lines">
            <span style={{ width: "100%" }} />
            <span style={{ width: "84%" }} />
            <span style={{ width: "60%" }} />
          </div>
        </aside>
      </div>
    </div>
  );
}
