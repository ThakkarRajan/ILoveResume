import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Contact us",
  description:
    "Product questions, partnerships, or support for I Love Resumes—tailor resumes to job descriptions, edit drafts, export Word or PDF.",
  path: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
