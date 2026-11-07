import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Visualizer kode sebagai cadangan pratinjau ketika repo tidak punya
 * halaman live. Baris kode dibangun deterministik dari nama repo +
 * bahasanya — hasilnya stabil antar render, bukan acak berubah tiap saat.
 */

/** Gaya sintaks per bahasa supaya campuran token tidak terlihat asal-asalan. */
const STYLE = {
  JavaScript: {
    mode: "code", hash: "//", varKw: "const", declKw: "function",
    retKw: "return", open: " {", close: "}", semi: ";", file: "index.js",
  },
  TypeScript: {
    mode: "code", hash: "//", varKw: "const", declKw: "export function",
    retKw: "return", open: " {", close: "}", semi: ";", file: "index.ts",
  },
  Python: {
    mode: "code", hash: "#", varKw: "", declKw: "def",
    retKw: "return", open: ":", close: "", semi: "", file: "main.py",
  },
  HTML: { mode: "html", hash: "<!--", file: "index.html" },
  CSS: { mode: "css", hash: "/*", file: "styles.css" },
  "C#": {
    mode: "code", hash: "//", varKw: "var", declKw: "public void",
    retKw: "return", open: " {", close: "}", semi: ";", file: "Program.cs",
  },
  "C++": {
    mode: "code", hash: "//", varKw: "auto", declKw: "void",
    retKw: "return", open: " {", close: "}", semi: ";", file: "main.cpp",
  },
  C: {
    mode: "code", hash: "//", varKw: "int", declKw: "void",
    retKw: "return", open: " {", close: "}", semi: ";", file: "main.c",
  },
  Lua: {
    mode: "code", hash: "--", varKw: "local", declKw: "function",
    retKw: "return", open: "", close: "end", semi: "", file: "main.lua",
  },
  Shell: {
    mode: "code", hash: "#", varKw: "", declKw: "function",
    retKw: "return", open: " {", close: "}", semi: "", file: "run.sh",
  },
  PowerShell: {
    mode: "code", hash: "#", varKw: "$", declKw: "function",
    retKw: "return", open: " {", close: "}", semi: "", file: "script.ps1",
  },
  Dart: {
    mode: "code", hash: "//", varKw: "final", declKw: "void",
    retKw: "return", open: " {", close: "}", semi: ";", file: "main.dart",
  },
  Kotlin: {
    mode: "code", hash: "//", varKw: "val", declKw: "fun",
    retKw: "return", open: " {", close: "}", semi: "", file: "Main.kt",
  },
  Java: {
    mode: "code", hash: "//", varKw: "final", declKw: "public void",
    retKw: "return", open: " {", close: "}", semi: ";", file: "Main.java",
  },
  Go: {
    mode: "code", hash: "//", varKw: "var", declKw: "func",
    retKw: "return", open: " {", close: "}", semi: "", file: "main.go",
  },
  Rust: {
    mode: "code", hash: "//", varKw: "let", declKw: "fn",
    retKw: "return", open: " {", close: "}", semi: "", file: "main.rs",
  },
};

const DEFAULT_STYLE = STYLE.JavaScript;

const KEYWORDS = {
  JavaScript: ["import", "from", "async", "await", "export", "new"],
  TypeScript: ["import", "type", "satisfies", "export", "await"],
  Python: ["import", "from", "class", "async", "with", "elif"],
  HTML: ["<section", "<article", "<button", "<nav", "<ul"],
  CSS: ["display", "grid", "flex", "position", "gap", "align-items"],
  "C#": ["using", "namespace", "class", "public", "async", "await"],
  "C++": ["include", "namespace", "template", "constexpr", "nullptr"],
  C: ["include", "static", "struct", "const", "size_t"],
  Lua: ["local", "function", "end", "elseif", "require"],
  Shell: ["local", "echo", "grep", "return", "export"],
  PowerShell: ["param", "return", "$true", "Write-Output"],
  Dart: ["import", "final", "late", "await", "widget"],
  Kotlin: ["fun", "val", "var", "suspend", "when"],
  Java: ["import", "final", "static", "public", "void"],
  Go: ["package", "import", "func", "defer", "chan"],
  Rust: ["fn", "let", "mut", "impl", "async", "derive"],
};

const DEFAULT_KEYWORDS = ["import", "const", "async", "return"];

const IDENTIFIERS = [
  "init",
  "resolve",
  "handleEvent",
  "loadConfig",
  "parseInput",
  "renderList",
  "connect",
  "dispatch",
  "normalize",
  "buildTree",
];

