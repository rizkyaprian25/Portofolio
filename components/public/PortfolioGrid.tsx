"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Github, Play, X, ArrowRight, ArrowLeft, Share2, Search } from "lucide-react";
import { PortfolioItem } from "@/lib/db";
import { playClickSound, playPopSound } from "@/lib/audio";
import { triggerToast } from "./ToastNotification";
import SpotlightCard from "./SpotlightCard";

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
  const [highlightedTech, setHighlightedTech] = useState<string | null>(null);

  // Connected Skill Highlighting Listener & Filter Listener
  useEffect(() => {
    const handleFilterTech = (e: CustomEvent<string>) => {
      const tech = e.detail;
      if (isProjectsPage) {
        setActiveFilter(tech);
      } else {
        setHighlightedTech(tech);
        const el = document.getElementById("work");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        triggerToast(`Menyorot proyek dengan teknologi "${tech}"`);
        setTimeout(() => setHighlightedTech(null), 4500);
      }
    };

    const handleOpenProjectPreview = (e: CustomEvent<string | number>) => {
      const p = projects.find((item) => String(item.id) === String(e.detail));
      if (p) {
        setSelectedProject(p);
      }
    };

    window.addEventListener("filter-tech" as any, handleFilterTech);
    window.addEventListener("open-project-preview" as any, handleOpenProjectPreview);
    return () => {
      window.removeEventListener("filter-tech" as any, handleFilterTech);
      window.removeEventListener("open-project-preview" as any, handleOpenProjectPreview);
    };
  }, [projects, isProjectsPage]);

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

  // Copy Project Link
  const handleCopyProjectLink = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    const url = typeof window !== "undefined" ? `${window.location.origin}/projects` : "";
    navigator.clipboard.writeText(url);
    triggerToast(`Tautan portofolio disalin ke clipboard!`);
  };

  return (
    <section
      id="work"
      className={`py-20 md:py-28 transition-colors duration-200 ${
        isProjectsPage
          ? "bg-apple-canvas dark:bg-apple-canvas-dark"
          : "bg-white dark:bg-black border-t border-black/[0.06] dark:border-white/[0.08]"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Apple Style Section / Page Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          {isProjectsPage ? (
            <>
              <Link
                href="/"
                onClick={() => playClickSound()}
                className="inline-flex items-center gap-2 text-xs font-medium text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white mb-6 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Kembali ke Beranda</span>
              </Link>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary dark:text-apple-secondary-dark">
                  Project Archive
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue font-medium">
                  {projects.length} Proyek
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold text-apple-text dark:text-apple-text-dark tracking-tight leading-tight">
                Semua Proyek &amp; Eksplorasi
              </h1>
              <p className="text-base sm:text-lg text-apple-secondary dark:text-apple-secondary-dark mt-3 leading-relaxed">
                Koleksi lengkap seluruh aplikasi web, mobile, sistem backend, dan produk digital yang telah dirancang dan dibangun.
              </p>

              {/* Apple-styled Search Bar Trigger for Projects Page */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    window.dispatchEvent(new CustomEvent("open-command-palette"));
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-apple-card-dark border border-black/[0.08] dark:border-white/[0.1] text-apple-secondary dark:text-apple-secondary-dark hover:border-apple-blue/50 dark:hover:border-apple-blue/50 shadow-sm hover:shadow-apple-hover transition-all text-left group cursor-pointer"
                  title="Cari proyek atau filter cepat (Cmd+K)"
                >
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <Search className="w-4 h-4 text-apple-secondary group-hover:text-apple-blue transition-colors" />
                    <span className="text-apple-secondary dark:text-apple-secondary-dark group-hover:text-apple-text dark:group-hover:text-white transition-colors">
                      Cari proyek berdasarkan judul, teknologi, atau deskripsi...
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-apple-secondary dark:text-apple-secondary-dark border border-black/5 dark:border-white/10">
                      ⌘K / Ctrl+K
                    </kbd>
                  </div>
                </button>
              </div>

              {/* Filter Pills for Projects Page */}
              <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveFilter("all");
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeFilter === "all"
                      ? "bg-apple-text dark:bg-white text-white dark:text-black shadow-sm"
                      : "bg-white dark:bg-apple-card-dark border border-black/[0.08] dark:border-white/[0.08] text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/5"
                  }`}
                >
                  Semua ({projects.length})
                </button>
                {techCategories.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveFilter(tech);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeFilter === tech
                        ? "bg-apple-text dark:bg-white text-white dark:text-black shadow-sm"
                        : "bg-white dark:bg-apple-card-dark border border-black/[0.08] dark:border-white/[0.08] text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/5"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary dark:text-apple-secondary-dark block mb-2">
                Selected Works
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold text-apple-text dark:text-apple-text-dark tracking-tight leading-tight">
                Engineered with craft. Built to perform.
              </h2>
              <p className="text-base sm:text-lg text-apple-secondary dark:text-apple-secondary-dark mt-3 leading-relaxed">
                A showcase of digital products, scalable web systems, and open-source software crafted with rigorous attention to detail.
              </p>
            </>
          )}
        </div>

        {/* Apple Bento-Style Project Cards Grid */}
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedProjects.map((project) => {
              const isMatch = highlightedTech && project.teknologi.some((t) => t.toLowerCase().includes(highlightedTech.toLowerCase()));
              return (
                <SpotlightCard
                  key={project.id}
                  id={`project-${project.id}`}
                  className={`group flex flex-col bg-apple-canvas dark:bg-apple-card-dark rounded-[24px] border overflow-hidden transition-all duration-300 hover:shadow-apple-hover hover:-translate-y-1 scroll-mt-24 ${
                    isMatch
                      ? "ring-2 ring-apple-blue border-apple-blue scale-[1.02] shadow-apple-float"
                      : "border-black/[0.06] dark:border-white/[0.08]"
                  }`}
                >
                  {/* Card Media Area — Photo or Video Thumbnail */}
                  <div
                    onClick={() => {
                      playPopSound();
                      setSelectedProject(project);
                    }}
                    className="relative aspect-[16/10] w-full bg-black/5 dark:bg-white/5 overflow-hidden cursor-pointer"
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
                          <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
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
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full apple-glass border border-black/[0.08] dark:border-white/[0.1] text-[11px] font-semibold text-apple-text dark:text-apple-text-dark shadow-sm">
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
                            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors ${
                              highlightedTech && tech.toLowerCase().includes(highlightedTech.toLowerCase())
                                ? "bg-apple-blue text-white border-apple-blue"
                                : "bg-white dark:bg-white/10 border-black/[0.06] dark:border-white/10 text-apple-text dark:text-apple-text-dark"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => {
                          playPopSound();
                          setSelectedProject(project);
                        }}
                        className="text-lg font-semibold text-apple-text dark:text-apple-text-dark group-hover:text-apple-blue transition-colors cursor-pointer leading-snug tracking-tight"
                      >
                        {project.judul}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-apple-secondary dark:text-apple-secondary-dark mt-2 line-clamp-2 leading-relaxed">
                        {project.deskripsi_singkat}
                      </p>
                    </div>

                    {/* Apple Style Text Actions */}
                    <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          playPopSound();
                          setSelectedProject(project);
                        }}
                        className="inline-flex items-center gap-0.5 text-apple-blue font-medium hover:underline group/btn"
                      >
                        <span>Learn more</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>

                      <div className="flex items-center gap-3">
                        {/* Share Project Link Button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyProjectLink(project.judul, e)}
                          className="text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white transition-colors"
                          title="Salin tautan proyek"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {project.link_repo && (
                          <a
                            href={project.link_repo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white transition-colors"
                            title="GitHub"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-apple-canvas dark:bg-apple-card-dark rounded-[24px] border border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-apple-secondary dark:text-apple-secondary-dark text-sm">Tidak ada proyek yang sesuai dengan filter yang dipilih.</p>
            <button
              onClick={() => {
                playClickSound();
                setActiveFilter("all");
              }}
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
              onClick={() => playPopSound()}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-apple-text dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-white/90 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-apple-hover active:scale-95 group"
            >
              <span>Lihat Selengkapnya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

      </div>

      {/* Apple Sheet Modal — Detail View */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-apple-card dark:bg-apple-card-dark rounded-[28px] border border-black/[0.08] dark:border-white/[0.1] shadow-apple-float p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => {
                playClickSound();
                setSelectedProject(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-apple-canvas dark:bg-white/10 text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white transition-colors"
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
                    className="text-xs font-medium px-3 py-1 rounded-full bg-apple-canvas dark:bg-white/10 border border-black/[0.06] dark:border-white/[0.08] text-apple-text dark:text-apple-text-dark"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-semibold text-apple-text dark:text-apple-text-dark tracking-tight">
                {selectedProject.judul}
              </h3>

              {/* Media Preview — Photo or Embedded YouTube */}
              {(selectedProject.mediaType || "photo") === "video" && selectedProject.videoUrl && extractYouTubeId(selectedProject.videoUrl) ? (
                <div className="relative aspect-video w-full rounded-[20px] overflow-hidden bg-black border border-black/[0.06] dark:border-white/[0.08]">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedProject.videoUrl)}?rel=0`}
                    title={selectedProject.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : selectedProject.gambar && selectedProject.gambar.length > 0 ? (
                <div className="relative aspect-[16/9] w-full rounded-[20px] overflow-hidden bg-apple-canvas dark:bg-black border border-black/[0.06] dark:border-white/[0.08]">
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
              <div className="text-sm text-apple-secondary dark:text-apple-secondary-dark leading-relaxed whitespace-pre-line">
                {selectedProject.deskripsi_lengkap || selectedProject.deskripsi_singkat}
              </div>

              {/* Modal Actions in Apple Pill Style */}
              <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.link_repo && (
                    <a
                      href={selectedProject.link_repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-apple-canvas dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/15 border border-black/[0.08] dark:border-white/[0.1] text-apple-text dark:text-apple-text-dark font-medium text-xs transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleCopyProjectLink(selectedProject.judul, e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-apple-canvas dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/15 border border-black/[0.08] dark:border-white/[0.1] text-apple-text dark:text-apple-text-dark font-medium text-xs transition"
                  >
                    <Share2 className="w-3.5 h-3.5 text-apple-blue" />
                    <span>Salin Link</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedProject(null);
                  }}
                  className="text-xs font-medium text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white px-3 py-1.5"
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

