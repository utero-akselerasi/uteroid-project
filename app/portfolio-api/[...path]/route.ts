import type { NextRequest } from "next/server";
import fs from "fs";
import pathModule from "path";
import crypto from "crypto";
import { DeckImageError, processDeckImage } from "@/lib/processDeckImage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LOCAL_PROJECTS_FILE = pathModule.join(process.cwd(), "data", "projects.json");
const LOCAL_MEDIA_FILE = pathModule.join(process.cwd(), "data", "media.json");
const UPLOADS_DIR = pathModule.join(process.cwd(), "public", "uploads");

/* ────────────────────── Helpers: Projects ────────────────────── */

function getStoredProjects(): any[] {
  try {
    if (fs.existsSync(LOCAL_PROJECTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_PROJECTS_FILE, "utf-8"));
      if (Array.isArray(data)) return data;
    }
  } catch {}
  return [];
}

function saveStoredProjects(list: any[]): void {
  try {
    const dir = pathModule.dirname(LOCAL_PROJECTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_PROJECTS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[portfolio-api] Failed to write data/projects.json:", err);
  }
}

/* ────────────────────── Helpers: Media ────────────────────── */

type LocalMediaItem = {
  id: number;
  projectId: number;
  mediaType: string;
  url: string;
  filename: string;
  altText: string;
  sortOrder: number;
};

function getStoredMedia(): LocalMediaItem[] {
  try {
    if (fs.existsSync(LOCAL_MEDIA_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_MEDIA_FILE, "utf-8"));
      if (Array.isArray(data)) return data;
    }
  } catch {}
  return [];
}

