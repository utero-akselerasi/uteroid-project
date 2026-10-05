#!/usr/bin/env node
/*
 * Hardcoded-string audit for the utero.id site.
 *
 * Reports user-visible strings that are baked into components/pages instead of
 * coming from lib/translations. Imports, CSS classes, URLs, route paths and
 * technical tokens are excluded so the report stays actionable.
 *
 * Usage:
 *   node scripts/audit-hardcoded-strings.mjs                # human report
 *   node scripts/audit-hardcoded-strings.mjs --json         # machine report
 *   node scripts/audit-hardcoded-strings.mjs --write out.txt
 *
 * Exit code is 1 while there are findings, so it can gate CI.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const SCAN_ROOTS = ["app", "components"];

/*
 * Data files holding studio marketing copy. Tracked explicitly because the
 * copy lives in data rather than JSX. lib/projects.ts is deliberately absent:
 * those records are client-authored portfolio content, not studio copy.
 */
const DATA_FILES = ["lib/services.ts"];

/*
 * Strings that stay in English on purpose (brand lockups, the brand name,
 * punctuation). Exact full-string matches only, so a half-translated sentence
 * can never slip through on a substring.
 */
const EXACT_ALLOW = new Set([
  "Utero",
  "UTERO",
  "Utero Studio",
  "UTERO STUDIO",
  "Utero Indonesia",
  "utero.id",
  "DESIGN AS A SOLUTION.",
  "SOLVE PROBLEM THROUGH DESIGN SOLUTION.",
  "IDE TANPA REALISASI SAMA DENGAN SAMPAH.",
  "MALANG, INDONESIA",
  "Malang, Indonesia",
  "East Java, Indonesia",
  "&",
  "©",
  "—",
  "–",
  "•",
  "→",
  "←",
  "×",
]);

/* Attributes whose values are read by assistive tech or shown in a control. */
const VISIBLE_ATTRS = new Set([
  "alt",
  "aria-label",
  "aria-placeholder",
  "aria-roledescription",
  "aria-valuetext",
  "label",
  "placeholder",
  "title",
]);

/*
 * Literal values that are code, not prose: CSS colors, timezones, unit
 * keywords, animation and layout keywords, HTTP methods.
 */
const CSS_VALUE =
  /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|var\(--[\w-]+\)|[\d.]+(px|rem|em|vh|vw|vmin|vmax|%|s|ms|deg|fr|ch)$)/;
const CSS_KEYWORD =
  /^(absolute|relative|fixed|sticky|static|flex|grid|block|inline|inline-block|inline-flex|inline-grid|none|auto|hidden|visible|center|cover|contain|top|bottom|left|right|inset|middle|baseline|stretch|column|row|wrap|nowrap|normal|bold|italic|uppercase|lowercase|capitalize|pointer|cursor|serif|sans-serif|monospace|linear-gradient|radial-gradient|cubic-bezier|ease|ease-in|ease-out|ease-in-out|infinite|alternate|forwards|backwards|both|left|scroll|fade|slide|up|down|light|dark|inherit|initial|unset|transparent|currentColor|solid|thick|medium|thin|round|butt|square|clip|ellipsis|pre|nowrap|break-word|break-all|min-content|max-content|fit-content|space-between|space-around|space-evenly|flex-start|flex-end|start|end|contain|sr-only|not-sr-only|default|manual|vertical|horizontal|auto|blur|blurDataURL|quality|placeholder|fill|empty|loading|lazy|eager|decoded|metadata|always|onLoad|onError)$/;

/* HTML tag names and short enum-ish tokens used as data, never as copy. */
const TAG_NAME = /^(div|span|section|article|header|footer|main|nav|aside|ul|ol|li|p|a|button|img|figure|figcaption|h[1-6]|video|iframe|form|label|input|textarea|select|option|table|tr|td|th)$/;
const HIDDEN_ATTRS = new Set([
  "className",
  "class",
  "src",
  "id",
  "key",
  "type",
  "style",
  "rel",
  "target",
  "name",
  "autoComplete",
  "autocomplete",
  "role",
  "as",
  "sizes",
  "width",
  "height",
  "fill",
  "stroke",
  "viewBox",
  "xmlns",
  "lang",
  "dir",
  "media",
  "preload",
  "crossOrigin",
  "referrerPolicy",
  "loading",
  "decoding",
  "poster",
  "action",
  "method",
  "encType",
  "noValidate",
  "color",
  "d",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "offset",
  "stopColor",
  "stopOpacity",
  "htmlFor",
  "colSpan",
  "rowSpan",
  "charSet",
  "contentEditable",
  "suppressHydrationWarning",
]);

