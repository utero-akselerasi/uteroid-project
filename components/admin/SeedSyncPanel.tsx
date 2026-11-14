"use client";

import { useMemo, useState } from "react";
import { projects as legacyProjects } from "@/lib/projects";
import styles from "./AdminDashboard.module.css";
import {
  buildSyncPayload,
  computeWorkDiffs,
  previewValue,
  type AdminProjectLike,
  type SyncFieldDiff,
  type WorkSyncDiff,
} from "./seedSync";

type ApiFn = (path: string, options?: RequestInit, csrfToken?: string) => Promise<any>;

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
};

function workKey(work: WorkSyncDiff): string {
  return String(work.db.id ?? work.seed.slug);
}

function fieldKey(work: WorkSyncDiff, field: SyncFieldDiff): string {
  return `${workKey(work)}::${field.path}`;
}

export default function SeedSyncPanel({
  projects,
  csrfToken,
  api,
  requestConfirm,
  onApplied,
  onNotice,
  onError,
}: {
  projects: AdminProjectLike[];
  csrfToken: string;
  api: ApiFn;
  requestConfirm: (options: ConfirmOptions) => void;
  onApplied: () => Promise<void> | void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}) {
  const diffs = useMemo(() => computeWorkDiffs(projects, legacyProjects), [projects]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const emptyFieldCount = useMemo(
    () => diffs.reduce((sum, work) => sum + work.fields.filter((f) => f.kind === "empty").length, 0),
    [diffs]
  );
  const worksWithEmpty = useMemo(
    () => diffs.filter((work) => work.fields.some((f) => f.kind === "empty")).length,
    [diffs]
  );

  function toggleExpanded(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleField(work: WorkSyncDiff, field: SyncFieldDiff) {
    const key = fieldKey(work, field);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleWork(work: WorkSyncDiff, select: boolean) {
    setChecked((prev) => {
      const next = new Set(prev);
      for (const field of work.fields) {
        const key = fieldKey(work, field);
        if (select) next.add(key);
        else next.delete(key);
      }
      return next;
    });
  }

  function checkedFieldsFor(work: WorkSyncDiff): SyncFieldDiff[] {
    return work.fields.filter((field) => checked.has(fieldKey(work, field)));
  }

  async function applyWork(work: WorkSyncDiff, fields: SyncFieldDiff[], silent = false) {
    if (!work.db.id || fields.length === 0) return true;
    const payload = buildSyncPayload(work.db, work.seed, fields.map((f) => f.path));
    await api(`admin/projects/${work.db.id}`, { method: "PUT", body: JSON.stringify(payload) }, csrfToken);
    if (!silent) {
      onNotice(`${work.seed.title}: ${fields.length} field diperbarui.`);
      setChecked((prev) => {
        const next = new Set(prev);
        for (const field of fields) next.delete(fieldKey(work, field));
        return next;
      });
    }
    return true;
  }

  async function applySelected(work: WorkSyncDiff) {
    const fields = checkedFieldsFor(work);
    if (fields.length === 0) return;
    setBusy(true);
    onError("");
    try {
      await applyWork(work, fields);
      await onApplied();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Sinkronisasi gagal");
    } finally {
      setBusy(false);
    }
  }

  function fillEmptyFields() {
    const targets = diffs
      .map((work) => ({ work, fields: work.fields.filter((f) => f.kind === "empty") }))
      .filter((item) => item.fields.length > 0);
    if (targets.length === 0) return;
    const totalFields = targets.reduce((sum, item) => sum + item.fields.length, 0);
    requestConfirm({
      title: "Isi Kolom Kosong dari Seed",
      message: `Isi ${totalFields} field kosong di ${targets.length} karya dari data seed? Hanya field yang saat ini kosong yang diisi — tidak ada data admin yang ditimpa.`,
      confirmLabel: "Isi Kolom Kosong",
      isDanger: false,
      onConfirm: async () => {
        setBusy(true);
        onError("");
        let applied = 0;
        let failed = 0;
        const failures: string[] = [];
        for (const { work, fields } of targets) {
          try {
            await applyWork(work, fields, true);
            applied += fields.length;
          } catch {
            failed += 1;
            failures.push(work.seed.title);
          }
        }
        await onApplied();
        setBusy(false);
        if (failed > 0) {
          onError(`${applied} field terisi, ${failed} karya gagal: ${failures.join(", ")}`);
        } else {
          onNotice(`${applied} field kosong diisi dari seed (${targets.length} karya).`);
        }
      },
    });
  }

  if (diffs.length === 0) {
    return (
      <div className={styles.bannerCard} style={{ marginBottom: 16 }}>
        <p className={styles.muted} style={{ margin: 0 }}>
          Semua karya yang ada di database sudah sama dengan data seed — tidak ada yang perlu disinkronkan.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.bannerCard} style={{ marginBottom: 16 }}>
      <div className={styles.bannerCardHeader}>
        <h3>Sinkronisasi dari Seed ({diffs.length} karya berbeda)</h3>
        <div className={styles.actions}>
          <button className={styles.secondary} disabled={busy} onClick={fillEmptyFields}>
            Isi kolom kosong saja ({emptyFieldCount} field / {worksWithEmpty} karya)
          </button>
        </div>
      </div>
      <p className={styles.muted} style={{ margin: "0 0 12px" }}>
        Bandingkan data seed (kode) dengan isi database per field. Centang field yang ingin diterapkan —
        tidak ada yang ditimpa kecuali Anda memilihnya.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {diffs.map((work) => {
          const key = workKey(work);
          const isOpen = expanded.has(key);
          const selected = checkedFieldsFor(work);
          return (
            <div key={key} style={{ border: "1px solid #dedad2", background: "#fff" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 14px",
                  cursor: "pointer",
                  flexWrap: "wrap",
                }}
                onClick={() => toggleExpanded(key)}
              >
                <div>
                  <strong style={{ fontSize: 13 }}>{work.seed.title}</strong>
                  <span className={styles.muted} style={{ marginLeft: 8, fontSize: 12 }}>
                    {work.fields.length} field · {work.fields.filter((f) => f.kind === "empty").length} kosong
                  </span>
                </div>
                <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.ghost} disabled={busy} onClick={() => toggleWork(work, true)}>
                    Pilih semua
                  </button>
                  <button
                    className={styles.primary}
                    disabled={busy || selected.length === 0}
                    onClick={() => applySelected(work)}
                  >
                    Terapkan {selected.length > 0 ? `(${selected.length})` : ""}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid #eee", padding: "10px 14px 14px" }}>
                  {work.fields.map((field) => {
                    const fKey = fieldKey(work, field);
                    const isChecked = checked.has(fKey);
                    return (
                      <label
                        key={field.path}
                        className={styles.check}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          width: "100%",
                          marginBottom: 8,
                          cursor: "pointer",
                          opacity: isChecked ? 1 : 0.85,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleField(work, field)}
                          style={{ marginTop: 3 }}
                        />
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <strong style={{ fontSize: 12 }}>{field.label}</strong>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: ".06em",
                                textTransform: "uppercase",
                                padding: "2px 6px",
                                background: field.kind === "empty" ? "#dff4e6" : "#fff0c8",
                                color: field.kind === "empty" ? "#176437" : "#765500",
                              }}
                            >
                              {field.kind === "empty" ? "DB kosong" : "Berbeda"}
                            </span>
                            {field.media && (
                              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#888" }}>
                                media
                              </span>
                            )}
                          </span>
                          <span className={styles.muted} style={{ display: "block", fontSize: 11, marginTop: 3 }}>
                            Seed: {previewValue(field.seedValue)}
                          </span>
                          <span className={styles.muted} style={{ display: "block", fontSize: 11 }}>
                            DB: {previewValue(field.currentValue)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
