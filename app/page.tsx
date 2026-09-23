import { getProfile, getPortfolioItems, getCv } from "@/lib/db";
import dynamicImport from "next/dynamic";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import PortfolioGrid from "@/components/public/PortfolioGrid";
import AboutSkills from "@/components/public/AboutSkills";
import CvSection from "@/components/public/CvSection";
import Footer from "@/components/public/Footer";

// Pemuatan malas (lazy-load) modal interaktif guna meminimalkan ukuran bundel JavaScript awal
const CvQuickLookModal = dynamicImport(() => import("@/components/public/CvQuickLookModal"), { ssr: false });
const ToastNotification = dynamicImport(() => import("@/components/public/ToastNotification"), { ssr: false });

// Rendering dinamis agar pembaruan data dari panel admin langsung tercermin di halaman publik
export const dynamic = "force-dynamic";

export default function HomePage() {
  const profile = getProfile();
  const portfolio = getPortfolioItems();
  const cv = getCv();

  return (
    <>
      <Navbar email={profile.email} name={profile.nama} />
      <main className="flex-1">
        <Hero profile={profile} cvUrl={cv.file_url} />
        <PortfolioGrid projects={portfolio} limit={3} showViewAll={true} />
        <AboutSkills profile={profile} />
        <CvSection cv={cv} />
      </main>
      <Footer profile={profile} />

      {/* Global Modals & Notifications */}
      <CvQuickLookModal cv={cv} />
      <ToastNotification />
    </>
  );
}
