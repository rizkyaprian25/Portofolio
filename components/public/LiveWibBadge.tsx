"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, Sun, Moon, Sparkles, ChevronDown } from "lucide-react";
import { playClickSound } from "@/lib/audio";

/**
 * Tipe data untuk status jam kerja
 */
interface WorkHourStatus {
  isWorkHour: boolean;
  timeString: string;
  dateString: string;
  statusLabel: string;
  statusDescription: string;
  badgeColor: string;
  pulseColor: string;
}

/**
 * Menghitung waktu WIB (Asia/Jakarta, UTC+7) dan menentukan status jam kerja
 * Jadwal: Senin - Jumat, pukul 08:30 s/d 18:00 WIB
 */
function getWibWorkStatus(): WorkHourStatus {
  const now = new Date();

  // Konversi waktu sekarang ke zona waktu Asia/Jakarta
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    weekday: "short",
  });

  const parts = formatter.formatToParts(now);
  const findPart = (type: string) => parts.find((p) => p.type === type)?.value || "";

  const hour = parseInt(findPart("hour"), 10) || 0;
  const minute = parseInt(findPart("minute"), 10) || 0;
  const weekdayStr = findPart("weekday"); // Mon, Tue, Wed, Thu, Fri, Sat, Sun

  const isWeekend = weekdayStr === "Sat" || weekdayStr === "Sun";
  const timeInMinutes = hour * 60 + minute;
  const startWorkMinutes = 8 * 60 + 30; // 08:30 WIB
  const endWorkMinutes = 18 * 60; // 18:00 WIB

  const isWorkHour = !isWeekend && timeInMinutes >= startWorkMinutes && timeInMinutes < endWorkMinutes;

  // Format jam lokal Indonesia
  const timeString = now.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format tanggal lengkap Indonesia
  const dateString = now.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (isWorkHour) {
    return {
      isWorkHour: true,
      timeString,
      dateString,
      statusLabel: "Jam Kerja Aktif",
      statusDescription: "Online & responsif untuk diskusi proyek atau rekrutmen.",
      badgeColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      pulseColor: "bg-emerald-500",
    };
  }

  return {
    isWorkHour: false,
    timeString,
    dateString,
    statusLabel: "Di Luar Jam Kerja",
    statusDescription: "Sedang istirahat / fokus riset. Pesan email tetap dibalas secepatnya.",
    badgeColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    pulseColor: "bg-purple-500",
  };
}

/**
 * Komponen Kapsul Jam Kerja Real-Time WIB
 * Menampilkan jam WIB aktual dan indikator ketersediaan kerja Apple HIG dengan popover interaktif.
 */
export default function LiveWibBadge() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<WorkHourStatus | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setStatus(getWibWorkStatus());

    // Perbarui waktu setiap 1 detik
    const timer = setInterval(() => {
      setStatus(getWibWorkStatus());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Menutup popover ketika pengguna mengklik di luar area widget
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    }

    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  const togglePopover = () => {
    playClickSound();
    setPopoverOpen((prev) => !prev);
  };

  // Tampilan fallback saat proses SSR sebelum hidrasi selesai untuk mencegah hydration mismatch
  if (!mounted || !status) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.06] text-xs font-medium text-apple-secondary dark:text-apple-secondary-dark animate-pulse">
        <Clock className="w-3.5 h-3.5 text-apple-secondary" />
        <span>Memuat Waktu WIB...</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Tombol Kapsul Utama */}
      <button
        type="button"
        onClick={togglePopover}
        aria-label="Lihat detail jam kerja WIB"
        aria-expanded={popoverOpen}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-apple-card-dark/80 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-apple-card hover:border-black/[0.15] dark:hover:border-white/[0.15] text-xs font-medium text-apple-text dark:text-apple-text-dark transition-all duration-200 active:scale-95 group cursor-pointer"
      >
        {/* Titik Status Animasi Pulse */}
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.pulseColor}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status.pulseColor}`} />
        </span>

        {/* Waktu Digital WIB */}
        <span className="font-mono font-medium tracking-tight text-apple-text dark:text-apple-text-dark">
          {status.timeString}
        </span>
        <span className="text-[11px] font-normal text-apple-secondary dark:text-apple-secondary-dark">
          WIB
        </span>

        {/* Label Status Singkat */}
        <span className="hidden sm:inline-block text-apple-secondary dark:text-apple-secondary-dark">
          ·
        </span>
        <span className="hidden sm:inline-block text-[11px] font-normal text-apple-secondary dark:text-apple-secondary-dark">
          {status.statusLabel}
        </span>

        <ChevronDown
          className={`w-3 h-3 text-apple-secondary transition-transform duration-200 ${
            popoverOpen ? "rotate-180" : "group-hover:translate-y-0.5"
          }`}
        />
      </button>

      {/* Popover Detail Jam Kerja Apple HIG */}
      {popoverOpen && (
        <div className="absolute left-0 mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_15px_35px_rgba(0,0,0,0.12)] p-4 text-left space-y-3 transition-all animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header Popover */}
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-apple-text dark:text-apple-text-dark">
              {status.isWorkHour ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>Zona Waktu Jakarta (UTC+7)</span>
            </div>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${status.badgeColor}`}
            >
              {status.statusLabel}
            </span>
          </div>

          {/* Jam & Tanggal Aktif */}
          <div className="space-y-0.5">
            <div className="text-2xl font-mono font-semibold tracking-tight text-apple-text dark:text-apple-text-dark">
              {status.timeString} <span className="text-xs font-sans font-normal text-apple-secondary">WIB</span>
            </div>
            <p className="text-xs text-apple-secondary dark:text-apple-secondary-dark capitalize">
              {status.dateString}
            </p>
          </div>

          {/* Penjelasan Status */}
          <p className="text-xs text-apple-secondary dark:text-apple-secondary-dark leading-relaxed bg-black/[0.02] dark:bg-white/[0.03] p-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
            {status.statusDescription}
          </p>

          {/* Jadwal Operasional */}
          <div className="space-y-1 pt-1 text-[11px] text-apple-secondary dark:text-apple-secondary-dark">
            <div className="flex items-center justify-between">
              <span className="font-medium text-apple-text dark:text-apple-text-dark">Senin – Jumat</span>
              <span>08:30 – 18:00 WIB</span>
            </div>
            <div className="flex items-center justify-between text-apple-secondary/80">
              <span>Sabtu – Minggu</span>
              <span>Libur / Respon Asinkron</span>
            </div>
          </div>

          {/* Catatan Kaki Mini */}
          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center gap-1.5 text-[11px] text-apple-blue font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Pesan atau tawaran proyek tetap dapat dikirim 24/7</span>
          </div>

        </div>
      )}
    </div>
  );
}
