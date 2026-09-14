"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Github, Sparkles, X } from "lucide-react";
import { PortfolioItem } from "@/lib/db";

export default function PortfolioGrid({ projects }: { projects: PortfolioItem[] }) {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Soft cheerful pastel colors for technology pills
  const getTagColorClass = (index: number) => {
    const colors = [
      "bg-sun-100 text-amber-800 border-amber-200",
      "bg-sky-100 text-sky-800 border-sky-200",
      "bg-botanical-100 text-emerald-800 border-emerald-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-purple-100 text-purple-800 border-purple-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="work" className="py-16 md:py-24 border-t border-canvas-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sun-600 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selected Work</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
            Curated projects & engineering studies
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary mt-2">
            A small collection of digital products, distributed systems, and open-source explorations built with architectural rigor.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className="group flex flex-col bg-canvas-card rounded-2xl border border-canvas-border overflow-hidden shadow-sunlit hover:shadow-sunlit-hover transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Image Thumbnail */}
              <div
                onClick={() => setSelectedProject(project)}
                className="relative aspect-[16/10] w-full bg-canvas-subtle overflow-hidden cursor-pointer"
              >
                {project.gambar && project.gambar.length > 0 ? (
                  <Image
                    src={project.gambar[0]}
                    alt={project.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-muted text-xs">
                    No preview available
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-sun-500 text-ink text-[10px] font-bold tracking-wider uppercase shadow-sm">
                    Featured
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.teknologi.map((tech, techIdx) => (
                      <span
                        key={tech}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getTagColorClass(
                          techIdx
                        )}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-serif text-xl font-normal text-ink group-hover:text-sun-600 transition-colors cursor-pointer leading-snug"
                  >
                    {project.judul}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-ink-secondary mt-2 line-clamp-2 leading-relaxed">
                    {project.deskripsi_singkat}
                  </p>
                </div>

                {/* Card Action Links */}
                <div className="pt-5 mt-5 border-t border-canvas-border flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-ink hover:text-sun-600 transition-colors"
                  >
                    <span>Read Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3">
                    {project.link_demo && (
                      <a
                        href={project.link_demo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-ink-muted hover:text-ink transition-colors flex items-center gap-1"
                        title="Live Preview"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.link_repo && (
                      <a
                        href={project.link_repo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-ink-muted hover:text-ink transition-colors flex items-center gap-1"
                        title="GitHub Repository"
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

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-canvas-card rounded-2xl border border-canvas-border shadow-sunlit-lg p-6 sm:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink hover:bg-canvas-subtle transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-5">
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.teknologi.map((tech, i) => (
                  <span
                    key={tech}
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-md border ${getTagColorClass(
                      i
                    )}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug">
                {selectedProject.judul}
              </h3>

              {/* Big Image */}
              {selectedProject.gambar && selectedProject.gambar.length > 0 && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-canvas-subtle border border-canvas-border">
                  <Image
                    src={selectedProject.gambar[0]}
                    alt={selectedProject.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover object-top"
                  />
                </div>
              )}

              {/* Full Description */}
              <div className="text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
                {selectedProject.deskripsi_lengkap || selectedProject.deskripsi_singkat}
              </div>

              {/* Modal Actions */}
              <div className="pt-5 border-t border-canvas-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.link_demo && (
                    <a
                      href={selectedProject.link_demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sun-500 hover:bg-sun-600 text-ink font-semibold text-xs transition shadow-sm"
                    >
                      <span>Open Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {selectedProject.link_repo && (
                    <a
                      href={selectedProject.link_repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-canvas-card hover:bg-canvas-subtle border border-canvas-border text-ink font-semibold text-xs transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-xs font-medium text-ink-muted hover:text-ink px-3 py-1.5"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
}
