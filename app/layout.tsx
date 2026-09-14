import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhamad Rizky Aprian — Web & Mobile Developer, AI Enthusiast",
  description: "Portofolio profesional Muhamad Rizky Aprian. Web & Mobile Developer serta AI Enthusiast berfokus pada arsitektur web modern (Next.js, TypeScript), aplikasi mobile, dan adopsi Artificial Narrow Intelligence (ANI) agentic tools.",
  keywords: [
    "Muhamad Rizky Aprian",
    "Web Developer",
    "Mobile Developer",
    "AI Enthusiast",
    "Artificial Narrow Intelligence",
    "ANI",
    "Google Antigravity AI",
    "Claude Code",
    "OpenCode",
    "Next.js",
    "React Native",
    "TypeScript",
    "Portofolio",
  ],
  authors: [{ name: "Muhamad Rizky Aprian" }],
  openGraph: {
    title: "Muhamad Rizky Aprian — Web & Mobile Developer, AI Enthusiast",
    description: "Portofolio profesional Muhamad Rizky Aprian. Web & Mobile Developer serta AI Enthusiast berfokus pada arsitektur web modern, aplikasi mobile, dan adopsi Artificial Narrow Intelligence (ANI) agentic tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-canvas text-ink antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
