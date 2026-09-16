"use client";

import React from "react";
import { Download, Eye, FileCheck, FileText } from "lucide-react";
import { CvData } from "@/lib/db";
import { playClickSound } from "@/lib/audio";
import { openCvQuickLook } from "./CvQuickLookModal";
import SpotlightCard from "./SpotlightCard";

export default function CvSection({ cv }: { cv: CvData }) {
  const formattedDate = new Date(cv.updated_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="resume" className="py-20 md:py-28 bg-white dark:bg-black border-t border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Apple Section Eyebrow */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary dark:text-apple-secondary-dark block mb-2">
            Curriculum Vitae
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold text-apple-text dark:text-apple-text-dark tracking-tight leading-tight">
            Credentials and track record.
          </h2>
          <p className="text-base sm:text-lg text-apple-secondary dark:text-apple-secondary-dark mt-3">
            Download an exhaustive breakdown of engineering experience, systems leadership, and education.
          </p>
        </div>

        {/* Apple Style Document Card */}
        <SpotlightCard className="bg-apple-canvas dark:bg-apple-card-dark rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] p-7 sm:p-10 shadow-apple-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* File Info */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-apple-blue shadow-sm shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-semibold text-apple-text dark:text-apple-text-dark tracking-tight">
                    {cv.filename}
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-apple-green/10 dark:bg-apple-green/20 text-apple-green border border-apple-green/20">
                    PDF · {cv.file_size}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-apple-secondary dark:text-apple-secondary-dark">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-apple-green" />
                    Verified Release ({cv.versi})
                  </span>
                  <span>·</span>
                  <span>Updated {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Preview & Download */}
            <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  openCvQuickLook();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/15 border border-black/[0.08] dark:border-white/[0.1] text-apple-text dark:text-apple-text-dark text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                <Eye className="w-4 h-4 text-apple-blue" />
                <span>Preview CV</span>
              </button>

              <a
                href={cv.file_url}
                download
                onClick={() => playClickSound()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
            </div>

          </div>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-apple-secondary dark:text-apple-secondary-dark">
            <div className="bg-white dark:bg-apple-card-dark-secondary rounded-xl p-3.5 border border-black/[0.04] dark:border-white/[0.06]">
              <span className="font-semibold text-apple-text dark:text-apple-text-dark block mb-0.5">5+ Years Experience</span>
              <span>Full-stack &amp; cloud systems engineering</span>
            </div>
            <div className="bg-white dark:bg-apple-card-dark-secondary rounded-xl p-3.5 border border-black/[0.04] dark:border-white/[0.06]">
              <span className="font-semibold text-apple-text dark:text-apple-text-dark block mb-0.5">Systems Architecture</span>
              <span>Micro-frontends, REST &amp; WebSockets</span>
            </div>
            <div className="bg-white dark:bg-apple-card-dark-secondary rounded-xl p-3.5 border border-black/[0.04] dark:border-white/[0.06]">
              <span className="font-semibold text-apple-text dark:text-apple-text-dark block mb-0.5">Production Tested</span>
              <span>High availability &amp; strict accessibility</span>
            </div>
          </div>

        </SpotlightCard>

      </div>
    </section>
  );
}

