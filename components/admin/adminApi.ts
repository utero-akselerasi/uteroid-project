"use client";

// Shared admin API helper — talks to the Go backend through the
// /portfolio-api proxy with the session cookie + CSRF token.

export async function api(path: string, options: RequestInit = {}, csrfToken = "") {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  const response = await fetch(`/portfolio-api/${path}`, { ...options, headers, credentials: "same-origin", cache: "no-store" });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Permintaan gagal");
  return data;
}

// Site/banners/campaign imagery → authenticated Go endpoint → SeaweedFS.
export async function uploadMediaFile(file: File, folder = "site"): Promise<string> {
  const sessionData = await api("admin/auth/session").catch(() => null);
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  const data = await api("admin/site-media", { method: "POST", body: form }, sessionData?.csrfToken || "");
  if (!data?.url) throw new Error("Gagal mengunggah gambar.");
  return data.url as string;
}
