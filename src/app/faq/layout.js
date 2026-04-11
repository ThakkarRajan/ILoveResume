import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume & ATS FAQ",
  description:
    "Answers about I Love Resumes: free exports, how AI tailoring works, ATS-friendly structure, Word and PDF, privacy with Google sign-in, and Canadian applications.",
  path: "/faq",
});

export default function FaqLayout({ children }) {
  return children;
}
