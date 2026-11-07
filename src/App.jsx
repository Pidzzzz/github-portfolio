import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Toolbar from "./components/Toolbar";
import NoticeBanner from "./components/NoticeBanner";
import RepoGrid, { GridSkeleton } from "./components/RepoGrid";
import PreviewModal from "./components/PreviewModal";
import Footer from "./components/Footer";

import { useGithub } from "./hooks/useGithub";
import { useTheme } from "./hooks/useTheme";
import { resolvePreviewUrl } from "./utils/github";
import {
  countCategories,
  matchesCategory,
  matchesQuery,
} from "./data/categories";

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { status, profile, repos, source, error, reload, tokenConfigured } =
    useGithub();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewRepo, setPreviewRepo] = useState(null);

  /** Tautan pratinjau disematkan sekali agar tidak dihitung ulang tiap render. */
  const enriched = useMemo(
    () => repos.map((repo) => ({ ...repo, previewUrl: resolvePreviewUrl(repo) })),
    [repos],
  );

  const counts = useMemo(() => countCategories(enriched), [enriched]);

  const visible = useMemo(
    () =>
      enriched.filter(
        (repo) =>
          matchesCategory(repo, activeCategory) && matchesQuery(repo, query),
      ),
    [enriched, activeCategory, query],
  );

  const newestRepo = enriched[0] ?? null;

  function resetFilters() {
    setQuery("");
    setActiveCategory("all");
  }

  return (
    <div className="grain relative min-h-screen overflow-x-hidden">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        profile={profile}
        source={source}
      />

      <main id="tentang" className="relative pb-24">
        <Hero
          profile={profile}
          repoCount={enriched.length}
          newestRepo={newestRepo}
        />

        <div className="mx-auto w-[min(1180px,calc(100%-1.5rem))] pt-10">
          <NoticeBanner message={error} onReload={reload} />

          {!tokenConfigured && status === "ready" && !error && (
            <p className="mb-6 text-[13px] text-ink-3">
              Berjalan tanpa token API — jumlah permintaan dibatasi 60 per jam.
              Salin <code className="rounded bg-surface-2 px-1.5 py-0.5">.env.example</code>{" "}
              menjadi <code className="rounded bg-surface-2 px-1.5 py-0.5">.env.local</code>{" "}
              untuk memakainya tanpa batas.
            </p>
          )}

          <Toolbar
            query={query}
            onQueryChange={setQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={counts}
            visibleCount={visible.length}
            totalCount={enriched.length}
          />

          {status === "loading" ? (
            <GridSkeleton />
          ) : (
            <RepoGrid
              repos={visible}
              query={query}
              activeCategory={activeCategory}
              onPreview={setPreviewRepo}
              onReset={resetFilters}
            />
          )}
        </div>
      </main>

      <Footer profile={profile} repoCount={enriched.length} />

      <AnimatePresence>
        {previewRepo && (
          <PreviewModal
            key={previewRepo.id ?? previewRepo.name}
            repo={previewRepo}
            onClose={() => setPreviewRepo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
