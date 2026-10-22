import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const baseUrl = (process.env.PORTFOLIO_API_URL || "http://127.0.0.1:8080/api/v1").replace(/\/$/, "");
  const target = `${baseUrl}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers = new Headers();
  for (const name of ["accept", "content-type", "cookie", "origin", "user-agent", "x-csrf-token"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-forwarded-for", request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1");

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });
  const responseHeaders = new Headers();
  for (const name of ["content-type", "content-length", "cache-control", "content-disposition", "etag", "last-modified", "set-cookie"]) {
    const value = response.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  return new Response(response.body, { status: response.status, headers: responseHeaders });
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
