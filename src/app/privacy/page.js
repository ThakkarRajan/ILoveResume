import LegalDocLayout from "../../components/legal/LegalDocLayout";
import PrivacyContent from "../../components/legal/privacy-content";
import { LEGAL_EFFECTIVE_DATE } from "../../components/legal/legal-constants";

export const metadata = {
  title: "Privacy Policy",
  description: `How I Love Resumes collects, uses, and protects personal data. Effective ${LEGAL_EFFECTIVE_DATE}.`,
};

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
