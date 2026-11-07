import { AnimatePresence, motion } from "framer-motion";
import RepoCard from "./RepoCard";
import { IconInbox, IconSearch } from "./Icon";

const OFFSETS = ["", "lg:mt-9", "lg:mt-4"];

/**
 * Grid asimetris: kartu pertama memanjang dua kolom, sisanya bergeser
 * vertikal selang-seling agar tidak terbaca sebagai baris korporat yang kaku.
 */
export default function RepoGrid({ repos, query, activeCategory, onPreview, onReset }) {
  if (repos.length === 0) {
    return <EmptyState query={query} activeCategory={activeCategory} onReset={onReset} />;
  }

  return (
    <motion.div
      layout
      className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {repos.map((repo, index) => (
          <motion.div
            key={repo.id ?? repo.name}
            layout
            className={[
              index === 0 ? "sm:col-span-2" : "",
              index === 0 ? "" : OFFSETS[index % OFFSETS.length],
            ].join(" ")}
          >
            <RepoCard
              repo={repo}
              index={index}
              wide={index === 0}
              onPreview={onPreview}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

/** Keadaan kosong dengan bahasa yang ramah, bukan pesan teknis. */
function EmptyState({ query, activeCategory, onReset }) {
  const isSearching = query.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="radius-organic flex flex-col items-center border border-dashed border-ink-3/40 bg-surface/60 px-6 py-16 text-center"
    >
      <span className="grid h-16 w-16 place-items-center rounded-[22px_22px_22px_8px] bg-surface-2 text-ink-3">
        {isSearching ? <IconSearch size={26} /> : <IconInbox size={26} />}
      </span>

      <h3 className="mt-5 font-display text-[22px] font-semibold tracking-tight">
        {isSearching ? "Belum ketemu, maaf" : "Rak kategori ini masih kosong"}
      </h3>

      <p className="mt-2 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
        {isSearching ? (
          <>
            Tidak ada proyek yang cocok dengan{" "}
            <q className="font-medium text-ink">{query.trim()}</q>. Coba kata
            kunci lain — misalnya bahasa seperti <em>Python</em> atau{" "}
            <em>JavaScript</em>.
          </>
        ) : (
          <>
            Sepertinya belum ada proyek yang masuk ke kategori ini. Pilih
            kategori lain untuk melihat yang lainnya.
          </>
        )}
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-all ease-human duration-300 hover:-translate-y-0.5 hover:shadow-soft"
      >
        Tampilkan semua proyek
      </button>
    </motion.div>
  );
}

/** Kerangka muat yang bentuknya menyerupai kartu asli. */
export function GridSkeleton() {
  return (
    <div
      aria-hidden
      className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className={[
            "radius-organic-alt border border-line bg-surface p-6",
            index === 0 ? "sm:col-span-2" : "",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <span className="skeleton h-3 w-24 rounded-full" />
            <span className="skeleton h-3 w-16 rounded-full" />
          </div>
          <span className="skeleton mt-4 block h-6 w-2/3 rounded-lg" />
          <div className="mt-4 space-y-2">
            <span className="skeleton block h-3.5 w-full rounded-full" />
            <span className="skeleton block h-3.5 w-5/6 rounded-full" />
          </div>
          <div className="mt-5 flex gap-2">
            <span className="skeleton h-6 w-16 rounded-full" />
            <span className="skeleton h-6 w-20 rounded-full" />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="skeleton h-3.5 w-24 rounded-full" />
            <span className="skeleton h-8 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
