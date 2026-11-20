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
  { id: "projects", label: "Proyek EN/ID" },
] as const;

const TRANSLATION_LOCALES = ["en", "id"] as const;
const PAGE_SIZE = 20;
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
  return typeof v === "string" ? v : JSON.stringify(v) ?? "";
}

export default function ContentOverridesPanel({ csrfToken }: { csrfToken: string }) {
  const [scope, setScope] = useState<string>("translations");
  const [locale, setLocale] = useState<string>("en");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
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
      // page-copy / projects: show existing overrides + allow custom keys
      for (const o of overrides.filter((x) => x.scope === scope)) {
        if (scope === "projects" && o.locale !== locale) continue;
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
        body: JSON.stringify({ scope, key, locale: locale === "id" ? "id" : "en", value }),
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
  const pageCount = Math.max(1, Math.ceil(shownCount / PAGE_SIZE));
  const visibleRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.editor}>
      <header className={styles.contentHeader}>
        <div className={styles.eyebrow}>Konten & Bahasa</div>
        <h2>Kelola konten situs</h2>
        <p className={styles.muted}>Atur terjemahan, copy layanan, SEO, dan teks halaman. Nilai override menggantikan default; reset untuk memakai teks bawaan lagi.</p>
      </header>
      {message && <div className={styles.success} role="status">{message}</div>}
      {error && <div className={styles.error} role="alert">{error}</div>}
      <section className={styles.contentWorkspace} aria-label="Editor konten">
        <div className={styles.scopeTabs} role="group" aria-label="Jenis konten">
          {SCOPES.map((item) => <button key={item.id} className={scope === item.id ? styles.scopeTabActive : styles.scopeTab} aria-pressed={scope === item.id} onClick={() => { setScope(item.id); setSearch(""); setPage(1); }} type="button">{item.label}</button>)}
        </div>
        <div className={styles.contentTools}>
          {(scope === "translations" || scope === "services" || scope === "projects") && <div className={styles.localePicker} role="group" aria-label="Bahasa"><span>Bahasa</span>{TRANSLATION_LOCALES.map((item) => <button key={item} className={locale === item ? styles.localeActive : styles.localeButton} aria-pressed={locale === item} onClick={() => { setLocale(item); setPage(1); }} type="button">{item.toUpperCase()}</button>)}</div>}
          <label className={styles.contentSearch}><span>Cari key konten</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Contoh: hero.title" /></label>

        </div>
        <div className={styles.contentListHeader}>
          <div><strong>{shownCount.toLocaleString("id-ID")}</strong> key tersedia{shownCount > 0 && <span> · Menampilkan {((page - 1) * PAGE_SIZE + 1).toLocaleString("id-ID")}–{Math.min(page * PAGE_SIZE, shownCount).toLocaleString("id-ID")}</span>}</div>
          <div className={styles.pagination} aria-label="Halaman daftar key"><button type="button" className={styles.pageButton} disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Sebelumnya</button><span>Halaman {Math.min(page, pageCount)} / {pageCount}</span><button type="button" className={styles.pageButton} disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Berikutnya</button></div>
        </div>
        <div className={styles.contentList}>
          {visibleRows.map((row) => {
            const current = row.override ? displayValue(row.override.value) : displayValue(row.defaultValue);
            const draft = drafts[row.id] ?? current;
            const dirty = drafts[row.id] !== undefined && drafts[row.id] !== current;
            const fieldId = "content-" + row.id;
            const longValue = current.length > 120 || Array.isArray(row.defaultValue) || Array.isArray(row.override?.value);
            return <article key={row.id} className={styles.contentRow}>
              <div className={styles.contentMeta}><code>{row.key}</code>{row.locale && <span className={styles.localeTag}>{row.locale.toUpperCase()}</span>}{row.override ? <span className={styles.overrideTag}>Override aktif</span> : <span className={styles.defaultTag}>Default</span>}{row.defaultValue !== undefined && !row.override && <p>{current.length > 110 ? current.slice(0, 110) + "…" : current}</p>}</div>
              <div className={styles.contentField}><label htmlFor={fieldId}>{row.override ? "Nilai override" : "Nilai teks"}</label>{longValue ? <textarea id={fieldId} value={draft} rows={3} onChange={(event) => setDrafts((values) => ({ ...values, [row.id]: event.target.value }))} /> : <input id={fieldId} value={draft} onChange={(event) => setDrafts((values) => ({ ...values, [row.id]: event.target.value }))} />}</div>
              <div className={styles.contentActions}><button className={styles.saveOverride} disabled={!dirty || busyKey === row.id} onClick={() => save(row)} type="button">{busyKey === row.id ? "Menyimpan…" : "Simpan"}</button>{row.override && <button className={styles.resetOverride} disabled={busyKey === row.id} onClick={() => reset(row)} type="button">Reset</button>}</div>
            </article>;
          })}
          {!rows.length && <div className={styles.contentEmpty}><strong>Tidak ada key yang cocok.</strong><span>Coba kata kunci lain atau hapus pencarian.</span>{search && <button type="button" onClick={() => { setSearch(""); setPage(1); }}>Hapus pencarian</button>}</div>}

        </div>
        {(scope === "page-copy" || scope === "projects") && <form className={styles.newCopyForm} onSubmit={(event) => { event.preventDefault(); void addPageCopy(); }}><div><strong>{scope === "projects" ? "Tambah teks proyek" : "Tambah copy halaman"}</strong><p>Gunakan key unik, misalnya <code>{scope === "projects" ? "biskuat.description" : "hero.cta"}</code>.</p></div><label>Key<input value={newKey} onChange={(event) => setNewKey(event.target.value)} placeholder={scope === "projects" ? "slug.field" : "hero.cta"} required /></label><label>Nilai<input value={newValue} onChange={(event) => setNewValue(event.target.value)} placeholder="Teks baru" required /></label><button className={styles.saveOverride} disabled={busyKey === "new"} type="submit">{busyKey === "new" ? "Menyimpan…" : "Tambah copy"}</button></form>}
      </section>
    </div>
  );
}
