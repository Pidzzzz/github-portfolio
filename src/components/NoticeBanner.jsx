import { motion } from "framer-motion";
import { IconAlert, IconRefresh } from "./Icon";

/**
 * Pita pemberitahuan lembut untuk ketika data berasal dari salinan lokal.
 * Bukan merah alarm — hanya pengingat ramah.
 */
export default function NoticeBanner({ message, onReload }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 overflow-hidden"
      role="status"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px_20px_20px_8px] border border-clay/30 bg-clay/8 px-5 py-3.5">
        <p className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
          <span className="mt-0.5 shrink-0 text-clay">
            <IconAlert size={16} />
          </span>
          {message}
        </p>

        <button
          type="button"
          onClick={onReload}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-clay/35 bg-surface px-3.5 py-2 text-[12.5px] font-semibold text-clay transition-all ease-human duration-300 hover:-translate-y-0.5 hover:shadow-soft"
        >
          <IconRefresh size={14} />
          Coba lagi
        </button>
      </div>
    </motion.div>
  );
}
