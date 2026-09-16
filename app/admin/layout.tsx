"use client";

import React, { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Force remove dark mode on all admin pages
    document.documentElement.classList.remove("dark");

    return () => {
      // When leaving admin to public pages, restore previous theme preference
      try {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (saved === "dark" || (!saved && prefersDark)) {
          document.documentElement.classList.add("dark");
        }
      } catch (e) {}
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-apple-canvas text-apple-text light"
      style={{ colorScheme: "light" }}
    >
      {children}
    </div>
  );
}
