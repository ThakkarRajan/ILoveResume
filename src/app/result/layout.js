import { pageMeta } from "../../config/site";

export const metadata = {
  ...pageMeta({
    title: "Resume editor",
    description: "Edit your tailored resume draft, then export to Word or PDF.",
    path: "/result",
  }),
  robots: { index: false, follow: false },
};

export default function ResultLayout({ children }) {
  return children;
}
