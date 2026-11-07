import { motion } from "framer-motion";
import { IconGithub, IconSparkle } from "./Icon";

const LINKS = [
  { href: "https://github.com/Pidzzzz", label: "GitHub" },
  { href: "https://github.com/Pidzzzz?tab=repositories", label: "Semua repo" },
  { href: "mailto:ahmadrafflir05@gmail.com", label: "Email" },
];

/** Penutup yang hangat — bukan blok hukum abu-abu. */
export default function Footer({ profile, repoCount }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-surface/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-transparent to-clay/8 blur-2xl"
      />

      <div className="relative mx-auto w-[min(1180px,calc(100%-1.5rem))] py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-[46ch]">
            <p className="flex items-center gap-2 font-display text-[24px] font-semibold tracking-tight">
              <span className="text-clay">
                <IconSparkle size={18} />
              </span>
              Terima kasih sudah mampir.
            </p>
            <p className="mt-3 text-[15px] leading-[1.75] text-ink-2">
              Rak ini berisi {repoCount} proyek yang tumbuh pelan-pelan sambil
              saya belajar. Kalau ada yang menarik perhatian — atau memantik
              ide — saya senang sekali mendengarnya.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-ink-2 transition-all ease-human duration-300 hover:-translate-y-0.5 hover:border-ink-3/50 hover:text-ink"
                  >
                    {link.label === "GitHub" && <IconGithub size={14} />}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="radius-organic-alt border border-line bg-surface p-5 shadow-soft md:min-w-[260px]">
            <p className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">
              Dibuat oleh
            </p>
            <p className="mt-2 font-display text-[19px] font-semibold tracking-tight">
              {profile?.name ?? "Pidzzzz"}
            </p>
            <p className="mt-1 text-[13.5px] text-ink-2">
              @{profile?.login ?? "Pidzzzz"} · React + Tailwind + Framer Motion
            </p>
            <p className="mt-4 border-t border-line pt-3 text-[12.5px] leading-relaxed text-ink-3">
              Data diambil langsung dari GitHub API, jadi rak ini tidak pernah
              basi.
            </p>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[12.5px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile?.name ?? "Pidzzzz"} — dirakit dengan sabar di
            rumah.
          </p>
          <p className="flex items-center gap-1.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-clay" />
            Bukan templat korporat.
          </p>
        </div>
      </div>
    </footer>
  );
}
