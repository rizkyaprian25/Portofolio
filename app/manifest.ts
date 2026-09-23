import { MetadataRoute } from "next";

/**
 * Konfigurasi Web App Manifest (PWA Readiness)
 * Sesuai Standar SoftwareEngineer.md Seksi 7.5.4:
 * Menyediakan metadata instalasi aplikasi web mandiri, warna tema sistem, dan ikon responsif.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhamad Rizky Aprian — Web Developer & AI Enthusiast",
    short_name: "Rizky Aprian",
    description:
      "Portofolio rekayasa web modern, sistem backend, dan produk digital berkualitas tinggi berbasis Next.js, TypeScript, dan Artificial Narrow Intelligence (ANI) stack.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F5F7",
    theme_color: "#0071E3",
    icons: [
      {
        src: "/Profil.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/Profil.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
