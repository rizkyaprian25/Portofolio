"use client";

import React from "react";
import Link from "next/link";
import { Compass, Home, FolderGit2 } from "lucide-react";
import { playClickSound } from "@/lib/audio";

/**
 * Not-Found Page (404) — Halaman penanganan rute tidak ditemukan
 * Mematuhi prinsip Apple Human Interface Guidelines:
 * - Serene minimalism dengan kontras jelas dan navigasi cepat
 * - Memberi panduan arah kepada pengunjung tanpa rasa buntu
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-apple-canvas dark:bg-apple-canvas-dark flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-apple-card-dark rounded-[28px] border border-black/[0.08] dark:border-white/[0.1] shadow-apple-card dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 text-center space-y-6">
        
        {/* Ikon Kompas Apple Style */}
        <div className="w-14 h-14 rounded-2xl bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue mx-auto flex items-center justify-center shadow-sm">
          <Compass className="w-7 h-7 stroke-[1.75] animate-[spin_10s_linear_infinite]" />
        </div>

        {/* Angka & Pesan 404 */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-secondary dark:text-apple-secondary-dark">
            Error 404 · Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-apple-text dark:text-apple-text-dark">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-apple-secondary dark:text-apple-secondary-dark leading-relaxed">
            Tautan yang Anda tuju mungkin telah dipindahkan, dihapus, atau kode alamat URL yang dimasukkan kurang tepat.
          </p>
        </div>

        {/* Tombol Navigasi Alternatif */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            onClick={() => playClickSound()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-apple-text dark:bg-white text-white dark:text-black text-xs font-medium hover:bg-black/90 dark:hover:bg-white/90 shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/projects"
            onClick={() => playClickSound()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/10 text-apple-text dark:text-apple-text-dark text-xs font-medium hover:bg-black/10 dark:hover:bg-white/15 transition-all duration-200 active:scale-[0.98]"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-apple-blue" />
            <span>Arsip Proyek</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
