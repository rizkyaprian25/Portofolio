import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arif Rahman — Portfolio & Personal Space",
  description: "Personal portfolio, selected projects, architectural case studies, and engineering philosophy.",
  keywords: ["Software Engineer", "Full-stack Developer", "Portfolio", "Web Development", "Next.js", "React"],
  authors: [{ name: "Arif Rahman" }],
  openGraph: {
    title: "Arif Rahman — Portfolio & Personal Space",
    description: "Designing & building thoughtful digital experiences with craft and care.",
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
