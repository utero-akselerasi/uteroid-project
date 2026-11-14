"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { api } from "./adminApi";
import { en } from "@/lib/translations/en";
import { id as idTranslations } from "@/lib/translations/id";
import { servicesData } from "@/lib/services";
import { flattenKeys, getPath, type ContentOverride } from "@/lib/contentOverrides";

const SCOPES = [
  { id: "translations", label: "Terjemahan EN/ID" },
  { id: "services", label: "Copy Layanan" },
  { id: "seo", label: "SEO per Halaman" },
  { id: "page-copy", label: "Copy Halaman" },
] as const;

const TRANSLATION_LOCALES = ["en", "id"] as const;
const SERVICE_FIELDS = ["name", "tagline", "heroHeadline", "description", "overview", "approach", "deliverables", "capabilities", "imageAlt", "inquiryLabel"];
const SEO_PAGES = ["work", "services", "studio", "contact", "insights"];
const SEO_FIELDS = ["title", "description", "openGraph.title", "openGraph.description", "twitter.title", "twitter.description"];

interface Row {
  id: string; // unique row id: scope|key|locale
  scope: string;
  key: string;
  locale: string;
  defaultValue: unknown;
  override?: ContentOverride;
}

function displayValue(v: unknown): string {
  if (v === undefined) return "";
  return typeof v === "string" ? v : JSON.stringify(v);
}

