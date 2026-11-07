/**
 * Kategori repo berbasis topik + kata kunci deskripsi.
 *
 * Setiap repo mendapat SATU kategori utama (untuk chip filter), ditambah
 * bendera `featured` yang bersifat independen sehingga sebuah repo bisa
 * muncul di filter "Unggulan" maupun kategorinya sendiri.
 */

export const CATEGORIES = [
  { id: "all", label: "Semua", hint: "Seluruh koleksi" },
  { id: "featured", label: "Unggulan", hint: "Paling banyak disorot" },
  { id: "web", label: "Web Apps", hint: "Aplikasi & situs web" },
  { id: "tools", label: "Tools / Scripts", hint: "Utilitas & skrip" },
  { id: "bots", label: "Bot & Otomasi", hint: "Bot dan pekerjaan otomatis" },
  { id: "other", label: "Lainnya", hint: "Eksperimen & catatan" },
];

const RULES = [
  {
    id: "bots",
    test: (repo) => {
      const text = haystack(repo);
      const topics = repo.topics ?? [];
      return (
        /\b(bot|bots|telegram|discord|whatsapp|otomasi|automation|crawler|scrap)/i.test(
          text,
        ) || topics.some((t) => /bot|automation|telegram|discord/.test(t))
      );
    },
  },
  {
    id: "web",
    test: (repo) => {
      const text = haystack(repo);
      const topics = repo.topics ?? [];
      return (
        /\b(pwa|web|website|situs|aplikasi|app|kasir|dashboard|frontend|landing)/i.test(
          text,
        ) || topics.some((t) => /web|pwa|react|frontend|site/.test(t))
      );
    },
  },
  {
    id: "tools",
    test: (repo) => {
      const text = haystack(repo);
      const topics = repo.topics ?? [];
      return (
        /\b(tools?|scripts?|decrypt|decrpyt|hook|modding|mod|util|cli|parser|converter)/i.test(
          text,
        ) || topics.some((t) => /tool|script|mod|hook|decrypt/.test(t))
      );
    },
  },
];

function haystack(repo) {
  return [repo.name, repo.description ?? "", (repo.topics ?? []).join(" ")].join(" ");
}

/**
 * Kategori utama repo.
 * @param {object} repo
 * @returns {"web"|"tools"|"bots"|"other"}
 */
export function primaryCategory(repo) {
  for (const rule of RULES) {
    if (rule.test(repo)) return rule.id;
  }
  return "other";
}

/**
 * Repo dianggap unggulan bila punya bintang atau termasuk yang paling baru
 * disentuh — supaya rak tidak terasa sepi hanya karena bintang sedikit.
 * @param {object} repo
 * @param {string[]} recentNames nama 3 repo terbaru (sudah diurutkan)
 */
export function isFeatured(repo, recentNames = []) {
  if (repo.stargazers_count > 0) return true;
  return recentNames.includes(repo.name);
}

/** Gabungkan kategori utama + bendera featured pada tiap repo. */
export function withCategoryFlags(repos) {
  const recentNames = repos
    .slice()
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3)
    .map((r) => r.name);

  return repos.map((repo) => ({
    ...repo,
    category: primaryCategory(repo),
    featured: isFeatured(repo, recentNames),
  }));
}

/**
 * Cocokkan repo terhadap chip filter aktif.
 * @param {object} repo
 * @param {string} categoryId
 */
export function matchesCategory(repo, categoryId) {
  if (categoryId === "all") return true;
  if (categoryId === "featured") return Boolean(repo.featured);
  return repo.category === categoryId;
}

/** Hitung jumlah tiap kategori untuk label chip. */
export function countCategories(repos) {
  const counts = { all: repos.length, featured: 0 };
  for (const repo of repos) {
    if (repo.featured) counts.featured += 1;
    counts[repo.category] = (counts[repo.category] ?? 0) + 1;
  }
  return counts;
}

/**
 * Cocokkan teks pencarian terhadap nama, deskripsi, bahasa, dan topik.
 * @param {object} repo
 * @param {string} query
 */
export function matchesQuery(repo, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const fields = [
    repo.name,
    repo.description ?? "",
    repo.language ?? "",
    ...(repo.topics ?? []),
  ];
  return fields.some((field) => field.toLowerCase().includes(q));
}
