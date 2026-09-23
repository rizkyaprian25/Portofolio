"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  FolderGit2,
  FileText,
  Mail,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Github,
  Linkedin,
  Compass,
  ArrowRight,
  Eye,
  Download,
  X,
} from "lucide-react";
import { PortfolioItem, Profile, CvData } from "@/lib/db";
import { playClickSound, playPopSound, isSoundMuted, setSoundMuted } from "@/lib/audio";
import { triggerToast } from "./ToastNotification";
import { openCvQuickLook } from "./CvQuickLookModal";

export function openCommandPalette() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }
}

interface CommandPaletteProps {
  projects: PortfolioItem[];
  profile: Profile;
  cv: CvData;
}

interface ActionItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Proyek" | "Navigasi" | "Aksi Cepat" | "Filter";
  icon: React.ReactNode;
  onSelect: () => void;
}

export default function CommandPalette({ projects, profile, cv }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inisialisasi status tema tampilan dan audio haptic
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setIsMuted(isSoundMuted());

    const handleSoundChange = (e: CustomEvent<boolean>) => {
      setIsMuted(e.detail);
    };
    const handleThemeChange = (e: CustomEvent<boolean>) => {
      setIsDark(e.detail);
    };
    window.addEventListener("sound-mute-change" as any, handleSoundChange);
    window.addEventListener("theme-change" as any, handleThemeChange);
    return () => {
      window.removeEventListener("sound-mute-change" as any, handleSoundChange);
      window.removeEventListener("theme-change" as any, handleThemeChange);
    };
  }, []);

  // Listener pintasan keyboard global (Cmd+K, Ctrl+K, atau /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/" && !isOpen) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea") {
          e.preventDefault();
          setIsOpen(true);
        }
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      playPopSound();
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Fokuskan kursor pada kolom pencarian saat palet dibuka
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Beralih tema tampilan terang atau gelap
  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(nextDark);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: nextDark }));
    triggerToast(nextDark ? "Mode Gelap aktif" : "Mode Terang aktif");
  };

  // Beralih status bisu audio haptic
  const toggleAudio = React.useCallback(() => {
    playClickSound();
    const nextMuted = !isMuted;
    setSoundMuted(nextMuted);
    setIsMuted(nextMuted);
    triggerToast(nextMuted ? "Suara UI dibisukan" : "Suara UI diaktifkan");
  }, [isMuted]);

  // Salin email ke clipboard
  const copyEmail = React.useCallback(() => {
    navigator.clipboard.writeText(profile.email);
    triggerToast(`Email ${profile.email} disalin!`);
  }, [profile.email]);

  // Susun daftar seluruh opsi pencarian
  const allItems: ActionItem[] = useMemo(() => {
    const list: ActionItem[] = [];

    // Opsi Proyek Portofolio
    projects.forEach((proj) => {
      list.push({
        id: `proj-${proj.id}`,
        title: proj.judul,
        subtitle: `${proj.teknologi.join(" · ")}`,
        category: "Proyek",
        icon: <FolderGit2 className="w-4 h-4 text-apple-blue" />,
        onSelect: () => {
          const el = document.getElementById(`project-${proj.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          window.dispatchEvent(new CustomEvent("open-project-preview", { detail: proj.id }));
          triggerToast(`Membuka "${proj.judul}"`);
        },
      });
    });

    // Filter Cepat pada Halaman Proyek
    list.push(
      {
        id: "filter-all",
        title: "Tampilkan Semua Proyek",
        subtitle: `Reset filter (${projects.length} proyek)`,
        category: "Filter",
        icon: <Compass className="w-4 h-4 text-apple-blue" />,
        onSelect: () => {
          window.dispatchEvent(new CustomEvent("filter-tech", { detail: "all" }));
        },
      },
      {
        id: "filter-video",
        title: "Filter: Proyek dengan Video",
        subtitle: "Hanya proyek yang memiliki video demo",
        category: "Filter",
        icon: <Compass className="w-4 h-4 text-apple-purple" />,
        onSelect: () => {
          window.dispatchEvent(new CustomEvent("filter-tech", { detail: "video" }));
        },
      }
    );

    // Navigasi Halaman Utama
    list.push(
      {
        id: "nav-overview",
        title: "Overview",
        subtitle: "Profil, bio, dan keahlian utama",
        category: "Navigasi",
        icon: <Compass className="w-4 h-4 text-apple-purple" />,
        onSelect: () => {
          window.location.href = "/#overview";
        },
      },
      {
        id: "nav-projects",
        title: "Semua Proyek (Project Archive)",
        subtitle: "Daftar lengkap seluruh portofolio & filter",
        category: "Navigasi",
        icon: <FolderGit2 className="w-4 h-4 text-apple-blue" />,
        onSelect: () => {
          window.location.href = "/projects";
        },
      },
      {
        id: "nav-craft",
        title: "Craft & Philosophy (ANI Stack)",
        subtitle: "Filosofi web engineering & agentic tools",
        category: "Navigasi",
        icon: <Compass className="w-4 h-4 text-apple-green" />,
        onSelect: () => {
          window.location.href = "/#craft";
        },
      },
      {
        id: "nav-resume",
        title: "Curriculum Vitae",
        subtitle: "Unduh atau preview ringkasan karir",
        category: "Navigasi",
        icon: <FileText className="w-4 h-4 text-apple-orange" />,
        onSelect: () => {
          window.location.href = "/#resume";
        },
      },
      {
        id: "nav-contact",
        title: "Kontak & Kolaborasi",
        subtitle: "Kirim email dan opsi terhubung",
        category: "Navigasi",
        icon: <Mail className="w-4 h-4 text-apple-blue" />,
        onSelect: () => {
          window.location.href = "/#contact";
        },
      }
    );

    // Aksi Cepat
    list.push(
      {
        id: "action-preview-cv",
        title: "QuickLook Preview CV",
        subtitle: "Buka dokumen CV langsung di browser",
        category: "Aksi Cepat",
        icon: <Eye className="w-4 h-4 text-apple-blue" />,
        onSelect: () => {
          openCvQuickLook();
        },
      },
      {
        id: "action-download-cv",
        title: "Download CV PDF",
        subtitle: `${cv.filename} (${cv.file_size})`,
        category: "Aksi Cepat",
        icon: <Download className="w-4 h-4 text-apple-green" />,
        onSelect: () => {
          const a = document.createElement("a");
          a.href = cv.file_url;
          a.download = cv.filename;
          a.click();
          triggerToast("Mengunduh CV...");
        },
      },
      {
        id: "action-copy-email",
        title: "Salin Alamat Email",
        subtitle: profile.email,
        category: "Aksi Cepat",
        icon: <Mail className="w-4 h-4 text-apple-text dark:text-apple-text-dark" />,
        onSelect: copyEmail,
      },
      {
        id: "action-toggle-theme",
        title: isDark ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)",
        subtitle: "Sesuaikan kenyamanan tampilan",
        category: "Aksi Cepat",
        icon: isDark ? (
          <Sun className="w-4 h-4 text-apple-orange" />
        ) : (
          <Moon className="w-4 h-4 text-apple-purple" />
        ),
        onSelect: toggleTheme,
      },
      {
        id: "action-toggle-sound",
        title: isMuted ? "Aktifkan Efek Suara UI" : "Bisukan Efek Suara UI",
        subtitle: "Web Audio tactile haptic sound",
        category: "Aksi Cepat",
        icon: isMuted ? (
          <Volume2 className="w-4 h-4 text-apple-green" />
        ) : (
          <VolumeX className="w-4 h-4 text-apple-secondary" />
        ),
        onSelect: toggleAudio,
      }
    );

    if (profile.sosial_media.github) {
      list.push({
        id: "action-github",
        title: "Buka Profil GitHub",
        subtitle: profile.sosial_media.github,
        category: "Aksi Cepat",
        icon: <Github className="w-4 h-4 text-apple-text dark:text-apple-text-dark" />,
        onSelect: () => {
          window.open(profile.sosial_media.github, "_blank");
        },
      });
    }

    if (profile.sosial_media.linkedin) {
      list.push({
        id: "action-linkedin",
        title: "Buka Profil LinkedIn",
        subtitle: profile.sosial_media.linkedin,
        category: "Aksi Cepat",
        icon: <Linkedin className="w-4 h-4 text-apple-blue" />,
        onSelect: () => {
          window.open(profile.sosial_media.linkedin, "_blank");
        },
      });
    }

    return list;
  }, [projects, profile, cv, isDark, isMuted, copyEmail, toggleAudio]);

  // Filter item berdasarkan kata kunci pencarian
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [allItems, query]);

  // Navigasi keyboard di dalam daftar hasil pencarian
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      playClickSound();
      setIsOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        playClickSound();
        filteredItems[selectedIndex].onSelect();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/50 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
      onClick={() => {
        playClickSound();
        setIsOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-xl bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl rounded-[24px] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input & Exit Button */}
        <div className="flex items-center px-4 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-apple-secondary dark:text-apple-secondary-dark shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Cari proyek, teknologi, atau filter..."
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-apple-text dark:text-apple-text-dark placeholder:text-apple-secondary dark:placeholder:text-apple-secondary-dark"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-apple-secondary hover:text-apple-text dark:hover:text-white"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Tombol Exit / Tutup */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsOpen(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-apple-secondary dark:text-apple-secondary-dark hover:text-red-600 dark:hover:text-red-400 bg-black/[0.04] dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer border border-black/[0.06] dark:border-white/[0.08]"
            title="Keluar dari pencarian (Esc)"
            aria-label="Exit"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit</span>
            <kbd className="hidden sm:inline text-[10px] font-mono opacity-60 ml-0.5">ESC</kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-transparent">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playClickSound();
                    item.onSelect();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-apple-blue text-white"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-apple-text dark:text-apple-text-dark"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-apple-canvas dark:bg-white/10"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-medium truncate ${isSelected ? "text-white" : ""}`}>
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p
                          className={`text-[11px] truncate ${
                            isSelected
                              ? "text-white/80"
                              : "text-apple-secondary dark:text-apple-secondary-dark"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2 shrink-0">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-black/[0.04] dark:bg-white/10 text-apple-secondary dark:text-apple-secondary-dark"
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${
                        isSelected ? "text-white" : "text-apple-secondary/50 dark:text-apple-secondary-dark/50"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-apple-secondary dark:text-apple-secondary-dark">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints & Click outside hint */}
        <div className="px-4 py-2.5 bg-apple-canvas/60 dark:bg-black/40 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-apple-secondary dark:text-apple-secondary-dark shrink-0">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 font-mono text-[10px]">
                ↑
              </kbd>{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 font-mono text-[10px]">
                ↓
              </kbd>{" "}
              Navigasi
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 font-mono text-[10px]">
                ↵
              </kbd>{" "}
              Pilih
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsOpen(false);
            }}
            className="flex items-center gap-1 text-apple-secondary dark:text-apple-secondary-dark hover:text-apple-text dark:hover:text-white transition cursor-pointer"
          >
            <span>Klik di luar card atau tekan</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 font-mono text-[10px]">
              ESC
            </kbd>
            <span>untuk keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
