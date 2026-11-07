import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const repos = JSON.parse(
  readFileSync(join(root, "data", "_repos_raw.json"), "utf8"),
);

const profile = {
  login: "Pidzzzz",
  name: "Pidzzz",
  bio: "Membangun perkakas kecil yang menyelesaikan masalah nyata.",
  avatar_url: "https://avatars.githubusercontent.com/u/208608712?v=4",
  html_url: "https://github.com/Pidzzzz",
  public_repos: repos.length,
  followers: 0,
  created_at: "2025-04-22T09:04:30Z",
};

const banner = `/**
 * Data cadangan — dipakai ketika GitHub API tidak bisa dihubungi
 * (rate limit, offline, atau token tidak valid).
 *
 * Di-generate dari data publik akun GitHub. Jalankan \`node scripts/gen-fallback.mjs\`
 * setelah mengganti \`_repos_raw.json\` untuk menyegarkannya.
 */

`;

const out =
  banner +
  `export const FALLBACK_PROFILE = ${JSON.stringify(profile, null, 2)};\n\n` +
  `export const FALLBACK_REPOS = ${JSON.stringify(repos, null, 2)};\n`;

writeFileSync(join(root, "src/data/fallback.js"), out, "utf8");
console.log(`fallback.js dibuat: ${repos.length} repo, ${out.length} bytes`);
