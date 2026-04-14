/**
 * Starter resume for the /result editor (same shape as AI `structured`).
 * Includes example lines so users see tone, length, and bullet style—replace with your own content.
 */
export function getEmptyResumeDraft() {
  return {
    name: "Jordan Lee",
    contact: {
      email: "jordan.lee@email.com",
      phone: "+1 (555) 010-2030",
      location: "Toronto, ON",
      website: "portfolio.example.com",
      github: "jordanlee",
      linkedin: "jordan-lee-profile",
    },
    tailored_summary:
      "Product-focused software developer with 4+ years building web apps used by thousands of users. " +
      "Comfortable owning features end-to-end: discovery, implementation, metrics, and rollout. " +
      "Looking for a team that values clear communication and steady delivery over hype.",
    tailored_skills: {
      technical: ["TypeScript", "React", "Next.js", "Node.js", "REST APIs", "PostgreSQL"],
      tools: ["Git", "Docker", "CI/CD (GitHub Actions)", "Figma"],
      soft: ["Stakeholder updates", "Code review", "Writing design docs", "Mentoring interns"],
    },
    tailored_experience: [
      {
        company: "Your company (replace)",
        title: "Senior Software Engineer",
        location: "Remote · Canada",
        start: "Jan 2022",
        end: "Present",
        highlights: [
          "Led migration of the customer dashboard to React and TypeScript, cutting page load time by roughly 35% for the busiest routes.",
          "Partnered with design and support to ship a guided onboarding flow; first-week activation improved from 41% to 58% over two quarters.",
          "Mentored two junior developers through their first production releases, including pairing on testing strategy and incident response.",
          "Introduced lightweight RFCs for cross-team changes so larger refactors shipped with fewer regressions.",
        ],
      },
      {
        company: "Previous Company Inc.",
        title: "Software Engineer",
        location: "Vancouver, BC",
        start: "Jun 2019",
        end: "Dec 2021",
        highlights: [
          "Built and maintained billing integrations (Stripe) handling six-figure monthly volume with strong reconciliation checks.",
          "Reduced flaky CI jobs by stabilizing test data and splitting slow suites; average pipeline time dropped from 22 minutes to under 12.",
        ],
      },
    ],
    education: [
      {
        program: "B.Sc. Computer Science",
        school: "Your University (edit)",
        location: "Canada",
        start: "2015",
        end: "2019",
        highlights: ["Dean's List (example — optional)", "Capstone: team project with industry partner"],
      },
    ],
    projects: [
      {
        title: "Open source CLI tool (sample project)",
        tech: ["Go", "Cobra"],
        highlights: [
          "Small command-line utility that validates config files before deploy; documented usage and error messages for contributors.",
          "Published on GitHub with MIT license — swap this block for a real project you can discuss in interviews.",
        ],
      },
    ],
    tailored_certificates: [
      "AWS Certified Cloud Practitioner (replace or remove if not applicable)",
      "Company-internal security training (example line)",
    ],
  };
}
