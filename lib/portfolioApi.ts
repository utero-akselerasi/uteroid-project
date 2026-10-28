import "server-only";
import fs from "fs";
import type { Project } from "./types";
import { projects as localProjects } from "./projects";

function getApiBase(): string {
  let url = (process.env.PORTFOLIO_API_URL || "").replace(/\/$/, "");
  if (url && url.includes("portfolio-api") && !fs.existsSync("/.dockerenv")) {
    url = url.replace("portfolio-api", "127.0.0.1");
  }
  return url;
}

export async function getPortfolioProjects(): Promise<Project[]> {
  const apiBase = getApiBase();
  if (!apiBase) return localProjects;
  try {
    const response = await fetch(`${apiBase}/projects`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      console.warn(`[portfolioApi] Portfolio API returned ${response.status}, falling back to local projects`);
      return localProjects;
    }
    return (await response.json()) as Project[];
  } catch (err) {
    console.warn(`[portfolioApi] Failed to fetch from Portfolio API (${apiBase}), falling back to local projects:`, err);
    return localProjects;
  }
}

export async function getPortfolioProject(routeSlug: string): Promise<Project | undefined> {
  const apiBase = getApiBase();
  if (!apiBase) return localProjects.find((project) => project.routeSlug === routeSlug);
  try {
    const response = await fetch(`${apiBase}/projects/${encodeURIComponent(routeSlug)}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (response.status === 404) return undefined;
    if (!response.ok) {
      console.warn(`[portfolioApi] Portfolio API returned ${response.status}, falling back to local project`);
      return localProjects.find((project) => project.routeSlug === routeSlug);
    }
    return (await response.json()) as Project;
  } catch (err) {
    console.warn(`[portfolioApi] Failed to fetch project "${routeSlug}" from Portfolio API (${apiBase}), falling back to local project:`, err);
    return localProjects.find((project) => project.routeSlug === routeSlug);
  }
}

