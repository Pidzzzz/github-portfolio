import { motion } from "framer-motion";
import { CATEGORIES } from "../data/categories";
import { IconClose, IconSearch } from "./Icon";

/**
 * Bilah pencarian real-time + chip filter kategori.
 * Chip-nya bergeser halus (layout animation) saat pindah kategori.
 */
export default function Toolbar({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  counts,
  visibleCount,
  totalCount,
}) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mb-8 space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            id="rak"
            className="scroll-mt-28 font-display text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold leading-tight tracking-tight"
          >
            Isi rak saya
          </h2>
          <p className="mt-1.5 text-[14.5px] text-ink-2">
            {totalCount === 0
              ? "Sebentar lagi muncul…"
              : visibleCount === totalCount
                ? `Semua ${totalCount} proyek sedang tampil di sini.`
                : `${visibleCount} dari ${totalCount} proyek cocok dengan saringanmu.`}
          </p>
        </div>

        <div className="relative w-full md:w-[340px]">
          <label htmlFor="cari-repo" className="sr-only">
            Cari repositori
          </label>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3">
            <IconSearch size={17} />
          </span>
          <input
            id="cari-repo"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Cari nama, bahasa, atau topik…"
            autoComplete="off"
            className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-11 text-[16px] sm:text-[14.5px] text-ink placeholder:text-ink-3 shadow-soft transition-all ease-human duration-300 focus:border-clay/60 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--c-clay)_15%,transparent)] focus:outline-none"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Bersihkan pencarian"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-all ease-human duration-200 hover:bg-surface-2 hover:text-ink"
            >
              <IconClose size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Saring berdasarkan kategori">
        {CATEGORIES.map((category) => {
          const count = counts[category.id] ?? 0;
          const isPending = totalCount === 0;
          const isActive = activeCategory === category.id;
          const isDisabled = !isPending && count === 0 && category.id !== "all";

          return (
            <motion.button
              key={category.id}
              type="button"
              layout
              onClick={() => onCategoryChange(category.id)}
              disabled={isDisabled}
              aria-pressed={isActive}
              title={category.hint}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={[
                "relative rounded-full border px-4 py-2.5 text-[13.5px] font-medium transition-all ease-human duration-300 sm:py-2",
                isActive
                  ? "border-transparent text-bg shadow-soft"
                  : "border-line bg-surface text-ink-2 hover:-translate-y-0.5 hover:border-ink-3/50 hover:text-ink",
                isDisabled && !isActive ? "opacity-45" : "",
              ].join(" ")}
            >
              {isActive && (
                <motion.span
                  layoutId="chip-active"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {category.label}
                <span
                  className={[
                    "text-[11.5px] font-semibold tabular-nums",
                    isActive ? "text-bg/60" : "text-ink-3",
                  ].join(" ")}
                >
                  {isPending ? "…" : count}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