/* Directives and module specifiers that look like copy but are not. */
const TECH_PREFIX = /^(use |next|react|@|\.|node:)/;
const TECH_EXACT = new Set([
  "use client",
  "use server",
  "use strict",
  "utf-8",
  "utf8",
]);

const KEYLIKE = /^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)+$/;
const SLUGLIKE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CAMEL_OR_IDENT = /^[a-z][a-zA-Z0-9]*$/;

/*
 * English strings that already exist in the dictionary. A hardcoded string that
 * matches one of these is a wiring gap rather than a copy gap: the translation
 * exists, the component just needs to read it from lib/translations.
 */
const DICT_VALUES = new Set(
  (() => {
    const src = fs.readFileSync(path.join(ROOT, "lib/translations/en.ts"), "utf8");
    const found = (src.match(/"((?:[^"\\\n]|\\.)*)"/g) || []).map((x) =>
      x.slice(1, -1).replace(/\\n/g, "\n").trim()
    );
    return found.filter((v) => v && /[A-Za-z]/.test(v));
  })()
);

function isAllowedFile(rel) {
  // Client-authored portfolio records and routing config are out of scope.
  return (
    /[\\/]lib[\\/]projects\.ts$/.test(rel) || /[\\/]middleware\.ts$/.test(rel)
  );
}

function blankOut(src) {
  // Replace comment bodies with spaces, preserving offsets so indices stay valid.
  let out = src;
  out = out.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  out = out.replace(
    /(^|[^:'"`\\])\/\/[^\n]*/g,
    (m, p1) => p1 + " ".repeat(Math.max(0, m.length - p1.length))
  );
  return out;
}

function lineIndexMap(src) {
  const starts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === "\n") starts.push(i + 1);
  return starts;
}

function lineAt(starts, offset) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}

/*
 * Classifies the JSX attribute a literal belongs to, or null when the literal is
 * not in an attribute. Only VISIBLE_ATTRS count as user-facing positions; a
 * literal sitting in ordinary code is treated as data, which keeps identifier
 * strings such as state values from being reported.
 */
