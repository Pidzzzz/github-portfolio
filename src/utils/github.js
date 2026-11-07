/**
 * Klien GitHub REST API.
 *
 * - Memakai token dari `VITE_GITHUB_TOKEN` bila ada (rate limit 5.000/jam).
 * - Tanpa token tetap jalan, hanya dibatasi 60 request/jam.
 * - Selalu punya jalur fallback ke data lokal supaya halaman tidak pernah
 *   kosong ketika API sedang down atau kena rate limit.
 */

import {
  FALLBACK_PROFILE,
  FALLBACK_REPOS,
} from "../data/fallback";

const API_BASE = "https://api.github.com";

export const USERNAME =
  import.meta.env.VITE_GITHUB_USERNAME?.trim() || "Pidzzzz";

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN?.trim() || "";

/** Header default; token disisipkan hanya bila tersedia. */
function headers(extra = {}) {
  const base = {
    Accept: "application/vnd.github+json",
    "User-Agent": "pidzzzz-portfolio",
    ...extra,
  };
  if (TOKEN) base.Authorization = `Bearer ${TOKEN}`;
  return base;
}

/** Wrapper fetch dengan pesan error yang ramah, bukan teks teknis dingin. */
async function request(path, extraHeaders) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: headers(extraHeaders),
  });

  if (!response.ok) {
    const error = new Error(`GitHub bilang ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export function hasToken() {
  return TOKEN.length > 0;
}

/** Profil publik pemilik rak proyek. */
export async function fetchProfile() {
  try {
    const data = await request(`/users/${encodeURIComponent(USERNAME)}`);
    return { data, source: "api" };
  } catch {
    return { data: FALLBACK_PROFILE, source: "fallback" };
  }
}

/** Seluruh repo publik, diurutkan dari yang paling baru disentuh. */
export async function fetchRepos() {
  try {
    const data = await request(
      `/users/${encodeURIComponent(USERNAME)}/repos?per_page=100&sort=updated`,
    );
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("data kosong");
    }
    return { data, source: "api" };
  } catch {
    return { data: FALLBACK_REPOS, source: "fallback" };
  }
}

/**
 * HTML README yang sudah disanitasi oleh GitHub.
 * @returns {Promise<string>} HTML, atau string kosong bila tidak tersedia.
 */
export async function fetchReadme(fullName) {
  try {
    // Bagi owner/repo dulu — slash-nya HARUS literal, jangan ikut di-encode,
    // karena GitHub membaca "repos/{owner}/{repo}/readme" sebagai 4 segmen.
    const [owner, repo] = String(fullName).split("/");
    if (!owner || !repo) return "";

    const response = await fetch(
      `${API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
      { headers: headers({ Accept: "application/vnd.github.html+json" }) },
    );
    if (!response.ok) return "";
    const html = await response.text();
    return sanitizeHtml(html);
  } catch {
    return "";
  }
}

/**
 * Penyaring lapis-kedua sebelum HTML disuntikkan ke DOM.
 * GitHub sudah menyaring, tapi membatasi tag berbahaya di sini tetap murah
 * dan menutup kemungkinan regresi di sisi API.
 */
function sanitizeHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

/**
 * Menentukan URL live preview: homepage dulu, lalu GitHub Pages.
 * @returns {string|null}
 */
export function resolvePreviewUrl(repo) {
  const homepage = typeof repo.homepage === "string" ? repo.homepage.trim() : "";
  if (homepage) {
    if (/^https?:\/\//i.test(homepage)) return homepage.replace(/\/+$/, "");
    return `https://${homepage.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  }
  if (repo.has_pages) {
    const owner = (repo.owner?.login ?? USERNAME).toLowerCase();
    return `https://${owner}.github.io/${repo.name}`;
  }
  return null;
}

/** Nama warna bahasa untuk titik penanda, tanpa dependensi. */
export const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
  PHP: "#4f5d95",
  Ruby: "#701516",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
  Lua: "#000080",
  Shell: "#89e051",
  PowerShell: "#012456",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  SCSS: "#c6538c",
  Markdown: "#083fa1",
  JSON: "#292929",
  YAML: "#cb171e",
  Dockerfile: "#384d54",
};

export function languageColor(language) {
  if (!language) return "var(--c-ink-3)";
  return LANGUAGE_COLORS[language] ?? "var(--c-ink-3)";
}
