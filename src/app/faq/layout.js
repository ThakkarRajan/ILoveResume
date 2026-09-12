import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume & ATS FAQ",
  description:
    "FAQ for I Love Resumes: free Word and PDF export, AI resume tailoring you control, ATS-friendly structure, Google sign-in, and how we handle your data.",
  path: "/faq",
});

export default function FaqLayout({ children }) {
  return children;
}
