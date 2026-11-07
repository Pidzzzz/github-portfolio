/**
 * Utilitas pemformatan ringan — tanpa dependensi eksternal.
 */

const NUMBER = new Intl.NumberFormat("id-ID");

/** 1234 -> "1.234" */
export function formatNumber(value) {
  if (!Number.isFinite(value)) return "0";
  return NUMBER.format(value);
}

/** 0 -> "0", 1500 -> "1,5k" */
export function formatCompact(value) {
  if (!Number.isFinite(value) || value < 1000) return formatNumber(value);
  const units = [
    { limit: 1_000_000, suffix: " jt" },
    { limit: 1_000, suffix: " rb" },
  ];
  for (const { limit, suffix } of units) {
    if (value >= limit) {
      const scaled = value / limit;
      const digits = scaled < 10 ? 1 : 0;
      return (
        scaled.toLocaleString("id-ID", {
          minimumFractionDigits: 0,
          maximumFractionDigits: digits,
        }) + suffix
      );
    }
  }
  return formatNumber(value);
}

/**
 * Waktu relatif yang terasa manusiawi: "baru saja", "3 jam lalu", "12 Feb".
 * @param {string|number|Date} input
 * @returns {string}
 */
export function timeAgo(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "waktu tidak diketahui";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60_000);

  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days} hari lalu`;

  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} minggu lalu`;

  const months = Math.round(days / 30);
  if (months < 12) return `${months} bulan lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Tanggal panjang: "4 November 2026" */
export function formatDate(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Ukuran repo dalam KB/MB: 1536 -> "1,5 MB" */
export function formatSize(kilobytes) {
  if (!Number.isFinite(kilobytes) || kilobytes <= 0) return "0 KB";
  if (kilobytes < 1024) return `${formatNumber(kilobytes)} KB`;
  return `${(kilobytes / 1024).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  })} MB`;
}

/** Potong teks panjang dengan aman. */
export function truncate(text, max = 140) {
  if (!text) return "";
  const value = String(text).trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}