export default function ContentOverridesPanel({ csrfToken }: { csrfToken: string }) {
  const [scope, setScope] = useState<string>("translations");
  const [locale, setLocale] = useState<string>("en");
  const [search, setSearch] = useState("");
  const [overrides, setOverrides] = useState<ContentOverride[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    api("content-overrides").then((data) => setOverrides(data?.overrides || [])).catch(() => setError("Gagal memuat daftar override."));
  }, []);

  const translationKeys = useMemo(() => flattenKeys(en), []);

  const rows = useMemo<Row[]>(() => {
    const q = search.trim().toLowerCase();
    const match = (key: string) => !q || key.toLowerCase().includes(q);
    const out: Row[] = [];
    const byId = `${scope}|`;

    const push = (r: Omit<Row, "override">) => {
      if (!match(r.key)) return;
      const override = overrides.find((o) => o.scope === r.scope && o.key === r.key && o.locale === r.locale);
      out.push({ ...r, override });
    };

    if (scope === "translations") {
      const base = locale === "id" ? idTranslations : en;
      for (const key of translationKeys) {
        push({ id: `${byId}${key}|${locale}`, scope, key, locale, defaultValue: getPath(base, key) });
      }
    } else if (scope === "services") {
      for (const s of servicesData) {
        for (const field of SERVICE_FIELDS) {
          for (const loc of TRANSLATION_LOCALES) {
            if (locale !== "all" && loc !== locale) continue;
            push({
              id: `${byId}${s.slug}.${field}|${loc}`,
              scope,
              key: `${s.slug}.${field}`,
              locale: loc,
              defaultValue: getPath(loc === "id" ? idTranslations : en, `disciplines.${({ brand: "brand", product: "product", promotion: "promotion", digital: "digital", environmental: "environmental", outdoor: "outdoor" } as Record<string, string>)[s.slug] || ""}.${field}`),
            });
          }
        }
      }
    } else if (scope === "seo") {
      for (const page of SEO_PAGES) {
        for (const field of SEO_FIELDS) {
          push({ id: `${byId}${page}.${field}|`, scope, key: `${page}.${field}`, locale: "", defaultValue: undefined });
        }
      }
    } else {
      // page-copy: show existing overrides + allow custom keys
      for (const o of overrides.filter((x) => x.scope === "page-copy")) {
        if (locale !== "all" && o.locale !== locale) continue;
        if (!match(o.key)) continue;
        out.push({ id: `${byId}${o.key}|${o.locale}`, scope, key: o.key, locale: o.locale, defaultValue: undefined, override: o });
      }
    }
    return out;
  }, [scope, locale, search, overrides, translationKeys]);

  async function save(row: Row) {
    const draft = drafts[row.id];
    if (draft === undefined) return;
    let value: unknown = draft;
    try {
      value = JSON.parse(draft);
    } catch {
      // treat as plain string
    }
    setBusyKey(row.id);
    setError("");
    try {
      await api("admin/content-overrides", {
        method: "PUT",
        body: JSON.stringify({ scope: row.scope, key: row.key, locale: row.locale, value }),
      }, csrfToken);
      setMessage(`Override ${row.key} (${row.locale || "default"}) disimpan.`);
      const data = await api("content-overrides");
      setOverrides(data?.overrides || []);
      setDrafts((d) => {
        const next = { ...d };
        delete next[row.id];
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan override.");
    } finally {
      setBusyKey(null);
    }
  }

  async function reset(row: Row) {
    setBusyKey(row.id);
    setError("");
    try {
      await api(`admin/content-overrides?scope=${encodeURIComponent(row.scope)}&key=${encodeURIComponent(row.key)}&locale=${encodeURIComponent(row.locale)}`, { method: "DELETE" }, csrfToken);
      setMessage(`Override ${row.key} direset ke default.`);
      const data = await api("content-overrides");
      setOverrides(data?.overrides || []);
      setDrafts((d) => {
        const next = { ...d };
        delete next[row.id];
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mereset override.");
    } finally {
      setBusyKey(null);
    }
  }

  async function addPageCopy() {
    const key = newKey.trim();
    if (!key) return;
    let value: unknown = newValue;
    try {
      value = JSON.parse(newValue);
    } catch { /* plain string */ }
    setBusyKey("new");
    setError("");
    try {
      await api("admin/content-overrides", {
        method: "PUT",
        body: JSON.stringify({ scope: "page-copy", key, locale: "en", value }),
      }, csrfToken);
      setMessage(`Override ${key} disimpan.`);
      const data = await api("content-overrides");
      setOverrides(data?.overrides || []);
      setNewKey("");
      setNewValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan override.");
    } finally {
      setBusyKey(null);
    }
  }

  const shownCount = rows.length;

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>Konten</div>
          <h2>Override Konten (EN/ID, Layanan, SEO)</h2>
          <p className={styles.muted}>
            Nilai di database menimpa default kode. Kosongkan override untuk kembali ke default. Teks translasi tampil setelah reload halaman.
          </p>
        </div>
      </div>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.section}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <div className={styles.checkGrid}>
            {SCOPES.map((s) => (
              <button key={s.id} className={scope === s.id ? styles.primary : styles.ghost} onClick={() => { setScope(s.id); setSearch(""); }} type="button">
                {s.label}
              </button>
            ))}
          </div>
          {(scope === "translations" || scope === "services") && (
            <div className={styles.checkGrid}>
              {TRANSLATION_LOCALES.map((l) => (
                <button key={l} className={locale === l ? styles.primary : styles.ghost} onClick={() => setLocale(l)} type="button">
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari key…"
            style={{ flex: 1, minWidth: 180 }}
          />
        </div>
        <p className={styles.muted} style={{ marginBottom: 12 }}>{shownCount} key</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "65vh", overflowY: "auto" }}>
          {rows.map((row) => {
            const current = row.override ? displayValue(row.override.value) : displayValue(row.defaultValue);
            const draft = drafts[row.id] ?? current;
            const dirty = drafts[row.id] !== undefined && drafts[row.id] !== current;
            return (
              <div key={row.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 12, border: "1px solid #e3ded5", borderRadius: 4, background: "#faf9f6" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 12, wordBreak: "break-all" }}>
                    {row.key}
                    {row.locale && <span className={styles.muted}> [{row.locale}]</span>}
                    {row.override && <span style={{ color: "#e31e24" }}> ● override</span>}
                  </div>
                  {!row.override && row.defaultValue !== undefined && (
                    <div className={styles.muted} style={{ fontSize: 12, marginTop: 2, whiteSpace: "pre-wrap" }}>{current.slice(0, 140)}{current.length > 140 ? "…" : ""}</div>
                  )}
                  <input
                    value={draft}
                    onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                    placeholder='Nilai override (teks atau JSON, mis. "teks" atau {"a":1})'
                    style={{ width: "100%", marginTop: 6, fontFamily: "monospace", fontSize: 12 }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                  <button className={styles.primary} disabled={!dirty || busyKey === row.id} onClick={() => save(row)} type="button">
                    {busyKey === row.id ? "…" : "Simpan"}
                  </button>
                  {row.override && (
                    <button className={styles.ghost} disabled={busyKey === row.id} onClick={() => reset(row)} type="button">
                      Reset
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {scope === "page-copy" && (
            <div style={{ display: "flex", gap: 8, padding: 12, border: "1px dashed #bbb", borderRadius: 4 }}>
              <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="key.baru (mis. hero.cta)" style={{ flex: 1 }} />
              <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="nilai" style={{ flex: 1 }} />
              <button className={styles.primary} onClick={addPageCopy} type="button">Tambah</button>
            </div>
          )}
          {!rows.length && <p className={styles.muted}>Tidak ada key yang cocok.</p>}
        </div>
      </section>
    </div>
  );
}