function saveStoredMedia(list: LocalMediaItem[]): void {
  try {
    const dir = pathModule.dirname(LOCAL_MEDIA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_MEDIA_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[portfolio-api] Failed to write data/media.json:", err);
  }
}

/** After media changes, update the project's coverImage & galleryImages fields */
function syncProjectMedia(projectId: number): void {
  const allMedia = getStoredMedia().filter((m) => m.projectId === projectId);
  const projects = getStoredProjects();
  const idx = projects.findIndex((p: any) => p.id === projectId);
  if (idx < 0) return;

  const covers = allMedia.filter((m) => m.mediaType === "cover").sort((a, b) => a.sortOrder - b.sortOrder);
  const gallery = allMedia.filter((m) => m.mediaType === "gallery").sort((a, b) => a.sortOrder - b.sortOrder);

  projects[idx].coverImage = covers.length > 0 ? covers[0].url : projects[idx].coverImage || "";
  projects[idx].heroImage = covers.length > 0 ? covers[0].url : projects[idx].heroImage || "";
  projects[idx].galleryImages = gallery.map((m) => m.url);

  saveStoredProjects(projects);
}

async function saveUploadedFile(file: File): Promise<{ url: string; filename: string }> {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = pathModule.extname(file.name) || (file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg");
  const sanitizedBase = pathModule.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const uniqueHash = crypto.randomBytes(6).toString("hex");
  const filename = `${sanitizedBase}_${uniqueHash}${ext}`;
  const destination = pathModule.join(UPLOADS_DIR, filename);
  fs.writeFileSync(destination, buffer);

  return { url: `/uploads/${filename}`, filename };
}

/* ────────────────────── Proxy ────────────────────── */

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

function getBaseUrl(): string {
  let url = (process.env.PORTFOLIO_API_URL || "http://127.0.0.1:8080/api/v1").replace(/\/$/, "");
  if (url.includes("portfolio-api") && !fs.existsSync("/.dockerenv")) {
    url = url.replace("portfolio-api", "127.0.0.1");
  }
  return url;
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const baseUrl = getBaseUrl();
  const target = `${baseUrl}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const isMediaUpload = request.method === "POST" && path.length === 4 && path[0] === "admin" && path[1] === "projects" && path[3] === "media";
  const headers = new Headers();

  if (isMediaUpload && Number(request.headers.get("content-length")) > 21 * 1024 * 1024) {
    return Response.json({ error: "File melebihi batas 20 MB." }, { status: 413 });
  }

  let body: BodyInit | undefined;
  let rawBody: ArrayBuffer | undefined;
  let parsedFormData: FormData | null = null;
  let rebuildsMultipartBody = false;

  const contentType = request.headers.get("content-type") || "";

  if (contentType.startsWith("multipart/form-data")) {
    try {
      parsedFormData = await request.formData();
      if (isMediaUpload && parsedFormData.get("mediaType") === "deck") {
        const file = parsedFormData.get("file");
        if (file instanceof File) {
          const processed = await processDeckImage(Buffer.from(await file.arrayBuffer()));
          const filename = `${file.name.replace(/\.[^.]+$/, "") || "deck-slide"}.webp`;
          if (processed.buffer.length > 20 * 1024 * 1024) {
            throw new DeckImageError("Hasil WebP melebihi batas 20 MB.");
          }
          parsedFormData.set("file", new File([new Uint8Array(processed.buffer)], filename, { type: "image/webp" }));
        }
      }
      body = parsedFormData;
      rebuildsMultipartBody = true;
    } catch (error) {
      if (error instanceof DeckImageError) {
        return Response.json({ error: error.message }, { status: 400 });
      }
    }
  } else if (request.method !== "GET" && request.method !== "HEAD") {
    rawBody = await request.arrayBuffer();
    if (path[0] === "admin" && path[1] === "projects" && (request.method === "POST" || request.method === "PUT")) {
      try {
        const text = new TextDecoder().decode(rawBody);
        const json = JSON.parse(text);
        if (json && typeof json === "object" && !Array.isArray(json)) {
          const autoSlug = (json.title || "proyek").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `proyek-${Date.now()}`;
          let modified = false;
          if (!json.slug) {
            json.slug = autoSlug;
            modified = true;
          }
          if (!json.routeSlug) {
            json.routeSlug = json.slug || autoSlug;
            modified = true;
          }
          if (modified) {
            const encoded = new TextEncoder().encode(JSON.stringify(json));
            rawBody = encoded.buffer as ArrayBuffer;
          }
        }
      } catch {}
    }
    body = rawBody;
  }

  for (const name of ["accept", "content-type", "cookie", "user-agent", "x-csrf-token"]) {
    if (name === "content-type" && rebuildsMultipartBody) continue;
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  // The Go backend validates Origin against FRONTEND_ORIGIN (e.g. http://localhost:3020)
  // Ensure the forwarded origin matches so cross-port local dev (e.g. :3000 -> :8080) is accepted
  const configuredOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3020";
  headers.set("origin", configuredOrigin);
  headers.set("x-forwarded-for", request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1");

  function getBodyJson(): any {
    if (!rawBody || rawBody.byteLength === 0) return {};
    try {
      return JSON.parse(new TextDecoder().decode(rawBody));
    } catch {
      return {};
    }
  }

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-length", "cache-control", "content-disposition", "etag", "last-modified"]) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    const setCookies = typeof (response.headers as any).getSetCookie === "function" ? (response.headers as any).getSetCookie() : [];
    if (setCookies.length > 0) {
      for (const cookie of setCookies) {
        const devCookie = cookie.replace(/SameSite=Strict/gi, "SameSite=Lax");
        responseHeaders.append("set-cookie", devCookie);
      }
    } else {
      const single = response.headers.get("set-cookie");
      if (single) {
        responseHeaders.set("set-cookie", single.replace(/SameSite=Strict/gi, "SameSite=Lax"));
      }
    }
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    // ─── OFFLINE FALLBACK ───────────────────────────────────────────
    // Go backend unreachable → full local development mode
    const subpath = path.join("/");

    /* ── Auth ── */
    if (subpath === "admin/auth/session") {
      const hasCookie = request.headers.get("cookie")?.includes("utero_admin_session");
      if (hasCookie || process.env.NODE_ENV !== "production") {
        return Response.json({ authenticated: true, csrfToken: "dev-csrf-token" });
      }
      return Response.json({ authenticated: false, csrfToken: "" }, { status: 401 });
    }

    if (subpath === "admin/auth/login") {
      const res = Response.json({ authenticated: true, csrfToken: "dev-csrf-token", username: "admin" });
      res.headers.set("Set-Cookie", "utero_admin_session=dev-token; Path=/; HttpOnly; SameSite=Lax");
      return res;
    }

    if (subpath === "admin/auth/logout") {
      const res = Response.json({ ok: true });
      res.headers.set("Set-Cookie", "utero_admin_session=; Path=/; Max-Age=0");
      return res;
    }

    /* ── Media endpoints (per-project) ── */
    const mediaMatch = subpath.match(/^admin\/projects\/(\d+)\/media(?:\/(.*))?$/);
    if (mediaMatch) {
      const projectId = Number(mediaMatch[1]);
      const mediaSuffix = mediaMatch[2] || "";

      // GET media list for project
      if (request.method === "GET" && !mediaSuffix) {
        const items = getStoredMedia().filter((m) => m.projectId === projectId).sort((a, b) => a.sortOrder - b.sortOrder);
        return Response.json(items);
      }

      // POST upload new media
      if (request.method === "POST" && !mediaSuffix) {
        try {
          const formData = parsedFormData;
          if (!formData) {
            return Response.json({ error: "Content-Type harus multipart/form-data" }, { status: 400 });
          }

          const file = formData.get("file");
          if (!(file instanceof File)) {
            return Response.json({ error: "File wajib dipilih." }, { status: 400 });
          }

          const mediaType = String(formData.get("mediaType") || "gallery");
          const altText = String(formData.get("altText") || "");

          // Save file to public/uploads/
          const saved = await saveUploadedFile(file);

          // Add to media.json
          const allMedia = getStoredMedia();
          const nextId = allMedia.length > 0 ? Math.max(...allMedia.map((m) => m.id)) + 1 : 1;
          const projectMedia = allMedia.filter((m) => m.projectId === projectId && m.mediaType === mediaType);
          const newItem: LocalMediaItem = {
            id: nextId,
            projectId,
            mediaType,
            url: saved.url,
            filename: saved.filename,
            altText,
            sortOrder: projectMedia.length,
          };
          allMedia.push(newItem);
          saveStoredMedia(allMedia);

          // Sync project coverImage/galleryImages
          syncProjectMedia(projectId);

          return Response.json(newItem);
        } catch (err) {
          console.error("[portfolio-api] Local media upload failed:", err);
          return Response.json({ error: "Gagal mengunggah file." }, { status: 500 });
        }
      }

      // PUT reorder: admin/projects/{id}/media/order
      if (request.method === "PUT" && mediaSuffix === "order") {
        try {
          const { ids } = getBodyJson();
          if (!Array.isArray(ids)) return Response.json({ ok: true });

          const allMedia = getStoredMedia();
          ids.forEach((id, index) => {
            const item = allMedia.find((m) => m.id === id);
            if (item) item.sortOrder = index;
          });
          saveStoredMedia(allMedia);
          syncProjectMedia(projectId);
          return Response.json({ ok: true });
        } catch {
          return Response.json({ error: "Gagal menyusun ulang media." }, { status: 400 });
        }
      }

      // DELETE media item: admin/projects/{id}/media/{mediaId}
      if (request.method === "DELETE" && mediaSuffix) {
        const mediaId = Number(mediaSuffix);
        if (!isNaN(mediaId)) {
          let allMedia = getStoredMedia();
          const toDelete = allMedia.find((m) => m.id === mediaId);
          if (toDelete) {
            try {
              const filePath = pathModule.join(process.cwd(), "public", toDelete.url);
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch {}
          }
          allMedia = allMedia.filter((m) => m.id !== mediaId);
          saveStoredMedia(allMedia);
          syncProjectMedia(projectId);
        }
        return Response.json({ ok: true });
      }

      return Response.json([]);
    }

    // Migrate media (no-op in local mode)
    if (subpath.match(/^admin\/projects\/\d+\/migrate-media$/)) {
      return Response.json({ migrated: 0, message: "Mode lokal — tidak perlu migrasi S3." });
    }

    /* ── Projects import ── */
    if (subpath === "admin/projects/import") {
      const body = getBodyJson();
      let importedList = Array.isArray(body) && body.length > 0 ? body : [];
      if (importedList.length === 0) {
        const { projects } = await import("@/lib/projects");
        importedList = projects.map((p, idx) => ({ ...p, id: idx + 1, status: "published" }));
      }
      saveStoredProjects(importedList);
      return Response.json({ imported: importedList.length });
    }

    /* ── Projects CRUD ── */
    if (subpath === "admin/projects" || subpath === "projects" || subpath.startsWith("admin/projects/")) {
      let stored = getStoredProjects();
      if (stored.length === 0) {
        const { projects } = await import("@/lib/projects");
        stored = projects.map((p, idx) => ({ ...p, id: idx + 1, status: "published" }));
        saveStoredProjects(stored);
      }

      const idParam = path[2] ? Number(path[2]) : NaN;

      if (request.method === "GET") {
        if (!isNaN(idParam)) {
          const found = stored.find((p: any) => Number(p.id) === idParam);
          if (found) return Response.json(found);
          return Response.json({ error: "Project not found" }, { status: 404 });
        }
        return Response.json(stored);
      }

      if (request.method === "POST") {
        try {
          const body = getBodyJson();
          const nextId = stored.length > 0 ? Math.max(...stored.map((p: any) => Number(p.id) || 0)) + 1 : 1;
          const newProject = {
            slug: "",
            routeSlug: "",
            title: "",
            client: "",
            year: new Date().getFullYear().toString(),
            category: "",
            industry: "services",
            shortDescription: "",
            description: "",
            coverImage: "",
            featured: false,
            priority: 0,
            tags: [],
            galleryImages: [],
            details: { scope: [], challenge: "", solution: "" },
            status: body.status || "draft",
            ...body,
            id: nextId,
            disciplines: Array.isArray(body.disciplines) && body.disciplines.length > 0 ? body.disciplines : ["identity"],
          };
          stored = [newProject, ...stored];
          saveStoredProjects(stored);
          return Response.json(newProject);
        } catch {
          return Response.json({ error: "Gagal menyimpan proyek." }, { status: 400 });
        }
      }

      if (request.method === "PUT") {
        try {
          const body = getBodyJson();
          const targetId = !isNaN(idParam) ? idParam : Number(body.id);
          const idx = stored.findIndex((p: any) => Number(p.id) === targetId);
          const updated = {
            ...(idx >= 0 ? stored[idx] : {}),
            ...body,
            id: targetId,
            disciplines: Array.isArray(body.disciplines) && body.disciplines.length > 0 ? body.disciplines : (idx >= 0 ? stored[idx].disciplines : ["identity"]),
          };
          if (idx >= 0) {
            stored[idx] = updated;
          } else {
            stored.push(updated);
          }
          saveStoredProjects(stored);
          return Response.json(updated);
        } catch {
          return Response.json({ error: "Gagal memperbarui proyek." }, { status: 400 });
        }
      }

      if (request.method === "DELETE") {
        if (!isNaN(idParam)) {
          stored = stored.filter((p: any) => Number(p.id) !== idParam);
          saveStoredProjects(stored);
        }
        return Response.json({ ok: true });
      }

      return Response.json(stored);
    }

    return Response.json(
      { error: "Backend Go belum berjalan di http://127.0.0.1:8080." },
      { status: 503 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: methods.join(", ") } });
}

