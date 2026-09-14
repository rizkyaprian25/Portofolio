"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar({ email, name }: { email: string; name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-canvas/90 backdrop-blur-md border-b border-canvas-border shadow-sm py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-ink group-hover:text-sun-600 transition-colors">
            {name}
          </span>
          <span className="text-xs font-sans text-ink-muted hidden sm:inline-block border-l border-canvas-border pl-2">
            Portfolio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
          <Link href="#work" className="hover:text-ink transition-colors">
            Projects
          </Link>
          <Link href="#about" className="hover:text-ink transition-colors">
            About & Skills
          </Link>
          <Link href="#cv" className="hover:text-ink transition-colors">
            Resume / CV
          </Link>
          <Link href="#contact" className="hover:text-ink transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-ink-muted hover:text-ink transition-colors px-2 py-1"
          >
            Admin Panel
          </Link>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sun-500 hover:bg-sun-600 text-ink font-semibold text-xs transition-all shadow-sm hover:shadow active:scale-95"
          >
            Say Hello 👋
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-canvas-subtle"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-canvas border-b border-canvas-border px-6 py-4 space-y-3 animate-fadeIn">
          <Link
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-ink-secondary hover:text-ink py-1.5"
          >
            Projects
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-ink-secondary hover:text-ink py-1.5"
          >
            About & Skills
          </Link>
          <Link
            href="#cv"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-ink-secondary hover:text-ink py-1.5"
          >
            Resume / CV
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-ink-secondary hover:text-ink py-1.5"
          >
            Contact
          </Link>
          <div className="pt-3 border-t border-canvas-border flex items-center justify-between">
            <Link
              href="/admin"
              className="text-xs text-ink-muted hover:text-ink"
            >
              Admin Panel
            </Link>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-sun-500 text-ink font-semibold text-xs"
            >
              Say Hello 👋
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
