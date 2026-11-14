"use client";

import { useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { defaultCampaignConfig } from "@/lib/campaignDefaults";
import { uploadMediaFile } from "./adminApi";
import type { CampaignConfig, CampaignLocaleConfig, CampaignPostConfig, HomepageConfig, SiteSettings } from "@/lib/siteSettings";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
    </div>
  );
}

const POST_KEYS = ["postLeft", "postMiddle", "postRight"] as const;
const POST_LABELS: Record<string, string> = { postLeft: "Post Kiri", postMiddle: "Post Tengah", postRight: "Post Kanan" };

export default function CampaignManager({
  settings,
  busy,
  onSave,
}: {
  settings: SiteSettings;
  busy: boolean;
  onSave: (payload: { homepage?: HomepageConfig; campaign?: CampaignConfig }, message: string) => void;
}) {
  const defaults = useMemo(() => defaultCampaignConfig(), []);
  const [locale, setLocale] = useState<"en" | "id">("en");
  const [mode, setMode] = useState<"random" | "fixed">(settings.homepage?.mode === "fixed" ? "fixed" : "random");
  const [campaign, setCampaign] = useState<CampaignConfig>(() => {
    const merged: CampaignConfig = {};
    for (const loc of ["en", "id"] as const) {
      merged[loc] = { ...defaults[loc], ...(settings.campaign?.[loc] || {}) } as CampaignLocaleConfig;
      for (const key of POST_KEYS) {
        merged[loc]![key] = { ...defaults[loc][key], ...(settings.campaign?.[loc]?.[key] || {}) };
      }
    }
    return merged;
  });
  const [uploading, setUploading] = useState<string | null>(null);

  const loc = campaign[locale] || defaults[locale];

  function setLoc(patch: Partial<CampaignLocaleConfig>) {
    setCampaign((prev) => ({ ...prev, [locale]: { ...(prev[locale] || {}), ...patch } }));
  }

  function setPost(key: (typeof POST_KEYS)[number], patch: Partial<CampaignPostConfig>) {
    setCampaign((prev) => ({
      ...prev,
      [locale]: { ...(prev[locale] || {}), [key]: { ...(prev[locale]?.[key] || {}), ...patch } },
    }));
  }

  async function handleUpload(target: string, file: File) {
    try {
      setUploading(target);
      const url = await uploadMediaFile(file, "campaign");
      const [postKey, field] = target.split(".") as [string, "src" | "poster"];
      if (postKey === "section") {
        // section-level fields don't use media upload
        return;
      }
      setPost(postKey as (typeof POST_KEYS)[number], { [field]: url });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(null);
    }
  }

  function MediaField({ postKey, field, label }: { postKey: string; field: "src" | "poster"; label: string }) {
    const post = loc[postKey as (typeof POST_KEYS)[number]] || {};
    const value = (post as CampaignPostConfig)[field] || "";
    const accept = field === "src" ? "image/jpeg,image/png,image/webp,video/mp4" : "image/jpeg,image/png,image/webp";
    return (
      <Field label={label}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={value}
            onChange={(e) => setPost(postKey as (typeof POST_KEYS)[number], { [field]: e.target.value })}
            placeholder="/portfolio-api/media/campaign/... atau path lokal"
            style={{ flex: 1 }}
          />
          <label className={styles.ghost} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
            {uploading === `${postKey}.${field}` ? "…" : "Upload"}
            <input
              type="file"
              accept={accept}
              className={styles.uploadInput}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(`${postKey}.${field}`, file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </Field>
    );
  }

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>Homepage Content</div>
          <h2>Kampanye Studio & Homepage</h2>
          <p className={styles.muted}>
            Kelola section &quot;Studio Campaign&quot; di homepage (3 pos feed) dan mode rotasi karya pilihan.
          </p>
        </div>
        <button
          className={styles.primary}
          disabled={busy}
          onClick={() => onSave({ homepage: { mode }, campaign }, "Konten kampanye & homepage berhasil disimpan!")}
        >
          {busy ? "Menyimpan…" : "Simpan Kampanye"}
        </button>
      </div>

      <section className={styles.section}>
        <h3>Mode Homepage</h3>
        <div className={styles.checkGrid}>
          <label className={styles.check}>
            <input type="radio" checked={mode === "random"} onChange={() => setMode("random")} />
            Rotasi acak (default)
          </label>
          <label className={styles.check}>
            <input type="radio" checked={mode === "fixed"} onChange={() => setMode("fixed")} />
            4 karya tetap (prioritas tertinggi)
          </label>
        </div>
        <p className={styles.muted} style={{ marginTop: 8 }}>
          Flag &quot;Tampilkan di homepage&quot; dan priority diatur per karya di tab Daftar Proyek.
        </p>
      </section>

      <section className={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Section Kampanye ({locale.toUpperCase()})</h3>
          <div className={styles.checkGrid}>
            {(["en", "id"] as const).map((l) => (
              <button
                key={l}
                className={locale === l ? styles.primary : styles.ghost}
                onClick={() => setLocale(l)}
                type="button"
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.grid2}>
          <Field label="Badge label">
            <input value={loc.badgeLabel || ""} onChange={(e) => setLoc({ badgeLabel: e.target.value })} />
          </Field>
          <Field label="Tag pill">
            <input value={loc.tagPill || ""} onChange={(e) => setLoc({ tagPill: e.target.value })} />
          </Field>
          <Field label="Judul section">
            <input value={loc.title || ""} onChange={(e) => setLoc({ title: e.target.value })} />
          </Field>
          <Field label="Handle Instagram">
            <input value={loc.handle || ""} onChange={(e) => setLoc({ handle: e.target.value })} />
          </Field>
          <div className={styles.wide}>
            <Field label="Subtitle">
              <textarea value={loc.subtitle || ""} onChange={(e) => setLoc({ subtitle: e.target.value })} />
            </Field>
          </div>
        </div>
      </section>

      {POST_KEYS.map((key) => {
        const post = loc[key] || {};
        return (
          <section className={styles.section} key={key}>
            <h3>{POST_LABELS[key]}</h3>
            <div className={styles.grid2}>
              <Field label="Posisi / label">
                <input value={post.position || ""} onChange={(e) => setPost(key, { position: e.target.value })} />
              </Field>
              <Field label="Tipe media">
                <select
                  value={post.mediaType || "video"}
                  onChange={(e) => setPost(key, { mediaType: e.target.value as "video" | "image" })}
                >
                  <option value="video">Video (MP4)</option>
                  <option value="image">Gambar</option>
                </select>
              </Field>
              <Field label="Headline">
                <input value={post.headline || ""} onChange={(e) => setPost(key, { headline: e.target.value })} />
              </Field>
              <Field label="Aria label tombol play">
                <input value={post.playAria || ""} onChange={(e) => setPost(key, { playAria: e.target.value })} />
              </Field>
              <div className={styles.wide}>
                <Field label="Deskripsi">
                  <textarea value={post.description || ""} onChange={(e) => setPost(key, { description: e.target.value })} />
                </Field>
              </div>
              <div className={styles.wide}>
                <MediaField postKey={key} field="src" label="Src media (video MP4 atau gambar)" />
              </div>
              {(post.mediaType || "video") === "video" && (
                <div className={styles.wide}>
                  <MediaField postKey={key} field="poster" label="Poster video" />
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
