"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Komponen Hairline Scroll Progress Indicator
 * Menampilkan garis indikator progres gulir halaman tipis (2.5px) di bagian teratas viewport.
 * Menggunakan akselerasi transformasi GPU (scaleX) untuk performa 60/120 FPS tanpa layout thrashing.
 * Otomatis disembunyikan ketika pengguna berada di portal /admin.
 */
export default function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let rafId: number | null = null;

    // Menghitung persentase scroll halaman secara presisi
    const handleScroll = () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollHeight > 0) {
          const currentProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
          setProgress(currentProgress);
        } else {
          setProgress(0);
        }

        rafId = null;
      });
    };

    // Jalankan kalkulasi awal saat pertama kali dimuat
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Jangan render di sisi server sebelum hidrasi, atau jika sedang berada di rute admin
  if (!mounted || (pathname && pathname.startsWith("/admin"))) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-black/[0.04] dark:bg-white/[0.04]"
    >
      <div
        className="h-full w-full bg-gradient-to-r from-apple-blue via-apple-purple to-apple-blue origin-left transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(0,113,227,0.4)]"
        style={{
          transform: `scaleX(${progress})`,
          willChange: "transform",
        }}
      />
    </div>
  );
}
