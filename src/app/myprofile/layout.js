import { pageMeta } from "../../config/site";

export const metadata = {
  ...pageMeta({
    title: "Profile",
    description: "Your Google account and tailoring activity from the dashboard.",
    path: "/myprofile",
  }),
  robots: { index: false, follow: false },
};

export default function MyProfileLayout({ children }) {
  return children;
}
