import { motion } from "framer-motion";
import { IconGithub, IconMoon, IconSun } from "./Icon";

const NAV_LINKS = [
  { href: "#rak", label: "Rak Proyek" },
  { href: "#tentang", label: "Tentang" },
];

/**
 * Bilah navigasi yang melayang dengan latar buram — ringan, bukan balok tebal.
 */
export default function Header({ theme, onToggleTheme, profile, source }) {
  const githubUrl = profile?.html_url ?? "https://github.com/Pidzzzz";

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40"
    >
      <div className="mx-auto mt-4 w-[min(1180px,calc(100%-1.5rem))]">
        <div className="flex items-center justify-between gap-4 rounded-full border border-line/80 bg-surface/75 px-3 py-2 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-surface/60">
          {/* Penanda: lingkaran organik yang sedikit miring */}
          <a
            href="#atas"
            className="group flex items-center gap-2.5 rounded-full py-1 pl-1.5 pr-3 transition-colors ease-human duration-300 hover:bg-surface-2"
          >
            <span className="relative grid h-9 w-9 place-items-center">
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-[14px_14px_14px_4px] bg-clay/90"
                animate={{ rotate: [-4, 6, -4] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative font-display text-[15px] font-semibold text-bg">
                P
              </span>
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight">
              {profile?.name ?? "Pidzzzz"}
              <span className="text-ink-3">.work</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-[14px] font-medium text-ink-2 transition-all ease-human duration-300 hover:bg-surface-2 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {source === "fallback" && (
              <span
                className="hidden rounded-full bg-clay/12 px-3 py-1.5 text-[11.5px] font-medium text-clay-2 sm:inline-block"
                title="Data diambil dari salinan lokal karena API tidak terjangkau"
              >
                mode lokal
              </span>
            )}

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap"
              }
              className="grid h-9 w-9 place-items-center rounded-full border border-line/70 bg-surface-2/70 text-ink-2 transition-all ease-human duration-300 hover:-rotate-12 hover:text-ink"
            >
              {theme === "dark" ? <IconSun size={17} /> : <IconMoon size={17} />}
            </button>

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13.5px] font-semibold text-bg transition-all ease-human duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <IconGithub size={16} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
