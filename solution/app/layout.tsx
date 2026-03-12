import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "Skill Gap Analyzer — Know Your Gaps, Build Your Future",
  description:
    "Analyze your skills from your resume and GitHub profile, compare with job role requirements, detect skill gaps, and get a personalized learning roadmap.",
  openGraph: {
    title: "Skill Gap Analyzer",
    description: "Detect skill gaps and get a personalized learning roadmap.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
