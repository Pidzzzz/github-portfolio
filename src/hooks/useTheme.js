import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

/**
 * Tema gelap/terang dengan persistensi ke localStorage dan
 * hormat pada preferensi sistem saat belum pernah dipilih.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const toggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "dark" ? "#15171c" : "#f6f4f0");

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* penyimpanan diblokir — tema tetap berlaku untuk sesi ini */
    }
  }, [theme]);

  return { theme, toggle };
}
