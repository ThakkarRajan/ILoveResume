import { LegalSection } from "./LegalDocLayout";
import Link from "next/link";
import LegalSupportEmailLink from "./LegalSupportEmailLink";
import { LEGAL_BUSINESS_ADDRESS, LEGAL_EFFECTIVE_DATE } from "./legal-constants";

export default function CookiesContent() {
  return (
    <article>
      <p className="text-sm leading-relaxed text-zinc-600">
        This Cookie Policy describes how <strong className="font-semibold text-zinc-800">I Love Resumes</strong> (this website
        and its individual operators, not a registered company) uses cookies and similar technologies on our website and web
        application (together, the &quot;Site&quot;). Effective date: {LEGAL_EFFECTIVE_DATE}. For how we
        handle personal data more broadly, see our{" "}
        <Link href="/privacy" className="font-medium text-blue-700 underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <LegalSection title="1. What cookies are">
        <p>
          Cookies are small text files stored on your device when you visit a site. Similar technologies include local
          storage, session storage, and pixels. They help the Site remember preferences, keep you signed in, understand
          usage, and improve performance.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use cookies">
        <p>We group cookies into the categories below. Exact cookie names may change as we update the product.</p>
      </LegalSection>

      <LegalSection title="3. Essential cookies">
        <p>
          Required for core functionality such as authentication sessions, security (for example, CSRF protection or load
          balancing), and remembering privacy-related choices. These cookies are typically set in response to actions you
          take. Because they are necessary for the Services, they cannot be disabled through our cookie banner if we offer
          one—your browser may still allow you to block them, but parts of the Site may not work.
        </p>
      </LegalSection>

      <LegalSection title="4. Functional cookies">
        <p>
          Used to remember preferences like language, editor state, or UI settings so the experience feels consistent across
          visits. If disabled, some convenience features may reset between sessions.
        </p>
      </LegalSection>

      <LegalSection title="5. Analytics cookies">
        <p>
          Help us understand aggregate traffic, feature usage, and errors so we can improve reliability and design. Where
          required by law, we will ask for your consent before enabling non-essential analytics. When enabled in our
          configuration, we may use Google Analytics (see Google&apos;s cookie documentation for names and lifetimes).
        </p>
      </LegalSection>

      <LegalSection title="6. Third-party cookies">
        <p>
          Some pages load content or scripts from third parties (for example, authentication with Google, embedded
          previews, or support widgets). Those providers may set their own cookies governed by their policies. Review their
          documentation for details—for example Google accounts and Firebase where used for sign-in or hosting.
        </p>
      </LegalSection>

      <LegalSection title="7. Managing cookies">
        <p>
          Most browsers let you refuse or delete cookies through settings. You can also use industry opt-out pages where
          available. Blocking all cookies may prevent sign-in or export flows from working correctly. For analytics
          specifically, you can use your browser settings or any third-party opt-out tools you prefer. We do not currently
          offer a separate in-product cookie preference center; if we add one, we will update this policy.
        </p>
      </LegalSection>

      <LegalSection title="8. Do Not Track">
        <p>
          There is no consistent industry response to Do Not Track signals. We treat DNT as described in our Privacy
          Policy. We do not treat Do Not Track as a binding opt-out of all cookies by default; use browser controls or
          contact us if you need help limiting analytics.
        </p>
      </LegalSection>

      <LegalSection title="9. Updates">
        <p>
          We may update this Cookie Policy when we change vendors or technologies. Check the effective date at the top and
          review the Privacy Policy for related changes.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions: <LegalSupportEmailLink />
          <br />
          Address: <span className="font-medium text-zinc-800">{LEGAL_BUSINESS_ADDRESS}</span>
        </p>
      </LegalSection>
    </article>
  );
}
