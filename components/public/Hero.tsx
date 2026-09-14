import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, FileText, MapPin, Sparkles } from "lucide-react";
import { Profile } from "@/lib/db";

export default function Hero({ profile, cvUrl }: { profile: Profile; cvUrl: string }) {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-50 border border-botanical-100 text-botanical-700 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-botanical-500 animate-pulse" />
              <span>{profile.status_ketersediaan}</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink font-normal leading-[1.15] tracking-tight">
              Designing & building{" "}
              <span className="italic text-sun-600 font-serif">thoughtful</span> digital
              experiences with craft and care.
            </h1>

            {/* Bio Text */}
            <p className="text-base sm:text-lg text-ink-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              {profile.bio}
            </p>

            {/* Meta tags: Location & Specialization */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sun-500" />
                {profile.lokasi}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sun-500" />
                Full-Stack & Product Architecture
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="#work"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-ink font-semibold text-sm transition-all shadow-sunlit hover:shadow-sunlit-hover active:scale-95"
              >
                <span>Explore Selected Work</span>
                <ArrowDown className="w-4 h-4" />
              </Link>

              <a
                href={cvUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-canvas-card hover:bg-canvas-subtle border border-canvas-border text-ink font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-95"
              >
                <FileText className="w-4 h-4 text-sun-600" />
                <span>Resume / CV (PDF)</span>
              </a>
            </div>

          </div>

          {/* Right Image Column */}
          <div className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] shrink-0">
            <div className="relative group">
              {/* Warm decorative backdrop blur aura */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-sun-200 via-botanical-100 to-sky-100 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-700" />
              
              {/* Portrait Container */}
              <div className="relative bg-canvas-card border border-canvas-border p-3 rounded-2xl shadow-sunlit">
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-canvas-subtle">
                  <Image
                    src={profile.foto_url}
                    alt={profile.nama}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                
                {/* Micro caption card */}
                <div className="pt-3 pb-1 px-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{profile.nama}</p>
                    <p className="text-xs text-ink-muted">Digital Craftsman</p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-canvas-subtle text-ink-secondary border border-canvas-border">
                    2025/2026
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
