import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume & Career Tips",
  description:
    "Practical articles on resumes, ATS, tailoring, and job search—with clear takeaways from I Love Resumes.",
  path: "/blog",
});

export default function BlogLayout({ children }) {
  return children;
}
