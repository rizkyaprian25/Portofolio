"use client";

import React, { useState } from "react";
import { Check, Download, ExternalLink, FileCheck, FileText, UploadCloud } from "lucide-react";
import { CvData } from "@/lib/db";

export default function CvManager({ initialCv }: { initialCv: CvData }) {
  const [cv, setCv] = useState<CvData>(initialCv);
  const [versi, setVersi] = useState(cv.versi);
  const [fileUrl, setFileUrl] = useState(cv.file_url);
  const [filename, setFilename] = useState(cv.filename);
  const [fileSize, setFileSize] = useState(cv.file_size);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage({ text: "Hanya berkas format PDF yang diperbolehkan", isError: true });
      return;
    }

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
        setFileUrl(data.url);
        setFilename(data.filename || file.name);
        setFileSize(data.size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        setMessage({ text: "Berkas PDF berhasil diunggah. Klik 'Simpan Perubahan' untuk mengaktifkan." });
      } else {
        setMessage({ text: data.error || "Gagal mengunggah berkas PDF", isError: true });
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

    const payload: Partial<CvData> = {
      file_url: fileUrl,
      filename,
      file_size: fileSize,
      versi,
    };

    try {
      const res = await fetch("/api/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setCv(data);
        setMessage({ text: "Berkas CV berhasil diperbarui!" });
      } else {
        setMessage({ text: data.error || "Gagal memperbarui data CV", isError: true });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan koneksi server", isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = new Date(cv.updated_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-6 sm:p-10 max-w-4xl space-y-8">
      <div>
        <div className="text-xs font-medium text-ink-muted flex items-center gap-2 mb-1">
          <span>Admin</span>
          <span>/</span>
          <span>Curriculum Vitae</span>
          <span>/</span>
          <span className="text-ink font-semibold">Manager</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
          Kelola Berkas CV / Resume
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary mt-1">
          Ganti berkas PDF CV yang dapat diunduh oleh pengunjung dan perekrut di halaman publik.
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

      {/* Current File Card */}
      <div className="bg-canvas-card border border-canvas-border rounded-2xl p-6 sm:p-8 shadow-sunlit space-y-6">
        <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
          Berkas CV Aktif Saat Ini
        </h2>

        <div className="p-5 rounded-xl bg-canvas-subtle border border-canvas-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sun-100 text-sun-700 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{cv.filename}</p>
              <p className="text-xs text-ink-muted">
                Versi: {cv.versi} • Ukuran: {cv.file_size} • Terakhir diupdate: {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <a
              href={cv.file_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-semibold text-ink hover:bg-canvas-subtle transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
              <span>Lihat PDF</span>
            </a>
            <a
              href={cv.file_url}
              download
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-sun-500 hover:bg-sun-600 text-ink font-semibold text-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </a>
          </div>
        </div>

        {/* Form Upload & Update */}
        <form onSubmit={handleSave} className="space-y-6 pt-4 border-t border-canvas-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
            Ganti atau Perbarui Berkas
          </h3>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-canvas-border rounded-2xl p-8 text-center hover:bg-canvas-subtle/50 transition cursor-pointer">
            <label className="cursor-pointer block space-y-2">
              <UploadCloud className="w-10 h-10 text-sun-600 mx-auto" />
              <div className="text-sm font-semibold text-ink">
                {isUploading ? "Mengunggah berkas PDF..." : "Klik untuk pilih berkas PDF baru"}
              </div>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Hanya menerima format PDF dengan ukuran maksimal 5MB.
              </p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Version Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                Label Versi (Misal: v3.2 atau 2025 Edition)
              </label>
              <input
                type="text"
                value={versi}
                onChange={(e) => setVersi(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                Nama File Tampilan
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-canvas-border flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-sun-500 hover:bg-sun-600 disabled:opacity-50 text-ink font-semibold text-xs transition shadow-sm"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan CV"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
