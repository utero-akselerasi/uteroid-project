import type { Project } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────
// M1b — Seed sync: field-by-field comparison between the code seed
// (lib/projects.ts) and projects stored in the admin database.
// Pure logic only — the panel component applies the user's ticks via
// the regular admin PUT endpoint, so nothing is overwritten unless
// explicitly selected.
// ─────────────────────────────────────────────────────────────────────

export type AdminProjectLike = Project & {
  id?: number;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SyncFieldKind = "empty" | "different";

export interface SyncFieldSpec {
  path: string;
  label: string;
  media?: boolean;
  unordered?: boolean;
}

export interface SyncFieldDiff extends SyncFieldSpec {
  kind: SyncFieldKind;
  seedValue: unknown;
  currentValue: unknown;
}

export interface WorkSyncDiff {
  db: AdminProjectLike;
  seed: Project;
  fields: SyncFieldDiff[];
}

export const SYNC_FIELD_SPECS: SyncFieldSpec[] = [
  { path: "title", label: "Title" },
  { path: "client", label: "Client" },
  { path: "year", label: "Year" },
  { path: "category", label: "Category" },
  { path: "industry", label: "Industry" },
  { path: "disciplines", label: "Disciplines", unordered: true },
  { path: "shortDescription", label: "Short description" },
  { path: "description", label: "Description" },
  { path: "excerpt", label: "Excerpt" },
  { path: "coverImage", label: "Cover image", media: true },
  { path: "heroImage", label: "Hero image", media: true },
  { path: "gridCoverPosition", label: "Grid cover position" },
  { path: "hoverImage", label: "Hover image", media: true },
  { path: "galleryImages", label: "Gallery images", media: true },
  { path: "video.type", label: "Video type" },
  { path: "video.src", label: "Video source", media: true },
  { path: "video.poster", label: "Video poster", media: true },
  { path: "video.aspectRatio", label: "Video aspect ratio" },
  { path: "featured", label: "Featured" },
  { path: "homepageVisible", label: "Show on homepage" },
  { path: "priority", label: "Priority" },
  { path: "tags", label: "Tags", unordered: true },
  { path: "details.scope", label: "Details · scope" },
  { path: "details.challenge", label: "Details · challenge" },
  { path: "details.solution", label: "Details · solution" },
  { path: "details.deliverables", label: "Details · deliverables" },
];

const NEVER_EMPTY_PATHS = new Set(["featured", "homepageVisible"]);

export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

export function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let acc = target;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!acc[key] || typeof acc[key] !== "object" || Array.isArray(acc[key])) acc[key] = {};
    acc = acc[key] as Record<string, unknown>;
  }
  acc[keys[keys.length - 1]] = value;
}

function isEmptyValue(path: string, value: unknown): boolean {
  if (NEVER_EMPTY_PATHS.has(path)) return false;
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "number") return value === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
}

function stableStringify(value: unknown, unordered = false): string {
  if (value === undefined) return "__undefined__";
  if (Array.isArray(value)) {
    const items = value.map((item) => stableStringify(item));
    if (unordered) items.sort();
    return `[${items.join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

function valuesEqual(a: unknown, b: unknown, unordered: boolean): boolean {
  return stableStringify(a, unordered) === stableStringify(b, unordered);
}

export function workMatches(db: AdminProjectLike, seed: Project): boolean {
  const dbKeys = new Set([db.slug, db.routeSlug].filter(Boolean));
  return dbKeys.has(seed.slug) || dbKeys.has(seed.routeSlug);
}

/** Compare one DB project against its seed entry. Returns only differing fields. */
export function diffWork(db: AdminProjectLike, seed: Project): SyncFieldDiff[] {
  const diffs: SyncFieldDiff[] = [];
  for (const spec of SYNC_FIELD_SPECS) {
    const seedValue = getPath(seed, spec.path);
    if (seedValue === undefined) continue; // seed has no value → nothing to sync
    const currentValue = getPath(db, spec.path);
    if (valuesEqual(seedValue, currentValue, !!spec.unordered)) continue;
    const seedEmpty = isEmptyValue(spec.path, seedValue);
    const currentEmpty = isEmptyValue(spec.path, currentValue);
    diffs.push({
      ...spec,
      kind: !seedEmpty && currentEmpty ? "empty" : "different",
      seedValue,
      currentValue,
    });
  }
  return diffs;
}

/** All works present in both the DB list and the seed, with their diffs. */
export function computeWorkDiffs(dbProjects: AdminProjectLike[], seedProjects: Project[]): WorkSyncDiff[] {
  const result: WorkSyncDiff[] = [];
  for (const seed of seedProjects) {
    const candidates = dbProjects.filter((project) => project.id && workMatches(project, seed));
    if (candidates.length === 0) continue;
    // Prefer the candidate with the fewest differences (handles slug/routeSlug cross-matches)
    let best: WorkSyncDiff | null = null;
    for (const db of candidates) {
      const fields = diffWork(db, seed);
      if (!best || fields.length < best.fields.length) best = { db, seed, fields };
    }
    if (best && best.fields.length > 0) result.push(best);
  }
  return result;
}

/** Build the PUT payload for a work with the selected field paths applied from seed. */
export function buildSyncPayload(db: AdminProjectLike, seed: Project, paths: string[]): Record<string, unknown> {
  const payload = JSON.parse(JSON.stringify(db)) as Record<string, unknown>;
  for (const path of paths) {
    const value = getPath(seed, path);
    if (value !== undefined) setPath(payload, path, JSON.parse(JSON.stringify(value)));
  }
  return payload;
}

export function previewValue(value: unknown, max = 90): string {
  if (value === undefined || value === null) return "—";
  let text: string;
  if (Array.isArray(value)) {
    text = value.length === 0 ? "(kosong)" : value.length <= 3 ? value.join(", ") : `${value.length} item`;
  } else if (typeof value === "object") {
    text = JSON.stringify(value);
  } else {
    text = String(value);
  }
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
