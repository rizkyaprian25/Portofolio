"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Github, Play, X, ArrowRight, ArrowLeft } from "lucide-react";
import { PortfolioItem } from "@/lib/db";

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

interface PortfolioGridProps {
  projects: PortfolioItem[];
  limit?: number;
  showViewAll?: boolean;
  isProjectsPage?: boolean;
}

export default function PortfolioGrid({
  projects,
  limit,
  showViewAll = false,
  isProjectsPage = false,
}: PortfolioGridProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filter logic for projects page
  const displayedProjects = React.useMemo(() => {
    let list = projects;
    if (isProjectsPage && activeFilter !== "all") {
      list = list.filter((p) => {
        if (activeFilter === "video") return p.mediaType === "video";
        if (activeFilter === "photo") return p.mediaType === "photo" || !p.mediaType;
        return p.teknologi.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()));
      });
    }
    if (limit && !isProjectsPage) {
      return list.slice(0, limit);
    }
    return list;
  }, [projects, limit, isProjectsPage, activeFilter]);

  // Unique categories for filtering on projects page
  const techCategories = React.useMemo(() => {
    if (!isProjectsPage) return [];
    const set = new Set<string>();
    projects.forEach((p) => {
      p.teknologi.forEach((t) => set.add(t));
    });
    return Array.from(set).slice(0, 6);
  }, [projects, isProjectsPage]);

  return (
    <section id="work" className={`py-20 md:py-28 ${isProjectsPage ? "bg-apple-canvas" : "bg-white border-t border-black/[0.06]"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Apple Style Section / Page Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          {isProjectsPage ? (
            <>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-medium text-apple-secondary hover:text-apple-text mb-6 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Kembali ke Beranda</span>
              </Link>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary">
                  Project Archive
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue font-medium">
                  {projects.length} Proyek
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold text-apple-text tracking-tight leading-tight">
                Semua Proyek &amp; Eksplorasi
              </h1>
              <p className="text-base sm:text-lg text-apple-secondary mt-3 leading-relaxed">
                Koleksi lengkap seluruh aplikasi web, mobile, sistem backend, dan produk digital yang telah dirancang dan dibangun.
              </p>

              {/* Filter Pills for Projects Page */}
              <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeFilter === "all"
                      ? "bg-apple-text text-white shadow-sm"
                      : "bg-white border border-black/[0.08] text-apple-secondary hover:text-apple-text hover:bg-black/[0.02]"
                  }`}
                >
                  Semua ({projects.length})
                </button>
                {techCategories.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setActiveFilter(tech)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeFilter === tech
                        ? "bg-apple-text text-white shadow-sm"
                        : "bg-white border border-black/[0.08] text-apple-secondary hover:text-apple-text hover:bg-black/[0.02]"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary block mb-2">
                Selected Works
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-apple-text tracking-tight leading-tight">
                Engineered with craft. Built to perform.
              </h2>
              <p className="text-base sm:text-lg text-apple-secondary mt-3 leading-relaxed">
                A showcase of digital products, scalable web systems, and open-source software crafted with rigorous attention to detail.
              </p>
            </>
          )}
        </div>

        {/* Apple Bento-Style Project Cards Grid */}
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col bg-apple-canvas rounded-[24px] border border-black/[0.06] overflow-hidden transition-all duration-300 hover:shadow-apple-hover hover:-translate-y-1"
              >
                {/* Card Media Area — Photo or Video Thumbnail */}
                <div
                  onClick={() => setSelectedProject(project)}
                  className="relative aspect-[16/10] w-full bg-black/5 overflow-hidden cursor-pointer"
                >
                  {(project.mediaType || "photo") === "video" && project.videoUrl ? (
                    // YouTube Thumbnail with Play overlay
                    <>
                      {extractYouTubeId(project.videoUrl) && (
                        <Image
                          src={`https://img.youtube.com/vi/${extractYouTubeId(project.videoUrl)}/hqdefault.jpg`}
                          alt={project.judul}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-red-600 ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : project.gambar && project.gambar.length > 0 ? (
                    <Image
                      src={project.gambar[0]}
                      alt={project.judul}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-apple-secondary text-xs">
                      No preview
                    </div>
                  )}
                  
                  {project.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full apple-glass border border-black/[0.08] text-[11px] font-semibold text-apple-text shadow-sm">
                      Featured
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Technology Tags in Apple Minimalist Capsule */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.teknologi.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-apple-text shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setSelectedProject(project)}
                      className="text-lg font-semibold text-apple-text group-hover:text-apple-blue transition-colors cursor-pointer leading-snug tracking-tight"
                    >
                      {project.judul}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-apple-secondary mt-2 line-clamp-2 leading-relaxed">
                      {project.deskripsi_singkat}
                    </p>
                  </div>

                  {/* Apple Style Text Actions */}
                  <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-0.5 text-apple-blue font-medium hover:underline group/btn"
                    >
                      <span>Learn more</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    <div className="flex items-center gap-3">
                      {project.link_repo && (
                        <a
                          href={project.link_repo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-apple-secondary hover:text-apple-text transition-colors"
                          title="GitHub"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-apple-canvas rounded-[24px] border border-black/[0.06]">
            <p className="text-apple-secondary text-sm">Tidak ada proyek yang sesuai dengan filter yang dipilih.</p>
            <button
              onClick={() => setActiveFilter("all")}
              className="mt-3 text-xs text-apple-blue font-medium hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}

        {/* Lihat Selengkapnya CTA Button for Homepage */}
        {showViewAll && (
          <div className="mt-14 sm:mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-apple-text text-white hover:bg-black font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-apple-hover active:scale-95 group"
            >
              <span>Lihat Selengkapnya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

      </div>

      {/* Apple Sheet Modal — Detail View */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-apple-card rounded-[28px] border border-black/[0.08] shadow-apple-float p-6 sm:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-apple-canvas text-apple-secondary hover:text-apple-text transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Body */}
            <div className="space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.teknologi.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-apple-canvas border border-black/[0.06] text-apple-text"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-semibold text-apple-text tracking-tight">
                {selectedProject.judul}
              </h3>

              {/* Media Preview — Photo or Embedded YouTube */}
              {(selectedProject.mediaType || "photo") === "video" && selectedProject.videoUrl && extractYouTubeId(selectedProject.videoUrl) ? (
                <div className="relative aspect-video w-full rounded-[20px] overflow-hidden bg-black border border-black/[0.06]">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedProject.videoUrl)}?rel=0`}
                    title={selectedProject.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : selectedProject.gambar && selectedProject.gambar.length > 0 ? (
                <div className="relative aspect-[16/9] w-full rounded-[20px] overflow-hidden bg-apple-canvas border border-black/[0.06]">
                  <Image
                    src={selectedProject.gambar[0]}
                    alt={selectedProject.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover object-top"
                  />
                </div>
              ) : null}

              {/* Full Description */}
              <div className="text-sm text-apple-secondary leading-relaxed whitespace-pre-line">
                {selectedProject.deskripsi_lengkap || selectedProject.deskripsi_singkat}
              </div>

              {/* Modal Actions in Apple Pill Style */}
              <div className="pt-6 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.link_repo && (
                    <a
                      href={selectedProject.link_repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-apple-canvas hover:bg-black/5 border border-black/[0.08] text-apple-text font-medium text-xs transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-xs font-medium text-apple-secondary hover:text-apple-text px-3 py-1.5"
                >
                  Done
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
}
