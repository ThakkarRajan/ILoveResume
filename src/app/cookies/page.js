import LegalDocLayout from "../../components/legal/LegalDocLayout";
import CookiesContent from "../../components/legal/cookies-content";
import { LEGAL_EFFECTIVE_DATE } from "../../components/legal/legal-constants";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Cookie Policy",
  description: `Cookie and similar technology notice for I Love Resumes. Effective ${LEGAL_EFFECTIVE_DATE}.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalDocLayout
      title="Cookie Policy"
      description={<>Effective: {LEGAL_EFFECTIVE_DATE}.</>}
    >
      <CookiesContent />
    </LegalDocLayout>
  );
}
