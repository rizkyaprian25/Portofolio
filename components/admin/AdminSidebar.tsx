"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  FolderGit2,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    {
      label: "Dashboard & Proyek",
      href: "/admin",
      icon: FolderGit2,
      active: pathname === "/admin",
    },
    {
      label: "Kelola Biodata",
      href: "/admin/profile",
      icon: User,
      active: pathname === "/admin/profile",
    },
    {
      label: "Kelola Berkas CV",
      href: "/admin/cv",
      icon: FileText,
      active: pathname === "/admin/cv",
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-canvas-card border-r border-canvas-border flex flex-col justify-between shrink-0 shadow-sm">
      {/* Top Brand & Profile */}
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-canvas-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sun-500 text-ink flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-normal text-ink block leading-tight">
                Studio Archive
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">
                Admin Control
              </span>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="px-6 py-4 border-b border-canvas-border bg-canvas-subtle/50 flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-sun-100 border border-sun-200 text-sun-700 flex items-center justify-center font-semibold text-xs">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-botanical-500 ring-2 ring-canvas-card" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-ink truncate">{username}</p>
            <p className="text-[11px] text-botanical-600 font-medium flex items-center gap-1">
              Super Admin • Online
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? "bg-sun-100 text-amber-900 border border-sun-200 shadow-sm"
                    : "text-ink-secondary hover:text-ink hover:bg-canvas-subtle"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? "text-sun-600" : "text-ink-muted"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 my-2 border-t border-canvas-border">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-ink-secondary hover:text-ink hover:bg-canvas-subtle transition"
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-sky-600" />
                <span>Buka Web Publik</span>
              </span>
              <span className="text-[10px] text-ink-muted">Live ↗</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-canvas-border space-y-2">
        <div className="px-3 py-1.5 text-[11px] text-ink-muted flex items-center justify-between">
          <span>Theme: Warm Editorial</span>
          <span className="font-mono text-[10px]">v2.4.0</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
