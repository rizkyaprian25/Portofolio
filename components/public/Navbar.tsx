"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, Moon, Sun, Volume2, VolumeX, X } from "lucide-react";
import { playChimeSound, playClickSound, isSoundMuted, setSoundMuted } from "@/lib/audio";

export default function Navbar({ email, name }: { email: string; name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Inisialisasi state tema terang/gelap dan audio haptic
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setIsMuted(isSoundMuted());

    const handleSoundChange = (e: CustomEvent<boolean>) => {
      setIsMuted(e.detail);
    };
    const handleThemeChange = (e: CustomEvent<boolean>) => {
      setIsDark(e.detail);
    };
    window.addEventListener("sound-mute-change" as any, handleSoundChange);
    window.addEventListener("theme-change" as any, handleThemeChange);
    return () => {
      window.removeEventListener("sound-mute-change" as any, handleSoundChange);
      window.removeEventListener("theme-change" as any, handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    playChimeSound();
    const nextDark = !document.documentElement.classList.contains("dark");
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(nextDark);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: nextDark }));
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setSoundMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playClickSound();
    }
  };

  // Pintasan rahasia (Ctrl+Shift+A atau Cmd+Shift+A) untuk membuka portal admin tersembunyi
  const openSecretAdmin = () => {
    const saved = localStorage.getItem("adm_p_key");
    if (saved) {
      window.location.href = `/admin/${saved}`;
      return;
    }
    const input = window.prompt("Apple Security: Masukkan Kode Akses Admin (URL Slug)");
    if (input && input.trim()) {
      const slug = input.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      localStorage.setItem("adm_p_key", slug);
      window.location.href = `/admin/${slug}`;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        openSecretAdmin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Klik tiga kali pada titik monogram logo untuk membuka akses admin
  const handleDotClick = () => {
    playClickSound();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setClickCount(0);
      openSecretAdmin();
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "apple-glass border-b border-black/[0.08] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          : "apple-glass border-b border-black/[0.04] dark:border-white/[0.04]"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12 text-[13px]">
        {/* Brand with secret dot trigger */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDotClick}
            title="Muhamad Rizky Aprian"
            className="w-2.5 h-2.5 rounded-full bg-apple-blue inline-block hover:scale-125 transition-transform cursor-pointer"
            aria-label="Monogram"
          />
          <Link href="/" className="font-semibold text-apple-text dark:text-apple-text-dark tracking-tight hover:opacity-80 transition">
            <span>{name}</span>
          </Link>
        </div>

        {/* Apple Style Minimalist Center Nav */}
        <nav className="hidden md:flex items-center gap-7 text-apple-secondary dark:text-apple-secondary-dark font-normal">
          <Link href="/#overview" className="hover:text-apple-text dark:hover:text-apple-text-dark transition-colors">
            Overview
          </Link>
          <Link href="/projects" className="hover:text-apple-text dark:hover:text-apple-text-dark transition-colors">
            Projects
          </Link>
          <Link href="/#craft" className="hover:text-apple-text dark:hover:text-apple-text-dark transition-colors">
            Craft &amp; Philosophy
          </Link>
          <Link href="/#resume" className="hover:text-apple-text dark:hover:text-apple-text-dark transition-colors">
            Resume
          </Link>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? "Aktifkan Efek Suara UI" : "Bisukan Efek Suara UI"}
            className="p-1.5 rounded-full text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-apple-secondary/60" /> : <Volume2 className="w-3.5 h-3.5 text-apple-green" />}
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            className="p-1.5 rounded-full text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Theme Toggle"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-apple-orange transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-apple-purple transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Contact Button */}
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-medium text-xs transition-all shadow-sm active:scale-95 ml-1"
          >
            <span>Contact</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden apple-glass border-b border-black/[0.08] dark:border-white/[0.08] px-6 py-4 space-y-3">
          <Link
            href="/#overview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white py-1"
          >
            Overview
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white py-1"
          >
            Projects
          </Link>
          <Link
            href="/#craft"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white py-1"
          >
            Craft &amp; Philosophy
          </Link>
          <Link
            href="/#resume"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white py-1"
          >
            Resume
          </Link>
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-apple-secondary/60">Muhamad Rizky Aprian</span>

            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-apple-blue text-white font-medium text-xs"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

