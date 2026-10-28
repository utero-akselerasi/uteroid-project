"use client";

import { useEffect, useMemo, useState } from "react";
import { projects as legacyProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";
import {
  defaultSiteSettings,
  AVAILABLE_TYPEFACES,
  type SiteSettings,
  type BannerSlide,
  type InsightArticleConfig,
  type StudioConfig,
  type InsightsConfig,
} from "@/lib/siteSettings";
import styles from "./AdminDashboard.module.css";

type Status = "draft" | "published" | "archived";
type AdminProject = Project & { id?: number; status: Status; publishedAt?: string; createdAt?: string; updatedAt?: string };
type SessionResponse = { authenticated: boolean; csrfToken: string };
type MediaItem = { id: number; mediaType: string; url: string; filename: string; sortOrder: number };
type AdminTab = "projects" | "typography" | "banners" | "media" | "studio" | "insights" | "contacts" | "security";

const disciplines = ["identity", "packaging", "signage", "campaign", "print", "digital", "exhibition", "indoor", "outdoor"] as const;
const industries = ["fnb", "corporate", "government", "education", "property", "retail", "arts", "event", "services", "products"] as const;

function slugify(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

const emptyProject = (): AdminProject => ({
  slug: "",
  routeSlug: "",
  title: "",
  client: "",
  year: new Date().getFullYear().toString(),
  category: "",
  industry: "services",
  disciplines: ["identity"],
  shortDescription: "",
  description: "",
  coverImage: "",
  featured: false,
  priority: 0,
  tags: [],
  galleryImages: [],
  details: { scope: [], challenge: "", solution: "" },
  status: "draft",
});

async function api(path: string, options: RequestInit = {}, csrfToken = "") {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  const response = await fetch(`/portfolio-api/${path}`, { ...options, headers, credentials: "same-origin", cache: "no-store" });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Permintaan gagal");
  return data;
}

async function uploadMediaFile(file: File): Promise<string> {
  const form = new FormData();
  form.set("file", file);
  const res = await fetch("/api/admin/upload-banner", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal mengunggah gambar.");
  return data.url;
}

export default function AdminDashboard() {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [projectQuery, setProjectQuery] = useState("");
  const [clientQuery, setClientQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const requestConfirm = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmDialog({
      isOpen: true,
      ...options,
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [selectedTypeface, setSelectedTypeface] = useState<string>("'Helvetica Neue', Arial, sans-serif");

  async function loadProjects() {
    try {
      const data = await api("admin/projects");
      setProjects(data);
    } catch {
      // Projects optional if backend offline
    }
  }

  async function loadSiteSettings() {
    try {
      const res = await fetch("/api/site-settings", { cache: "no-store" });
      if (res.ok) {
        const data: SiteSettings = await res.json();
        setSiteSettings(data);
        if (data.typography?.typeface) {
          setSelectedTypeface(data.typography.typeface);
        }
      }
    } catch (err) {
      console.warn("Could not load site settings:", err);
    }
  }

  useEffect(() => {
    loadSiteSettings();
    api("admin/auth/session")
      .then((data) => {
        setSession(data);
        return loadProjects();
      })
      .catch(() => setSession(null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (session && editing?.id) {
      api(`admin/projects/${editing.id}/media`)
        .then(setMedia)
        .catch(() => setMedia([]));
    } else {
      setMedia([]);
    }
  }, [session, editing?.id]);

  const years = useMemo(
    () => [...new Set(projects.map((project) => project.year).filter(Boolean))].sort((a, b) => b.localeCompare(a)),
    [projects]
  );

  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        const projectText = `${project.title} ${project.routeSlug}`.toLowerCase();
        const clientText = project.client.toLowerCase();
        return (
          projectText.includes(projectQuery.toLowerCase()) &&
          clientText.includes(clientQuery.toLowerCase()) &&
          (yearFilter === "all" || project.year === yearFilter) &&
          (statusFilter === "all" || project.status === statusFilter)
        );
      }),
    [projects, projectQuery, clientQuery, yearFilter, statusFilter]
  );

  const stats = useMemo(
    () => ({
      total: projects.length,
      published: projects.filter((item) => item.status === "published").length,
      draft: projects.filter((item) => item.status === "draft").length,
      archived: projects.filter((item) => item.status === "archived").length,
      featured: projects.filter((item) => item.featured).length,
    }),
    [projects]
  );

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await api("admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
          totpCode: form.get("totpCode"),
        }),
      });
      setSession(data);
      await loadProjects();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login gagal");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (!session) return;
    await api("admin/auth/logout", { method: "POST" }, session.csrfToken);
    setSession(null);
    setProjects([]);
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    const form = new FormData(event.currentTarget);
    const next = String(form.get("newPassword") || "");
    if (next !== form.get("confirmation")) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api(
        "admin/auth/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            currentPassword: form.get("currentPassword"),
            newPassword: next,
          }),
        },
        session.csrfToken
      );
      setSession(null);
      setNotice("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Password gagal diubah");
    } finally {
      setBusy(false);
    }
  }

  async function importLegacy() {
    if (!session || projects.length > 0) return;
    requestConfirm({
      title: "Impor Proyek Portofolio",
      message: "Impor 34 proyek portofolio bawaan Utero ke dalam database studio?",
      confirmLabel: "Impor 34 Proyek",
      isDanger: false,
      onConfirm: async () => {
        closeConfirm();
        setBusy(true);
        setError("");
        try {
          const payload = legacyProjects.map((project) => ({ ...project, status: "published" }));
          const result = await api("admin/projects/import", { method: "POST", body: JSON.stringify(payload) }, session.csrfToken);
          setNotice(`${result.imported} proyek berhasil diimpor.`);
          await loadProjects();
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Impor gagal");
        } finally {
          setBusy(false);
        }
      },
    });
  }

  async function saveProject(project: AdminProject) {
    if (!session) return;
    const title = (project.title || "").trim();
    const client = (project.client || "").trim();
    if (!title) {
      setError("Judul proyek wajib diisi.");
      return;
    }
    if (!client) {
      setError("Nama client wajib diisi.");
      return;
    }
    const autoSlug = slugify(title) || "proyek-" + Date.now();
    const cleanSlug = slugify(project.slug) || autoSlug;
    const cleanRouteSlug = slugify(project.routeSlug) || cleanSlug;

    const cleanProject: AdminProject = {
      ...project,
      title,
      client,
      slug: cleanSlug,
      routeSlug: cleanRouteSlug,
    };

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const path = cleanProject.id ? `admin/projects/${cleanProject.id}` : "admin/projects";
      const result = await api(path, { method: cleanProject.id ? "PUT" : "POST", body: JSON.stringify(cleanProject) }, session.csrfToken);
      setNotice("Proyek tersimpan.");
      const saved: AdminProject =
        result && typeof result === "object" && !Array.isArray(result) && result.id
          ? {
              ...emptyProject(),
              ...result,
              disciplines: Array.isArray(result.disciplines) && result.disciplines.length > 0 ? result.disciplines : cleanProject.disciplines || ["identity"],
            }
          : {
              ...cleanProject,
              id: cleanProject.id || (result && typeof result === "object" && !Array.isArray(result) && result.id ? result.id : Date.now()),
              disciplines: Array.isArray(cleanProject.disciplines) && cleanProject.disciplines.length > 0 ? cleanProject.disciplines : ["identity"],
            };
      setEditing(saved);
      await loadProjects();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Penyimpanan gagal");
    } finally {
      setBusy(false);
    }
  }

  async function removeProject(project: AdminProject) {
    if (!session || !project.id) return;
    const label = project.title ? `"${project.title}"` : "draft proyek tanpa judul ini";
    requestConfirm({
      title: "Hapus Proyek",
      message: `Apakah Anda yakin ingin menghapus proyek ${label} dari dashboard? Data proyek dan tautannya akan dihapus secara permanen.`,
      confirmLabel: "Hapus Proyek",
      isDanger: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await api(`admin/projects/${project.id}`, { method: "DELETE" }, session.csrfToken);
          setEditing(null);
          await loadProjects();
          setNotice(`Proyek ${label} berhasil dihapus.`);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Gagal menghapus proyek");
        }
      },
    });
  }

  async function upload(project: AdminProject, mediaType: string, files: File[]) {
    if (!session || !project.id || files.length === 0) return;
    setBusy(true);
    setError("");
    setNotice("");
    let uploaded = 0;
    try {
      for (const file of files) {
        const form = new FormData();
        form.set("file", file);
        form.set("mediaType", mediaType);
        form.set("altText", project.title);
        try {
          await api(`admin/projects/${project.id}/media`, { method: "POST", body: form }, session.csrfToken);
          uploaded++;
        } catch (caught) {
          const reason = caught instanceof Error ? caught.message : "Upload gagal";
          setError(`${file.name}: ${reason}. ${uploaded} dari ${files.length} file berhasil diunggah.`);
          break;
        }
      }
      if (uploaded > 0) {
        setEditing(await api(`admin/projects/${project.id}`));
        setMedia(await api(`admin/projects/${project.id}/media`));
        await loadProjects();
        if (uploaded === files.length) setNotice(`${uploaded} media berhasil diunggah.`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Daftar media gagal diperbarui");
    } finally {
      setBusy(false);
    }
  }

  async function deleteMedia(project: AdminProject, item: MediaItem) {
    if (!session || !project.id) return;
    requestConfirm({
      title: "Hapus File Media",
      message: `Apakah Anda yakin ingin menghapus file "${item.filename}" (${item.mediaType})? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: "Hapus File",
      isDanger: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await api(`admin/projects/${project.id}/media/${item.id}`, { method: "DELETE" }, session.csrfToken);
          setMedia(await api(`admin/projects/${project.id}/media`));
          setEditing(await api(`admin/projects/${project.id}`));
          await loadProjects();
          setNotice(`File "${item.filename}" berhasil dihapus.`);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Gagal menghapus media");
        }
      },
    });
  }

  async function moveMedia(project: AdminProject, item: MediaItem, direction: -1 | 1) {
    if (!session || !project.id) return;
    const same = media.filter((value) => value.mediaType === item.mediaType);
    const index = same.findIndex((value) => value.id === item.id);
    const target = index + direction;
    if (target < 0 || target >= same.length) return;
    [same[index], same[target]] = [same[target], same[index]];
    await api(`admin/projects/${project.id}/media/order`, { method: "PUT", body: JSON.stringify({ ids: same.map((value) => value.id) }) }, session.csrfToken);
    setMedia(await api(`admin/projects/${project.id}/media`));
  }

  async function migrateMedia(project: AdminProject) {
    if (!session || !project.id || !confirm(`Pindahkan media ${project.title} ke storage S3?`)) return;
    setBusy(true);
    setError("");
    try {
      const result = await api(`admin/projects/${project.id}/migrate-media`, { method: "POST" }, session.csrfToken);
      setEditing(await api(`admin/projects/${project.id}`));
      setMedia(await api(`admin/projects/${project.id}/media`));
      await loadProjects();
      setNotice(`${result.migrated} file media dipindahkan ke S3.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Migrasi media gagal");
    } finally {
      setBusy(false);
    }
  }

  // Save Site Settings Handler
  async function saveSiteSettingsData(updated: Partial<SiteSettings>, successMsg = "Pengaturan berhasil disimpan.") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const merged: SiteSettings = {
        ...siteSettings,
        ...updated,
        typography: { ...siteSettings.typography, ...(updated.typography || {}) },
        banners: {
          ...siteSettings.banners,
          ...(updated.banners || {}),
          heroSlides: updated.banners?.heroSlides || siteSettings.banners.heroSlides,
          statementBanner: { ...siteSettings.banners.statementBanner, ...(updated.banners?.statementBanner || {}) },
          pageBanners: { ...siteSettings.banners.pageBanners, ...(updated.banners?.pageBanners || {}) },
        },
        serviceImages: { ...siteSettings.serviceImages, ...(updated.serviceImages || {}) },
        contacts: { ...siteSettings.contacts, ...(updated.contacts || {}) },
        studio: { ...siteSettings.studio, ...(updated.studio || {}) },
        insights: { ...siteSettings.insights, ...(updated.insights || {}) },
      };

      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });

      if (!res.ok) throw new Error("Gagal menyimpan ke server.");
      const saved = await res.json();
      setSiteSettings(saved);
      setNotice(successMsg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengaturan.");
    } finally {
      setBusy(false);
    }
  }

  if (checking)
    return (
      <div className={styles.root}>
        <div className={styles.loading}>Memeriksa sesi…</div>
      </div>
    );

  if (!session)
    return (
      <div className={styles.root}>
        <div className={styles.login}>
          <form className={styles.loginCard} onSubmit={login}>
            <div className={styles.eyebrow}>Utero Studio System</div>
            <h1>Admin Login</h1>
            <p className={styles.muted}>Kelola portofolio, banner, tipografi, studio, dan publikasi insights website dari satu kontrol pusat.</p>
            <div className={styles.formStack}>
              {error && <div className={styles.error}>{error}</div>}
              <Field label="Username">
                <input name="username" autoComplete="username" required defaultValue="admin" />
              </Field>
              <Field label="Password">
                <input name="password" type="password" autoComplete="current-password" required />
              </Field>
              <Field label="Kode TOTP">
                <input name="totpCode" inputMode="numeric" autoComplete="one-time-code" placeholder="Opsional jika belum diaktifkan" />
              </Field>
              <button className={styles.primary} disabled={busy}>
                {busy ? "Memeriksa…" : "Masuk Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  return (
    <div className={styles.root}>
      <div className={styles.shell}>
        {/* ─── SIDEBAR NAVIGATION ─── */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            UTERO.ID<span> •</span>
          </div>
          <div className={styles.sideMeta}>STUDIO SYSTEM ADMIN</div>

          <div className={styles.nav}>
            <div className={styles.navSection}>
              <div className={styles.navGroupTitle}>Portofolio</div>
              <button
                className={activeTab === "projects" && !editing ? styles.active : ""}
                onClick={() => {
                  setActiveTab("projects");
                  setEditing(null);
                }}
              >
                Daftar Proyek
              </button>
              <button
                className={activeTab === "projects" && editing && !editing.id ? styles.active : ""}
                onClick={() => {
                  setActiveTab("projects");
                  setEditing(emptyProject());
                }}
              >
                + Tambah Proyek
              </button>
            </div>

            <div className={styles.navSection}>
              <div className={styles.navGroupTitle}>Tampilan & Website</div>
              <button
                className={activeTab === "typography" ? styles.active : ""}
                onClick={() => {
                  setActiveTab("typography");
                  setEditing(null);
                }}
              >
                Tipografi & Font
              </button>
              <button
                className={activeTab === "banners" ? styles.active : ""}
                onClick={() => {
                  setActiveTab("banners");
                  setEditing(null);
                }}
              >
                Banner & Hero
              </button>
              <button
                className={activeTab === "media" ? styles.active : ""}
                onClick={() => {
                  setActiveTab("media");
                  setEditing(null);
                }}
              >
                Gambar Menu (Services)
              </button>
              <button
                className={activeTab === "studio" ? styles.active : ""}
                onClick={() => {
                  setActiveTab("studio");
                  setEditing(null);
                }}
              >
                Menu Studio & Ruang
              </button>
              <button
                className={activeTab === "insights" ? styles.active : ""}
                onClick={() => {
                  setActiveTab("insights");
                  setEditing(null);
                }}
              >
                Menu Insights & Artikel
              </button>
              <button
                className={activeTab === "contacts" ? styles.active : ""}
                onClick={() => {
                  setActiveTab("contacts");
                  setEditing(null);
                }}
              >
                Kontak & Sosmed
              </button>
            </div>

            <div className={styles.navSection}>
              <div className={styles.navGroupTitle}>Sistem</div>
              <button
                className={activeTab === "security" ? styles.active : ""}
                onClick={() => {
                  setActiveTab("security");
                  setEditing(null);
                }}
              >
                Keamanan
              </button>
            </div>
          </div>

          <div className={styles.sideBottom}>
            <button className={styles.ghost} onClick={() => window.open("/", "_blank")}>
              Lihat Website
            </button>
            <button className={styles.danger} onClick={logout}>
              Keluar
            </button>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className={styles.main}>
          {error && <div className={styles.error}>{error}</div>}
          {notice && <div className={styles.success}>{notice}</div>}

          {/* TAB 1: PROJECTS */}
          {activeTab === "projects" &&
            (editing ? (
              <ProjectEditor
                project={editing}
                media={media}
                busy={busy}
                onChange={setEditing}
                onSave={saveProject}
                onDelete={removeProject}
                onDeleteMedia={deleteMedia}
                onMoveMedia={moveMedia}
                onUpload={upload}
                onMigrate={migrateMedia}
                onBack={() => setEditing(null)}
              />
            ) : (
              <>
                <header className={styles.topbar}>
                  <div>
                    <div className={styles.eyebrow}>Archive Management</div>
                    <h1>Work</h1>
                    <p className={styles.muted}>Kelola portofolio publik, status publikasi, dan media S3.</p>
                  </div>
                  <div className={styles.actions}>
                    {projects.length === 0 && (
                      <button className={styles.secondary} disabled={busy} onClick={importLegacy}>
                        Impor 34 proyek lama
                      </button>
                    )}
                    <button className={styles.primary} onClick={() => setEditing(emptyProject())}>
                      + Proyek baru
                    </button>
                  </div>
                </header>
                <div className={styles.stats}>
                  <Stat label="Total" value={stats.total} />
                  <Stat label="Published" value={stats.published} />
                  <Stat label="Draft" value={stats.draft} />
                  <Stat label="Archived" value={stats.archived} />
                  <Stat label="Featured" value={stats.featured} />
                </div>
                <div className={styles.toolbar}>
                  <input
                    aria-label="Filter nama proyek"
                    placeholder="Nama proyek…"
                    value={projectQuery}
                    onChange={(event) => setProjectQuery(event.target.value)}
                  />
                  <input
                    aria-label="Filter nama client"
                    placeholder="Nama client…"
                    value={clientQuery}
                    onChange={(event) => setClientQuery(event.target.value)}
                  />
                  <select aria-label="Filter tahun" value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
                    <option value="all">Semua tahun</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select aria-label="Filter status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="all">Semua status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Proyek</th>
                        <th>Client</th>
                        <th>Tahun</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((project) => (
                        <tr key={project.id}>
                          <td>
                            <div className={styles.projectCell}>
                              {project.coverImage ? (
                                <img className={styles.thumb} src={project.coverImage} alt="" />
                              ) : (
                                <div className={styles.thumb} />
                              )}
                              <div>
                                <div className={styles.title}>
                                  {project.title || <span style={{ fontStyle: "italic", opacity: 0.6 }}>(Tanpa Judul)</span>}
                                </div>
                                <div className={styles.slug}>/work/{project.routeSlug || "..."}</div>
                              </div>
                            </div>
                          </td>
                          <td>{project.client || <span style={{ fontStyle: "italic", opacity: 0.5 }}>-</span>}</td>
                          <td>{project.year}</td>
                          <td>
                            <span className={`${styles.status} ${styles[project.status]}`}>{project.status}</span>
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              <button onClick={() => setEditing(project)}>Edit</button>
                              <button onClick={() => window.open(`/admin/preview/${project.id}`, "_blank")}>Preview</button>
                              <button style={{ color: "#a01015", borderColor: "#f1c0c2" }} onClick={() => removeProject(project)}>Hapus</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ))}

          {/* TAB 2: TYPOGRAPHY / TYPEFACE */}
          {activeTab === "typography" && (
            <TypographyManager
              currentFont={selectedTypeface}
              busy={busy}
              onSelectFont={(font) => setSelectedTypeface(font)}
              onSave={async (font) => {
                await saveSiteSettingsData(
                  { typography: { typeface: font } },
                  `Typeface "${font}" berhasil diterapkan ke seluruh website!`
                );
              }}
            />
          )}

          {/* TAB 3: BANNERS & HERO */}
          {activeTab === "banners" && (
            <BannerManager
              settings={siteSettings}
              busy={busy}
              onSave={async (banners) => {
                await saveSiteSettingsData({ banners }, "Banner website berhasil diperbarui!");
              }}
            />
          )}

          {/* TAB 4: SERVICES MEDIA */}
          {activeTab === "media" && (
            <ServiceMediaManager
              settings={siteSettings}
              busy={busy}
              onSave={async (serviceImages) => {
                await saveSiteSettingsData({ serviceImages }, "Gambar menu disiplin desain berhasil diperbarui!");
              }}
            />
          )}

          {/* TAB 5: STUDIO & RUANG */}
          {activeTab === "studio" && (
            <StudioManager
              studio={siteSettings.studio}
              busy={busy}
              onSave={async (studio) => {
                await saveSiteSettingsData({ studio }, "Konten halaman Studio & filosofi berhasil diperbarui!");
              }}
            />
          )}

          {/* TAB 6: INSIGHTS & ARTIKEL */}
          {activeTab === "insights" && (
            <InsightsManager
              insights={siteSettings.insights}
              busy={busy}
              onSave={async (insights) => {
                await saveSiteSettingsData({ insights }, "Artikel dan header Insights berhasil diperbarui!");
              }}
            />
          )}

          {/* TAB 7: CONTACTS & SOCIALS */}
          {activeTab === "contacts" && (
            <ContactManager
              contacts={siteSettings.contacts}
              busy={busy}
              onSave={async (contacts) => {
                await saveSiteSettingsData({ contacts }, "Informasi kontak dan media sosial berhasil diperbarui!");
              }}
            />
          )}

          {/* TAB 8: SECURITY */}
          {activeTab === "security" && (
            <form className={styles.editor} onSubmit={changePassword}>
              <div className={styles.editorHead}>
                <div>
                  <div className={styles.eyebrow}>Account Security</div>
                  <h2>Ganti Password Admin</h2>
                </div>
              </div>
              <div className={styles.formStack}>
                <Field label="Password sekarang">
                  <input name="currentPassword" type="password" autoComplete="current-password" required />
                </Field>
                <Field label="Password baru">
                  <input name="newPassword" type="password" autoComplete="new-password" minLength={16} required />
                </Field>
                <Field label="Konfirmasi password">
                  <input name="confirmation" type="password" autoComplete="new-password" minLength={16} required />
                </Field>
                <p className={styles.muted}>Minimal 16 karakter. Semua sesi login akan dicabut setelah password berubah.</p>
                <button className={styles.primary} disabled={busy}>
                  {busy ? "Memproses…" : "Ganti Password"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* Confirmation Modal Popup */}
      {confirmDialog?.isOpen && (
        <div className={styles.modalOverlay} onClick={closeConfirm}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.modalHead}>
              <div className={styles.modalEyebrow}>Konfirmasi Tindakan</div>
              <button type="button" className={styles.modalClose} onClick={closeConfirm} aria-label="Tutup">
                ×
              </button>
            </div>
            <h3 className={styles.modalTitle}>{confirmDialog.title}</h3>
            <p className={styles.modalMessage}>{confirmDialog.message}</p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.ghost} onClick={closeConfirm}>
                {confirmDialog.cancelLabel || "Batal"}
              </button>
              <button
                type="button"
                className={confirmDialog.isDanger ? styles.danger : styles.primary}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmLabel || "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SUB-MANAGERS & COMPONENTS
// ─────────────────────────────────────────────

function TypographyManager({
  currentFont,
  busy,
  onSelectFont,
  onSave,
}: {
  currentFont: string;
  busy: boolean;
  onSelectFont: (font: string) => void;
  onSave: (font: string) => void;
}) {
  const [activeFont, setActiveFont] = useState(currentFont);
  const [customInput, setCustomInput] = useState("");

  const selectedOption = AVAILABLE_TYPEFACES.find(
    (t) => t.fontFamily === activeFont || t.name === activeFont
  );

  const handleSelect = (fontFamily: string) => {
    setActiveFont(fontFamily);
    onSelectFont(fontFamily);
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>Brand Typography System</div>
          <h2>Ganti Typeface Website</h2>
          <p className={styles.muted}>
            Pilih font tipografi utama website Utero.id. Perubahan akan langsung diaplikasikan ke judul besar, subjudul, menu navigasi, dan teks isi.
          </p>
        </div>
        <button
          className={styles.primary}
          disabled={busy}
          onClick={() => onSave(activeFont)}
        >
          {busy ? "Menerapkan…" : "Terapkan Font Ini"}
        </button>
      </div>

      {/* Live Specimen Preview Box */}
      <div className={styles.specimenBox} style={{ fontFamily: activeFont }}>
        <div className={styles.specimenHeader}>Live Specimen Preview &mdash; {selectedOption ? selectedOption.name : activeFont}</div>
        <h1 className={styles.specimenHeading}>DESIGN AS A SOLUTION</h1>
        <p className={styles.specimenBody}>
          Utero adalah studio konsultan desain multidisiplin di Malang sejak 1998. Kami membangun identitas visual otoritatif, sistem kemasan produk, arsitektur wayfinding spasial, dan pengalaman digital bernilai tinggi.
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 14, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>01 IDENTITY</span>
          <span>&bull;</span>
          <span>02 PACKAGING</span>
          <span>&bull;</span>
          <span>03 SPATIAL</span>
          <span>&bull;</span>
          <span>04 DIGITAL</span>
        </div>
      </div>

      {/* Typeface Selection Grid */}
      <h3 style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", margin: "24px 0 12px" }}>
        Pilihan Typeface Terkurasi
      </h3>

      <div className={styles.typefaceGrid}>
        {AVAILABLE_TYPEFACES.map((t) => {
          const isSelected = activeFont === t.fontFamily || (t.id === "helvetica" && activeFont.includes("Helvetica Neue"));
          return (
            <div
              key={t.id}
              className={`${styles.typefaceCard} ${isSelected ? styles.typefaceActive : ""}`}
              onClick={() => handleSelect(t.fontFamily)}
            >
              <div>
                <div className={styles.typefaceHeader}>
                  <div className={styles.typefaceName}>{t.name}</div>
                  <span className={styles.typefaceBadge}>{t.badge}</span>
                </div>
                <div className={styles.typefaceSpecimen} style={{ fontFamily: t.fontFamily }}>
                  Aa Gg 1998
                </div>
                <p className={styles.typefaceDesc}>{t.description}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? "#e31e24" : "#888" }}>
                  {isSelected ? "TERPILIH" : "KLIK UNTUK MEMILIH"}
                </span>
                <input
                  type="radio"
                  name="typefaceSelection"
                  checked={isSelected}
                  onChange={() => handleSelect(t.fontFamily)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Font Input */}
      <div className={styles.section}>
        <h3>Atau Gunakan Custom Font Family</h3>
        <div style={{ display: "flex", gap: 12, maxWidth: 540 }}>
          <input
            placeholder="Contoh: 'Futura', sans-serif"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            style={{ flex: 1, padding: "10px 12px", border: "1px solid #d4d0c9" }}
          />
          <button
            className={styles.secondary}
            onClick={() => {
              if (customInput.trim()) {
                handleSelect(customInput.trim());
              }
            }}
          >
            Pilih Custom
          </button>
        </div>
      </div>

      <div className={styles.footerActions}>
        <div />
        <button
          className={styles.primary}
          disabled={busy}
          onClick={() => onSave(activeFont)}
        >
          {busy ? "Menerapkan…" : "Terapkan Font Ini ke Seluruh Website"}
        </button>
      </div>
    </div>
  );
}

function BannerManager({
  settings,
  busy,
  onSave,
}: {
  settings: SiteSettings;
  busy: boolean;
  onSave: (banners: SiteSettings["banners"]) => void;
}) {
  const [heroSlides, setHeroSlides] = useState<BannerSlide[]>(settings.banners.heroSlides || []);
  const [statementBanner, setStatementBanner] = useState(settings.banners.statementBanner);
  const [pageBanners, setPageBanners] = useState(settings.banners.pageBanners);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  const handleSlideChange = (idx: number, field: keyof BannerSlide, val: string) => {
    setHeroSlides((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleAddSlide = () => {
    const nextId = heroSlides.length ? Math.max(...heroSlides.map((s) => s.id)) + 1 : 1;
    setHeroSlides((prev) => [
      ...prev,
      {
        id: nextId,
        image: "/img/background1.png",
        alt: `Utero Design Studio Visual ${nextId}`,
        title: "NEW HERO SLIDE",
        subtitle: "EST. 1998 — MALANG, INDONESIA",
      },
    ]);
  };

  const handleDeleteSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      alert("Harus ada minimal 1 banner slide.");
      return;
    }
    if (confirm("Hapus slide ini?")) {
      setHeroSlides((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleMoveSlide = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= heroSlides.length) return;
    setHeroSlides((prev) => {
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  };

  const handleUploadSlide = async (idx: number, file: File) => {
    try {
      setUploadingIdx(idx);
      const url = await uploadMediaFile(file);
      handleSlideChange(idx, "image", url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleUploadBannerTarget = async (target: "statement" | "services" | "insights" | "studio" | "contact", file: File) => {
    try {
      setUploadingTarget(target);
      const url = await uploadMediaFile(file);
      if (target === "statement") {
        setStatementBanner((prev) => ({ ...prev, image: url }));
      } else {
        const key = `${target}HeroImage` as keyof typeof pageBanners;
        setPageBanners((prev) => ({ ...prev, [key]: url }));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploadingTarget(null);
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>Visual Assets Management</div>
          <h2>Kelola Banner Website</h2>
          <p className={styles.muted}>
            Kelola slider latar belakang Hero halaman utama, Statement Banner toko/studio, dan backdrop halaman lain.
          </p>
        </div>
        <button
          className={styles.primary}
          disabled={busy}
          onClick={() =>
            onSave({
              heroSlides,
              statementBanner,
              pageBanners,
            })
          }
        >
          {busy ? "Menyimpan…" : "Simpan Semua Banner"}
        </button>
      </div>

      {/* SECTION 1: HERO SLIDER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>
          01 &mdash; Hero Section Sliders ({heroSlides.length} Slide)
        </h3>
        <button className={styles.secondary} onClick={handleAddSlide} type="button">
          + Tambah Slide
        </button>
      </div>

      {heroSlides.map((slide, idx) => (
        <div key={slide.id || idx} className={styles.bannerCard}>
          <div className={styles.bannerCardHeader}>
            <h3>Slide #{idx + 1}</h3>
            <div className={styles.rowActions}>
              <button disabled={idx === 0} onClick={() => handleMoveSlide(idx, -1)} type="button">
                ↑ Naik
              </button>
              <button disabled={idx === heroSlides.length - 1} onClick={() => handleMoveSlide(idx, 1)} type="button">
                ↓ Turun
              </button>
              <button onClick={() => handleDeleteSlide(idx)} type="button" style={{ color: "#80161a" }}>
                Hapus
              </button>
            </div>
          </div>

          <div className={styles.bannerGrid}>
            <div>
              <div className={styles.bannerPreviewWrap}>
                {slide.image ? (
                  <img src={slide.image} alt={slide.alt || ""} className={styles.bannerPreviewImg} />
                ) : (
                  <div className={styles.bannerNoImg}>Belum Ada Gambar</div>
                )}
              </div>
              <label className={styles.secondary} style={{ display: "block", textAlign: "center", marginTop: 8, cursor: "pointer" }}>
                {uploadingIdx === idx ? "Mengunggah…" : "Ganti Gambar File"}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadSlide(idx, e.target.files[0]);
                  }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <Field label="URL Gambar">
                <input
                  value={slide.image}
                  onChange={(e) => handleSlideChange(idx, "image", e.target.value)}
                  placeholder="/img/background1.png atau https://..."
                />
              </Field>
              <Field label="Alt Text Gambar">
                <input
                  value={slide.alt}
                  onChange={(e) => handleSlideChange(idx, "alt", e.target.value)}
                  placeholder="Deskripsi gambar untuk aksesibilitas dan SEO"
                />
              </Field>
              <div className={styles.grid2}>
                <Field label="Judul Slide (Headline)">
                  <input
                    value={slide.title || ""}
                    onChange={(e) => handleSlideChange(idx, "title", e.target.value)}
                    placeholder="DESIGN AS A SOLUTION"
                  />
                </Field>
                <Field label="Subjudul / Tagline">
                  <input
                    value={slide.subtitle || ""}
                    onChange={(e) => handleSlideChange(idx, "subtitle", e.target.value)}
                    placeholder="EST. 1998 — MALANG, INDONESIA"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* SECTION 2: STATEMENT BANNER */}
      <section className={styles.section}>
        <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          02 &mdash; Statement Banner (Storefront / Studio Quote)
        </h3>
        <div className={styles.bannerCard}>
          <div className={styles.bannerGrid}>
            <div>
              <div className={styles.bannerPreviewWrap}>
                {statementBanner.image ? (
                  <img src={statementBanner.image} alt="Statement Banner" className={styles.bannerPreviewImg} />
                ) : (
                  <div className={styles.bannerNoImg}>Belum Ada Gambar</div>
                )}
              </div>
              <label className={styles.secondary} style={{ display: "block", textAlign: "center", marginTop: 8, cursor: "pointer" }}>
                {uploadingTarget === "statement" ? "Mengunggah…" : "Ganti Gambar Storefront"}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUploadBannerTarget("statement", e.target.files[0]);
                  }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <Field label="URL Gambar Background">
                <input
                  value={statementBanner.image}
                  onChange={(e) => setStatementBanner({ ...statementBanner, image: e.target.value })}
                />
              </Field>
              <Field label="Tag Header">
                <input
                  value={statementBanner.tag}
                  onChange={(e) => setStatementBanner({ ...statementBanner, tag: e.target.value })}
                  placeholder="UTERO CREATIVE STANDARD — EST. 1998"
                />
              </Field>
              <Field label="Pernyataan / Filosofi Studio">
                <textarea
                  value={statementBanner.quote}
                  onChange={(e) => setStatementBanner({ ...statementBanner, quote: e.target.value })}
                  style={{ minHeight: 80 }}
                />
              </Field>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OTHER PAGE BANNERS */}
      <section className={styles.section}>
        <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          03 &mdash; Banner Header Halaman Lain
        </h3>
        <div className={styles.grid2}>
          <div className={styles.bannerCard}>
            <div className={styles.bannerCardHeader}>
              <h3>Services Page Backdrop</h3>
            </div>
            <div className={styles.bannerPreviewWrap}>
              <img src={pageBanners.servicesHeroImage} alt="Services Banner" className={styles.bannerPreviewImg} />
            </div>
            <Field label="URL Banner Services">
              <input
                value={pageBanners.servicesHeroImage}
                onChange={(e) => setPageBanners({ ...pageBanners, servicesHeroImage: e.target.value })}
              />
            </Field>
            <label className={styles.secondary} style={{ textAlign: "center", cursor: "pointer" }}>
              Upload Gambar
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUploadBannerTarget("services", e.target.files[0]);
                }}
              />
            </label>
          </div>

          <div className={styles.bannerCard}>
            <div className={styles.bannerCardHeader}>
              <h3>Insights & Publications Backdrop</h3>
            </div>
            <div className={styles.bannerPreviewWrap}>
              <img src={pageBanners.insightsHeroImage} alt="Insights Banner" className={styles.bannerPreviewImg} />
            </div>
            <Field label="URL Banner Insights">
              <input
                value={pageBanners.insightsHeroImage}
                onChange={(e) => setPageBanners({ ...pageBanners, insightsHeroImage: e.target.value })}
              />
            </Field>
            <label className={styles.secondary} style={{ textAlign: "center", cursor: "pointer" }}>
              Upload Gambar
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUploadBannerTarget("insights", e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div />
        <button
          className={styles.primary}
          disabled={busy}
          onClick={() =>
            onSave({
              heroSlides,
              statementBanner,
              pageBanners,
            })
          }
        >
          {busy ? "Menyimpan…" : "Simpan Semua Banner"}
        </button>
      </div>
    </div>
  );
}

function ServiceMediaManager({
  settings,
  busy,
  onSave,
}: {
  settings: SiteSettings;
  busy: boolean;
  onSave: (images: Record<string, string>) => void;
}) {
  const [images, setImages] = useState<Record<string, string>>(settings.serviceImages || {});
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);

  const coreDisciplines = [
    { slug: "brand", number: "01", name: "Brand Identity & Visual Systems" },
    { slug: "product", number: "02", name: "Product Packaging Design" },
    { slug: "promotion", number: "03", name: "Promotion Campaign & Print Collateral" },
    { slug: "digital", number: "04", name: "Digital Systems & UI/UX Design" },
    { slug: "environmental", number: "05", name: "Environmental Spatial & Wayfinding" },
    { slug: "outdoor", number: "06", name: "Large-Scale Outdoor Advertising" },
  ];

  const handleUpload = async (slug: string, file: File) => {
    try {
      setUploadingSlug(slug);
      const url = await uploadMediaFile(file);
      setImages((prev) => ({ ...prev, [slug]: url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploadingSlug(null);
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>Capabilities Media</div>
          <h2>Gambar Menu & Disiplin Services</h2>
          <p className={styles.muted}>
            Kelola gambar visual utama untuk 6 disiplin desain Utero yang tampil di halaman Services dan beranda.
          </p>
        </div>
        <button className={styles.primary} disabled={busy} onClick={() => onSave(images)}>
          {busy ? "Menyimpan…" : "Simpan Gambar Menu"}
        </button>
      </div>

      <div className={styles.serviceGrid}>
        {coreDisciplines.map((d) => {
          const currentImg = images[d.slug] || (d.slug === "environmental" ? "/img/Services/environment.png" : `/img/Services/${d.slug}.png`);
          return (
            <div key={d.slug} className={styles.serviceCard}>
              <div className={styles.serviceCardHeader}>
                <strong>
                  {d.number} {d.slug.toUpperCase()}
                </strong>
                <span className={styles.muted} style={{ fontSize: 11 }}>
                  DISIPLIN
                </span>
              </div>
              <div className={styles.serviceCardThumb}>
                <img src={currentImg} alt={d.name} />
              </div>
              <div>
                <strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>{d.name}</strong>
                <Field label="URL Gambar">
                  <input
                    value={images[d.slug] || ""}
                    placeholder={currentImg}
                    onChange={(e) => setImages({ ...images, [d.slug]: e.target.value })}
                  />
                </Field>
                <label className={styles.secondary} style={{ display: "block", textAlign: "center", marginTop: 8, cursor: "pointer" }}>
                  {uploadingSlug === d.slug ? "Mengunggah…" : "Upload Gambar Baru"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUpload(d.slug, e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footerActions}>
        <div />
        <button className={styles.primary} disabled={busy} onClick={() => onSave(images)}>
          {busy ? "Menyimpan…" : "Simpan Gambar Menu"}
        </button>
      </div>
    </div>
  );
}

function StudioManager({
  studio,
  busy,
  onSave,
}: {
  studio: StudioConfig;
  busy: boolean;
  onSave: (studio: StudioConfig) => void;
}) {
  const [data, setData] = useState<StudioConfig>(studio || defaultSiteSettings.studio);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  const handleUploadImage = async (field: "workspaceImage1" | "workspaceImage2", file: File) => {
    try {
      setUploadingTarget(field);
      const url = await uploadMediaFile(file);
      setData((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleMetricChange = (idx: number, key: "num" | "label" | "sub", value: string) => {
    setData((prev) => {
      const copy = [...prev.metrics];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, metrics: copy };
    });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>About & Studio Identity</div>
          <h2>Kelola Menu Studio & Filosofi</h2>
          <p className={styles.muted}>
            Ubah narasi profil studio, filosofi kerja, foto ruang workshop di Malang, dan 4 metrik pencapaian studio.
          </p>
        </div>
        <button className={styles.primary} disabled={busy} onClick={() => onSave(data)}>
          {busy ? "Menyimpan…" : "Simpan Studio"}
        </button>
      </div>

      {/* SECTION 1: HEADER & DESKRIPSI */}
      <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", margin: "24px 0 16px" }}>
        01 &mdash; Header Halaman Studio
      </h3>
      <div className={styles.grid2}>
        <Field label="Judul Utama">
          <input value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} />
        </Field>
        <Field label="Tahun Berdiri">
          <input value={data.established} onChange={(e) => setData({ ...data, established: e.target.value })} />
        </Field>
        <Field label="Deskripsi Pengantar Studio" className={styles.wide}>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            style={{ minHeight: 70 }}
          />
        </Field>
      </div>

      {/* SECTION 2: WORKSPACE PHOTOS */}
      <section className={styles.section}>
        <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          02 &mdash; Foto Ruang Kerja & Workshop Studio
        </h3>
        <div className={styles.grid2}>
          <div className={styles.bannerCard}>
            <div className={styles.bannerCardHeader}>
              <h3>Foto Studio 1</h3>
            </div>
            <div className={styles.bannerPreviewWrap}>
              <img src={data.workspaceImage1} alt="Foto Studio 1" className={styles.bannerPreviewImg} />
            </div>
            <Field label="URL Foto 1">
              <input
                value={data.workspaceImage1}
                onChange={(e) => setData({ ...data, workspaceImage1: e.target.value })}
              />
            </Field>
            <label className={styles.secondary} style={{ textAlign: "center", cursor: "pointer" }}>
              {uploadingTarget === "workspaceImage1" ? "Mengunggah…" : "Upload Foto Baru"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUploadImage("workspaceImage1", e.target.files[0]);
                }}
              />
            </label>
          </div>

          <div className={styles.bannerCard}>
            <div className={styles.bannerCardHeader}>
              <h3>Foto Studio 2</h3>
            </div>
            <div className={styles.bannerPreviewWrap}>
              <img src={data.workspaceImage2} alt="Foto Studio 2" className={styles.bannerPreviewImg} />
            </div>
            <Field label="URL Foto 2">
              <input
                value={data.workspaceImage2}
                onChange={(e) => setData({ ...data, workspaceImage2: e.target.value })}
              />
            </Field>
            <label className={styles.secondary} style={{ textAlign: "center", cursor: "pointer" }}>
              {uploadingTarget === "workspaceImage2" ? "Mengunggah…" : "Upload Foto Baru"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUploadImage("workspaceImage2", e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>
      </section>

      {/* SECTION 3: PHILOSOPHY */}
      <section className={styles.section}>
        <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          03 &mdash; Narasi Filosofi & Eksekusi
        </h3>
        <div className={styles.grid2}>
          <Field label="Kutipan Filosofi (Quote)" className={styles.wide}>
            <input
              value={data.philosophyQuote}
              onChange={(e) => setData({ ...data, philosophyQuote: e.target.value })}
            />
          </Field>
          <Field label="Teks Penjelasan Filosofi" className={styles.wide}>
            <textarea
              value={data.philosophyText}
              onChange={(e) => setData({ ...data, philosophyText: e.target.value })}
              style={{ minHeight: 80 }}
            />
          </Field>
          <Field label="Paragraf Disiplin Terintegrasi 1">
            <textarea
              value={data.disciplinesText1}
              onChange={(e) => setData({ ...data, disciplinesText1: e.target.value })}
              style={{ minHeight: 80 }}
            />
          </Field>
          <Field label="Paragraf Disiplin Terintegrasi 2">
            <textarea
              value={data.disciplinesText2}
              onChange={(e) => setData({ ...data, disciplinesText2: e.target.value })}
              style={{ minHeight: 80 }}
            />
          </Field>
        </div>
      </section>

      {/* SECTION 4: METRICS */}
      <section className={styles.section}>
        <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          04 &mdash; Metrik & Pencapaian Studio
        </h3>
        <div className={styles.metricGrid}>
          {data.metrics.map((m, idx) => (
            <div key={idx} className={styles.bannerCard}>
              <Field label={`Metrik #${idx + 1} Angka`}>
                <input
                  value={m.num}
                  onChange={(e) => handleMetricChange(idx, "num", e.target.value)}
                />
              </Field>
              <Field label="Label">
                <input
                  value={m.label}
                  onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                />
              </Field>
              <Field label="Keterangan Singkat">
                <input
                  value={m.sub}
                  onChange={(e) => handleMetricChange(idx, "sub", e.target.value)}
                />
              </Field>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.footerActions}>
        <div />
        <button className={styles.primary} disabled={busy} onClick={() => onSave(data)}>
          {busy ? "Menyimpan…" : "Simpan Studio"}
        </button>
      </div>
    </div>
  );
}

function InsightsManager({
  insights,
  busy,
  onSave,
}: {
  insights: InsightsConfig;
  busy: boolean;
  onSave: (insights: InsightsConfig) => void;
}) {
  const [data, setData] = useState<InsightsConfig>(insights || defaultSiteSettings.insights);
  const [editingArticle, setEditingArticle] = useState<InsightArticleConfig | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleSaveArticle = (article: InsightArticleConfig) => {
    setData((prev) => {
      const existingIdx = prev.articles.findIndex((a) => a.slug === article.slug);
      let nextArticles = [...prev.articles];
      if (existingIdx >= 0) {
        nextArticles[existingIdx] = article;
      } else {
        nextArticles = [article, ...nextArticles];
      }
      return { ...prev, articles: nextArticles };
    });
    setEditingArticle(null);
  };

  const handleDeleteArticle = (slug: string) => {
    if (confirm("Hapus artikel ini?")) {
      setData((prev) => ({
        ...prev,
        articles: prev.articles.filter((a) => a.slug !== slug),
      }));
    }
  };

  const handleUploadCover = async (file: File) => {
    try {
      setUploadingCover(true);
      const url = await uploadMediaFile(file);
      if (editingArticle) {
        setEditingArticle({ ...editingArticle, coverImage: url });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>Publications & Perspectives</div>
          <h2>Kelola Menu Insights & Artikel</h2>
          <p className={styles.muted}>
            Kelola header halaman publikasi Utero, tulis artikel baru, atau ubah artikel dan foto sampul yang sudah ada.
          </p>
        </div>
        <button className={styles.primary} disabled={busy} onClick={() => onSave(data)}>
          {busy ? "Menyimpan…" : "Simpan Semua Artikel"}
        </button>
      </div>

      {editingArticle ? (
        /* ARTICLE EDITOR */
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3>{editingArticle.slug ? "Edit Artikel" : "Tambah Artikel Baru"}</h3>
            <button className={styles.ghost} onClick={() => setEditingArticle(null)} type="button">
              ← Kembali ke Daftar
            </button>
          </div>

          <div className={styles.grid2}>
            <Field label="Judul Artikel" className={styles.wide}>
              <input
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                required
              />
            </Field>
            <Field label="Slug URL (unik, huruf kecil)">
              <input
                value={editingArticle.slug}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
                  })
                }
                required
              />
            </Field>
            <Field label="Kategori">
              <input
                value={editingArticle.category}
                onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                placeholder="Design Strategy, Packaging, Spatial, dll."
              />
            </Field>
            <Field label="Tanggal Publikasi">
              <input
                value={editingArticle.date}
                onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                placeholder="March 2024"
              />
            </Field>
            <Field label="Estimasi Waktu Baca">
              <input
                value={editingArticle.readTime}
                onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                placeholder="4 min read"
              />
            </Field>
            <Field label="URL Foto Sampul" className={styles.wide}>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={editingArticle.coverImage}
                  onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                  style={{ flex: 1 }}
                />
                <label className={styles.secondary} style={{ cursor: "pointer", display: "inline-block", padding: "11px 16px" }}>
                  {uploadingCover ? "Mengunggah…" : "Upload File"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUploadCover(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </Field>
            {editingArticle.coverImage && (
              <div className={styles.wide} style={{ width: 160, aspectRatio: "16/10", overflow: "hidden", background: "#111" }}>
                <img src={editingArticle.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <Field label="Ringkasan (Excerpt)" className={styles.wide}>
              <textarea
                value={editingArticle.excerpt}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                style={{ minHeight: 70 }}
              />
            </Field>
            <Field label="Isi Lengkap Artikel" className={styles.wide}>
              <textarea
                value={editingArticle.content}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                style={{ minHeight: 180 }}
              />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              className={styles.primary}
              type="button"
              onClick={() => {
                if (!editingArticle.title || !editingArticle.slug) {
                  alert("Judul dan Slug wajib diisi.");
                  return;
                }
                handleSaveArticle(editingArticle);
              }}
            >
              Simpan Artikel Ini
            </button>
            <button className={styles.ghost} onClick={() => setEditingArticle(null)} type="button">
              Batal
            </button>
          </div>
        </div>
      ) : (
        /* ARTICLES LIST VIEW */
        <>
          {/* HEADER SETTINGS */}
          <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", margin: "24px 0 16px" }}>
            01 &mdash; Header Halaman Insights
          </h3>
          <div className={styles.grid2}>
            <Field label="Tag Header">
              <input
                value={data.headerTag}
                onChange={(e) => setData({ ...data, headerTag: e.target.value })}
              />
            </Field>
            <Field label="Judul Header">
              <input
                value={data.headerTitle}
                onChange={(e) => setData({ ...data, headerTitle: e.target.value })}
              />
            </Field>
            <Field label="Deskripsi Header" className={styles.wide}>
              <textarea
                value={data.headerDescription}
                onChange={(e) => setData({ ...data, headerDescription: e.target.value })}
                style={{ minHeight: 60 }}
              />
            </Field>
          </div>

          {/* ARTICLES LIST */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>
              02 &mdash; Daftar Artikel ({data.articles.length} Publikasi)
            </h3>
            <button
              className={styles.secondary}
              type="button"
              onClick={() =>
                setEditingArticle({
                  slug: `artikel-${Date.now()}`,
                  title: "",
                  category: "Design Strategy",
                  date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
                  readTime: "4 min read",
                  excerpt: "",
                  coverImage: "/img/remote/insight-identity.jpg",
                  content: "",
                })
              }
            >
              + Tambah Artikel Baru
            </button>
          </div>

          <div className={styles.articleList}>
            {data.articles.map((article) => (
              <div key={article.slug} className={styles.articleRow}>
                <div className={styles.articleLeft}>
                  <img src={article.coverImage} alt={article.title} className={styles.articleThumb} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#e31e24", letterSpacing: "0.1em" }}>
                      {article.category} &bull; {article.date} &bull; {article.readTime}
                    </span>
                    <h4 style={{ margin: "4px 0 6px", fontSize: 16, fontWeight: 800 }}>{article.title}</h4>
                    <p style={{ margin: 0, fontSize: 12, color: "#666", maxWidth: 600 }}>{article.excerpt}</p>
                  </div>
                </div>
                <div className={styles.rowActions}>
                  <button onClick={() => setEditingArticle(article)} type="button">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteArticle(article.slug)} type="button" style={{ color: "#80161a" }}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footerActions}>
            <div />
            <button className={styles.primary} disabled={busy} onClick={() => onSave(data)}>
              {busy ? "Menyimpan…" : "Simpan Semua Artikel"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ContactManager({
  contacts,
  busy,
  onSave,
}: {
  contacts: SiteSettings["contacts"];
  busy: boolean;
  onSave: (contacts: SiteSettings["contacts"]) => void;
}) {
  const [data, setData] = useState(contacts);

  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>Studio Information</div>
          <h2>Kontak & Media Sosial</h2>
          <p className={styles.muted}>
            Kelola nomor WhatsApp, email permohonan proyek, alamat studio di Malang, dan tautan sosial media resmi Utero.id.
          </p>
        </div>
        <button className={styles.primary} disabled={busy} onClick={() => onSave(data)}>
          {busy ? "Menyimpan…" : "Simpan Kontak"}
        </button>
      </div>

      <div className={styles.grid2} style={{ marginTop: 24 }}>
        <Field label="Nomor Telepon Studio">
          <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
        </Field>
        <Field label="WhatsApp Inquiries (format internasional tanpa +)">
          <input value={data.whatsapp} onChange={(e) => setData({ ...data, whatsapp: e.target.value })} placeholder="6281999900900" />
        </Field>
        <Field label="Email Utama (Inquiry Proyek)">
          <input value={data.email} type="email" onChange={(e) => setData({ ...data, email: e.target.value })} />
        </Field>
        <Field label="Email Sekunder / Alternatif">
          <input value={data.secondaryEmail || ""} type="email" onChange={(e) => setData({ ...data, secondaryEmail: e.target.value })} />
        </Field>
        <Field label="Alamat Studio Lengkap" className={styles.wide}>
          <textarea value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} style={{ minHeight: 70 }} />
        </Field>
        <Field label="Link Google Maps" className={styles.wide}>
          <input value={data.googleMapsUrl || ""} onChange={(e) => setData({ ...data, googleMapsUrl: e.target.value })} />
        </Field>
      </div>

      <section className={styles.section}>
        <h3 style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          Akun Media Sosial
        </h3>
        <div className={styles.grid2}>
          <Field label="Instagram URL">
            <input value={data.instagram} onChange={(e) => setData({ ...data, instagram: e.target.value })} />
          </Field>
          <Field label="Facebook URL">
            <input value={data.facebook} onChange={(e) => setData({ ...data, facebook: e.target.value })} />
          </Field>
          <Field label="YouTube URL">
            <input value={data.youtube} onChange={(e) => setData({ ...data, youtube: e.target.value })} />
          </Field>
          <Field label="LinkedIn URL">
            <input value={data.linkedin || ""} onChange={(e) => setData({ ...data, linkedin: e.target.value })} />
          </Field>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div />
        <button className={styles.primary} disabled={busy} onClick={() => onSave(data)}>
          {busy ? "Menyimpan…" : "Simpan Kontak"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROJECT EDITOR (ORIGINAL CRUD)
// ─────────────────────────────────────────────

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.stat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function split(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function MediaUpload({ type, busy, onUpload }: { type: string; busy: boolean; onUpload: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const multiple = type === "gallery" || type === "deck";
  const send = (files: FileList | null) => {
    if (!files?.length) return;
    onUpload(Array.from(files).slice(0, multiple ? undefined : 1));
  };
  return (
    <label
      className={`${styles.upload} ${dragging ? styles.uploadDragging : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        send(event.dataTransfer.files);
      }}
    >
      <strong>{type.toUpperCase()}</strong>
      <p className={styles.muted}>
        {type === "deck"
          ? "Tarik beberapa halaman JPG, PNG, atau WebP. Otomatis menjadi WebP resolusi tinggi dengan watermark UTERO ID di tengah. Urutan file menjadi urutan slide. Maksimal 20 MB per file."
          : `Tarik ${multiple ? "satu atau beberapa" : "satu"} gambar ke sini, atau klik untuk memilih. Maksimal 20 MB per file.`}
      </p>
      <span className={styles.uploadAction}>{dragging ? "Lepaskan untuk upload" : "Pilih file"}</span>
      <input
        className={styles.uploadInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        disabled={busy}
        onChange={(event) => {
          send(event.target.files);
          event.target.value = "";
        }}
      />
    </label>
  );
}

function ProjectEditor({
  project,
  media,
  busy,
  onChange,
  onSave,
  onDelete,
  onDeleteMedia,
  onMoveMedia,
  onUpload,
  onMigrate,
  onBack,
}: {
  project: AdminProject;
  media: MediaItem[];
  busy: boolean;
  onChange: (p: AdminProject) => void;
  onSave: (p: AdminProject) => void;
  onDelete: (p: AdminProject) => void;
  onDeleteMedia: (p: AdminProject, item: MediaItem) => void;
  onMoveMedia: (p: AdminProject, item: MediaItem, direction: -1 | 1) => void;
  onUpload: (p: AdminProject, type: string, files: File[]) => void;
  onMigrate: (p: AdminProject) => void;
  onBack: () => void;
}) {
  const safeDisciplines = Array.isArray(project.disciplines) ? project.disciplines : [];
  const set = <K extends keyof AdminProject>(key: K, value: AdminProject[K]) =>
    onChange({
      ...project,
      disciplines: Array.isArray(project.disciplines) ? project.disciplines : ["identity"],
      [key]: value,
    });

  const handleTitleChange = (newTitle: string) => {
    const prevAuto = slugify(project.title);
    const shouldSyncSlug = !project.slug || project.slug === prevAuto;
    const shouldSyncRoute = !project.routeSlug || project.routeSlug === prevAuto;
    const auto = slugify(newTitle);
    onChange({
      ...project,
      disciplines: Array.isArray(project.disciplines) ? project.disciplines : ["identity"],
      title: newTitle,
      slug: shouldSyncSlug ? auto : project.slug,
      routeSlug: shouldSyncRoute ? auto : project.routeSlug,
    });
  };

  const details = project.details || {};
  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <div>
          <div className={styles.eyebrow}>{project.id ? `Project #${project.id}` : "New Project"}</div>
          <h2>{project.title || "Proyek baru"}</h2>
        </div>
        <button className={styles.ghost} onClick={onBack}>
          ← Kembali
        </button>
      </div>
      <div className={styles.grid2}>
        <Field label="Judul *">
          <input
            placeholder="Contoh: GaragePlug Indonesia"
            value={project.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </Field>
        <Field label="Client *">
          <input
            placeholder="Contoh: PT. Era Automotive Revolution"
            value={project.client}
            onChange={(e) => set("client", e.target.value)}
            required
          />
        </Field>
        <Field label="Slug internal *">
          <input
            placeholder="otomatis dari judul"
            value={project.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            required
          />
        </Field>
        <Field label="Slug URL *">
          <input
            placeholder="otomatis dari judul (/work/slug-url)"
            value={project.routeSlug}
            onChange={(e) => set("routeSlug", slugify(e.target.value))}
            required
          />
        </Field>
        <Field label="Tahun">
          <input value={project.year} onChange={(e) => set("year", e.target.value)} />
        </Field>
        <Field label="Kategori">
          <input value={project.category} onChange={(e) => set("category", e.target.value)} />
        </Field>
        <Field label="Industri">
          <select value={project.industry} onChange={(e) => set("industry", e.target.value as AdminProject["industry"])}>
            {industries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={project.status} onChange={(e) => set("status", e.target.value as Status)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Ringkasan" className={styles.wide}>
          <textarea value={project.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
        </Field>
        <Field label="Deskripsi" className={styles.wide}>
          <textarea value={project.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </div>
      <section className={styles.section}>
        <h3>Disiplin & metadata</h3>
        <div className={styles.checkGrid}>
          {disciplines.map((item) => (
            <label className={styles.check} key={item}>
              <input
                type="checkbox"
                checked={safeDisciplines.includes(item)}
                onChange={(e) =>
                  set(
                    "disciplines",
                    e.target.checked ? [...safeDisciplines, item] : safeDisciplines.filter((value) => value !== item)
                  )
                }
              />
              {item}
            </label>
          ))}
          <label className={styles.check}>
            <input type="checkbox" checked={!!project.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured
          </label>
        </div>
        <div className={styles.grid2} style={{ marginTop: 18 }}>
          <Field label="Tags, satu per baris">
            <textarea value={(project.tags || []).join("\n")} onChange={(e) => set("tags", split(e.target.value))} />
          </Field>
          <Field label="Scope, satu per baris">
            <textarea
              value={(details.scope || []).join("\n")}
              onChange={(e) => set("details", { ...details, scope: split(e.target.value) })}
            />
          </Field>
        </div>
      </section>
      <section className={styles.section}>
        <h3>Studi kasus</h3>
        <div className={styles.grid2}>
          <Field label="Challenge">
            <textarea
              value={details.challenge || ""}
              onChange={(e) => set("details", { ...details, challenge: e.target.value })}
            />
          </Field>
          <Field label="Solution">
            <textarea
              value={details.solution || ""}
              onChange={(e) => set("details", { ...details, solution: e.target.value })}
            />
          </Field>
        </div>
      </section>
      <section className={styles.section}>
        <h3>Media S3</h3>
        {!project.id ? (
          <p className={styles.muted}>Simpan proyek dahulu sebelum mengunggah media.</p>
        ) : (
          <>
            <div className={styles.mediaGrid}>
              {["cover", "hover", "gallery", "deck"].map((type) => (
                <MediaUpload key={type} type={type} busy={busy} onUpload={(files) => onUpload(project, type, files)} />
              ))}
            </div>
            {project.coverImage && typeof project.coverImage === "string" && project.coverImage.startsWith("/projects/") && (
              <button className={styles.secondary} style={{ marginTop: 18 }} disabled={busy} onClick={() => onMigrate(project)}>
                Pindahkan media lama ke S3
              </button>
            )}
            {media.length > 0 && (
              <div className={styles.tableWrap} style={{ marginTop: 18 }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Media</th>
                      <th>Tipe</th>
                      <th>Urutan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {media.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className={styles.projectCell}>
                            <img className={styles.thumb} src={item.url} alt="" />
                            <span>{item.filename}</span>
                          </div>
                        </td>
                        <td>{item.mediaType}</td>
                        <td>{item.sortOrder + 1}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button onClick={() => onMoveMedia(project, item, -1)} type="button">
                              ↑
                            </button>
                            <button onClick={() => onMoveMedia(project, item, 1)} type="button">
                              ↓
                            </button>
                            <button onClick={() => onDeleteMedia(project, item)} type="button">
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
      <div className={styles.footerActions}>
        <div>{project.id && <button className={styles.danger} onClick={() => onDelete(project)}>Hapus proyek</button>}</div>
        <div className={styles.actions}>
          <button className={styles.ghost} onClick={onBack}>
            Batal
          </button>
          <button className={styles.primary} disabled={busy} onClick={() => onSave(project)}>
            {busy ? "Menyimpan…" : "Simpan proyek"}
          </button>
        </div>
      </div>
    </div>
  );
}
