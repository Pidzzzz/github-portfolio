import { motion } from "framer-motion";
import { languageColor } from "../utils/github";
import { formatCompact, timeAgo, truncate } from "../utils/format";
import { IconClock, IconExternal, IconFork, IconSparkle, IconStar } from "./Icon";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Kartu repositori.
 *
 * `wide` membuat kartu memanjang dua kolom dengan tata letak horizontal —
 * dipakai untuk repo unggulan supaya grid terasa asimetris, bukan baris rapi.
 */
export default function RepoCard({ repo, index, wide = false, onPreview }) {
  const hasPreview = Boolean(repo.previewUrl);
  const topics = (repo.topics ?? []).slice(0, wide ? 6 : 3);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.045, 0.4),
        ease: EASE,
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={[
        "group relative flex h-full flex-col overflow-hidden border border-line bg-surface shadow-soft transition-shadow duration-500 ease-human hover:shadow-lift",
        wide ? "radius-organic sm:flex-row" : "radius-organic-alt",
      ].join(" ")}
    >
      {/* Sapuan gradien halus yang menyala saat hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-clay/8 via-transparent to-moss/8 opacity-0 transition-opacity duration-500 ease-human group-hover:opacity-100"
      />

      {wide && (
        <div className="relative flex w-full shrink-0 items-center justify-center gap-2 bg-gradient-to-br from-clay/12 to-moss/12 p-5 sm:w-[38%] sm:flex-col sm:p-7">
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-clay shadow-soft backdrop-blur">
            <IconSparkle size={12} /> Pilihan
          </span>
          <span
            aria-hidden
            className="font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none tracking-tighter text-clay/25 transition-transform duration-700 ease-human group-hover:-translate-y-1 group-hover:rotate-[-4deg]"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="hidden text-center text-[12.5px] leading-relaxed text-ink-2 sm:block">
            {repo.featured ? "Sering dibuka" : "Baru disentuh"}
          </span>
        </div>
      )}

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-ink-2">
            {repo.language ? (
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-black/5"
                  style={{ backgroundColor: languageColor(repo.language) }}
                />
                {repo.language}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-ink-3">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full bg-ink-3/50 ring-2 ring-black/5"
                />
                Campuran
              </span>
            )}
            <span className="text-ink-3">•</span>
            <span className="inline-flex items-center gap-1.5">
              <IconClock size={13} />
              {timeAgo(repo.updated_at)}
            </span>
          </div>

          {repo.featured && (
            <span className="shrink-0 rounded-full bg-clay/12 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-clay">
              Unggulan
            </span>
          )}
        </div>

        <h3 className="mt-3.5 font-display text-[19px] font-semibold leading-snug tracking-tight sm:text-[21px]">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer noopener"
            className="decoration-clay/40 underline-offset-4 transition-colors duration-300 ease-human hover:text-clay hover:underline"
          >
            {repo.name}
          </a>
        </h3>

        <p className="mt-2.5 flex-1 text-[14.5px] leading-[1.7] text-ink-2">
          {repo.description
            ? truncate(repo.description, wide ? 220 : 130)
            : "Belum ada deskripsi — tapi kodenya sudah bicara banyak."}
        </p>

        {topics.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-ink-2 transition-colors duration-300 ease-human group-hover:border-ink-3/40"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex items-center gap-4 text-[13px] font-medium text-ink-2">
            <span
              className="inline-flex items-center gap-1.5 transition-colors duration-300 ease-human hover:text-clay"
              title={`${formatCompact(repo.stargazers_count)} bintang`}
            >
              <IconStar size={15} />
              {formatCompact(repo.stargazers_count)}
            </span>
            <span
              className="inline-flex items-center gap-1.5 transition-colors duration-300 ease-human hover:text-clay"
              title={`${formatCompact(repo.forks_count)} fork`}
            >
              <IconFork size={15} />
              {formatCompact(repo.forks_count)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(repo)}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2.5 text-[12.5px] sm:py-2 font-semibold text-bg transition-all ease-human duration-300 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span
                aria-hidden
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  hasPreview ? "bg-clay" : "bg-moss",
                ].join(" ")}
              />
              {hasPreview ? "Pratinjau" : "Detail"}
            </button>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Buka ${repo.name} di GitHub`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2.5 text-[12.5px] sm:py-2 font-semibold text-ink-2 transition-all ease-human duration-300 hover:-translate-y-0.5 hover:border-ink-3/50 hover:text-ink"
            >
              Kode
              <IconExternal size={13} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
