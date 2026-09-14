"use client";

import React, { useState } from "react";
import { Check, Copy, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Profile } from "@/lib/db";

export default function Footer({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="border-t border-canvas-border bg-canvas-subtle/60 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Call to Action Box */}
        <div className="bg-canvas-card border border-canvas-border rounded-2xl p-8 sm:p-12 shadow-sunlit text-center max-w-3xl mx-auto mb-16">
          <span className="text-2xl mb-2 inline-block">☕</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
            Let&rsquo;s build something great together.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary mt-3 max-w-lg mx-auto">
            Whether you have a breakthrough product in mind, a freelance inquiry, or just want to discuss software craftsmanship.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-ink font-semibold text-sm transition-all shadow-sm hover:shadow"
            >
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-canvas-card hover:bg-canvas-subtle border border-canvas-border text-ink font-semibold text-sm transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-botanical-600" />
                  <span className="text-botanical-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-ink-muted" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div>
            © {new Date().getFullYear()} {profile.nama}. Crafted with care and warm daylight.
          </div>

          <div className="flex items-center gap-5">
            {profile.sosial_media.github && (
              <a
                href={profile.sosial_media.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink transition-colors flex items-center gap-1"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {profile.sosial_media.linkedin && (
              <a
                href={profile.sosial_media.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink transition-colors flex items-center gap-1"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.sosial_media.twitter && (
              <a
                href={profile.sosial_media.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink transition-colors flex items-center gap-1"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter/X</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
