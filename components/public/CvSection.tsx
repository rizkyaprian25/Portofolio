import React from "react";
import { Download, FileCheck, FileText } from "lucide-react";
import { CvData } from "@/lib/db";

export default function CvSection({ cv }: { cv: CvData }) {
  const formattedDate = new Date(cv.updated_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="resume" className="py-20 md:py-28 bg-white border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Apple Section Eyebrow */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary block mb-2">
            Curriculum Vitae
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold text-apple-text tracking-tight leading-tight">
            Credentials and track record.
          </h2>
          <p className="text-base sm:text-lg text-apple-secondary mt-3">
            Download an exhaustive breakdown of engineering experience, systems leadership, and education.
          </p>
        </div>

        {/* Apple Style Document Card */}
        <div className="bg-apple-canvas rounded-[24px] border border-black/[0.06] p-7 sm:p-10 shadow-apple-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* File Info */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white border border-black/[0.08] flex items-center justify-center text-apple-blue shadow-sm shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-semibold text-apple-text tracking-tight">
                    {cv.filename}
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-apple-green/10 text-apple-green border border-apple-green/20">
                    PDF · {cv.file_size}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-apple-secondary">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-apple-green" />
                    Verified Release ({cv.versi})
                  </span>
                  <span>·</span>
                  <span>Updated {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="w-full md:w-auto">
              <a
                href={cv.file_url}
                download
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
            </div>

          </div>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-black/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-apple-secondary">
            <div className="bg-white rounded-xl p-3.5 border border-black/[0.04]">
              <span className="font-semibold text-apple-text block mb-0.5">5+ Years Experience</span>
              <span>Full-stack &amp; cloud systems engineering</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-black/[0.04]">
              <span className="font-semibold text-apple-text block mb-0.5">Systems Architecture</span>
              <span>Micro-frontends, REST &amp; WebSockets</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-black/[0.04]">
              <span className="font-semibold text-apple-text block mb-0.5">Production Tested</span>
              <span>High availability &amp; strict accessibility</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
