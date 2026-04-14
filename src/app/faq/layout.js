import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume & ATS FAQ",
  description:
    "FAQ for I Love Resumes: free Word and PDF export, AI resume tailoring you control, ATS-friendly structure, Google sign-in, data handling, and Canadian applications.",
  path: "/faq",
});

export default function FaqLayout({ children }) {
  return children;
}