function attrBefore(src, idx) {
  const lineStart = src.lastIndexOf("\n", idx - 1) + 1;
  const before = src.slice(lineStart, idx);
  const braced = before.match(/([A-Za-z][A-Za-z0-9-]*)\s*=\s*\{\s*$/);
  if (braced) {
    return braced[1].startsWith("data-") ? "data" : braced[1];
  }
  const plain = before.match(/([A-Za-z][A-Za-z0-9-]*)\s*=\s*$/);
  return plain ? plain[1] : null;
}

function isHiddenAttr(attr) {
  return attr === "data" || (attr !== null && HIDDEN_ATTRS.has(attr));
}

function inImport(src, idx) {
  const lineStart = src.lastIndexOf("\n", idx - 1) + 1;
  const line = src.slice(lineStart, idx);
  if (/^\s*(import|export)\b/.test(line)) return true;
  if (/\bfrom\s*$/.test(line)) return true;
  return false;
}

/*
 * Literals used as identifiers rather than copy: string comparisons, DOM lookups,
 * console output and third-party service IDs. None of these reach the screen.
 */
function isNonVisibleCode(src, idx, value) {
  const lineStart = src.lastIndexOf("\n", idx - 1) + 1;
  const before = src.slice(lineStart, idx);

  if (/(?:===|!==|==|!=)\s*$/.test(before)) return true; // comparison operand
  if (/\b(getElementById|querySelector|querySelectorAll|getElementsBy\w+|closest)\(\s*$/.test(before))
    return true;
  if (/\b(console\.\w+|setAttribute|getAttribute|addEventListener|removeEventListener)\(\s*$/.test(before))
    return true;
  if (/^(service|template|user|contact|public)_[A-Za-z0-9]{6,}$/.test(value)) return true;
  if (/^[A-Za-z0-9_-]{20,}$/.test(value) && !/\s/.test(value)) return true; // keys/tokens
  if (/^[A-Za-z0-9]{16}$/.test(value)) return true; // opaque third-party key
  if (/^(on[a-z]+|(true|false|null|undefined|object|behavior|smooth|auto))$/.test(value))
    return true;

  // `import("...")["nav"]` type-index access.
  const window = src.slice(Math.max(0, idx - 120), idx);
  if (/\bimport\(\s*$/.test(window) || /\]\[\s*$/.test(window)) return true;

  return false;
}

function looksLikeProse(v) {
  const words = v.split(/\s+/).filter((w) => /[A-Za-z]/.test(w));
  return words.length > 1;
}

function classify(value, kind, visible) {
  const v = value.trim();
  if (!v) return null;
  if (EXACT_ALLOW.has(v)) return null;
  if (TECH_EXACT.has(v)) return null;
  if (TECH_PREFIX.test(v)) return null;
  if (/^https?:\/\//.test(v) || v.includes("://")) return null;
  if (/^[/#][A-Za-z0-9_\-/]*$/.test(v)) return null;
  if (/^\.(css|scss|svg|png|jpg|jpeg|webp|avif|gif|json)$/.test(v)) return null;
  if (/^[a-z]{2}(-[A-Za-z]{2})?$/.test(v) && v.length <= 5) return null; // locale
  if (!/[A-Za-z]/.test(v)) return null;
  if (/^[\s\d.,:;%°+\-*/()[\]{}<>#@!&|"'`~^$\\_=]*$/.test(v)) return null;
  if (CSS_VALUE.test(v)) return null;
  if (CSS_KEYWORD.test(v)) return null;
  // CSS transform/function chains, e.g. "translateY(0) scale(1)".
  if (/^[a-z-]+\([^()]*\)(\s+[a-z-]+\([^()]*\))*$/.test(v)) return null;
  if (/^\d+-(digit|char|unit|percent)$/.test(v)) return null; // Intl option
  if (/^\d[\d\s.,%a-zA-Z()#-]*$/.test(v)) return null; // shadow / multi-token CSS
  if (/^\(prefers-[a-z-]+:\s*[a-z-]+\)$/.test(v)) return null; // media query
  if (TAG_NAME.test(v)) return null;
  if (/^\/(?:[A-Za-z0-9_${}\-/.]+)$/.test(v)) return null; // route template
  if (/^[A-Z][a-z]+\/[A-Z][a-z_]+$/.test(v)) return null; // IANA timezone
  if (/^\d+:\d+$/.test(v)) return null; // clock value
  if (/^[A-Z]{2,5}$/.test(v)) return null; // HTTP verb or enum constant

  if (KEYLIKE.test(v)) return { status: "key", why: "translation key" };

  /*
   * A hardcoded string that already exists in the dictionary is not a missing
   * translation; it is a component reading a literal instead of the lookup. It is
   * still reported so the literal gets replaced with the lookup.
   */
  const inDictionary = DICT_VALUES.has(v);

  if (!looksLikeProse(v)) {
    // A lone token: copy only when it sits in a user-facing position.
    if (visible) {
      return {
        status: "report",
        why: "hardcoded token in user-facing attribute",
        inDictionary,
      };
    }
    return { status: "key", why: inDictionary ? "dictionary value, used as data" : "identifier token" };
  }

  return {
    status: "report",
    why: kind === "jsx" ? "hardcoded JSX text" : "hardcoded string literal",
    inDictionary,
  };
}

/*
 * Inline style objects are full of CSS values that look like words
 * ("absolute", "cover", "center"). Collect their ranges so literals inside them
 * can be skipped entirely.
 */
function styleRegions(src) {
  const regions = [];
  const re = /style=\{\{/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index + m[0].length;
    let depth = 2;
    let i = start;
    while (i < src.length && depth > 0) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") depth--;
      i++;
    }
    regions.push([start, i]);
  }
  return regions;
}

function findCandidates(src) {
  const clean = blankOut(src);
  const starts = lineIndexMap(src);
  const styles = styleRegions(src);
  const inStyle = (offset) => styles.some(([a, b]) => offset >= a && offset < b);
  const out = [];

  const commentDepth = (offset) => {
    const before = clean.slice(0, offset);
    return (
      (before.match(/\/\*/g) || []).length - (before.match(/\*\//g) || []).length
    );
  };

  const literalRe = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = literalRe.exec(src)) !== null) {
    if (m.index >= clean.length) continue;
    if (commentDepth(m.index) > 0) continue;
    if (inImport(src, m.index)) continue;
    if (inStyle(m.index)) continue;

    const attr = attrBefore(src, m.index);
    if (isHiddenAttr(attr)) continue;

    const raw = m[1] ?? m[2] ?? m[3] ?? "";
    const value = raw.replace(/\\n/g, "\n").replace(/\\(["'`\\])/g, "$1").trim();
    if (isNonVisibleCode(src, m.index, value)) continue;

    /*
     * A literal only counts as user-facing when it sits in a visible attribute
     * (aria-label, placeholder, alt...). Everywhere else it is data, so lone
     * tokens are treated as identifiers instead of copy.
     */
    const visible = attr !== null && VISIBLE_ATTRS.has(attr);

    const verdict = classify(value, "string", visible);
    if (!verdict) continue;
    out.push({
      line: lineAt(starts, m.index),
      value: value.replace(/\s+/g, " ").trim(),
      kind: "string",
      ...verdict,
    });
  }

  /*
   * JSX text nodes. The pattern is deliberately narrow: a real text node has
   * no quotes, brackets, semicolons or `=`, which keeps code such as
   * `a > b < c` or arrow-function bodies out of the report.
   */
  const jsxRe = />([^<>{}();=\"'`$\[\]\\\/]{2,160})</g;
  while ((m = jsxRe.exec(src)) !== null) {
    const idx = m.index + 1;
    if (idx >= clean.length) continue;
    if (commentDepth(idx) > 0) continue;
    if (inStyle(idx)) continue;
    if (/^\s*[a-z]+\s*$/.test(m[1])) continue; // stray identifiers
    const value = m[1].replace(/\s+/g, " ").trim();
    const verdict = classify(value, "jsx", true);
    if (!verdict) continue;
    out.push({
      line: lineAt(starts, idx),
      value,
      kind: "jsx",
      ...verdict,
    });
  }

  return out;
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      walk(full, acc);
    } else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const relFiles = SCAN_ROOTS.flatMap((r) => {
  const dir = path.join(ROOT, r);
  return fs.existsSync(dir) ? walk(dir).map((f) => path.relative(ROOT, f)) : [];
});

const targets = [
  ...relFiles,
  ...DATA_FILES.filter((f) => fs.existsSync(path.join(ROOT, f))),
];

const findings = [];
let scannedFiles = 0;

for (const rel of targets) {
  if (isAllowedFile(rel)) continue;
  scannedFiles++;
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  for (const c of findCandidates(src)) {
    findings.push({ file: rel, ...c });
  }
}

const seen = new Set();
const unique = findings.filter((f) => {
  const k = `${f.file}:${f.line}:${f.value}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

unique.sort((a, b) =>
  a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file)
);

const mustFix = unique.filter((f) => f.status === "report");
const keyLike = unique.filter((f) => f.status === "key");

const args = process.argv.slice(2);

if (args.includes("--json")) {
  const out = {
    scannedFiles,
    mustFix: mustFix.length,
    keyLike: keyLike.length,
    findings: unique,
  };
  const w = args.indexOf("--write");
  process.stdout.write(JSON.stringify(out, null, 2));
  if (w !== -1 && args[w + 1]) {
    fs.writeFileSync(path.resolve(args[w + 1]), JSON.stringify(out, null, 2), "utf8");
  }
  process.exit(mustFix.length ? 1 : 0);
}

let report = `Scanned ${scannedFiles} files (${SCAN_ROOTS.join(", ")} + ${DATA_FILES.join(", ")})\n`;
const alreadyInDictionary = mustFix.filter((f) => f.inDictionary).length;

report += `\nMUST FIX (${mustFix.length})\n${"-".repeat(64)}\n`;
let lastFile = "";
for (const f of mustFix) {
  if (f.file !== lastFile) {
    report += `\n${f.file}\n`;
    lastFile = f.file;
  }
  const tag = f.inDictionary ? " [dictionary has it]" : "";
  report += `  ${String(f.line).padStart(4)}  ${f.value}${tag}\n`;
}

report += `\n\nKEY-LIKE, spot-check once (${keyLike.length})\n${"-".repeat(64)}\n`;
lastFile = "";
for (const f of keyLike) {
  if (f.file !== lastFile) {
    report += `\n${f.file}\n`;
    lastFile = f.file;
  }
  report += `  ${String(f.line).padStart(4)}  ${f.value}\n`;
}

report += `\n\nSUMMARY: ${mustFix.length} to fix (${alreadyInDictionary} already in dictionary), ${keyLike.length} key-like, ${scannedFiles} files\n`;

process.stdout.write(report);

const w = args.indexOf("--write");
if (w !== -1 && args[w + 1]) {
  fs.writeFileSync(path.resolve(args[w + 1]), report, "utf8");
  process.stdout.write("wrote " + args[w + 1] + "\n");
}

process.exit(mustFix.length ? 1 : 0);