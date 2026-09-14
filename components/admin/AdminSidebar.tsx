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
      label: "Projects & Works",
      href: "/admin",
      icon: FolderGit2,
      color: "bg-apple-blue text-white",
      active: pathname === "/admin",
    },
    {
      label: "Profile & Identity",
      href: "/admin/profile",
      icon: User,
      color: "bg-apple-orange text-white",
      active: pathname === "/admin/profile",
    },
    {
      label: "Resume & CV Manifest",
      href: "/admin/cv",
      icon: FileText,
      color: "bg-apple-purple text-white",
      active: pathname === "/admin/cv",
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white/70 apple-glass border-r border-black/[0.08] flex flex-col justify-between shrink-0">
      {/* Top Section */}
      <div>
        {/* macOS Window Title bar area */}
        <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-apple-text text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-sm text-apple-text block leading-tight tracking-tight">
                Studio Workspace
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-apple-secondary">
                macOS Settings
              </span>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="px-5 py-3.5 border-b border-black/[0.06] bg-black/[0.02] flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-apple-blue/15 text-apple-blue flex items-center justify-center font-semibold text-xs">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-apple-green ring-2 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-apple-text truncate">{username}</p>
            <p className="text-[10px] text-apple-secondary flex items-center gap-1 font-medium">
              Administrator · Online
            </p>
          </div>
        </div>

        {/* Navigation Items in iOS/macOS Settings Style */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  item.active
                    ? "bg-black/[0.08] text-apple-text shadow-sm"
                    : "text-apple-secondary hover:text-apple-text hover:bg-black/[0.03]"
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-sm ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 my-2 border-t border-black/[0.06]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-apple-secondary hover:text-apple-text hover:bg-black/[0.03] transition"
            >
              <span className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-black/10 text-apple-text flex items-center justify-center shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <span>View Live Site</span>
              </span>
              <span className="text-[11px] text-apple-secondary font-mono">↗</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-black/[0.06] space-y-2">
        <div className="px-2 text-[10px] text-apple-secondary flex items-center justify-between">
          <span>Apple HIG Design</span>
          <span className="font-mono">v2.5</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50/70 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
