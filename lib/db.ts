import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface Profile {
  nama: string;
  tagline: string;
  bio: string;
  foto_url: string;
  email: string;
  lokasi: string;
  status_ketersediaan: string;
  sosial_media: {
    github: string;
    linkedin: string;
    twitter: string;
    readcv?: string;
  };
  skills: {
    frontend: string[];
    backend: string[];
    tools_design: string[];
  };
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  judul: string;
  slug: string;
  deskripsi_singkat: string;
  deskripsi_lengkap: string;
  gambar: string[];
  teknologi: string[];
  link_demo: string;
  link_repo: string;
  featured: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface CvData {
  file_url: string;
  filename: string;
  file_size: string;
  versi: string;
  updated_at: string;
}

export interface AdminUser {
  username: string;
  password_hash: string;
  security_code?: string;
  secret_path?: string;
}

export interface DatabaseSchema {
  profile: Profile;
  portfolio: PortfolioItem[];
  cv: CvData;
  admin: AdminUser;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Default initial seed data (Warm Editorial Minimalist)
function getDefaultData(): DatabaseSchema {
  // Default password: "admin123"
  const defaultPasswordHash = bcrypt.hashSync("admin123", 10);

  return {
    profile: {
      nama: "Muhamad Rizky Aprian",
      tagline: "Web Developer & AI Enthusiast building high-craft digital products with modern web technologies and Artificial Narrow Intelligence (ANI).",
      bio: "Web Developer dan AI Enthusiast yang berfokus membangun aplikasi web modern yang cepat, bersih, dan elegan menggunakan ekosistem Next.js, React, dan TypeScript. Terbiasa mengoptimalkan alur kerja software engineering dengan Artificial Narrow Intelligence (ANI) agentic tools seperti Google Antigravity AI, OpenCode, dan Claude Code.",
      foto_url: "/Profil.jpeg",
      email: "rizkyaprian25@gmail.com",
      lokasi: "Indonesia",
      status_ketersediaan: "Tersedia untuk proyek & kolaborasi",
      sosial_media: {
        github: "https://github.com/rizkyaprian25",
        linkedin: "https://linkedin.com/in/rizkyaprian",
        twitter: "https://twitter.com",
        readcv: "https://read.cv",
      },
      skills: {
        frontend: [
          "Next.js 14",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "JavaScript (ES6+)",
          "HTML5 / CSS3",
          "Responsive UI/UX",
        ],
        backend: [
          "Node.js",
          "REST APIs",
          "PostgreSQL",
          "Prisma / Drizzle",
          "Python / FastAPI",
          "WebSockets",
        ],
        tools_design: [
          "Google Antigravity AI",
          "Claude Code",
          "OpenCode",
          "Artificial Narrow Intelligence (ANI)",
          "Git / GitHub",
          "Docker",
          "Vercel / VPS",
        ],
      },
      updated_at: new Date().toISOString(),
    },
    portfolio: [
      {
        id: "proj-1",
        judul: "Aura — Editorial Writing & Knowledge Platform",
        slug: "aura-editorial-writing",
        deskripsi_singkat: "A distraction-free markdown publishing engine with live semantic synthesis and typography control.",
        deskripsi_lengkap: "Aura is an independent publishing platform designed for writers, researchers, and technical essayists. Built with a focus on serene minimalism, it features zero-latency markdown rendering, semantic linking, automated table of contents generation, and bespoke typography control for high-fidelity reading experiences.",
        gambar: [
          "https://lh3.googleusercontent.com/aida/AEtjO1URT0U_BeittlihGdGIWKUJmLCw3HLrzVRDqLmuWRuCjKqC6TzM2xy8sWwLedvTuEG5w_S3HQ3NzfSEQJvz-qQh6Ma4bnvOhp0LQ3NsmMsPb_AoOGV4oksCz0pEHx3De5QkKxh4gnyShchVTMGINoY5C2AoLd8uD1I6cgmzitZTQH8dnJu4aYnMfT1wH7DC1bpJL5XAGSeMlDqhDWkUmvbLiaOp6Z8vnTtGq90OfDZ5oLRfHFdvH3KGF-QQ",
        ],
        teknologi: ["Next.js 14", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        link_demo: "https://aura.arifrahman.dev",
        link_repo: "https://github.com/arifrahman/aura-platform",
        featured: true,
        urutan: 1,
        created_at: "2024-08-10T10:00:00.000Z",
        updated_at: "2024-09-01T10:00:00.000Z",
      },
      {
        id: "proj-2",
        judul: "FinWellness — Financial Health & Mindful Budgeting",
        slug: "finwellness-budgeting",
        deskripsi_singkat: "Predictive cash flow telemetry and automated envelope budgeting designed for mindful personal finance.",
        deskripsi_lengkap: "FinWellness transforms personal wealth management from stressful arithmetic into calm, mindful decision making. Features include multi-currency bank account synchronization, recurring bill forecasting, interactive scenario modeling, and an offline-first mobile-responsive architecture.",
        gambar: [
          "https://lh3.googleusercontent.com/aida/AEtjO1VQkaQmFtWFomVABHAWSlR_8fvaOm9DlYeJvQycNQoLpG7O9uM-8S0LFq29r-8SsSNVMNuMfKmHXJtXS4Br2IjeXWsQOHBgXaBR9jcu4IiHfuM_mjRUSHerGtjiW_TxoKd-yNTPbTB9Cl7JYO1RnZyg_aTMST61RslpGZzb1ckqk9cv2_plWsVp8INorqIUXZVCFvO4gM-CQjLq4iSTFJ94GJbipyIQwnnOzUGYFfn5hPD4A46NG5Zw0it2",
        ],
        teknologi: ["React", "Node.js", "TypeScript", "PostgreSQL", "Recharts"],
        link_demo: "https://finwellness.arifrahman.dev",
        link_repo: "https://github.com/arifrahman/finwellness",
        featured: true,
        urutan: 2,
        created_at: "2024-06-15T10:00:00.000Z",
        updated_at: "2024-07-20T10:00:00.000Z",
      },
      {
        id: "proj-3",
        judul: "PulseCare+ — Telemetry & Clinical Monitoring",
        slug: "pulsecare-telemetry",
        deskripsi_singkat: "Real-time physiological telemetry dashboard with sub-second WebSocket updates for healthcare specialists.",
        deskripsi_lengkap: "An enterprise medical telemetry dashboard built for ICU and ambulatory observation units. Connects directly to hospital sensor hubs via secure WebSockets to display heart-rate variability, oxygen saturation, and automated arrhythmia anomaly detection with zero perceived latency.",
        gambar: [
          "https://lh3.googleusercontent.com/aida/AEtjO1X2oHMnBVqZ7uFKyce5bj0t3ijQRwacFSi0UtPJvk0d3QxUDpw3OpEWJx7IHMtgX4C2HjLnyl9-ZO0mCIqZ-x37N6yZwS3aE2iVqeFbJgwSn3Ad8--tICIU8_t7qNHkUQL0LH1Cu_S_wEAZ_yG-mCrbsJEJ47cHAFUHXU6VagCcCS2FvnfxCDWwcJv651upUEMDCeqqB-H8e8T086oDRnpfkdjb1o5kJSrUq0YLLgiDztWYqrET8ND6eZk",
        ],
        teknologi: ["WebSockets", "Go", "Docker", "Redis", "Next.js"],
        link_demo: "https://pulsecare.arifrahman.dev",
        link_repo: "https://github.com/arifrahman/pulsecare",
        featured: true,
        urutan: 3,
        created_at: "2024-04-05T10:00:00.000Z",
        updated_at: "2024-05-12T10:00:00.000Z",
      },
    ],
    cv: {
      file_url: "/cv.pdf",
      filename: "Arif_Rahman_Curriculum_Vitae.pdf",
      file_size: "2.4 MB",
      versi: "v3.2",
      updated_at: "2024-10-01T08:00:00.000Z",
    },
    admin: {
      username: "admin",
      password_hash: defaultPasswordHash,
      security_code: "889900",
    },
  };
}

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = getDefaultData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    const initialData = getDefaultData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function saveDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Profile CRUD
export function getProfile(): Profile {
  const db = ensureDb();
  return db.profile;
}

export function updateProfile(partial: Partial<Profile>): Profile {
  const db = ensureDb();
  db.profile = {
    ...db.profile,
    ...partial,
    updated_at: new Date().toISOString(),
  };
  saveDb(db);
  return db.profile;
}

// Portfolio CRUD
export function getPortfolioItems(): PortfolioItem[] {
  const db = ensureDb();
  return db.portfolio.sort((a, b) => a.urutan - b.urutan);
}

export function getPortfolioItemBySlug(slug: string): PortfolioItem | undefined {
  const db = ensureDb();
  return db.portfolio.find((item) => item.slug === slug);
}

export function getPortfolioItemById(id: string): PortfolioItem | undefined {
  const db = ensureDb();
  return db.portfolio.find((item) => item.id === id);
}

export function createPortfolioItem(data: Omit<PortfolioItem, "id" | "created_at" | "updated_at">): PortfolioItem {
  const db = ensureDb();
  const newItem: PortfolioItem = {
    ...data,
    id: `proj-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.portfolio.push(newItem);
  saveDb(db);
  return newItem;
}

export function updatePortfolioItem(id: string, partial: Partial<PortfolioItem>): PortfolioItem | null {
  const db = ensureDb();
  const index = db.portfolio.findIndex((item) => item.id === id);
  if (index === -1) return null;

  db.portfolio[index] = {
    ...db.portfolio[index],
    ...partial,
    updated_at: new Date().toISOString(),
  };
  saveDb(db);
  return db.portfolio[index];
}

export function deletePortfolioItem(id: string): boolean {
  const db = ensureDb();
  const prevLen = db.portfolio.length;
  db.portfolio = db.portfolio.filter((item) => item.id !== id);
  if (db.portfolio.length !== prevLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// CV CRUD
export function getCv(): CvData {
  const db = ensureDb();
  return db.cv;
}

export function updateCv(partial: Partial<CvData>): CvData {
  const db = ensureDb();
  db.cv = {
    ...db.cv,
    ...partial,
    updated_at: new Date().toISOString(),
  };
  saveDb(db);
  return db.cv;
}

// Admin Auth
export function getAdminUser(): AdminUser {
  const db = ensureDb();
  return db.admin;
}

export function updateAdminPassword(newPasswordHash: string): void {
  const db = ensureDb();
  db.admin.password_hash = newPasswordHash;
  saveDb(db);
}

export function getAdminSecretPath(): string {
  const db = ensureDb();
  return db.admin.secret_path || "5495i403-asjdd";
}

export function updateAdminSecurity(updates: {
  security_code?: string;
  secret_path?: string;
  password_hash?: string;
}): void {
  const db = ensureDb();
  if (updates.security_code !== undefined) {
    db.admin.security_code = updates.security_code;
  }
  if (updates.secret_path !== undefined) {
    db.admin.secret_path = updates.secret_path;
  }
  if (updates.password_hash !== undefined) {
    db.admin.password_hash = updates.password_hash;
  }
  saveDb(db);
}

