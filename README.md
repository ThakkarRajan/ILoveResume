I Love Resumes – Smart Resume Customization for Job Applications

I Love Resumes is a full-stack web application that intelligently analyzes and customizes resumes based on job descriptions. Built with Next.js (App Router) on the frontend and FastAPI on the backend, this tool streamlines the job application process by aligning your resume with the specific requirements of each job posting using AI (OpenAI GPT-4).

🚀 Key Features
🔐 Google Authentication (NextAuth)

📄 PDF Resume Upload with 3MB file limit.

📤 Resume Validation and text extraction (PyPDF2) 

🧠 AI-Powered Tailoring using GPT to generate a personalized resume

✏️ Fully Editable Result Page – modify any section (name, contact, skills, experience, etc.)

💾 Save to Local Storage

📥 Download as Editable Word Document (.docx)

🎨 Modern UI with responsive design and Tailwind CSS

☁️ Firebase Storage + Firestore for file handling and metadata

🔍 SEO Optimized with comprehensive meta tags, structured data, and search engine optimization

📱 PWA Ready with web app manifest and mobile-friendly design

🛠️ Tech Stack
Frontend: Next.js 15 App Router, Tailwind CSS, NextAuth

Backend: FastAPI, OpenAI API, PyPDF2

Storage: Firebase (Storage + Firestore)

Document Export: docx, file-saver

SEO: Structured data (JSON-LD), Open Graph, Twitter Cards, Sitemap, Robots.txt

📌 Use Case
Perfect for job seekers who want to tailor their resume to different job descriptions quickly and effectively—boosting their chances of passing ATS filters and standing out to recruiters.

## SEO Features

This application includes comprehensive SEO optimization:

- **Meta Tags**: Complete set of meta tags for search engines
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Structured Data**: JSON-LD schema markup for better search understanding
- **Sitemap**: XML sitemap for search engine crawling
- **Robots.txt**: Search engine crawling instructions
- **Favicon**: Custom favicon using logo.png
- **Web App Manifest**: PWA support for mobile devices
- **Performance**: Preconnect and DNS prefetch for faster loading

## SEO Files

- `public/manifest.json` - Web app manifest for PWA
- `public/robots.txt` - Search engine crawling rules
- `public/sitemap.xml` - XML sitemap for all pages
- `src/app/layout.js` - Comprehensive meta tags and structured data

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
