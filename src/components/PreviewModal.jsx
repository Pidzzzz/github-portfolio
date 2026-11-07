import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchReadme, languageColor } from "../utils/github";
import {
  formatDate,
  formatSize,
  formatCompact,
} from "../utils/format";
import CodeVisualizer from "./CodeVisualizer";
import {
  IconAlert,
  IconBook,
  IconClock,
  IconClose,
  IconExternal,
  IconGithub,
  IconRefresh,
  IconStar,
  IconTerminal,
} from "./Icon";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Panel pratinjau.
 *
 * Tab "Live" memuat halaman GitHub Pages / Vercel / Netlify / homepage repo
 * di dalam iframe berbingkai jendela browser. Tab "Tentang" menampilkan
 * README hasil render GitHub, meta repo, dan visualizer kode sebagai
 * cadangan ketika tidak ada tautan live.
 */
export default function PreviewModal({ repo, onClose }) {
  const [tab, setTab] = useState(repo.previewUrl ? "live" : "about");
  const [frameState, setFrameState] = useState("loading");
  const [readme, setReadme] = useState(null); // null = memuat, "" = tidak ada
  const [attempt, setAttempt] = useState(0);

  const closeRef = useRef(null);

  // Kunci gulir halaman di belakang panel
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Tutup dengan Escape + pindahkan fokus ke tombol tutup
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Ambil README sekali saat panel terbuka
  useEffect(() => {
    let alive = true;
    setReadme(null);
    fetchReadme(repo.full_name).then((html) => {
      if (alive) setReadme(html || "");
    });
    return () => {
      alive = false;
    };
  }, [repo.full_name]);

  // Atur ulang status frame saat tab/URL berubah
  useEffect(() => {
    if (tab === "live") setFrameState("loading");
  }, [tab, repo.previewUrl, attempt]);

  // Jika frame belum juga siap dalam 12 detik, tawarkan jalan keluar
  useEffect(() => {
    if (tab !== "live" || frameState !== "loading") return undefined;
    const timer = window.setTimeout(() => setFrameState("slow"), 12_000);
    return () => window.clearTimeout(timer);
  }, [tab, frameState, attempt]);

  const meta = [
    { icon: <IconClock size={14} />, label: "Dibuat", value: formatDate(repo.created_at) },
    { icon: <IconClock size={14} />, label: "Diperbarui", value: formatDate(repo.updated_at) },
    { icon: <IconStar size={14} />, label: "Bintang", value: formatCompact(repo.stargazers_count) },
    { icon: <IconTerminal size={14} />, label: "Ukuran", value: formatSize(repo.size) },
  ];

  return (
    <motion.div
      key="backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 bg-ink/45 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Pratinjau ${repo.name}`}
        initial={{ opacity: 0, y: 34, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
        className="relative flex h-[min(88vh,860px)] w-[min(1100px,100%)] flex-col overflow-hidden border border-line bg-surface shadow-lift"
        style={{ borderRadius: "28px 28px 12px 28px" }}
      >
        <PanelHeader
          repo={repo}
          tab={tab}
          onTabChange={setTab}
          onClose={onClose}
          closeRef={closeRef}
          hasPreview={Boolean(repo.previewUrl)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {tab === "live" ? (
            <LivePreview
              repo={repo}
              frameState={frameState}
              attempt={attempt}
              onReload={() => setAttempt((n) => n + 1)}
              onFrameReady={() => setFrameState("ready")}
            />
          ) : (
            <AboutPanel repo={repo} readme={readme} meta={meta} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */

function PanelHeader({ repo, tab, onTabChange, onClose, closeRef, hasPreview }) {
  const tabs = hasPreview
    ? [
        { id: "live", label: "Pratinjau langsung" },
        { id: "about", label: "Tentang" },
      ]
    : [{ id: "about", label: "Tentang proyek" }];

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line bg-surface-2/70 px-4 py-3.5 backdrop-blur sm:px-5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px_12px_12px_4px] bg-clay/12 text-clay">
        <IconGithub size={17} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[16.5px] font-semibold leading-tight tracking-tight">
          {repo.name}
        </p>
        <p className="truncate text-[12px] text-ink-3">
          {repo.full_name}
          {repo.language ? ` · ${repo.language}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            aria-pressed={tab === item.id}
            className={[
              "relative rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors duration-300 ease-human",
              tab === item.id ? "text-bg" : "text-ink-2 hover:text-ink",
            ].join(" ")}
          >
            {tab === item.id && (
              <motion.span
                layoutId="preview-tab"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                className="absolute inset-0 rounded-full bg-ink"
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        ))}
      </div>

      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer noopener"
        className="hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[12.5px] font-semibold text-ink-2 transition-all ease-human duration-300 hover:-translate-y-0.5 hover:text-ink sm:inline-flex"
      >
        GitHub <IconExternal size={13} />
      </a>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Tutup pratinjau"
        className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 transition-all ease-human duration-300 hover:rotate-90 hover:text-ink"
      >
        <IconClose size={16} />
      </button>
    </header>
  );
}

/* -------------------------------------------------------------------------- */

function LivePreview({ repo, frameState, attempt, onReload, onFrameReady }) {
  const url = repo.previewUrl;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Bilah alamat ala jendela browser */}
      <div className="flex items-center gap-3 rounded-full border border-line bg-surface-2 px-3 py-2">
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-clay/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e9c46a]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-moss/70" />
        </span>

        <p className="min-w-0 flex-1 truncate rounded-full bg-surface px-3.5 py-1.5 font-mono text-[11.5px] text-ink-2">
          <span className="text-moss">🔒</span> {url}
        </p>

        <button
          type="button"
          onClick={onReload}
          aria-label="Muat ulang pratinjau"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-3 transition-all ease-human duration-300 hover:rotate-180 hover:text-ink"
        >
          <IconRefresh size={15} />
        </button>

        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="shrink-0 rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold text-bg transition-all ease-human duration-300 hover:-translate-y-0.5"
        >
          Buka tab baru
        </a>
      </div>

      <div className="relative min-h-[380px] flex-1 overflow-hidden rounded-[20px_20px_8px_20px] border border-line bg-surface">
        {frameState !== "ready" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface px-6 text-center">
            <span className="skeleton h-8 w-8 rounded-full" />
            <p className="text-[14px] font-medium text-ink">Menyiapkan tampilannya…</p>
            <p className="max-w-[42ch] text-[13px] leading-relaxed text-ink-3">
              Beberapa situs butuh waktu sebentar untuk bangun.
            </p>
          </div>
        )}

        <iframe
          key={attempt}
          src={url}
          title={`Pratinjau langsung ${repo.name}`}
          onLoad={onFrameReady}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
          className="h-full w-full border-0 bg-white"
        />

        {frameState === "slow" && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur">
            <p className="flex items-center gap-2 text-[13px] text-ink-2">
              <span className="text-clay">
                <IconAlert size={15} />
              </span>
              Tampilannya lambat — bisa jadi situsnya memblokir embed.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-clay px-4 py-2 text-[12.5px] font-semibold text-bg transition-all ease-human duration-300 hover:-translate-y-0.5 hover:bg-clay-2"
            >
              Buka langsung
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function AboutPanel({ repo, readme, meta }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        <section className="radius-organic border border-line bg-surface p-5">
          <h4 className="flex items-center gap-2 font-display text-[17px] font-semibold tracking-tight">
            <span className="text-clay">
              <IconBook size={16} />
            </span>
            README
          </h4>

          {readme === null ? (
            <div className="mt-4 space-y-2.5" aria-hidden>
              <span className="skeleton block h-3.5 w-4/5 rounded-full" />
              <span className="skeleton block h-3.5 w-full rounded-full" />
              <span className="skeleton block h-3.5 w-2/3 rounded-full" />
            </div>
          ) : readme === "" ? (
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              Repo ini belum punya README — dokumennya masih menunggu
              ditulisi. Kalau penasaran, intip langsung struktur filenya di
              GitHub.
            </p>
          ) : (
            <div
              className="repo-readme mt-4 text-[14.5px] leading-[1.75] text-ink-2"
              dangerouslySetInnerHTML={{ __html: readme }}
            />
          )}
        </section>

        <section>
          <h4 className="mb-3 flex items-center gap-2 font-display text-[17px] font-semibold tracking-tight">
            <span className="text-clay">
              <IconTerminal size={16} />
            </span>
            Sekilas isi kode
          </h4>
          <CodeVisualizer repoName={repo.name} language={repo.language} />
        </section>
      </div>

      <aside className="space-y-5">
        <section className="radius-organic-alt border border-line bg-surface p-5">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-ink-3">
            Deskripsi
          </p>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">
            {repo.description ??
              "Belum ada deskripsi tertulis — proyeknya masih dalam perjalanan."}
          </p>

          {(repo.topics ?? []).length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {repo.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-ink-2"
                >
                  {topic}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid grid-cols-2 gap-2.5">
          {meta.map((item) => (
            <div
              key={item.label}
              className="rounded-[16px_16px_16px_6px] border border-line bg-surface p-3.5"
            >
              <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-3">
                <span className="text-clay/70">{item.icon}</span>
                {item.label}
              </p>
              <p className="mt-1.5 font-display text-[15px] font-semibold tracking-tight">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[16px_16px_16px_6px] border border-line bg-surface p-5">
          <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full ring-2 ring-black/5"
              style={{ backgroundColor: languageColor(repo.language) }}
            />
            {repo.language ?? "Bahasa campuran"}
            {repo.license ? ` · ${repo.license}` : ""}
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-ink-3">
            {repo.forks_count > 0
              ? `Di-fork ${formatCompact(repo.forks_count)} kali oleh sesama pembuat.`
              : "Belum ada fork — jadilah yang pertama."}
          </p>
        </section>
      </aside>
    </div>
  );
}
