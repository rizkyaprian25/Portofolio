"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar({ email, name }: { email: string; name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Secret shortcut (Ctrl+Shift+A or Cmd+Shift+A) to open hidden admin portal
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

  // Secret triple click on the monogram dot
  const handleDotClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setClickCount(0);
      openSecretAdmin();
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "apple-glass border-b border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          : "apple-glass border-b border-black/[0.04]"
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
          <Link href="/" className="font-semibold text-apple-text tracking-tight hover:opacity-80 transition">
            <span>{name}</span>
          </Link>
        </div>

        {/* Apple Style Minimalist Center Nav */}
        <nav className="hidden md:flex items-center gap-7 text-apple-secondary font-normal">
          <Link href="#overview" className="hover:text-apple-text transition-colors">
            Overview
          </Link>
          <Link href="#work" className="hover:text-apple-text transition-colors">
            Projects
          </Link>
          <Link href="#craft" className="hover:text-apple-text transition-colors">
            Craft &amp; Philosophy
          </Link>
          <Link href="#resume" className="hover:text-apple-text transition-colors">
            Resume
          </Link>
        </nav>

        {/* Right CTA Actions (Admin link completely hidden from front) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#contact"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-medium text-xs transition-all shadow-sm active:scale-95"
          >
            <span>Contact</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-apple-secondary hover:text-apple-text"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer (Clean, no admin link) */}
      {mobileMenuOpen && (
        <div className="md:hidden apple-glass border-b border-black/[0.08] px-6 py-4 space-y-3">
          <Link
            href="#overview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary hover:text-apple-text py-1"
          >
            Overview
          </Link>
          <Link
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary hover:text-apple-text py-1"
          >
            Projects
          </Link>
          <Link
            href="#craft"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary hover:text-apple-text py-1"
          >
            Craft &amp; Philosophy
          </Link>
          <Link
            href="#resume"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-apple-secondary hover:text-apple-text py-1"
          >
            Resume
          </Link>
          <div className="pt-3 border-t border-black/[0.06] flex items-center justify-end">
            <Link
              href="#contact"
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
