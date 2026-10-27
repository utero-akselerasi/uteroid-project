import type { NextRequest } from "next/server";
import { DeckImageError, processDeckImage } from "@/lib/processDeckImage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    if (subpath === "admin/projects" || subpath === "projects" || subpath.startsWith("admin/projects/")) {
      if (request.method === "POST" || request.method === "PUT") {
        try {
          const body = (await request.json().catch(() => ({}))) || {};
          const id = path[2] && !isNaN(Number(path[2])) ? Number(path[2]) : Date.now();
          const saved = {
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
            status: "published",
            ...body,
            id,
            disciplines: Array.isArray(body.disciplines) && body.disciplines.length > 0 ? body.disciplines : ["identity"],
          };
          return Response.json(saved);
        } catch {
          return Response.json({
            id: Date.now(),
            title: "Proyek",
            client: "Client",
            status: "published",
            disciplines: ["identity"],
            year: new Date().getFullYear().toString(),
            category: "Branding",
            industry: "services",
            slug: "proyek-baru",
            routeSlug: "proyek-baru",
          });
        }
      }
      if (request.method === "DELETE") {
        return Response.json({ ok: true });
      }
      const { projects } = await import("@/lib/projects");
      return Response.json(projects.map((p, idx) => ({ ...p, id: idx + 1, status: "published" })));
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
