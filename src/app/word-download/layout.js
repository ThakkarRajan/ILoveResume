import { pageMeta } from "../../config/site";

export const metadata = {
  ...pageMeta({
    title: "Download resume",
    description: "Export your edited resume as Word (.docx) or PDF for job applications.",
    path: "/word-download",
  }),
  robots: { index: false, follow: false },
};

export default function WordDownloadLayout({ children }) {
  return children;
}
