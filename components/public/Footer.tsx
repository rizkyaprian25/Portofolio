"use client";

import React, { useState } from "react";
import { Check, Copy, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Profile } from "@/lib/db";
import { playClickSound } from "@/lib/audio";
import { triggerToast } from "./ToastNotification";
import SpotlightCard from "./SpotlightCard";

export default function Footer({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    triggerToast(`Email ${profile.email} berhasil disalin!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="bg-apple-canvas dark:bg-apple-canvas-dark border-t border-black/[0.06] dark:border-white/[0.08] py-16 sm:py-20 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Apple Style Interaction Card */}
        <SpotlightCard className="bg-white dark:bg-apple-card-dark rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-14 text-center max-w-3xl mx-auto mb-16 shadow-apple-card">
          <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary dark:text-apple-secondary-dark block mb-3">
            Mari Terhubung
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-apple-text dark:text-apple-text-dark tracking-tight leading-tight">
            Punya ide proyek atau peluang kolaborasi?
          </h2>
          <p className="text-base text-apple-secondary dark:text-apple-secondary-dark mt-3 max-w-md mx-auto">
            Terbuka untuk posisi Web Developer, proyek lepas (freelance), maupun eksplorasi implementasi AI &amp; ANI.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-sm font-medium transition shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-canvas dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/15 border border-black/[0.08] dark:border-white/[0.1] text-apple-text dark:text-apple-text-dark text-sm font-medium transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-apple-green" />
                  <span className="text-apple-green">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-apple-secondary dark:text-apple-secondary-dark" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>
        </SpotlightCard>

        {/* Apple Minimalist Sub-Footer */}
        <div className="pt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-apple-secondary dark:text-apple-secondary-dark">
          <div>
            Copyright &copy; {new Date().getFullYear()} {profile.nama}. Built with precision. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            {profile.sosial_media.github && (
              <a
                href={profile.sosial_media.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-apple-text dark:hover:text-apple-text-dark transition-colors flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {profile.sosial_media.linkedin && (
              <a
                href={profile.sosial_media.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-apple-text dark:hover:text-apple-text-dark transition-colors flex items-center gap-1"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.sosial_media.twitter && (
              <a
                href={profile.sosial_media.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-apple-text dark:hover:text-apple-text-dark transition-colors flex items-center gap-1"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}

