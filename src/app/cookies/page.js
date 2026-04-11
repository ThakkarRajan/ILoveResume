import LegalDocLayout from "../../components/legal/LegalDocLayout";
import CookiesContent from "../../components/legal/cookies-content";
import { LEGAL_EFFECTIVE_DATE } from "../../components/legal/legal-constants";

export const metadata = {
  title: "Cookie Policy",
  description: `Cookie and similar technology notice for I Love Resumes. Effective ${LEGAL_EFFECTIVE_DATE}.`,
};

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
