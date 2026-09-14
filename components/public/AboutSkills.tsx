import React from "react";
import { Code2, Cpu, Layers, Sparkles } from "lucide-react";
import { Profile } from "@/lib/db";

export default function AboutSkills({ profile }: { profile: Profile }) {
  return (
    <section id="craft" className="py-20 md:py-28 bg-apple-canvas border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Apple Section Eyebrow & Title */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary block mb-2">
            Engineering &amp; Craftsmanship
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold text-apple-text tracking-tight leading-tight">
            Presisi web engineering, dipercepat oleh kecerdasan ANI.
          </h2>
          <p className="text-base sm:text-lg text-apple-secondary mt-3">
            Filosofi pengembangan perangkat lunak modern yang mengutamakan kecepatan, struktur bersih, dan adopsi alat berbasis agen cerdas.
          </p>
        </div>

        {/* 2-Column Apple Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Narrative Card */}
          <div className="lg:col-span-6 bg-white rounded-[24px] border border-black/[0.06] p-7 sm:p-9 shadow-apple-card space-y-6">
            <div className="w-10 h-10 rounded-2xl bg-apple-blue/10 text-apple-blue flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-semibold text-apple-text tracking-tight">
              Sinergi Web &amp; Mobile Developer dengan Agentic ANI
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-apple-secondary leading-relaxed">
              <p>
                Sebagai Web &amp; Mobile Developer dan AI Enthusiast, saya memadukan arsitektur web modern serta ekosistem mobile dengan akselerasi agen cerdas Artificial Narrow Intelligence (ANI) seperti Google Antigravity AI, Claude Code, dan OpenCode.
              </p>
              <p>
                Pendekatan ini memungkinkan saya merekayasa produk digital dari konsep menjadi aplikasi web dan mobile siap pakai dengan kecepatan tinggi tanpa mengorbankan kualitas kode, ketelitian UI/UX, performa, maupun ketahanan sistem.
              </p>
            </div>

            <div className="pt-4 border-t border-black/[0.06]">
              <p className="text-xs uppercase tracking-wider font-semibold text-apple-secondary">
                Pilar Utama
              </p>
              <p className="text-sm font-medium text-apple-text mt-1">
                Web &amp; Mobile Apps · ANI Agentic Workflows · Clean Scalable Architecture
              </p>
            </div>
          </div>

          {/* Right Column: Apple Category Cards */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Frontend & Mobile Capsule */}
            <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 shadow-apple-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-apple-blue text-white flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-apple-text tracking-tight">
                  Web &amp; Mobile Development (UI/UX)
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.frontend.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-apple-canvas text-apple-text border border-black/[0.04]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend Capsule */}
            <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 shadow-apple-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-apple-green text-white flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-apple-text tracking-tight">
                  Backend &amp; API Infrastructure
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.backend.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-apple-canvas text-apple-text border border-black/[0.04]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tooling & ANI AI Tools Capsule */}
            <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 shadow-apple-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-apple-purple text-white flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-apple-text tracking-tight">
                  ANI AI Tools &amp; Dev Environment
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.tools_design.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-apple-canvas text-apple-text border border-black/[0.04]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
