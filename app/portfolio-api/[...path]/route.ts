import type { NextRequest } from "next/server";
import fs from "fs";
import pathModule from "path";
import { DeckImageError, processDeckImage } from "@/lib/processDeckImage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LOCAL_PROJECTS_FILE = pathModule.join(process.cwd(), "data", "projects.json");

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

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const baseUrl = (process.env.PORTFOLIO_API_URL || "http://127.0.0.1:8080/api/v1").replace(/\/$/, "");
  const target = `${baseUrl}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const isMediaUpload = request.method === "POST" && path.length === 4 && path[0] === "admin" && path[1] === "projects" && path[3] === "media";
  const headers = new Headers();
  let body: BodyInit | undefined;
  let rebuildsMultipartBody = false;

  if (isMediaUpload && Number(request.headers.get("content-length")) > 21 * 1024 * 1024) {
    return Response.json({ error: "File melebihi batas 20 MB." }, { status: 413 });
  }

  if (isMediaUpload) {
    const session = await fetch(`${baseUrl}/admin/auth/session`, {
      headers: { cookie: request.headers.get("cookie") || "" },
      cache: "no-store",
    });
    if (!session.ok) {
      return new Response(session.body, { status: session.status, headers: { "content-type": "application/json" } });
    }
    const credentials = await session.json();
    if (!request.headers.get("x-csrf-token") || request.headers.get("x-csrf-token") !== credentials.csrfToken) {
      return Response.json({ error: "csrf validation failed" }, { status: 403 });
    }
  }

  if (isMediaUpload && request.headers.get("content-type")?.startsWith("multipart/form-data")) {
    const rawBody = await request.arrayBuffer();
    if (rawBody.byteLength > 21 * 1024 * 1024) {
      return Response.json({ error: "File melebihi batas 20 MB." }, { status: 413 });
    }
    const formData = await new Request(request.url, {
      method: "POST",
      headers: { "content-type": request.headers.get("content-type")! },
      body: rawBody,
    }).formData();
    if (formData.get("mediaType") === "deck") {
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return Response.json({ error: "File DECK wajib dipilih." }, { status: 400 });
      }

      try {
        const processed = await processDeckImage(Buffer.from(await file.arrayBuffer()));
        const filename = `${file.name.replace(/\.[^.]+$/, "") || "deck-slide"}.webp`;
        if (processed.buffer.length > 20 * 1024 * 1024) {
          throw new DeckImageError("Hasil WebP melebihi batas 20 MB.");
        }
        formData.set("file", new File([new Uint8Array(processed.buffer)], filename, { type: "image/webp" }));
      } catch (error) {
        const message = error instanceof DeckImageError ? error.message : "Gambar DECK gagal diproses.";
        const status = error instanceof DeckImageError ? 400 : 500;
        return Response.json({ error: message }, { status });
      }
    }
    body = formData;
    rebuildsMultipartBody = true;
  } else if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }
  for (const name of ["accept", "content-type", "cookie", "origin", "user-agent", "x-csrf-token"]) {
    if (name === "content-type" && rebuildsMultipartBody) continue;
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-forwarded-for", request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1");

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-length", "cache-control", "content-disposition", "etag", "last-modified", "set-cookie"]) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    // When Go backend is unreachable (e.g. running locally via npm run dev),
    // provide development fallback so the admin dashboard is fully testable!
    const subpath = path.join("/");

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

    if (subpath.includes("/media")) {
      return Response.json([]);
    }

    if (subpath === "admin/projects/import") {
      const { projects } = await import("@/lib/projects");
      const imported = projects.map((p, idx) => ({ ...p, id: idx + 1, status: "published" }));
      saveStoredProjects(imported);
      return Response.json({ imported: imported.length });
    }

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
          const found = stored.find((p: any) => p.id === idParam);
          if (found) return Response.json(found);
          return Response.json({ error: "Project not found" }, { status: 404 });
        }
        return Response.json(stored);
      }

      if (request.method === "POST") {
        try {
          const body = (await request.json().catch(() => ({}))) || {};
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
          const body = (await request.json().catch(() => ({}))) || {};
          const targetId = !isNaN(idParam) ? idParam : Number(body.id);
          const idx = stored.findIndex((p: any) => p.id === targetId);
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
          stored = stored.filter((p: any) => p.id !== idParam);
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