/** PRNG kecil (mulberry32) — deterministik per seed. */
function seededRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const slugify = (value) => value.replace(/[^a-zA-Z0-9]+/g, "");

function buildCodeLines(repoName, language, style, rand, keywords, pick) {
  const slug = slugify(repoName);
  const lines = [
    { indent: 0, tokens: [{ text: `${style.hash} ${repoName}`, kind: "comment" }] },
  ];

  const total = 14;
  for (let i = lines.length; i < total; i += 1) {
    const roll = rand();

    // Deklarasi fungsi
    if (roll < 0.15) {
      lines.push({
        indent: 0,
        tokens: [
          { text: style.declKw, kind: "keyword" },
          { text: ` ${pick(IDENTIFIERS)}()`, kind: "fn" },
          { text: style.open, kind: "plain" },
        ],
      });
      continue;
    }

    // Deklarasi nilai
    if (roll < 0.34) {
      const name = pick(IDENTIFIERS);
      const value = `${pick(IDENTIFIERS)}(${Math.floor(rand() * 90 + 10)})${style.semi}`;
      lines.push({
        indent: 1,
        tokens: style.varKw
          ? [
              { text: style.varKw, kind: "keyword" },
              { text: ` ${name} = `, kind: "plain" },
              { text: value, kind: "string" },
            ]
          : [
              { text: `${name} = `, kind: "plain" },
              { text: value, kind: "string" },
            ],
      });
      continue;
    }

    // Baris komentar
    if (roll < 0.47) {
      lines.push({
        indent: 1,
        tokens: [
          { text: `${style.hash} sinkronkan dengan state lokal`, kind: "comment" },
        ],
      });
      continue;
    }

    // Pemanggilan
    if (roll < 0.66) {
      lines.push({
        indent: 1,
        tokens: [
          { text: pick(IDENTIFIERS), kind: "fn" },
          {
            text: `("${slug}.${pick(["json", "log", "cfg"])}")${style.semi}`,
            kind: "string",
          },
        ],
      });
      continue;
    }

    // Return
    if (roll < 0.86) {
      lines.push({
        indent: 1,
        tokens: [
          { text: style.retKw, kind: "keyword" },
          {
            text: ` ${pick(IDENTIFIERS)}(${Math.floor(rand() * 900 + 100)})${style.semi}`,
            kind: "plain",
          },
        ],
      });
      continue;
    }

    // Penutup blok
    if (style.close) {
      lines.push({ indent: 0, tokens: [{ text: style.close, kind: "plain" }] });
    } else {
      lines.push({
        indent: 1,
        tokens: [{ text: pick(keywords), kind: "keyword" }],
      });
    }
  }

  return lines;
}

function buildHtmlLines(repoName) {
  const slug = slugify(repoName).toLowerCase();
  return [
    { indent: 0, tokens: [{ text: `<!-- ${repoName} -->`, kind: "comment" }] },
    { indent: 0, tokens: [{ text: `<main class="${slug}-page">`, kind: "keyword" }] },
    { indent: 1, tokens: [{ text: `<header class="hero">`, kind: "keyword" }] },
    { indent: 2, tokens: [{ text: `<h1>`, kind: "keyword" }, { text: "Selamat datang", kind: "string" }, { text: `</h1>`, kind: "keyword" }] },
    { indent: 2, tokens: [{ text: `<p>`, kind: "keyword" }, { text: "Antarmuka yang ringan dan menyenangkan.", kind: "string" }, { text: `</p>`, kind: "keyword" }] },
    { indent: 1, tokens: [{ text: `</header>`, kind: "keyword" }] },
    { indent: 1, tokens: [{ text: `<section class="grid">`, kind: "keyword" }] },
    { indent: 2, tokens: [{ text: `<article class="card">`, kind: "keyword" }] },
    { indent: 3, tokens: [{ text: `<h2>`, kind: "keyword" }, { text: "Kartu fitur", kind: "string" }, { text: `</h2>`, kind: "keyword" }] },
    { indent: 3, tokens: [{ text: `<a href="#">`, kind: "keyword" }, { text: "Selengkapnya", kind: "string" }, { text: `</a>`, kind: "keyword" }] },
    { indent: 2, tokens: [{ text: `</article>`, kind: "keyword" }] },
    { indent: 1, tokens: [{ text: `</section>`, kind: "keyword" }] },
    { indent: 0, tokens: [{ text: `<script src="/app.js"></script>`, kind: "keyword" }] },
    { indent: 0, tokens: [{ text: `</main>`, kind: "keyword" }] },
  ];
}

