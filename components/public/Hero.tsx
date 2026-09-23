"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Eye, MapPin, Sparkles } from "lucide-react";
import { Profile } from "@/lib/db";
import { playClickSound, playPopSound } from "@/lib/audio";
import { openCvQuickLook } from "./CvQuickLookModal";
import SpotlightCard from "./SpotlightCard";
import LiveWibBadge from "./LiveWibBadge";

function getStatusIndicator(status: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("bekerja") || s.includes("employed") || s.includes("full-time") || s.includes("full time")) {
    return { dotColor: "bg-[#0071E3]", pulse: false };
  }
  if (s.includes("fokus") || s.includes("focus") || s.includes("proyek") || s.includes("project")) {
    return { dotColor: "bg-[#AF52DE]", pulse: true };
  }
  if (s.includes("sibuk") || s.includes("busy") || s.includes("tidak") || s.includes("not")) {
    return { dotColor: "bg-[#FF9500]", pulse: false };
  }
  return { dotColor: "bg-[#34C759]", pulse: true };
}

export default function Hero({ profile, cvUrl }: { profile: Profile; cvUrl: string }) {
  const statusInfo = getStatusIndicator(profile.status_ketersediaan);

  return (
    <section id="overview" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Kolom Kiri: Nama, Headline, Bio, Stack ANI, Tombol Aksi */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Kapsul Ketersediaan & Widget Jam Kerja Real-Time WIB */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-apple-card-dark border border-black/[0.08] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-xs font-medium text-apple-text dark:text-apple-text-dark">
                <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor} ${statusInfo.pulse ? "animate-pulse" : ""}`} />
                <span>{profile.status_ketersediaan}</span>
              </div>

              <LiveWibBadge />
            </div>

            {/* Apple Confident Typography */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-apple-blue">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Web &amp; Mobile Developer · AI Enthusiast</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-apple-text dark:text-apple-text-dark leading-[1.08]">
                {profile.nama}
              </h1>
            </div>

            {/* Subtitle / Ringkasan Profil */}
            <p className="text-base sm:text-lg text-apple-secondary dark:text-apple-secondary-dark font-normal leading-relaxed">
              {profile.bio}
            </p>

            {/* Kartu Fokus Engineering ANI & Agentic */}
            <SpotlightCard className="p-4 rounded-2xl bg-white dark:bg-apple-card-dark border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-apple-text dark:text-apple-text-dark">
                <span className="uppercase tracking-wider">Artificial Narrow Intelligence (ANI) Stack</span>
                <span className="text-[11px] font-normal text-apple-secondary dark:text-apple-secondary-dark">Agentic Dev Tools</span>
              </div>
              <p className="text-xs text-apple-secondary dark:text-apple-secondary-dark leading-relaxed">
                Memadukan rekayasa aplikasi Web &amp; Mobile modern dengan akselerasi agen coding cerdas Artificial Narrow Intelligence (ANI):
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue border border-apple-blue/20">
                  Google Antigravity AI
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-apple-purple/10 dark:bg-apple-purple/20 text-apple-purple border border-apple-purple/20">
                  Claude Code
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-apple-green/10 dark:bg-apple-green/20 text-apple-green border border-apple-green/20">
                  OpenCode
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/10 text-apple-text dark:text-apple-text-dark border border-black/[0.06] dark:border-white/10">
                  Flutter
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/10 text-apple-text dark:text-apple-text-dark border border-black/[0.06] dark:border-white/10">
                  React Native / Mobile
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/10 text-apple-text dark:text-apple-text-dark border border-black/[0.06] dark:border-white/10">
                  Next.js 14
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/10 text-apple-text dark:text-apple-text-dark border border-black/[0.06] dark:border-white/10">
                  TypeScript
                </span>
              </div>
            </SpotlightCard>

            {/* Tombol Aksi Khas Apple */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-sm font-medium">
              <Link
                href="#work"
                onClick={() => playPopSound()}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white transition-all shadow-sm active:scale-95"
              >
                <span>Lihat Karya &amp; Proyek</span>
              </Link>

              {/* Pemicu Modal QuickLook Pratinjau CV */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  openCvQuickLook();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-black/[0.08] dark:hover:bg-white/15 text-apple-text dark:text-apple-text-dark border border-black/[0.06] dark:border-white/10 transition"
              >
                <Eye className="w-3.5 h-3.5 text-apple-blue" />
                <span>Preview CV</span>
              </button>

              <a
                href={cvUrl}
                download
                onClick={() => playClickSound()}
                className="inline-flex items-center gap-1 text-apple-blue hover:underline py-2.5 px-2 transition-all group text-xs sm:text-sm"
              >
                <span>Unduh File CV</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Lokasi & Preferensi Kerja */}
            <div className="pt-1 flex items-center gap-1.5 text-xs text-apple-secondary dark:text-apple-secondary-dark">
              <MapPin className="w-3.5 h-3.5 text-apple-secondary dark:text-apple-secondary-dark" />
              <span>Berbasis di {profile.lokasi} · Siap Bekerja Remote &amp; Hybrid</span>
            </div>

          </div>

          {/* Kolom Kanan: Bingkai Studio Foto Potret Khas Apple */}
          <div className="lg:col-span-5">
            <div className="relative max-w-sm mx-auto">
              
              {/* Bingkai Studio Utama */}
              <div className="relative rounded-[32px] overflow-hidden bg-white dark:bg-apple-card-dark border border-black/[0.08] dark:border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-3 transition-transform duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
                
                {/* Wadah potret rasio 3:4 yang dioptimasi untuk foto profil */}
                <div className="relative aspect-[3/4] w-full rounded-[24px] overflow-hidden bg-apple-canvas dark:bg-black">
                  <Image
                    src={profile.foto_url}
                    alt={profile.nama}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-[center_15%] transition-transform duration-700 ease-out hover:scale-105"
                    priority
                  />
                  
                  {/* Vignette gradien kaca halus di bagian bawah */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                    <div className="text-white space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium text-white">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} ${statusInfo.pulse ? "animate-pulse" : ""}`} />
                        <span>{profile.status_ketersediaan}</span>
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight text-white leading-tight">
                        {profile.nama}
                      </h2>
                      <p className="text-xs text-white/80 line-clamp-1">
                        Web &amp; Mobile Developer · AI Enthusiast
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Lencana Mengambang ANI-Augmented Engineer */}
              <div className="hidden sm:flex absolute -bottom-3 -left-3 items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 dark:bg-apple-card-dark-secondary/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_10px_25px_rgba(0,0,0,0.08)] text-xs font-medium text-apple-text dark:text-apple-text-dark">
                <span className="text-sm">⚡</span>
                <span>ANI-Augmented Web &amp; Mobile Engineer</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

