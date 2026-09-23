"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, ShieldAlert, ShieldCheck, User } from "lucide-react";

interface AdminLoginClientProps {
  secretKey: string;
}

export default function AdminLoginClient({ secretKey }: AdminLoginClientProps) {
  const router = useRouter();

  // Status alur login: tahap 1 = gerbang passcode, tahap 2 = otentikasi kredensial
  const [step, setStep] = useState<1 | 2>(1);
  const [passcode, setPasscode] = useState<string[]>(["", "", "", "", "", ""]);
  const [securityCode, setSecurityCode] = useState("");

  // Kredensial akun admin
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Referensi elemen input untuk 6 digit passcode
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 1 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Tangani perubahan nilai digit angka
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Tangani aksi paste kode angka lengkap
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newPass = [...passcode];
        for (let i = 0; i < 6; i++) {
          newPass[i] = pasted[i] || "";
        }
        setPasscode(newPass);
        const code = newPass.join("");
        if (code.length === 6) {
          verifySecurityPasscode(code);
        }
        return;
      }
    }

    const digit = value.slice(-1).replace(/\D/g, "");
    const newPasscode = [...passcode];
    newPasscode[index] = digit;
    setPasscode(newPasscode);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newPasscode.join("");
    if (fullCode.length === 6 && !newPasscode.includes("")) {
      verifySecurityPasscode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verifikasi gerbang passcode keamanan
  const verifySecurityPasscode = async (code: string) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_code", security_code: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setError(data.error || "Kode Akses Keamanan Salah");
        setPasscode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setLoading(false);
        return;
      }

      // Valid passcode! Smoothly transition to Step 2
      setSecurityCode(code);
      setStep(2);
      setLoading(false);
    } catch {
      setError("Gagal menghubungkan ke server verifikasi");
      setLoading(false);
    }
  };

  // Submit Final Login
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          security_code: securityCode,
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kredensial tidak valid");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat otentikasi");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#0071E3]/20">
      {/* Back link */}
      <div className="w-full max-w-sm mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Portofolio</span>
        </Link>
      </div>

      {/* Main Apple Modal Card */}
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-[28px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-[#E5E5EA]">
        {/* Step 1: Security Passcode Gate */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            {/* Apple Key Icon Squircle */}
            <div className="w-16 h-16 rounded-[22px] bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-center text-[#1D1D1F] shadow-inner mb-5">
              <KeyRound className="w-7 h-7 stroke-[1.75] text-[#0071E3]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] text-[10px] font-mono font-medium text-[#86868B] mb-2 tracking-wider">
              <span>PATH:</span>
              <span className="text-[#0071E3]">/admin/{secretKey}</span>
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
              Gerbang Kunci Keamanan
            </h1>
            <p className="text-xs text-[#86868B] mt-1 mb-7 max-w-[240px]">
              Masukkan 6-digit Security Passcode untuk membuka akses autentikasi admin.
            </p>

            {/* Error Message */}
            {error && (
              <div className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200/80 flex items-center gap-2 text-left animate-in fade-in zoom-in-95 duration-200">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* 6 Digit Passcode Input Cells */}
            <div
              className={`flex items-center justify-center gap-2.5 mb-6 ${
                shaking ? "animate-[wiggle_0.4s_ease-in-out]" : ""
              }`}
            >
              {passcode.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={loading}
                  className="w-11 h-14 text-center text-xl font-semibold font-mono rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] focus:border-[#0071E3] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0071E3]/15 transition-all shadow-inner disabled:opacity-50"
                  autoComplete="off"
                />
              ))}
            </div>

            <p className="text-[11px] text-[#86868B] font-mono tracking-wider">
              {loading ? "Memverifikasi kode..." : "PROTECTED BY APPLE SECURITY GATE"}
            </p>
          </div>
        )}

        {/* Step 2: Username & Password Login Form */}
        {step === 2 && (
          <div>
            <div className="flex flex-col items-center text-center mb-6">
              {/* Unlocked Checkmark Badge */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 mb-3 shadow-sm">
                <ShieldCheck className="w-7 h-7 stroke-[2]" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700 border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3 h-3" />
                Passcode Terverifikasi
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
                Masuk ke Workspace
              </h2>
              <p className="text-xs text-[#86868B] mt-0.5">
                Masukkan kredensial pengelola portofolio
              </p>
            </div>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200/80 flex items-center gap-2 text-left">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#86868B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F5F5F7] border border-[#D2D2D7] rounded-xl text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#86868B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F5F5F7] border border-[#D2D2D7] rounded-xl text-sm text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white focus:ring-4 focus:ring-[#0071E3]/15 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,113,227,0.3)] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? "Mengotentikasi..." : "Masuk ke Dashboard"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPasscode(["", "", "", "", "", ""]);
                  setSecurityCode("");
                  setError("");
                }}
                className="w-full text-center text-xs text-[#86868B] hover:text-[#1D1D1F] pt-2 transition-colors"
              >
                Kunci Ulang Gerbang
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Apple Subtle Footer */}
      <p className="text-[11px] text-[#86868B] mt-8 font-mono">
        Rizky Aprian Portfolio — Apple Protected Environment
      </p>
    </div>
  );
}
