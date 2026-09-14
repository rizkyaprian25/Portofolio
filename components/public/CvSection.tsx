import React from "react";
import { Download, FileCheck, FileText, Sparkles } from "lucide-react";
import { CvData } from "@/lib/db";

export default function CvSection({ cv }: { cv: CvData }) {
  const formattedDate = new Date(cv.updated_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="cv" className="py-16 md:py-24 border-t border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
            Verified resume & credentials
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary mt-2">
            Download an up-to-date summary of professional experience, education, and technical competencies.
          </p>
        </div>

        {/* CV Card */}
        <div className="bg-canvas-card border border-canvas-border rounded-2xl p-6 sm:p-10 shadow-sunlit">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left file meta */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sun-50 border border-sun-200 flex items-center justify-center shrink-0 text-sun-600">
                <FileText className="w-6 h-6" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base sm:text-lg text-ink">
                    {cv.filename}
                  </h3>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-botanical-50 text-botanical-700 border border-botanical-100">
                    PDF ({cv.file_size})
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-botanical-500" />
                    Verified manifest ({cv.versi})
                  </span>
                  <span>•</span>
                  <span>Terakhir diperbarui: {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Right Download Button */}
            <div className="w-full md:w-auto">
              <a
                href={cv.file_url}
                download
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-ink font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download CV (PDF)</span>
              </a>
            </div>

          </div>

          {/* Quick Experience Highlights Snippet */}
          <div className="mt-8 pt-6 border-t border-canvas-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-ink-secondary">
            <div className="p-3 rounded-lg bg-canvas-subtle">
              <span className="font-semibold text-ink block mb-0.5">5+ Years Experience</span>
              <span>Full-lifecycle web engineering</span>
            </div>
            <div className="p-3 rounded-lg bg-canvas-subtle">
              <span className="font-semibold text-ink block mb-0.5">Architecture Lead</span>
              <span>Modern micro-frontends & APIs</span>
            </div>
            <div className="p-3 rounded-lg bg-canvas-subtle">
              <span className="font-semibold text-ink block mb-0.5">ATS-Optimized</span>
              <span>Clean tabular formatting standard</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
