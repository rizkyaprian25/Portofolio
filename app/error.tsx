"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { playClickSound, playPopSound } from "@/lib/audio";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary — Menangkap kesalahan render runtime secara elegan
 * Mematuhi prinsip Apple Human Interface Guidelines:
 * - Tidak merusak seluruh aplikasi dengan tampilan kosong (white-screen crash)
 * - Menyajikan UI pemulihan (fallback) yang tenang dan memberikan opsi coba lagi
 * - Mencatat error teknis secara terstruktur untuk audit developer
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Pencatatan error terstruktur untuk kebutuhan pemantauan teknis
    const timestamp = new Date().toISOString();
    console.error(
      `[${timestamp}] [ERROR_BOUNDARY] [RENDER_FAILURE] ${error.message || "Kesalahan tidak terduga"}`,
      { digest: error.digest, stack: error.stack }
    );
  }, [error]);

  const handleReset = () => {
    playPopSound();
    reset();
  };

  return (
    <div className="min-h-screen bg-apple-canvas dark:bg-apple-canvas-dark flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-apple-card-dark rounded-[28px] border border-black/[0.08] dark:border-white/[0.1] shadow-apple-card dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 text-center space-y-6">
        
        {/* Ikon Status Apple Minimalist */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-sm">
          <AlertTriangle className="w-7 h-7 stroke-[1.75]" />
        </div>

        {/* Teks Penjelasan */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-apple-text dark:text-apple-text-dark">
            Terjadi Kendala Teknis
          </h2>
          <p className="text-xs sm:text-sm text-apple-secondary dark:text-apple-secondary-dark leading-relaxed">
            Aplikasi mengalami kesalahan yang tidak terduga saat memuat tampilan ini. Anda dapat mencoba memuat ulang atau kembali ke halaman utama.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-apple-secondary/60 dark:text-apple-secondary-dark/60 pt-1">
              Kode Insiden: {error.digest}
            </p>
          )}
        </div>

        {/* Tombol Aksi Pemulihan */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-apple-text dark:bg-white text-white dark:text-black text-xs font-medium hover:bg-black/90 dark:hover:bg-white/90 shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/"
            onClick={() => playClickSound()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/10 text-apple-text dark:text-apple-text-dark text-xs font-medium hover:bg-black/10 dark:hover:bg-white/15 transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
