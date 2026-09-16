import { getProfile, getPortfolioItems } from "@/lib/db";
import Navbar from "@/components/public/Navbar";
import PortfolioGrid from "@/components/public/PortfolioGrid";
import Footer from "@/components/public/Footer";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projek — Muhamad Rizky Aprian",
  description:
    "Koleksi lengkap seluruh proyek aplikasi web, mobile, sistem backend, dan produk digital yang telah dirancang dan dibangun oleh Muhamad Rizky Aprian.",
};

export default function ProjectsPage() {
  const profile = getProfile();
  const portfolio = getPortfolioItems();

  return (
    <>
      <Navbar email={profile.email} name={profile.nama} />
      <main className="flex-1 min-h-screen bg-apple-canvas">
        <PortfolioGrid projects={portfolio} isProjectsPage={true} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
