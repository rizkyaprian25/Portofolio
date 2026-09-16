import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://muhamadrizkyaprian.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhamad Rizky Aprian — Web & Mobile Developer, AI Enthusiast",
    template: "%s | Muhamad Rizky Aprian",
  },
  description:
    "Portofolio profesional Muhamad Rizky Aprian. Web & Mobile Developer serta AI Enthusiast berfokus pada arsitektur web modern (Next.js, TypeScript), aplikasi mobile, dan adopsi Artificial Narrow Intelligence (ANI) agentic tools.",
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
    "Flutter",
    "Next.js",
    "React Native",
    "TypeScript",
    "Portofolio",
  ],
  authors: [{ name: "Muhamad Rizky Aprian", url: siteUrl }],
  creator: "Muhamad Rizky Aprian",
  openGraph: {
    title: "Muhamad Rizky Aprian — Web & Mobile Developer, AI Enthusiast",
    description:
      "Portofolio profesional Muhamad Rizky Aprian. Web & Mobile Developer serta AI Enthusiast berfokus pada arsitektur web modern, aplikasi mobile, dan adopsi Artificial Narrow Intelligence (ANI) agentic tools.",
    type: "website",
    url: siteUrl,
    siteName: "Muhamad Rizky Aprian Portfolio",
    locale: "id_ID",
    images: [
      {
        url: "/Profil.jpeg",
        width: 800,
        height: 800,
        alt: "Muhamad Rizky Aprian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhamad Rizky Aprian — Web & Mobile Developer, AI Enthusiast",
    description:
      "Portofolio profesional Muhamad Rizky Aprian. Web & Mobile Developer serta AI Enthusiast.",
    images: ["/Profil.jpeg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Muhamad Rizky Aprian",
      url: siteUrl,
      jobTitle: "Web & Mobile Developer, AI Enthusiast",
      sameAs: [
        "https://github.com/rizkyaprian25",
        "https://linkedin.com/in/rizkyaprian",
      ],
      image: `${siteUrl}/Profil.jpeg`,
      knowsAbout: [
        "Next.js",
        "React",
        "TypeScript",
        "Flutter",
        "React Native",
        "Artificial Narrow Intelligence",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Muhamad Rizky Aprian Portfolio",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (window.location.pathname.startsWith('/admin')) {
                    document.documentElement.classList.remove('dark');
                    return;
                  }
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-apple-canvas dark:bg-apple-canvas-dark text-apple-text dark:text-apple-text-dark antialiased min-h-screen flex flex-col transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
