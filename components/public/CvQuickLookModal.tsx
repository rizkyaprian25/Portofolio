"use client";

import React, { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { CvData } from "@/lib/db";
import { playClickSound, playPopSound } from "@/lib/audio";

export function openCvQuickLook() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-cv-quicklook"));
  }
}

export default function CvQuickLookModal({ cv }: { cv: CvData }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      playPopSound();
      setIsOpen(true);
    };
    window.addEventListener("open-cv-quicklook", handleOpen);
    return () => window.removeEventListener("open-cv-quicklook", handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[88vh] flex flex-col bg-white dark:bg-apple-card-dark rounded-[24px] border border-black/10 dark:border-white/10 shadow-apple-float overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* macOS QuickLook Toolbar */}
        <div className="h-14 px-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-apple-canvas/80 dark:bg-apple-card-dark-secondary/80 backdrop-blur-md shrink-0">
          
          {/* File Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-apple-text dark:text-apple-text-dark truncate">
                  {cv.filename}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">
                  {cv.versi}
                </span>
              </div>
              <span className="text-[11px] text-apple-secondary dark:text-apple-secondary-dark block">
                PDF · {cv.file_size}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <a
              href={cv.file_url}
              target="_blank"
              rel="noreferrer"
              title="Buka di tab baru"
              onClick={() => playClickSound()}
              className="p-2 rounded-full text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-apple-text-dark hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={cv.file_url}
              download
              title="Download CV"
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-medium transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              onClick={() => {
                playClickSound();
                setIsOpen(false);
              }}
              className="p-2 rounded-full text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-apple-text-dark hover:bg-black/5 dark:hover:bg-white/10 transition ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Embedded PDF Viewer */}
        <div className="flex-1 w-full bg-neutral-100 dark:bg-neutral-900 relative">
          <iframe
            src={`${cv.file_url}#toolbar=1&navpanes=0&scrollbar=1`}
            title="Curriculum Vitae Preview"
            className="w-full h-full border-none"
          />
        </div>

      </div>
    </div>
  );
}
