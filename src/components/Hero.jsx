import { motion } from "framer-motion";
import { formatNumber, timeAgo } from "../utils/format";
import { IconArrow, IconGithub, IconSparkle } from "./Icon";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Hero asimetris: judul besar di kiri, kartu profil yang sedikit miring
 * dan menumpuk di kanan — sengaja tidak simetris agar terasa hidup.
 */
export default function Hero({ profile, repoCount, newestRepo }) {
  const ready = Boolean(profile) && repoCount > 0;

  const stats = [
    { value: ready ? formatNumber(repoCount) : "—", label: "repositori" },
    { value: ready ? formatNumber(profile?.followers ?? 0) : "—", label: "pengikut" },
    {
      value: newestRepo ? timeAgo(newestRepo.updated_at) : "—",
      label: "terakhir disentuh",
    },
  ];

  return (
    <section
      id="atas"
      className="relative mx-auto w-[min(1180px,calc(100%-1.5rem))] pt-14 pb-6 sm:pt-20"
    >
      {/* Latar gradien lembut — menghangatkan permukaan tanpa agresif */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-clay/14 blur-[110px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
          className="absolute -top-24 right-0 h-[380px] w-[380px] rounded-full bg-moss/14 blur-[120px]"
        />
      </div>

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-soft"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moss" />
            </span>
            Rak proyek diperbarui{" "}
            {newestRepo ? timeAgo(newestRepo.updated_at) : "sebentar lagi"}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[clamp(2.4rem,6.4vw,4.4rem)] font-semibold leading-[1.03] tracking-[-0.025em] text-balance"
          >
            Kumpulan karya yang{" "}
            <span className="relative ml-1 inline-block italic text-clay">
              <span className="relative z-10">dibuat</span>
              <svg
                aria-hidden
                viewBox="0 0 220 16"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-3.5 w-full text-clay/35"
              >
                <path
                  d="M3 11C48 4 130 2 217 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br className="hidden sm:block" /> dengan tangan, bukan cetakan.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[52ch] text-[16.5px] leading-[1.75] text-ink-2"
          >
            Halo, saya{" "}
            <strong className="font-semibold text-ink">
              {profile?.name ?? "Pidzzzz"}
            </strong>
            . Di rak ini tersimpan aplikasi web, perkakas kecil, dan bot yang
            saya tulis sambil belajar — masing-masing punya cerita dan masalah
            nyata yang coba diselesaikan.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#rak"
              className="group inline-flex items-center gap-2.5 rounded-full bg-clay px-6 py-3.5 text-[14.5px] font-semibold text-bg shadow-[0_14px_30px_-12px_color-mix(in_srgb,var(--c-clay)_70%,transparent)] transition-all ease-human duration-300 hover:-translate-y-0.5 hover:bg-clay-2 hover:shadow-lift"
            >
              Lihat isi rak
              <IconArrow
                size={17}
                className="transition-transform ease-human duration-300 group-hover:translate-x-1"
              />
            </a>

            <a
              href={profile?.html_url ?? "https://github.com/Pidzzzz"}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-all ease-human duration-300 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <IconGithub size={17} />
              Buka di GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* Kartu profil — sedikit miring & menumpuk agar ada kedalaman */}
        <motion.div
          initial={{ opacity: 0, y: 34, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -1.6 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[400px] lg:mx-0 lg:justify-self-end"
        >
          <div
            aria-hidden
            className="absolute -inset-3 -z-10 rounded-[36px_36px_36px_10px] bg-gradient-to-br from-clay/22 via-transparent to-moss/22 blur-xl"
          />

          <div className="radius-organic border border-line bg-surface p-6 shadow-lift sm:p-7">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={
                    profile?.avatar_url ??
                    "https://avatars.githubusercontent.com/u/208608712?v=4"
                  }
                  alt={`Foto profil ${profile?.name ?? "Pidzzzz"}`}
                  width={72}
                  height={72}
                  loading="eager"
                  decoding="async"
                  className="h-[72px] w-[72px] rounded-[24px_24px_24px_8px] object-cover ring-2 ring-clay/30"
                />
                <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-moss text-bg shadow-soft">
                  <IconSparkle size={14} />
                </span>
              </div>

              <div className="min-w-0 pt-1">
                <p className="font-display text-[22px] font-semibold leading-tight tracking-tight">
                  {profile?.name ?? "Pidzzzz"}
                </p>
                <p className="truncate text-[13.5px] font-medium text-ink-3">
                  @{profile?.login ?? "Pidzzzz"}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                  {profile?.bio ?? "Membangun perkakas kecil untuk masalah nyata."}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-line pt-5">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-[19px] font-semibold leading-none tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-tight text-ink-3">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chip kecil yang menumpuk di tepi kartu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-5 -left-4 rotate-[-4deg] rounded-full border border-line bg-surface px-4 py-2 text-[12px] font-semibold shadow-soft"
          >
            <span className="text-clay">◆</span> open source sejak{" "}
            {profile?.created_at
              ? new Date(profile.created_at).getFullYear()
              : 2025}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
