import LegalDocLayout from "../../components/legal/LegalDocLayout";
import DisclaimerContent from "../../components/legal/disclaimer-content";
import { LEGAL_EFFECTIVE_DATE } from "../../components/legal/legal-constants";

export const metadata = {
  title: "Disclaimer",
  description: `Important limitations for I Love Resumes (AI, hiring outcomes, third parties). Effective ${LEGAL_EFFECTIVE_DATE}.`,
};

export default function DisclaimerPage() {
  return (
    <LegalDocLayout
      title="Disclaimer"
      description={<>Effective: {LEGAL_EFFECTIVE_DATE}. Not legal advice; consult counsel if you need certainty.</>}
    >
      <DisclaimerContent />
    </LegalDocLayout>
  );
}
