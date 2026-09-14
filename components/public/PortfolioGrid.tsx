"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight, ExternalLink, Github, X } from "lucide-react";
import { PortfolioItem } from "@/lib/db";

export default function PortfolioGrid({ projects }: { projects: PortfolioItem[] }) {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  return (
    <section id="work" className="py-20 md:py-28 bg-white border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Apple Style Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-apple-secondary block mb-2">
            Selected Works
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold text-apple-text tracking-tight leading-tight">
            Engineered with craft. Built to perform.
          </h2>
          <p className="text-base sm:text-lg text-apple-secondary mt-3">
            A showcase of digital products, scalable web systems, and open-source software crafted with rigorous attention to detail.
          </p>
        </div>

        {/* Apple Bento-Style Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col bg-apple-canvas rounded-[24px] border border-black/[0.06] overflow-hidden transition-all duration-300 hover:shadow-apple-hover hover:-translate-y-1"
            >
              {/* Card Image Area */}
              <div
                onClick={() => setSelectedProject(project)}
                className="relative aspect-[16/10] w-full bg-black/5 overflow-hidden cursor-pointer"
              >
                {project.gambar && project.gambar.length > 0 ? (
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
                    {project.link_demo && (
                      <a
                        href={project.link_demo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-apple-secondary hover:text-apple-text transition-colors flex items-center gap-1 font-medium"
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

      </div>

      {/* Apple Sheet Modal */}
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

              {/* Image Preview */}
              {selectedProject.gambar && selectedProject.gambar.length > 0 && (
                <div className="relative aspect-[16/9] w-full rounded-[20px] overflow-hidden bg-apple-canvas border border-black/[0.06]">
                  <Image
                    src={selectedProject.gambar[0]}
                    alt={selectedProject.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover object-top"
                  />
                </div>
              )}

              {/* Full Description */}
              <div className="text-sm text-apple-secondary leading-relaxed whitespace-pre-line">
                {selectedProject.deskripsi_lengkap || selectedProject.deskripsi_singkat}
              </div>

              {/* Modal Actions in Apple Pill Style */}
              <div className="pt-6 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.link_demo && (
                    <a
                      href={selectedProject.link_demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-medium text-xs transition shadow-sm"
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
