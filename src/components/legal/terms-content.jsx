import Link from "next/link";
import { LegalSection } from "./LegalDocLayout";
import LegalSupportEmailLink from "./LegalSupportEmailLink";
import {
  LEGAL_BUSINESS_ADDRESS,
  LEGAL_GOVERNING_LAW,
  LEGAL_LIABILITY_CAP_UNPAID,
  LEGAL_MINIMUM_AGE,
  LEGAL_VENUE,
} from "./legal-constants";

export default function TermsContent() {
  return (
    <article>
      <p className="text-sm leading-relaxed text-zinc-600">
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the resume creation, editing,
        optimization, and export services (the &quot;Services&quot;) offered by{" "}
        <strong className="font-semibold text-zinc-800">I Love Resumes</strong> (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;). &quot;I Love Resumes&quot; is the public name of this website and its resume tools; the Services are
        operated by individuals and are not offered by a registered corporate entity unless we say otherwise on this page.
        By creating an account, signing in, or otherwise using the Services, you agree to these Terms. If you do not agree, do
        not use the Services.
      </p>

      <LegalSection title="1. Acceptance of terms">
        <p>
          By accessing or using the Services, you confirm that you have read, understood, and agree to be bound by these
          Terms and our{" "}
          <Link href="/privacy" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/cookies" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
            Cookie Policy
          </Link>{" "}
          (each incorporated
          by reference). If you use the Services on behalf of an organization, you represent that you have authority to bind
          that organization.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least {LEGAL_MINIMUM_AGE} years old (or the age of digital consent in your jurisdiction, if
          higher) to use the Services. If you are using the Services on behalf of a minor, you are responsible for their use
          and for ensuring these Terms are followed.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts and security">
        <p>
          You may need to create an account or authenticate through a third-party provider. You agree to provide accurate
          information and to keep your credentials confidential. You are responsible for all activity under your account. If
          you believe your account has been compromised, contact us at <LegalSupportEmailLink /> promptly.
        </p>
      </LegalSection>

      <LegalSection title="4. User responsibilities">
        <p>
          You are responsible for the accuracy, legality, and appropriateness of the information you enter, upload, or
          export—including resume content, contact details, links, and files. You must comply with applicable laws,
          including employment, privacy, and anti-discrimination laws, when using the Services.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>use the Services to harass, defraud, impersonate, or mislead others;</li>
          <li>upload malware, attempt unauthorized access, or probe or stress our systems without permission;</li>
          <li>scrape, data-mine, or systematically harvest content or user data except as permitted in writing;</li>
          <li>reverse engineer the Services except where applicable law prohibits this restriction;</li>
          <li>use the Services to build a competing product using our proprietary materials or outputs in violation of these
            Terms; or
          </li>
          <li>violate third-party rights, including intellectual property and privacy rights.</li>
        </ul>
        <p>We may investigate violations and cooperate with law enforcement where appropriate.</p>
      </LegalSection>

      <LegalSection title="6. Your content and ownership">
        <p>
          You retain ownership of the content you provide (&quot;User Content&quot;). Between you and us, you are solely
          responsible for User Content and for obtaining any consents needed to submit personal data about other people (for
          example, references or employers mentioned in a resume).
        </p>
        <p>
          To operate and improve the Services, you grant us a worldwide, non-exclusive license to host, process, transmit,
          display, and create derivative formatting of User Content solely as needed to provide the Services (including
          previews, exports, backups, security monitoring, and support). This license ends when you delete User Content or
          your account, subject to reasonable retention described in our Privacy Policy and legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="7. Our intellectual property">
        <p>
          The Services, including software, templates, branding, and documentation, are owned by us or our licensors and are
          protected by intellectual property laws. Except for the rights expressly granted in these Terms, we reserve all
          rights.
        </p>
      </LegalSection>

      <LegalSection title="8. AI-assisted features">
        <p>
          Certain features may use artificial intelligence to suggest edits, rewrites, summaries, or formatting. AI outputs
          may be inaccurate, incomplete, or unsuitable for your situation. You must review and verify all AI-assisted content
          before relying on it or submitting it to employers or third parties. We do not warrant that AI outputs are
          truthful, current, or free from bias.
        </p>
      </LegalSection>

      <LegalSection title="9. No hiring or career guarantees">
        <p>
          The Services are tools to help you prepare application materials. We do not guarantee interviews, job offers,
          compensation outcomes, or that your resume will meet any employer&apos;s requirements, pass automated screening
          systems, or comply with immigration or licensing rules. Hiring decisions are made solely by third parties.
        </p>
      </LegalSection>

      <LegalSection title="10. Exports and downloads">
        <p>
          You are responsible for how you distribute exported files (for example, PDF or Word documents). Exports may
          contain metadata or formatting that varies by viewer. You should verify the final document before submission.
        </p>
      </LegalSection>

      <LegalSection title="11. Third-party services">
        <p>
          The Services may integrate authentication providers, analytics, hosting, storage, payment processors, or other
          vendors. Your use of those services may be subject to their terms. We are not responsible for third-party services
          beyond what the law requires.
        </p>
      </LegalSection>

      <LegalSection title="12. Fees and subscriptions (if applicable)">
        <p>
          No paid subscriptions are offered at present. If we introduce paid plans, pricing, billing cycles, taxes, refunds, and
          cancellation terms will be presented at checkout or in a separate order form before you are charged.
        </p>
      </LegalSection>

      <LegalSection title="13. Service changes and availability">
        <p>
          We may modify, suspend, or discontinue features to maintain security, comply with law, or improve the product. We
          will provide reasonable notice where practicable for material adverse changes affecting paid customers, consistent
          with applicable law.
        </p>
      </LegalSection>

      <LegalSection title="14. Suspension and termination">
        <p>
          You may stop using the Services at any time. We may suspend or terminate access if you violate these Terms, create
          risk or legal exposure, or if we discontinue the Services. Provisions that by their nature should survive will
          survive termination (including Sections 6, 8, 9, 15–18).
        </p>
      </LegalSection>

      <LegalSection title="15. Disclaimers">
        <p>
          THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM EXTENT PERMITTED BY LAW,
          WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE
          UNINTERRUPTED OR ERROR-FREE.
        </p>
        <p>
          YOU USE THE SERVICES ENTIRELY AT YOUR OWN RISK. WE MAKE NO PROMISE THAT THE SERVICES WILL MEET YOUR NEEDS, PRODUCE
          ANY PARTICULAR OUTCOME (INCLUDING EMPLOYMENT), OR BE SECURE, ACCURATE, OR FREE FROM ERRORS OR HARMFUL COMPONENTS.
        </p>
      </LegalSection>

      <LegalSection title="16. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL WE, THE INDIVIDUALS WHO OPERATE I LOVE RESUMES, OR
          OUR SERVICE PROVIDERS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY CLAIM, LOSS, OR DAMAGE OF ANY KIND ARISING OUT OF OR
          RELATED TO THE SERVICES OR THESE TERMS — INCLUDING YOUR USER CONTENT, AI-GENERATED OUTPUT, EXPORTS, UPLOADS, LOSS OR
          CORRUPTION OF DATA, BUSINESS INTERRUPTION, LOST PROFITS, LOST OPPORTUNITIES, REPUTATIONAL HARM, OR RELIANCE ON THE
          SERVICES — WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, STRICT LIABILITY, OR ANY OTHER THEORY,
          EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY.
        </p>
        <p>
          WITHOUT LIMITING THE FOREGOING, WE WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY OTHER DAMAGES OR REMEDIES, EXCEPT WHERE APPLICABLE LAW DOES NOT ALLOW THAT
          EXCLUSION (FOR EXAMPLE, SOME CONSUMER STATUTES MAY NOT PERMIT CERTAIN WAIVERS IN YOUR JURISDICTION).
        </p>
        <p>
          OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICES OR THESE TERMS WILL NOT EXCEED
          THE GREATER OF (A) THE AMOUNTS YOU ACTUALLY PAID US FOR THE SERVICES IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING
          RISE TO LIABILITY, OR (B) {LEGAL_LIABILITY_CAP_UNPAID} IF YOU HAVE NOT PAID US ANY FEES. BECAUSE THE SERVICES ARE
          CURRENTLY OFFERED WITHOUT CHARGE, (B) WILL OFTEN BE ZERO. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATIONS ABOVE; IN
          THOSE CASES, OUR LIABILITY IS LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.
        </p>
      </LegalSection>

      <LegalSection title="17. Indemnification">
        <p>
          You will defend, indemnify, and hold harmless I Love Resumes and the individuals who operate it from claims, damages,
          liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from your User Content, your
          misuse of the Services, or your violation of these Terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="18. Governing law and disputes">
        <p>
          These Terms are governed by the laws of {LEGAL_GOVERNING_LAW}, without regard to conflict-of-law principles.
          Courts located in {LEGAL_VENUE} will have exclusive jurisdiction over disputes,
          unless applicable law requires otherwise. If you are a consumer, you may have mandatory rights in your country of
          residence that cannot be waived.
        </p>
      </LegalSection>

      <LegalSection title="19. Changes to these Terms">
        <p>
          We may update these Terms from time to time. We will post the updated version on this page and update the effective
          date. If changes are material, we will provide additional notice as required by law (for example, by email or
          in-product notice). Your continued use after the effective date constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="20. Contact">
        <p>
          Questions about these Terms: <LegalSupportEmailLink />
          <br />
          Legal notices (where permitted): <LegalSupportEmailLink />
          <br />
          Business address:{" "}
          <span className="font-medium text-zinc-800">{LEGAL_BUSINESS_ADDRESS}</span>
        </p>
      </LegalSection>
    </article>
  );
}
