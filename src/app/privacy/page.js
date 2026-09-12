import LegalDocLayout from "../../components/legal/LegalDocLayout";
import PrivacyContent from "../../components/legal/privacy-content";
import { LEGAL_EFFECTIVE_DATE } from "../../components/legal/legal-constants";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: `How I Love Resumes collects, uses, and protects personal data. Effective ${LEGAL_EFFECTIVE_DATE}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalDocLayout
      title="Privacy Policy"
      description={<>Effective: {LEGAL_EFFECTIVE_DATE}.</>}
    >
      <PrivacyContent />
    </LegalDocLayout>
  );
}
