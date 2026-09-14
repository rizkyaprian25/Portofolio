"use client";

import React, { useState } from "react";
import { Check, Download, ExternalLink, FileText, UploadCloud } from "lucide-react";
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
      setMessage({ text: "Only PDF format files are allowed", isError: true });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setFileUrl(data.url);
        setFilename(data.filename || file.name);
        setFileSize(data.size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        setMessage({ text: "PDF uploaded. Click 'Save Changes' to activate." });
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
        setMessage({ text: "Resume manifest updated successfully!" });
      } else {
        setMessage({ text: data.error || "Failed to update resume", isError: true });
      }
    } catch {
      setMessage({ text: "Connection error occurred", isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = new Date(cv.updated_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 sm:p-10 max-w-4xl space-y-8 bg-apple-canvas min-h-screen">
      <div>
        <div className="text-xs font-medium text-apple-secondary flex items-center gap-1.5 mb-1">
          <span>Workspace</span>
          <span>/</span>
          <span>Credentials</span>
          <span>/</span>
          <span className="text-apple-text">Resume</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-apple-text tracking-tight">
          Curriculum Vitae Manager
        </h1>
        <p className="text-xs sm:text-sm text-apple-secondary mt-1">
          Upload and publish your canonical resume PDF for recruiters and clients.
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

      {/* Active Document Card */}
      <div className="bg-white border border-black/[0.06] rounded-[24px] p-6 sm:p-8 shadow-apple-card space-y-6">
        <h2 className="text-xs font-semibold text-apple-secondary uppercase tracking-wider">
          Current Active Document
        </h2>

        <div className="p-5 rounded-2xl bg-apple-canvas border border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-black/[0.06] text-apple-blue flex items-center justify-center font-bold shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-apple-text">{cv.filename}</p>
              <p className="text-xs text-apple-secondary">
                Version {cv.versi} · {cv.file_size} · Last revised {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <a
              href={cv.file_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-white border border-black/[0.08] text-xs font-medium text-apple-text hover:bg-black/5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-apple-blue" />
              <span>Preview</span>
            </a>
            <a
              href={cv.file_url}
              download
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-medium text-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSave} className="space-y-6 pt-4 border-t border-black/[0.06]">
          <h3 className="text-xs font-semibold text-apple-text uppercase tracking-wider">
            Replace File
          </h3>

          <div className="border-2 border-dashed border-black/[0.08] rounded-2xl p-8 text-center hover:bg-apple-canvas/50 transition cursor-pointer">
            <label className="cursor-pointer block space-y-2">
              <UploadCloud className="w-8 h-8 text-apple-blue mx-auto" />
              <div className="text-sm font-medium text-apple-text">
                {isUploading ? "Uploading PDF..." : "Select replacement PDF document"}
              </div>
              <p className="text-xs text-apple-secondary">
                PDF format only, maximum 5MB.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-apple-secondary mb-1.5">Version Release Tag</label>
              <input
                type="text"
                value={versi}
                onChange={(e) => setVersi(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-apple-secondary mb-1.5">Display File Name</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.06] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-full bg-apple-blue hover:bg-apple-blue-hover disabled:opacity-50 text-white font-medium text-xs transition shadow-sm"
            >
              {isSaving ? "Saving..." : "Save Resume Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
