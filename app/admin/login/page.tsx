"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk ke admin panel");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat menghubungkan ke server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-12">
      {/* Back to website */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Web Portofolio</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-canvas-card border border-canvas-border rounded-2xl p-8 sm:p-10 shadow-sunlit space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-sun-50 border border-sun-200 text-sun-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
            Admin Workspace
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Masuk untuk mengelola karya, biodata, dan berkas CV Anda.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas border border-canvas-border text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-sun-500 focus:ring-2 focus:ring-sun-200 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas border border-canvas-border text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-sun-500 focus:ring-2 focus:ring-sun-200 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sun-500 hover:bg-sun-600 disabled:opacity-50 text-ink font-semibold text-sm transition shadow-sm hover:shadow active:scale-95"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Panel"}
          </button>
        </form>

        {/* Demo credentials tip */}
        <div className="pt-4 border-t border-canvas-border text-center text-xs text-ink-muted">
          <span>Kredensial bawaan: </span>
          <code className="font-mono bg-canvas-subtle px-1.5 py-0.5 rounded text-ink font-medium">
            admin
          </code>{" "}
          /{" "}
          <code className="font-mono bg-canvas-subtle px-1.5 py-0.5 rounded text-ink font-medium">
            admin123
          </code>
        </div>

      </div>
    </div>
  );
}
