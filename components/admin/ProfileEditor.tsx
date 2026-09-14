"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Sparkles, UploadCloud, User } from "lucide-react";
import { Profile } from "@/lib/db";

export default function ProfileEditor({ initialProfile }: { initialProfile: Profile }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [nama, setNama] = useState(profile.nama);
  const [tagline, setTagline] = useState(profile.tagline);
  const [bio, setBio] = useState(profile.bio);
  const [fotoUrl, setFotoUrl] = useState(profile.foto_url);
  const [email, setEmail] = useState(profile.email);
  const [lokasi, setLokasi] = useState(profile.lokasi);
  const [statusKetersediaan, setStatusKetersediaan] = useState(profile.status_ketersediaan);
  const [github, setGithub] = useState(profile.sosial_media.github || "");
  const [linkedin, setLinkedin] = useState(profile.sosial_media.linkedin || "");
  const [twitter, setTwitter] = useState(profile.sosial_media.twitter || "");

  // Skills
  const [frontendSkills, setFrontendSkills] = useState(profile.skills.frontend.join(", "));
  const [backendSkills, setBackendSkills] = useState(profile.skills.backend.join(", "));
  const [toolsSkills, setToolsSkills] = useState(profile.skills.tools_design.join(", "));

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFotoUrl(data.url);
        setMessage({ text: "Foto berhasil diunggah" });
      } else {
        setMessage({ text: data.error || "Gagal mengunggah foto", isError: true });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan upload", isError: true });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const payload: Partial<Profile> = {
      nama,
      tagline,
      bio,
      foto_url: fotoUrl,
      email,
      lokasi,
      status_ketersediaan: statusKetersediaan,
      sosial_media: {
        github,
        linkedin,
        twitter,
      },
      skills: {
        frontend: frontendSkills.split(",").map((s) => s.trim()).filter(Boolean),
        backend: backendSkills.split(",").map((s) => s.trim()).filter(Boolean),
        tools_design: toolsSkills.split(",").map((s) => s.trim()).filter(Boolean),
      },
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setMessage({ text: "Profil berhasil diperbarui!" });
      } else {
        setMessage({ text: data.error || "Gagal memperbarui profil", isError: true });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan jaringan", isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl space-y-8">
      <div>
        <div className="text-xs font-medium text-ink-muted flex items-center gap-2 mb-1">
          <span>Admin</span>
          <span>/</span>
          <span>Profile</span>
          <span>/</span>
          <span className="text-ink font-semibold">Biodata</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
          Kelola Biodata & Profil
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary mt-1">
          Informasi ini akan ditampilkan pada halaman publik Beranda dan Tentang Saya.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.isError
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-botanical-50 border border-botanical-200 text-botanical-800"
          }`}
        >
          {!message.isError && <Check className="w-4 h-4 text-botanical-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-canvas-card border border-canvas-border rounded-2xl p-6 sm:p-8 shadow-sunlit space-y-6">
        
        {/* Photo Upload Row */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-canvas-border">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-canvas-subtle border border-canvas-border shrink-0 shadow-sm">
            {fotoUrl ? (
              <Image src={fotoUrl} alt="Foto Profil" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-muted">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-ink">Foto Profil Utama</h3>
            <p className="text-xs text-ink-muted max-w-md">
              Gunakan foto dengan pencahayaan hangat dan rasio potret (4:5) atau persegi. Maksimal 3MB (JPG/PNG).
            </p>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-canvas-card hover:bg-canvas-subtle border border-canvas-border text-xs font-semibold text-ink cursor-pointer transition shadow-sm">
              <UploadCloud className="w-4 h-4 text-sun-600" />
              <span>{isUploading ? "Mengunggah..." : "Ganti Foto"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Email Publik
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
            Tagline Utama
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
            Bio Ringkas & Filosofi
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Lokasi / Kota
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Status Ketersediaan
            </label>
            <input
              type="text"
              value={statusKetersediaan}
              onChange={(e) => setStatusKetersediaan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-canvas-border space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
            Tautan Sosial Media
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-ink-muted mb-1">GitHub</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-ink-muted mb-1">LinkedIn</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-ink-muted mb-1">Twitter / X</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="pt-4 border-t border-canvas-border space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
            Daftar Keahlian (Pisahkan dengan koma)
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-ink-muted mb-1">Frontend</label>
              <input
                type="text"
                value={frontendSkills}
                onChange={(e) => setFrontendSkills(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-ink-muted mb-1">Backend & Database</label>
              <input
                type="text"
                value={backendSkills}
                onChange={(e) => setBackendSkills(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-ink-muted mb-1">Tooling & Desain</label>
              <input
                type="text"
                value={toolsSkills}
                onChange={(e) => setToolsSkills(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-canvas-border flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-sun-500 hover:bg-sun-600 disabled:opacity-50 text-ink font-semibold text-xs transition shadow-sm"
          >
            {isSaving ? "Menyimpan..." : "Simpan Biodata"}
          </button>
        </div>

      </form>
    </div>
  );
}
