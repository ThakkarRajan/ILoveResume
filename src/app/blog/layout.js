import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume & career tips",
  description:
    "Practical guidance on resumes, ATS parsing, job descriptions, and presenting experience clearly. From the team behind I Love Resumes.",
  path: "/blog",
});

export default function BlogLayout({ children }) {
  return children;
}
