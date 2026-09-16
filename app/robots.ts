import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://muhamadrizkyaprian.dev";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/projects"],
      disallow: ["/admin/", "/admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
