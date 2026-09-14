"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, ShieldAlert, ShieldCheck, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  // State: step 1 = passcode gate, step 2 = credential login
  const [step, setStep] = useState<1 | 2>(1);
  const [passcode, setPasscode] = useState<string[]>(["", "", "", "", "", ""]);
  const [securityCode, setSecurityCode] = useState("");
  
  // Credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Input refs for 6-digit passcode
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 1 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
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

  // Verify Passcode Gate
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
          <span>Kembali ke Portofolio</span>
        </Link>
      </div>

      {/* Main Apple Lock Card */}
      <div className={`w-full max-w-sm bg-white/90 backdrop-blur-xl border border-black/[0.08] rounded-[28px] p-8 sm:p-9 shadow-[0_16px_48px_rgba(0,0,0,0.08)] space-y-6 transition-all duration-300 ${shaking ? "animate-shake" : ""}`}>
        
        {step === 1 ? (
          /* STEP 1: Passcode Gate Screen */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1D1D1F] to-[#2C2C2E] text-white flex items-center justify-center mx-auto mb-3 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                <KeyRound className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
                Security Passcode
              </h1>
              <p className="text-xs text-[#86868B] max-w-[240px] mx-auto leading-relaxed">
                Jendela ini terproteksi. Masukkan 6-digit kode keamanan untuk membuka akses admin.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-xs font-medium text-center flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center items-center gap-2 sm:gap-2.5 pt-2">
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
                  className="w-11 h-12 text-center text-lg font-mono font-semibold rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition shadow-inner"
                />
              ))}
            </div>

            <button
              type="button"
              disabled={loading || passcode.join("").length !== 6}
              onClick={() => verifySecurityPasscode(passcode.join(""))}
              className="w-full py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 text-white font-medium text-sm transition shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)] active:scale-[0.98]"
            >
              {loading ? "Memverifikasi Kode..." : "Buka Kunci Akses"}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-[#86868B] block">
                Enkripsi akses mandiri terproteksi
              </span>
            </div>
          </div>
        ) : (
          /* STEP 2: Authenticated Admin Login Screen */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#34C759] to-[#28a745] text-white flex items-center justify-center mx-auto mb-3 shadow-[0_4px_16px_rgba(52,199,89,0.25)]">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#34C759] uppercase tracking-wider">
                <span>Passcode Terverifikasi</span>
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
                Admin Workspace
              </h1>
              <p className="text-xs text-[#86868B] max-w-[240px] mx-auto">
                Masukkan akun admin Anda untuk masuk ke sistem.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-xs font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#86868B] mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.06] text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#86868B] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.06] text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white font-medium text-sm transition shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)] active:scale-[0.98]"
              >
                {loading ? "Mengotentikasi..." : "Masuk ke Panel"}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPasscode(["", "", "", "", "", ""]);
                  setSecurityCode("");
                }}
                className="text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors"
              >
                Kunci Ulang Jendela
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
