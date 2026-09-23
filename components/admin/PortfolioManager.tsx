"use client";

import React, { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  Check,
  FolderPlus,
  Github,
  ImageIcon,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { PortfolioItem, CvData } from "@/lib/db";

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function PortfolioManager({
  initialProjects,
  cvData,
}: {
  initialProjects: PortfolioItem[];
  cvData: CvData;
}) {
  const [projects, setProjects] = useState<PortfolioItem[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<"ALL" | "FEATURED">("ALL");

  // State visibilitas drawer / modal formulir
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);

  // State input formulir proyek
  const [formJudul, setFormJudul] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDeskripsiSingkat, setFormDeskripsiSingkat] = useState("");
  const [formDeskripsiLengkap, setFormDeskripsiLengkap] = useState("");
  const [formMediaType, setFormMediaType] = useState<"photo" | "video">("photo");
  const [formGambar, setFormGambar] = useState<string[]>([]);
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formTeknologi, setFormTeknologi] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [formLinkRepo, setFormLinkRepo] = useState("");
  const [formFeatured, setFormFeatured] = useState(true);
  const [formUrutan, setFormUrutan] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormJudul("");
    setFormSlug("");
    setFormDeskripsiSingkat("");
    setFormDeskripsiLengkap("");
    setFormMediaType("photo");
    setFormGambar([]);
    setFormVideoUrl("");
    setFormTeknologi(["Next.js", "TypeScript", "Tailwind CSS"]);
    setFormLinkRepo("");
    setFormFeatured(true);
    setFormUrutan(projects.length + 1);
    setFormError("");
    setIsDrawerOpen(true);
  };

  const openEditModal = (project: PortfolioItem) => {
    setEditingProject(project);
    setFormJudul(project.judul);
    setFormSlug(project.slug);
    setFormDeskripsiSingkat(project.deskripsi_singkat);
    setFormDeskripsiLengkap(project.deskripsi_lengkap);
    setFormMediaType(project.mediaType || "photo");
    setFormGambar(project.gambar || []);
    setFormVideoUrl(project.videoUrl || "");
    setFormTeknologi(project.teknologi || []);
    setFormLinkRepo(project.link_repo || "");
    setFormFeatured(project.featured);
    setFormUrutan(project.urutan);
    setFormError("");
    setIsDrawerOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormJudul(val);
    if (!editingProject) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormSlug(generatedSlug);
    }
  };

  const handleAddTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (!techInput.trim()) return;
    if (!formTeknologi.includes(techInput.trim())) {
      setFormTeknologi([...formTeknologi, techInput.trim()]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    setFormTeknologi(formTeknologi.filter((t) => t !== tech));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormGambar([data.url, ...formGambar]);
        showToast("Image uploaded");
      } else {
        setFormError(data.error || "Upload failed");
      }
    } catch {
      setFormError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (imgUrl: string) => {
    setFormGambar(formGambar.filter((u) => u !== imgUrl));
  };

  const handleToggleFeatured = async (project: PortfolioItem) => {
    const newStatus = !project.featured;
    try {
      const res = await fetch(`/api/portfolio/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newStatus }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) => (p.id === project.id ? { ...p, featured: newStatus } : p))
        );
        showToast(`Featured state updated`);
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Delete project "${judul}" permanently?`)) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        showToast("Project removed");
      } else {
        alert("Failed to remove project");
      }
    } catch {
      alert("Network error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || !formSlug.trim()) {
      setFormError("Title and slug are required");
      return;
    }

    // Validasi kelengkapan media (foto atau tautan video)
    if (formMediaType === "photo" && formGambar.length === 0) {
      setFormError("Please upload at least one image");
      return;
    }
    if (formMediaType === "video" && !formVideoUrl.trim()) {
      setFormError("Please enter a YouTube video URL");
      return;
    }
    if (formMediaType === "video" && !extractYouTubeId(formVideoUrl)) {
      setFormError("Invalid YouTube URL. Use formats like youtube.com/watch?v=... or youtu.be/...");
      return;
    }

    setIsSaving(true);
    setFormError("");

    const payload = {
      judul: formJudul,
      slug: formSlug,
      deskripsi_singkat: formDeskripsiSingkat,
      deskripsi_lengkap: formDeskripsiLengkap,
      mediaType: formMediaType,
      gambar: formMediaType === "photo" ? formGambar : [],
      videoUrl: formMediaType === "video" ? formVideoUrl : "",
      teknologi: formTeknologi,
      link_repo: formLinkRepo,
      featured: formFeatured,
      urutan: Number(formUrutan) || 1,
    };

    try {
      if (editingProject) {
        const res = await fetch(`/api/portfolio/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        if (res.ok) {
          setProjects(projects.map((p) => (p.id === editingProject.id ? updated : p)));
          setIsDrawerOpen(false);
          showToast("Project changes saved");
        } else {
          setFormError(updated.error || "Failed to save changes");
        }
      } else {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        if (res.ok) {
          setProjects([...projects, created]);
          setIsDrawerOpen(false);
          showToast("New project published");
        } else {
          setFormError(created.error || "Failed to create project");
        }
      }
    } catch {
      setFormError("Server connection error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teknologi.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFeatured = filterFeatured === "ALL" || p.featured;
    return matchesSearch && matchesFeatured;
  });

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="p-6 sm:p-10 space-y-8 bg-apple-canvas min-h-screen">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-apple-text text-white text-xs font-medium shadow-apple-float animate-fadeIn">
          <Check className="w-4 h-4 text-apple-green" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-apple-secondary flex items-center gap-1.5 mb-1 font-medium">
            <span>Workspace</span>
            <span>/</span>
            <span>Projects</span>
            <span>/</span>
            <span className="text-apple-text">Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-apple-text tracking-tight">
            Portfolio Management
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-medium text-xs transition shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-black/[0.06] rounded-[20px] p-5 shadow-apple-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-apple-secondary">
              Total Projects
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">
              Index
            </span>
          </div>
          <div className="text-3xl font-semibold text-apple-text tracking-tight">{projects.length}</div>
          <p className="text-xs text-apple-secondary">Published to live gallery</p>
        </div>

        <div className="bg-white border border-black/[0.06] rounded-[20px] p-5 shadow-apple-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-apple-secondary">
              Featured Slots
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green">
              Active
            </span>
          </div>
          <div className="text-3xl font-semibold text-apple-text tracking-tight">
            {featuredCount} <span className="text-base text-apple-secondary font-normal">/ 6 max</span>
          </div>
          <p className="text-xs text-apple-secondary">Showcased on main page</p>
        </div>

        <div className="bg-white border border-black/[0.06] rounded-[20px] p-5 shadow-apple-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-apple-secondary">
              Resume Status
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple">
              {cvData.versi}
            </span>
          </div>
          <div className="text-sm font-semibold text-apple-text truncate">{cvData.filename}</div>
          <p className="text-xs text-apple-secondary flex items-center justify-between">
            <span>Size: {cvData.file_size}</span>
            <a href={cvData.file_url} target="_blank" className="text-apple-blue hover:underline font-medium">
              View PDF ↗
            </a>
          </p>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-black/[0.06] rounded-[20px] shadow-apple-card overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-apple-canvas border border-black/[0.04] self-stretch sm:self-auto text-xs font-medium">
            <button
              onClick={() => setFilterFeatured("ALL")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterFeatured === "ALL"
                  ? "bg-white text-apple-text shadow-sm"
                  : "text-apple-secondary hover:text-apple-text"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setFilterFeatured("FEATURED")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterFeatured === "FEATURED"
                  ? "bg-white text-apple-text shadow-sm"
                  : "text-apple-secondary hover:text-apple-text"
              }`}
            >
              Featured ({featuredCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-apple-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text placeholder:text-apple-secondary focus:outline-none focus:border-apple-blue"
            />
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-apple-canvas/50 text-apple-secondary uppercase tracking-wider font-semibold border-b border-black/[0.06]">
              <tr>
                <th className="py-3 px-4 sm:px-6">Preview</th>
                <th className="py-3 px-4 sm:px-6">Title &amp; Slug</th>
                <th className="py-3 px-4 sm:px-6">Media</th>
                <th className="py-3 px-4 sm:px-6">Stack</th>
                <th className="py-3 px-4 sm:px-6 text-center">Featured</th>
                <th className="py-3 px-4 sm:px-6 text-center">Order</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-apple-secondary">
                    No matching projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-apple-canvas/60 transition-colors">
                    <td className="py-3 px-4 sm:px-6">
                      <div className="relative w-14 h-9 rounded-lg overflow-hidden bg-black/5 border border-black/[0.04] shrink-0">
                        {project.mediaType === "video" && project.videoUrl ? (
                          <div className="w-full h-full flex items-center justify-center bg-black/10">
                            <Play className="w-4 h-4 text-apple-secondary" />
                          </div>
                        ) : project.gambar && project.gambar[0] ? (
                          <SafeImage src={project.gambar[0]} alt={project.judul} fill sizes="64px" className="object-cover" fallbackText="No img" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-apple-secondary">
                            None
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 sm:px-6 max-w-xs">
                      <div className="font-semibold text-apple-text text-sm truncate">
                        {project.judul}
                      </div>
                      <div className="text-[11px] font-mono text-apple-secondary truncate">
                        /{project.slug}
                      </div>
                    </td>

                    {/* Media Type Badge */}
                    <td className="py-3 px-4 sm:px-6">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        (project.mediaType || "photo") === "video"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {(project.mediaType || "photo") === "video" ? (
                          <><Video className="w-2.5 h-2.5" /> Video</>
                        ) : (
                          <><ImageIcon className="w-2.5 h-2.5" /> Photo</>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.teknologi.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-apple-canvas border border-black/[0.06] text-apple-text"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* iOS Green Toggle Switch */}
                    <td className="py-3 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          project.featured ? "bg-apple-green" : "bg-black/20"
                        }`}
                        title="Toggle Featured"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                            project.featured ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-3 px-4 sm:px-6 text-center font-mono text-apple-secondary font-medium">
                      #{project.urutan}
                    </td>

                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1.5 rounded-lg text-apple-secondary hover:text-apple-blue hover:bg-apple-canvas transition"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.judul)}
                          className="p-1.5 rounded-lg text-apple-secondary hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apple Style Slide-Over Drawer Sheet */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl h-full bg-white border-l border-black/[0.08] shadow-apple-float flex flex-col justify-between overflow-y-auto">
            
            {/* Header */}
            <div className="p-6 border-b border-black/[0.06] flex items-center justify-between sticky top-0 bg-white/90 apple-glass z-10">
              <div>
                <h2 className="text-lg font-semibold text-apple-text tracking-tight">
                  {editingProject ? "Edit Project" : "New Project"}
                </h2>
                <p className="text-xs text-apple-secondary">
                  {editingProject ? `Path: /${editingProject.slug}` : "Configure project metadata"}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full bg-apple-canvas text-apple-secondary hover:text-apple-text transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-apple-secondary mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formJudul}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-apple-secondary mb-1">
                    Slug Identifier *
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs font-mono text-apple-text focus:outline-none focus:border-apple-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-apple-secondary mb-1">
                  Card Synopsis (Short description)
                </label>
                <textarea
                  rows={2}
                  value={formDeskripsiSingkat}
                  onChange={(e) => setFormDeskripsiSingkat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-apple-secondary mb-1">
                  Full Technical Architecture (Markdown)
                </label>
                <textarea
                  rows={4}
                  value={formDeskripsiLengkap}
                  onChange={(e) => setFormDeskripsiLengkap(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
                />
              </div>

              {/* ====== MEDIA TYPE SELECTOR (Apple Segmented Control) ====== */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-apple-secondary">
                  Project Showcase Media *
                </label>
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-apple-canvas border border-black/[0.06] text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setFormMediaType("photo")}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
                      formMediaType === "photo"
                        ? "bg-white text-apple-blue shadow-sm border border-black/[0.04]"
                        : "text-apple-secondary hover:text-apple-text"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMediaType("video")}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
                      formMediaType === "video"
                        ? "bg-white text-red-600 shadow-sm border border-black/[0.04]"
                        : "text-apple-secondary hover:text-apple-text"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video</span>
                  </button>
                </div>

                {/* Conditional: Photo Upload */}
                {formMediaType === "photo" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex flex-wrap gap-2">
                      {formGambar.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="relative w-24 h-16 rounded-xl overflow-hidden border border-black/[0.06] group shrink-0"
                        >
                          <SafeImage src={imgUrl} alt="Thumbnail" fill sizes="96px" className="object-cover" fallbackText="No img" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border border-dashed border-black/[0.1] rounded-2xl p-4 text-center hover:bg-apple-canvas transition">
                      <label className="cursor-pointer block space-y-1">
                        <UploadCloud className="w-5 h-5 text-apple-blue mx-auto" />
                        <span className="text-xs font-medium text-apple-text block">
                          {isUploading ? "Uploading..." : "Click to select screenshot (Max 3MB)"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Conditional: YouTube Video URL */}
                {formMediaType === "video" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-medium text-apple-secondary mb-1">
                        YouTube Video URL *
                      </label>
                      <input
                        type="url"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
                      />
                      <p className="text-[10px] text-apple-secondary mt-1">
                        Supports: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
                      </p>
                    </div>

                    {/* Live YouTube Preview */}
                    {formVideoUrl && extractYouTubeId(formVideoUrl) && (
                      <div className="rounded-2xl overflow-hidden border border-black/[0.06] bg-black aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(formVideoUrl)}`}
                          title="YouTube preview"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-medium text-apple-secondary mb-1">
                  Tech Stack Pills
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formTeknologi.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 text-xs px-3 py-0.5 rounded-full bg-apple-canvas border border-black/[0.06] text-apple-text"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-apple-secondary hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    placeholder="Type technology (e.g. Swift, Go) & press Enter"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3.5 py-1.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs font-medium text-apple-text hover:bg-black/5"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* GitHub Repo URL Only (Demo removed) */}
              <div>
                <label className="block text-xs font-medium text-apple-secondary mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={formLinkRepo}
                  onChange={(e) => setFormLinkRepo(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs text-apple-text focus:outline-none focus:border-apple-blue"
                />
              </div>

              {/* Order & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/[0.06]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-apple-blue focus:ring-apple-blue"
                  />
                  <label htmlFor="featured-checkbox" className="text-xs font-medium text-apple-text cursor-pointer">
                    Showcase on Home
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-apple-secondary mb-1">Order Index</label>
                  <input
                    type="number"
                    min={1}
                    value={formUrutan}
                    onChange={(e) => setFormUrutan(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-apple-canvas border border-black/[0.06] text-xs font-mono text-apple-text focus:outline-none focus:border-apple-blue"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-black/[0.06] flex items-center justify-end gap-3 sticky bottom-0 bg-white py-4">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-apple-secondary hover:text-apple-text hover:bg-apple-canvas transition"
                >
                  Cancel
                </button>
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
        </div>
      )}
    </div>
  );
}
