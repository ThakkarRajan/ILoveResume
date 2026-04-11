import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Contact I Love Resumes for product questions, feedback, or support. Free AI resume builder for tailoring resumes and exporting Word or PDF.",
  path: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
