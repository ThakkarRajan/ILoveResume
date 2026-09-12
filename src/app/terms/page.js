import LegalDocLayout from "../../components/legal/LegalDocLayout";
import TermsContent from "../../components/legal/terms-content";
import { LEGAL_EFFECTIVE_DATE } from "../../components/legal/legal-constants";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Terms & Conditions",
  description: `Terms of use for the I Love Resumes resume builder, including AI-assisted features and exports. Effective ${LEGAL_EFFECTIVE_DATE}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalDocLayout
      title="Terms & Conditions"
      description={<>Last updated: {LEGAL_EFFECTIVE_DATE}.</>}
    >
      <TermsContent />
    </LegalDocLayout>
  );
}
