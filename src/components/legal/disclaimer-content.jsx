import { LegalSection } from "./LegalDocLayout";
import Link from "next/link";
import LegalSupportEmailLink from "./LegalSupportEmailLink";
import { LEGAL_EFFECTIVE_DATE } from "./legal-constants";

export default function DisclaimerContent() {
  return (
    <article>
      <p className="text-sm leading-relaxed text-zinc-600">
        This Disclaimer applies to the website, application, and related materials that make up{" "}
        <strong className="font-semibold text-zinc-800">I Love Resumes</strong> (the &quot;Services&quot;). The Services are
        provided by the individuals who operate this site (not a registered corporate entity). By using the Services, you
        acknowledge the following. Effective date: {LEGAL_EFFECTIVE_DATE}.
      </p>

      <LegalSection title="1. Informational tool only">
        <p>
          The Services help you draft, edit, and export resume materials. They do not constitute legal, tax, immigration,
          human resources, or career advice. For advice specific to your situation, consult a qualified professional.
        </p>
      </LegalSection>

      <LegalSection title="2. AI outputs may be wrong or incomplete">
        <p>
          Features that use artificial intelligence can produce suggestions that are inaccurate, outdated, biased, or not
          suitable for your industry or jurisdiction. You must independently verify every fact, date, title, metric, and
          claim before you rely on it or submit it to an employer.
        </p>
      </LegalSection>

      <LegalSection title="3. You are responsible for your final resume">
        <p>
          You decide what to include, omit, or send to third parties. You are responsible for compliance with job postings,
          employer instructions, licensing boards, and applicable laws (including privacy and anti-discrimination rules).
        </p>
      </LegalSection>

      <LegalSection title="4. No guarantee of ATS, interviews, or employment">
        <p>
          We do not warrant that any resume will pass applicant tracking systems (ATS), human review, automated scoring, or
          similar screening. We do not guarantee interviews, offers, compensation, or continued employment. Hiring outcomes
          depend on many factors outside our control.
        </p>
      </LegalSection>

      <LegalSection title="5. No endorsement">
        <p>
          References to employers, job boards, certifications, or third-party trademarks on sample content or within user
          materials do not imply endorsement by those entities.
        </p>
      </LegalSection>

      <LegalSection title="6. Third-party links and services">
        <p>
          The Services may link to or integrate third-party sites (for example, sign-in providers or portfolio hosts). We
          are not responsible for their content, availability, or privacy practices. Review their terms and policies
          separately.
        </p>
      </LegalSection>

      <LegalSection title="7. Exports and file sharing">
        <p>
          Exported files may contain metadata or formatting that varies by software. You are responsible for secure
          storage and transmission of files you download or share.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of warranties">
        <p>
          Except where prohibited by law, the Services are provided &quot;as is&quot; without warranties of any kind. See
          also our{" "}
          <Link href="/terms" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Terms &amp; Conditions
          </Link>{" "}
          for additional disclaimers and liability limits.
        </p>
      </LegalSection>

      <LegalSection title="9. No liability">
        <p>
          To the fullest extent permitted by applicable law, I Love Resumes and the individuals who operate it expressly
          disclaim any and all responsibility and liability for any damages, losses, claims, costs, or expenses of any kind
          arising from or related to your access to or use of the Services — including without limitation resume content,
          AI-assisted suggestions, exports (PDF or Word), uploads, authentication, downtime, data loss, security incidents,
          third-party services, or decisions you make in your job search. This applies whether claims sound in contract,
          tort, negligence, statute, or otherwise, even if we were advised of the possibility.
        </p>
        <p>
          Nothing here is intended to limit rights you may have under mandatory consumer or privacy laws that cannot be waived.
          For the operative caps and exclusions, see the{" "}
          <Link href="/terms" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            Terms &amp; Conditions
          </Link>{" "}
          (Limitation of liability).
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about this Disclaimer: <LegalSupportEmailLink />
        </p>
      </LegalSection>
    </article>
  );
}
