import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { defaultSiteSettings, type SiteSettings } from "@/lib/siteSettings";

const SETTINGS_FILE = path.join(process.cwd(), "data", "site-settings.json");

function readStoredSettings(): SiteSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return {
        ...defaultSiteSettings,
        ...parsed,
        typography: {
          ...defaultSiteSettings.typography,
          ...(parsed.typography || {}),
        },
        banners: {
          ...defaultSiteSettings.banners,
          ...(parsed.banners || {}),
          heroSlides: parsed.banners?.heroSlides || defaultSiteSettings.banners.heroSlides,
          statementBanner: {
            ...defaultSiteSettings.banners.statementBanner,
            ...(parsed.banners?.statementBanner || {}),
          },
          pageBanners: {
            ...defaultSiteSettings.banners.pageBanners,
            ...(parsed.banners?.pageBanners || {}),
          },
        },
        serviceImages: {
          ...defaultSiteSettings.serviceImages,
          ...(parsed.serviceImages || {}),
        },
        contacts: {
          ...defaultSiteSettings.contacts,
          ...(parsed.contacts || {}),
        },
        studio: {
          ...defaultSiteSettings.studio,
          ...(parsed.studio || {}),
          metrics: parsed.studio?.metrics || defaultSiteSettings.studio.metrics,
        },
        insights: {
          ...defaultSiteSettings.insights,
          ...(parsed.insights || {}),
          articles: parsed.insights?.articles || defaultSiteSettings.insights.articles,
        },
      };
    }
  } catch (err) {
    console.error("[site-settings] Failed to read local settings file:", err);
  }
  return defaultSiteSettings;
}

function writeStoredSettings(settings: SiteSettings): void {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("[site-settings] Failed to write local settings file:", err);
  }
}

export async function GET() {
  const settings = readStoredSettings();
  return NextResponse.json(settings, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const current = readStoredSettings();

    const merged: SiteSettings = {
      ...current,
      ...payload,
      typography: {
        ...current.typography,
        ...(payload.typography || {}),
      },
      banners: {
        ...current.banners,
        ...(payload.banners || {}),
        heroSlides: payload.banners?.heroSlides || current.banners.heroSlides,
        statementBanner: {
          ...current.banners.statementBanner,
          ...(payload.banners?.statementBanner || {}),
        },
        pageBanners: {
          ...current.banners.pageBanners,
          ...(payload.banners?.pageBanners || {}),
        },
      },
      serviceImages: {
        ...current.serviceImages,
        ...(payload.serviceImages || {}),
      },
      contacts: {
        ...current.contacts,
        ...(payload.contacts || {}),
      },
      studio: {
        ...current.studio,
        ...(payload.studio || {}),
        metrics: payload.studio?.metrics || current.studio.metrics,
      },
      insights: {
        ...current.insights,
        ...(payload.insights || {}),
        articles: payload.insights?.articles || current.insights.articles,
      },
      updatedAt: new Date().toISOString(),
    };

    writeStoredSettings(merged);

    // If Go backend is available, also attempt to synchronize settings there
    const baseUrl = process.env.PORTFOLIO_API_URL;
    if (baseUrl) {
      try {
        await fetch(`${baseUrl.replace(/\/$/, "")}/admin/settings`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("cookie") || "",
            "X-CSRF-Token": request.headers.get("x-csrf-token") || "",
          },
          body: JSON.stringify({ site_settings: merged }),
        });
      } catch (backendErr) {
        // Backend optional sync warning
        console.warn("[site-settings] Could not sync with Go backend:", backendErr);
      }
    }

    return NextResponse.json(merged);
  } catch (err) {
    console.error("[site-settings] Error saving settings:", err);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan website." }, { status: 500 });
  }
}
