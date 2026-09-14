"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Check,
  ExternalLink,
  Eye,
  FileText,
  FolderPlus,
  Github,
  Layers,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { PortfolioItem, CvData } from "@/lib/db";

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

  // Drawer / Modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);

  // Form states
  const [formJudul, setFormJudul] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDeskripsiSingkat, setFormDeskripsiSingkat] = useState("");
  const [formDeskripsiLengkap, setFormDeskripsiLengkap] = useState("");
  const [formGambar, setFormGambar] = useState<string[]>([]);
  const [formTeknologi, setFormTeknologi] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [formLinkDemo, setFormLinkDemo] = useState("");
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
    setFormGambar([]);
    setFormTeknologi(["Next.js", "TypeScript", "Tailwind CSS"]);
    setFormLinkDemo("");
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
    setFormGambar(project.gambar || []);
    setFormTeknologi(project.teknologi || []);
    setFormLinkDemo(project.link_demo || "");
    setFormLinkRepo(project.link_repo || "");
    setFormFeatured(project.featured);
    setFormUrutan(project.urutan);
    setFormError("");
    setIsDrawerOpen(true);
  };

  // Auto-generate slug from title if creating
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
        showToast("Gambar berhasil diunggah");
      } else {
        setFormError(data.error || "Gagal upload gambar");
      }
    } catch {
      setFormError("Gagal upload gambar");
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
        showToast(`Status featured diperbarui`);
      }
    } catch {
      alert("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus proyek "${judul}" secara permanen?`)) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        showToast("Proyek berhasil dihapus");
      } else {
        alert("Gagal menghapus proyek");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || !formSlug.trim()) {
      setFormError("Judul dan slug wajib diisi");
      return;
    }

    setIsSaving(true);
    setFormError("");

    const payload = {
      judul: formJudul,
      slug: formSlug,
      deskripsi_singkat: formDeskripsiSingkat,
      deskripsi_lengkap: formDeskripsiLengkap,
      gambar: formGambar,
      teknologi: formTeknologi,
      link_demo: formLinkDemo,
      link_repo: formLinkRepo,
      featured: formFeatured,
      urutan: Number(formUrutan) || 1,
    };

    try {
      if (editingProject) {
        // UPDATE
        const res = await fetch(`/api/portfolio/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        if (res.ok) {
          setProjects(projects.map((p) => (p.id === editingProject.id ? updated : p)));
          setIsDrawerOpen(false);
          showToast("Perubahan proyek berhasil disimpan");
        } else {
          setFormError(updated.error || "Gagal menyimpan perubahan");
        }
      } else {
        // CREATE
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        if (res.ok) {
          setProjects([...projects, created]);
          setIsDrawerOpen(false);
          showToast("Proyek baru berhasil ditambahkan");
        } else {
          setFormError(created.error || "Gagal membuat proyek");
        }
      }
    } catch {
      setFormError("Terjadi kesalahan koneksi server");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teknologi.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFeatured = filterFeatured === "ALL" || p.featured;
    return matchesSearch && matchesFeatured;
  });

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-ink text-canvas-card text-xs font-semibold shadow-sunlit-lg animate-fadeIn">
          <Check className="w-4 h-4 text-botanical-500" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Bar / Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-ink-muted flex items-center gap-2 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-ink font-semibold">Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
            Manage Portfolio Projects
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-ink font-semibold text-xs transition shadow-sm hover:shadow active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Project</span>
        </button>
      </div>

      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-canvas-card border border-canvas-border rounded-2xl p-5 shadow-sunlit space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Total Projects
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-botanical-50 text-botanical-700 border border-botanical-100">
              Live Index
            </span>
          </div>
          <div className="text-3xl font-serif text-ink">{projects.length}</div>
          <p className="text-xs text-ink-secondary">Karya terpublikasi di website</p>
        </div>

        {/* Card 2 */}
        <div className="bg-canvas-card border border-canvas-border rounded-2xl p-5 shadow-sunlit space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Featured Slots
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sun-50 text-sun-700 border border-sun-100">
              Homepage
            </span>
          </div>
          <div className="text-3xl font-serif text-ink">
            {featuredCount} <span className="text-base text-ink-muted font-sans">/ 6 max</span>
          </div>
          <p className="text-xs text-ink-secondary">Karya unggulan di halaman depan</p>
        </div>

        {/* Card 3 */}
        <div className="bg-canvas-card border border-canvas-border rounded-2xl p-5 shadow-sunlit space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              CV Manifest
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              {cvData.versi}
            </span>
          </div>
          <div className="text-base font-semibold text-ink truncate">{cvData.filename}</div>
          <p className="text-xs text-ink-muted flex items-center justify-between">
            <span>Size: {cvData.file_size}</span>
            <a href={cvData.file_url} target="_blank" className="text-sky-600 hover:underline">
              Preview CV ↗
            </a>
          </p>
        </div>
      </div>

      {/* Main Content Area / Data Table */}
      <div className="bg-canvas-card border border-canvas-border rounded-2xl shadow-sunlit overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-canvas-subtle border border-canvas-border self-stretch sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setFilterFeatured("ALL")}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                filterFeatured === "ALL"
                  ? "bg-canvas-card text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Semua ({projects.length})
            </button>
            <button
              onClick={() => setFilterFeatured("FEATURED")}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                filterFeatured === "FEATURED"
                  ? "bg-canvas-card text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Featured ({featuredCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau teknologi..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-sun-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle/60 text-ink-muted uppercase tracking-wider font-semibold border-b border-canvas-border">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Preview</th>
                <th className="py-3.5 px-4 sm:px-6">Judul & Slug</th>
                <th className="py-3.5 px-4 sm:px-6">Teknologi</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Featured</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Urutan</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border font-sans">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ink-muted">
                    Tidak ada proyek yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-canvas-subtle/50 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-canvas-subtle border border-canvas-border shrink-0">
                        {project.gambar && project.gambar[0] ? (
                          <Image
                            src={project.gambar[0]}
                            alt={project.judul}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-ink-muted">
                            None
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Judul & Slug */}
                    <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                      <div className="font-semibold text-ink text-sm truncate">
                        {project.judul}
                      </div>
                      <div className="text-[11px] font-mono text-ink-muted truncate">
                        /{project.slug}
                      </div>
                    </td>

                    {/* Teknologi Tags */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.teknologi.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-sun-50 text-amber-900 border border-sun-100"
                          >
                            {t}
                          </span>
                        ))}
                        {project.teknologi.length > 3 && (
                          <span className="text-[10px] text-ink-muted px-1">
                            +{project.teknologi.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          project.featured ? "bg-sun-500" : "bg-canvas-border"
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

                    {/* Urutan */}
                    <td className="py-3.5 px-4 sm:px-6 text-center font-mono text-ink-muted font-medium">
                      #{project.urutan}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-subtle transition"
                          title="Edit Proyek"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.judul)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Slide-over Drawer / Modal Edit Project */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl h-full bg-canvas-card border-l border-canvas-border shadow-sunlit-lg flex flex-col justify-between overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-canvas-border flex items-center justify-between sticky top-0 bg-canvas-card z-10">
              <div>
                <h2 className="font-serif text-xl text-ink">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <p className="text-xs text-ink-muted">
                  {editingProject ? `Editing: ${editingProject.slug}` : "Lengkapi rincian portofolio"}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-subtle transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    value={formJudul}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Aura Writing Platform"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="aura-writing-platform"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs font-mono text-ink focus:outline-none focus:border-sun-500"
                  />
                </div>
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-semibold text-ink-secondary mb-1">
                  Deskripsi Singkat (Tampil di kartu)
                </label>
                <textarea
                  rows={2}
                  value={formDeskripsiSingkat}
                  onChange={(e) => setFormDeskripsiSingkat(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat mengenai tujuan proyek..."
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
                />
              </div>

              {/* Deskripsi Lengkap (Markdown) */}
              <div>
                <label className="block text-xs font-semibold text-ink-secondary mb-1">
                  Deskripsi Lengkap / Spesifikasi Arsitektur
                </label>
                <textarea
                  rows={4}
                  value={formDeskripsiLengkap}
                  onChange={(e) => setFormDeskripsiLengkap(e.target.value)}
                  placeholder="Ceritakan proses pembuatan, arsitektur, tantangan teknik..."
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
                />
              </div>

              {/* Gambar / Mockup Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-ink-secondary mb-1">
                  Gambar Mockup / Screenshot
                </label>
                <div className="space-y-3">
                  {/* Current images preview */}
                  <div className="flex flex-wrap gap-2">
                    {formGambar.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative w-24 h-16 rounded-lg overflow-hidden border border-canvas-border group shrink-0"
                      >
                        <Image src={imgUrl} alt="Thumbnail" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(imgUrl)}
                          className="absolute top-1 right-1 bg-ink/70 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upload button or URL input */}
                  <div className="border border-dashed border-canvas-border rounded-xl p-4 text-center hover:bg-canvas-subtle transition">
                    <label className="cursor-pointer block space-y-1">
                      <UploadCloud className="w-6 h-6 text-sun-600 mx-auto" />
                      <span className="text-xs font-medium text-ink block">
                        {isUploading ? "Mengunggah..." : "Klik untuk upload gambar baru (Maks 3MB)"}
                      </span>
                      <span className="text-[10px] text-ink-muted block">JPG, PNG, atau WebP</span>
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
              </div>

              {/* Teknologi Pills */}
              <div>
                <label className="block text-xs font-semibold text-ink-secondary mb-1">
                  Teknologi Stack
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formTeknologi.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md bg-sun-50 text-amber-900 border border-sun-200"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-600"
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
                    placeholder="Ketik teknologi (misal: Docker, Go) lalu tekan Enter"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 rounded-xl bg-canvas-card border border-canvas-border text-xs font-semibold hover:bg-canvas-subtle"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Links Demo & Repo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formLinkDemo}
                    onChange={(e) => setFormLinkDemo(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={formLinkRepo}
                    onChange={(e) => setFormLinkRepo(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-canvas-border text-xs text-ink focus:outline-none focus:border-sun-500"
                  />
                </div>
              </div>

              {/* Featured & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-canvas-border">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-sun-500 focus:ring-sun-400"
                  />
                  <label htmlFor="featured-checkbox" className="text-xs font-medium text-ink cursor-pointer">
                    Tampilkan sebagai Featured di Beranda
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1">
                    Urutan Tampil (Nomor)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formUrutan}
                    onChange={(e) => setFormUrutan(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-canvas border border-canvas-border text-xs font-mono text-ink focus:outline-none focus:border-sun-500"
                  />
                </div>
              </div>

              {/* Drawer Footer / Submit */}
              <div className="pt-6 border-t border-canvas-border flex items-center justify-end gap-3 sticky bottom-0 bg-canvas-card py-4">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-canvas-card border border-canvas-border text-xs font-semibold text-ink-secondary hover:bg-canvas-subtle transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-sun-500 hover:bg-sun-600 disabled:opacity-50 text-ink font-semibold text-xs transition shadow-sm"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
