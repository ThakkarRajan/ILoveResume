import { pageMeta } from "../../config/site";

export const metadata = {
  ...pageMeta({
    title: "Dashboard",
    description:
      "Add a job description and your resume for suggestions you can edit, then export Word or PDF. Private drafting area—sign in required.",
    path: "/dashboard",
  }),
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return children;
} 