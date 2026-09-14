"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, UploadCloud, User } from "lucide-react";
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
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setFotoUrl(data.url);
        setMessage({ text: "Profile portrait updated" });
      } else {
        setMessage({ text: data.error || "Upload failed", isError: true });
      }
    } catch {
      setMessage({ text: "Upload error occurred", isError: true });
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
      sosial_media: { github, linkedin, twitter },
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
        setMessage({ text: "Profile successfully saved to manifest." });
      } else {
        setMessage({ text: data.error || "Failed to update profile", isError: true });
      }
    } catch {
      setMessage({ text: "Network error occurred", isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl space-y-8 bg-apple-canvas min-h-screen">
      <div>
        <div className="text-xs font-medium text-apple-secondary flex items-center gap-1.5 mb-1">
          <span>Workspace</span>
          <span>/</span>
          <span>Identity</span>
          <span>/</span>
          <span className="text-apple-text">Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-apple-text tracking-tight">
          Profile &amp; Biography
        </h1>
        <p className="text-xs sm:text-sm text-apple-secondary mt-1">
          Manage your personal credentials, contact details, and engineering narrative.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
            message.isError
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-apple-green/10 text-apple-green border border-apple-green/20"
          }`}
        >
          {!message.isError && <Check className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-black/[0.06] rounded-[24px] p-6 sm:p-8 shadow-apple-card space-y-6">
        
        {/* Photo Upload in Apple Squircle Frame */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-black/[0.06]">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[22px] overflow-hidden bg-apple-canvas border border-black/[0.08] shrink-0 shadow-sm">
            {fotoUrl ? (
              <Image src={fotoUrl} alt="Portrait" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-apple-secondary">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-apple-text">Primary Portrait</h3>
            <p className="text-xs text-apple-secondary max-w-md">
              High resolution studio portrait or natural daylight photography. Recommended ratio 4:5 or 16:9.
            </p>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-apple-canvas hover:bg-black/5 border border-black/[0.08] text-xs font-medium text-apple-text cursor-pointer transition">
              <UploadCloud className="w-4 h-4 text-apple-blue" />
              <span>{isUploading ? "Uploading..." : "Replace Photo"}</span>
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
            <label className="block text-xs font-medium text-apple-secondary mb-1.5">Full Name</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-apple-secondary mb-1.5">Public Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-1.5">Headline Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-1.5">Short Bio &amp; Philosophy</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-apple-secondary mb-1.5">Location</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
          />
        </div>
        {/* Status Ketersediaan / Kondisi Kerja */}
        <div className="p-4 sm:p-5 rounded-2xl bg-apple-canvas border border-black/[0.06] space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-semibold text-apple-text">
                Kondisi Saat Ini (Status Ketersediaan &amp; Kerja)
              </label>
              <p className="text-[11px] text-apple-secondary">
                Status ini akan otomatis tertampil pada foto profil Anda dan badge ketersediaan di halaman depan.
              </p>
            </div>

            {/* Live Preview Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.08] shadow-sm text-xs font-medium text-apple-text shrink-0">
              <span className={`w-2 h-2 rounded-full ${
                statusKetersediaan.toLowerCase().includes("bekerja") || statusKetersediaan.toLowerCase().includes("employed")
                  ? "bg-[#0071E3]"
                  : statusKetersediaan.toLowerCase().includes("fokus") || statusKetersediaan.toLowerCase().includes("proyek") || statusKetersediaan.toLowerCase().includes("kolaborasi")
                  ? "bg-[#AF52DE]"
                  : statusKetersediaan.toLowerCase().includes("sibuk") || statusKetersediaan.toLowerCase().includes("tidak")
                  ? "bg-[#FF9500]"
                  : "bg-[#34C759]"
              } animate-pulse`} />
              <span className="truncate max-w-[200px]">{statusKetersediaan || "Status Kosong"}</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-apple-secondary block">
              Pilihan Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { text: "Available for Hire", dot: "bg-[#34C759]" },
                { text: "Tersedia untuk Proyek Web & Mobile", dot: "bg-[#34C759]" },
                { text: "Sedang Bekerja Penuh Waktu (Full-time)", dot: "bg-[#0071E3]" },
                { text: "Sedang Fokus Mengerjakan Proyek", dot: "bg-[#AF52DE]" },
                { text: "Terbuka untuk Kolaborasi & Diskusi", dot: "bg-[#AF52DE]" },
                { text: "Sedang Tidak Menerima Proyek Baru", dot: "bg-[#FF9500]" },
              ].map((preset) => {
                const isSelected = statusKetersediaan === preset.text;
                return (
                  <button
                    key={preset.text}
                    type="button"
                    onClick={() => setStatusKetersediaan(preset.text)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-white border-apple-blue text-apple-blue shadow-sm ring-1 ring-apple-blue/20"
                        : "bg-white/60 hover:bg-white border-black/[0.06] text-apple-text hover:border-black/[0.12]"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${preset.dot}`} />
                    <span>{preset.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-[11px] font-medium text-apple-secondary mb-1">
              Atau Tulis Status Kustom Anda:
            </label>
            <input
              type="text"
              value={statusKetersediaan}
              onChange={(e) => setStatusKetersediaan(e.target.value)}
              placeholder="Contoh: Tersedia untuk Freelance, Sedang Bekerja di Tech Company, dll."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-apple-text focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition shadow-inner"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-black/[0.06] space-y-4">
          <h3 className="text-xs font-semibold text-apple-text uppercase tracking-wider">Social Channels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-apple-secondary mb-1">GitHub</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-apple-secondary mb-1">LinkedIn</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-apple-secondary mb-1">Twitter</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="pt-4 border-t border-black/[0.06] space-y-4">
          <h3 className="text-xs font-semibold text-apple-text uppercase tracking-wider">Competencies (Comma-separated)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-apple-secondary mb-1">Frontend</label>
              <input
                type="text"
                value={frontendSkills}
                onChange={(e) => setFrontendSkills(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-apple-secondary mb-1">Backend &amp; Databases</label>
              <input
                type="text"
                value={backendSkills}
                onChange={(e) => setBackendSkills(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-apple-secondary mb-1">Tooling &amp; Cloud</label>
              <input
                type="text"
                value={toolsSkills}
                onChange={(e) => setToolsSkills(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-black/[0.06] flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 rounded-full bg-apple-blue hover:bg-apple-blue-hover disabled:opacity-50 text-white font-medium text-xs transition shadow-sm"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}
