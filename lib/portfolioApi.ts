import "server-only";
import type { Project } from "./types";
import { projects as localProjects } from "./projects";

const apiBase = (process.env.PORTFOLIO_API_URL || "").replace(/\/$/, "");

export async function getPortfolioProjects(): Promise<Project[]> {
  if (!apiBase) return localProjects;
  const response = await fetch(`${apiBase}/projects`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Portfolio API returned ${response.status}`);
  return (await response.json()) as Project[];
}

export async function getPortfolioProject(routeSlug: string): Promise<Project | undefined> {
  if (!apiBase) return localProjects.find((project) => project.routeSlug === routeSlug);
  const response = await fetch(`${apiBase}/projects/${encodeURIComponent(routeSlug)}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Portfolio API returned ${response.status}`);
  return (await response.json()) as Project;
}
