import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume & career tips",
  description:
    "Friendly, practical articles on resumes, ATS, tailoring, and Canadian job search—with visuals and clear takeaways. From I Love Resumes (iloveresumes.ca).",
  path: "/blog",
});

export default function BlogLayout({ children }) {
  return children;
}
