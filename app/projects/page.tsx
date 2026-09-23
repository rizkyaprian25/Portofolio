import { getProfile, getPortfolioItems, getCv } from "@/lib/db";
import dynamicImport from "next/dynamic";
import Navbar from "@/components/public/Navbar";
import PortfolioGrid from "@/components/public/PortfolioGrid";
import Footer from "@/components/public/Footer";
import { Metadata } from "next";

// Pemuatan malas (lazy-load) modal interaktif
const CommandPalette = dynamicImport(() => import("@/components/public/CommandPalette"), { ssr: false });
const CvQuickLookModal = dynamicImport(() => import("@/components/public/CvQuickLookModal"), { ssr: false });
const ToastNotification = dynamicImport(() => import("@/components/public/ToastNotification"), { ssr: false });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projek — Muhamad Rizky Aprian",
  description:
    "Koleksi lengkap seluruh proyek aplikasi web, mobile, sistem backend, dan produk digital yang telah dirancang dan dibangun oleh Muhamad Rizky Aprian.",
};

export default function ProjectsPage() {
  const profile = getProfile();
  const portfolio = getPortfolioItems();
  const cv = getCv();

  return (
    <>
      <Navbar email={profile.email} name={profile.nama} />
      <main className="flex-1 min-h-screen bg-apple-canvas dark:bg-apple-canvas-dark transition-colors duration-200">
        <PortfolioGrid projects={portfolio} isProjectsPage={true} />
      </main>
      <Footer profile={profile} />

      {/* Global Modals & Notifications */}
      <CommandPalette projects={portfolio} profile={profile} cv={cv} />
      <CvQuickLookModal cv={cv} />
      <ToastNotification />
    </>
  );
}
