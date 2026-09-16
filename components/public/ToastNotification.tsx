"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Info } from "lucide-react";

export interface ToastData {
  id: number;
  message: string;
  type?: "success" | "info";
}

/**
 * Trigger global toast from anywhere in the application
 */
export function triggerToast(message: string, type: "success" | "info" = "success") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("apple-toast", {
        detail: { message, type, id: Date.now() },
      })
    );
  }
}

export default function ToastNotification() {
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    const handleToast = (e: CustomEvent<ToastData>) => {
      setToast(e.detail);
    };

    window.addEventListener("apple-toast" as any, handleToast);
    return () => window.removeEventListener("apple-toast" as any, handleToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/90 dark:bg-white/95 text-white dark:text-black shadow-2xl backdrop-blur-md border border-white/10 dark:border-black/10 text-xs font-medium max-w-md pointer-events-auto">
        {toast.type === "info" ? (
          <Info className="w-4 h-4 text-apple-blue shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-apple-green dark:text-apple-green shrink-0" />
        )}
        <span className="truncate">{toast.message}</span>
      </div>
    </div>
  );
}
