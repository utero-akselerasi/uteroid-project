// Generic content-override helpers shared by client + admin.
// Overrides come from the Go API (content_overrides table) and take
// precedence over code defaults. Keys are dot-paths into the default
// object for scope "translations"/"page-copy"/"seo", or "<slug>.<field>"
// for scope "services".

export interface ContentOverride {
  scope: "translations" | "services" | "seo" | "page-copy";
  key: string;
  locale: string;
  value: unknown;
  updatedAt?: string;
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function setPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".").filter(Boolean);
  if (!parts.length) return;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const next = cur[parts[i]];
    if (!isPlainObject(next)) cur[parts[i]] = {};
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

export function getPath(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (!isPlainObject(cur)) return undefined;
    cur = cur[part];
  }
  return cur;
}

// Deep-clone base and apply overrides whose locale matches (or is "").
export function applyOverrides<T>(base: T, overrides: ContentOverride[], scope: ContentOverride["scope"], locale: string): T {
  const relevant = overrides.filter((o) => o.scope === scope && (!o.locale || o.locale === locale));
  if (!relevant.length || !isPlainObject(base)) return base;
  const out = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
  for (const o of relevant) setPath(out, o.key, o.value);
  return out as T;
}

// Flatten an object to leaf dot-paths for the admin key list.
export function flattenKeys(obj: unknown, prefix = "", out: string[] = []): string[] {
  if (isPlainObject(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      flattenKeys(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => flattenKeys(v, `${prefix}[${i}]`, out));
  } else if (prefix) {
    out.push(prefix);
  }
  return out;
}
