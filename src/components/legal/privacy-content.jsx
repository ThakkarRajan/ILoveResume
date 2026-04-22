import { LegalSection } from "./LegalDocLayout";
import Link from "next/link";
import LegalSupportEmailLink from "./LegalSupportEmailLink";
import { LEGAL_BUSINESS_ADDRESS, LEGAL_EFFECTIVE_DATE, LEGAL_MINIMUM_AGE } from "./legal-constants";

export default function PrivacyContent() {
  return (
    <article>
      <p className="text-sm leading-relaxed text-zinc-600">
        This Privacy Policy explains how <strong className="font-semibold text-zinc-800">I Love Resumes</strong> (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) — this website and its individual operators, not a registered company — collects,
        uses, stores, and shares personal information when you use our resume builder and related services (the
        &quot;Services&quot;), including our website, authentication, uploads, exports, and optional AI-assisted features.
        Effective date: {LEGAL_EFFECTIVE_DATE}.
      </p>

      <LegalSection title="1. Who we are">
        <p>
          Data controller: <strong className="font-semibold text-zinc-800">I Love Resumes</strong> (this website and the
          individuals who run it — not a registered corporation).
          <br />
          Contact: <LegalSupportEmailLink />
          <br />
          Postal address: <span className="font-medium text-zinc-800">{LEGAL_BUSINESS_ADDRESS}</span>
        </p>
      </LegalSection>

      <LegalSection title="2. Scope">
        <p>
          This policy applies to information processed through the Services. It should be read together with our{" "}
          <Link href="/terms" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Terms &amp; Conditions
          </Link>
          ,{" "}
          <Link href="/cookies" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Cookie Policy
          </Link>
          , and{" "}
          <Link href="/disclaimer" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Disclaimer
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="3. Personal data we collect">
        <p>Depending on how you use the Services, we may process:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-800">Account and authentication:</strong> name, email address, profile photo
            URL, and identifiers from your sign-in provider (for example, Google).
          </li>
          <li>
            <strong className="text-zinc-800">Resume and career content:</strong> text you paste or type, structured
            fields (experience, education, skills, projects), links (portfolio, LinkedIn, GitHub), and similar professional
            information you choose to include.
          </li>
          <li>
            <strong className="text-zinc-800">Files:</strong> PDF resumes or other documents you upload for parsing or
            storage in your account.
          </li>
          <li>
            <strong className="text-zinc-800">Job targeting inputs:</strong> job descriptions or keywords you provide so
            we can tailor suggestions.
          </li>
          <li>
            <strong className="text-zinc-800">AI interaction metadata:</strong> timestamps, feature usage, and technical
            logs needed to run and secure the Services.
          </li>
          <li>
            <strong className="text-zinc-800">Support communications:</strong> information you send when you contact us.
          </li>
          <li>
            <strong className="text-zinc-800">Technical data:</strong> IP address, device type, browser, approximate
            location derived from IP, and diagnostic logs.
          </li>
          <li>
            <strong className="text-zinc-800">Analytics and UX recordings:</strong> when enabled, interaction data (for
            example page views, clicks, scrolls, and session replay or heatmaps) processed by Microsoft Clarity or similar
            tools to understand how the Services are used.
          </li>
        </ul>
        <p>We do not require you to provide sensitive categories of data (such as health data). Please avoid uploading them.</p>
      </LegalSection>

      <LegalSection title="4. How we collect data">
        <p>We collect information when you:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>create an account or sign in;</li>
          <li>upload files, paste text, or edit resume fields in the product;</li>
          <li>generate exports (Word or PDF);</li>
          <li>use AI-assisted editing or optimization features;</li>
          <li>browse the site (cookies and similar technologies—see our Cookie Policy); or</li>
          <li>email or message us.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. How we use personal data">
        <p>We use personal data to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>provide, maintain, and improve the Services;</li>
          <li>authenticate users and prevent fraud or abuse;</li>
          <li>parse resumes, store your drafts, and render previews and downloads;</li>
          <li>run AI-assisted features you invoke, including generating suggestions based on your inputs;</li>
          <li>analyze product usage in aggregate to improve UX and reliability;</li>
          <li>communicate with you about the Services, security, or policy updates;</li>
          <li>comply with law and enforce our terms; and</li>
          <li>resolve disputes and troubleshoot issues.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Legal bases (EEA, UK, and similar regions)">
        <p>Where GDPR or similar laws apply, we rely on one or more of the following legal bases:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-800">Contract:</strong> processing necessary to provide the Services you request.
          </li>
          <li>
            <strong className="text-zinc-800">Legitimate interests:</strong> securing the platform, understanding usage,
            improving features, and marketing our own Services in compliance with your rights (where not overridden by
            consent requirements).
          </li>
          <li>
            <strong className="text-zinc-800">Consent:</strong> where required for certain cookies, marketing emails, or
            optional processing we describe at collection time. You may withdraw consent without affecting processing
            that relies on other bases, though some features may become unavailable.
          </li>
          <li>
            <strong className="text-zinc-800">Legal obligation:</strong> where we must retain or disclose information to
            comply with law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Resume and uploaded documents">
        <p>
          Uploaded files and resume text are processed to extract structure, display an editor, and produce exports. We
          may temporarily cache content on servers or client devices to improve performance. You control what you upload;
          remove content or delete your account where the product supports it, subject to backup and legal retention
          described below.
        </p>
      </LegalSection>

      <LegalSection title="8. AI processing">
        <p>
          When you use AI-assisted features, portions of your resume text and related prompts may be sent to model
          providers under our instructions to generate outputs. Providers are contractually restricted from using your
          content to train their models only where we have agreed those restrictions. For the subprocessors and model
          providers relevant when you use AI features, contact us at the email below. Outputs can be inaccurate; you remain
          responsible for reviewing them (see our
          Disclaimer).
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies and analytics">
        <p>
          We use cookies and similar technologies for essential operation, preferences, and analytics. Details, including
          categories and choices, are in our{" "}
          <Link href="/cookies" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Cookie Policy
          </Link>
          .
        </p>
        <p>
          We partner with{" "}
          <strong className="font-semibold text-zinc-800">Microsoft Clarity</strong> to capture how you use and interact
          with our website through behavioral metrics, heatmaps, and session replay, so we can improve our products and
          services. Usage data may be collected using first- and third-party cookies and other similar technologies to
          understand how popular features are and how people move through the site. We also use this information for site
          optimization, reliability, and to help detect fraud or abuse. Microsoft processes data under its own terms;
          for more on how Microsoft collects and uses data in connection with Clarity, see the{" "}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            className="font-medium text-blue-700 underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Privacy Statement
          </a>
          . By using our site while Clarity is enabled, you acknowledge that we and Microsoft may collect and use this
          category of information as described here and in the Microsoft Privacy Statement.
        </p>
        <p>
          Where we enable <strong className="font-semibold text-zinc-800">Google Analytics</strong> or{" "}
          <strong className="font-semibold text-zinc-800">Vercel Speed Insights</strong>, those services process technical
          and usage metrics under their respective policies to help us measure performance and traffic.
        </p>
      </LegalSection>

      <LegalSection title="10. Authentication providers">
        <p>
          If you sign in with Google or another provider, that provider receives technical data about the request and may
          process data under its own privacy policy. We receive profile information the provider shares with us based on
          your permissions.
        </p>
      </LegalSection>

      <LegalSection title="11. Third-party processors">
        <p>
          We use vendors for hosting, databases, storage, email delivery, analytics, authentication, and AI inference.
          Typical categories include Google (for example, Google Sign-In and, where used, Firebase or related Google Cloud
          services), optional Google Analytics when enabled in our configuration,{" "}
          <strong className="font-semibold text-zinc-800">Microsoft Clarity</strong> when enabled for session insights and
          heatmaps, Vercel (including Speed Insights when enabled) for hosting and performance metrics, EmailJS or similar for
          contact-form delivery, and our resume-processing API backend. Each processor receives only the data needed for its
          service. Email us for a concise, current list if you need it for your records.
        </p>
      </LegalSection>

      <LegalSection title="12. Retention">
        <p>
          We retain personal data only as long as needed for the purposes above, including providing the Services,
          resolving disputes, and meeting legal, tax, or accounting requirements. After you delete your account or ask us to
          delete personal data, we aim to remove or de-identify it within a reasonable period (often within 90 days), except
          where a longer period is required by law or for limited security backups. Security and diagnostic logs are typically
          kept for up to 90 days.
        </p>
      </LegalSection>

      <LegalSection title="13. Security">
        <p>
          We implement administrative, technical, and organizational measures designed to protect personal data (for
          example, access controls, encryption in transit where supported, and least-privilege internal access). No method
          of transmission or storage is completely secure; we encourage strong passwords and safe sharing of exported
          files.
        </p>
      </LegalSection>

      <LegalSection title="14. No liability (privacy-related matters)">
        <p>
          To the fullest extent permitted by applicable law, we and the individuals who operate I Love Resumes are not liable
          for any damages, losses, claims, or costs arising from or related to this Privacy Policy, your use of the Services,
          processing of personal data (including delays, errors, or unauthorized access despite reasonable safeguards), or
          reliance on any statement herein — except where applicable law does not permit that exclusion.
        </p>
        <p>
          This policy describes our practices in good faith; it is not a guarantee of a particular security outcome or legal
          result. For broader exclusions and monetary caps, see our{" "}
          <Link href="/terms" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/disclaimer" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Disclaimer
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="15. International transfers">
        <p>
          We may process data in Canada, the United States, and other countries where we or our vendors operate. If we
          transfer personal data from the EEA, UK, or Switzerland, we use appropriate safeguards such as Standard
          Contractual Clauses or an adequacy decision, as applicable. Contact us if you need more detail for your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="16. Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, delete, or port your personal data; to
          restrict or object to certain processing; and to lodge a complaint with a supervisory authority. To exercise
          rights, email <LegalSupportEmailLink />. We will verify your request consistent
          with law and may need to retain certain records to meet legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="17. Children">
        <p>
          The Services are not directed to children under {LEGAL_MINIMUM_AGE}. We do not knowingly collect personal
          information from children. If you believe we have, contact us and we will take appropriate steps to delete it.
        </p>
      </LegalSection>

      <LegalSection title="18. Marketing">
        <p>
          We will only send promotional emails if you opt in or as otherwise permitted by law. You can unsubscribe using
          the link in any marketing message. Transactional and security notices may continue.
        </p>
      </LegalSection>

      <LegalSection title="19. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the new version here and revise the effective
          date. Where changes are material, we will provide additional notice as required by law.
        </p>
      </LegalSection>

      <LegalSection title="20. Contact">
        <p>
          Privacy questions: <LegalSupportEmailLink />
          <br />
          Data protection / privacy requests: <LegalSupportEmailLink />
          <br />
          Address: <span className="font-medium text-zinc-800">{LEGAL_BUSINESS_ADDRESS}</span>
        </p>
      </LegalSection>
    </article>
  );
}