function buildCssLines(repoName) {
  const slug = slugify(repoName).toLowerCase();
  return [
    { indent: 0, tokens: [{ text: `/* ${repoName} */`, kind: "comment" }] },
    { indent: 0, tokens: [{ text: `.${slug}-page {`, kind: "keyword" }] },
    { indent: 1, tokens: [{ text: `display: `, kind: "plain" }, { text: "grid", kind: "string" }, { text: ";", kind: "plain" }] },
    { indent: 1, tokens: [{ text: `gap: `, kind: "plain" }, { text: "1.5rem", kind: "string" }, { text: ";", kind: "plain" }] },
    { indent: 1, tokens: [{ text: `padding: `, kind: "plain" }, { text: "clamp(1rem, 4vw, 3rem)", kind: "string" }, { text: ";", kind: "plain" }] },
    { indent: 0, tokens: [{ text: `}`, kind: "plain" }] },
    { indent: 0, tokens: [{ text: `.card {`, kind: "keyword" }] },
    { indent: 1, tokens: [{ text: `border-radius: `, kind: "plain" }, { text: "28px 28px 28px 8px", kind: "string" }, { text: ";", kind: "plain" }] },
    { indent: 1, tokens: [{ text: `box-shadow: `, kind: "plain" }, { text: "0 24px 48px -16px rgb(0 0 0 / 0.16)", kind: "string" }, { text: ";", kind: "plain" }] },
    { indent: 1, tokens: [{ text: `transition: `, kind: "plain" }, { text: "transform .45s cubic-bezier(.22,1,.36,1)", kind: "string" }, { text: ";", kind: "plain" }] },
    { indent: 1, tokens: [{ text: `&:hover { transform: `, kind: "plain" }, { text: "translateY(-6px)", kind: "string" }, { text: " }", kind: "plain" }] },
    { indent: 0, tokens: [{ text: `}`, kind: "plain" }] },
    { indent: 0, tokens: [{ text: `@media (prefers-reduced-motion: reduce) {`, kind: "keyword" }] },
    { indent: 1, tokens: [{ text: `.card { transition: `, kind: "plain" }, { text: "none", kind: "string" }, { text: " }", kind: "plain" }] },
    { indent: 0, tokens: [{ text: `}`, kind: "plain" }] },
  ];
}

function buildLines(repoName, language) {
  const style = STYLE[language] ?? DEFAULT_STYLE;
  const rand = seededRandom(hashString(`${repoName}:${language ?? "mixed"}`));
  const keywords = KEYWORDS[language] ?? DEFAULT_KEYWORDS;
  const pick = (list) => list[Math.floor(rand() * list.length)];

  if (style.mode === "html") return buildHtmlLines(repoName);
  if (style.mode === "css") return buildCssLines(repoName);
  return buildCodeLines(repoName, language, style, rand, keywords, pick);
}

const KIND_CLASS = {
  comment: "text-ink-3 italic",
  keyword: "text-clay font-semibold",
  string: "text-moss",
  fn: "text-sky-soft",
  plain: "text-ink-2",
};

export default function CodeVisualizer({ repoName, language }) {
  const { lines, fileName } = useMemo(() => {
    const style = STYLE[language] ?? DEFAULT_STYLE;
    return {
      lines: buildLines(repoName, language),
      fileName: style.file,
    };
  }, [repoName, language]);

  return (
    <div className="radius-organic overflow-hidden border border-line bg-surface-2">
      <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-clay/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e9c46a]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-moss/70" />
        </span>
        <span className="truncate font-mono text-[11.5px] text-ink-3">
          {repoName}/{fileName}
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-ink-3">
          {language ?? "campuran"}
        </span>
      </div>

      <div className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.85]">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: Math.min(index * 0.05, 0.75),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex gap-3 whitespace-pre"
          >
            <span className="w-5 shrink-0 select-none text-right text-ink-3/60">
              {index + 1}
            </span>
            <span
              aria-hidden
              className="shrink-0"
              style={{ width: `${line.indent * 1.1}em` }}
            />
            <span>
              {line.tokens.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  className={KIND_CLASS[token.kind] ?? KIND_CLASS.plain}
                >
                  {token.text}
                </span>
              ))}
              {index === lines.length - 1 && (
                <span className="caret-blink ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 bg-clay" />
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
