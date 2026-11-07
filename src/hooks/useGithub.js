import { useCallback, useEffect, useState } from "react";
import { fetchProfile, fetchRepos, hasToken } from "../utils/github";
import { withCategoryFlags } from "../data/categories";

/**
 * Mengambil profil + daftar repo, dengan status yang jelas dan selalu
 * memiliki data cadangan sebagai jaring pengaman.
 *
 * @returns {{
 *   status: "loading"|"ready",
 *   profile: object|null,
 *   repos: object[],
 *   source: "api"|"fallback"|null,
 *   error: string|null,
 *   reload: () => void
 * }}
 */
export function useGithub() {
  const [state, setState] = useState({
    status: "loading",
    profile: null,
    repos: [],
    source: null,
    error: null,
  });
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let alive = true;

    async function load() {
      setState((prev) => ({ ...prev, status: "loading", error: null }));

      const [profileResult, reposResult] = await Promise.all([
        fetchProfile(),
        fetchRepos(),
      ]);

      if (!alive) return;

      const fellBack = profileResult.source === "fallback" || reposResult.source === "fallback";

      setState({
        status: "ready",
        profile: profileResult.data,
        repos: withCategoryFlags(reposResult.data),
        source: reposResult.source,
        error: fellBack
          ? "Koneksi ke GitHub sedang tidak bersahabat, jadi kami tampilkan salinan lokal dulu."
          : null,
      });
    }

    load().catch(() => {
      if (!alive) return;
      setState((prev) => ({
        ...prev,
        status: "ready",
        error: "Ada yang mengganjal saat memuat rak proyek. Coba muat ulang, ya.",
      }));
    });

    return () => {
      alive = false;
    };
  }, [nonce]);

  return { ...state, tokenConfigured: hasToken(), reload };
}
