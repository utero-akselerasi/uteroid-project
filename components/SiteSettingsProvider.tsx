"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultSiteSettings, type SiteSettings, AVAILABLE_TYPEFACES } from "@/lib/siteSettings";

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateLocalSettings: (newSettings: Partial<SiteSettings>) => void;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSiteSettings,
  updateLocalSettings: () => {},
  refreshSettings: async () => {},
  loading: false,
});

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: SiteSettings;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || defaultSiteSettings);
  const [loading, setLoading] = useState(false);

  const applyTypeface = (typefaceFontFamily: string) => {
    if (typeof document === "undefined") return;

    // Find if it's one of our known Google Fonts
    const match = AVAILABLE_TYPEFACES.find(
      (t) => t.fontFamily === typefaceFontFamily || t.name === typefaceFontFamily
    );

    const root = document.documentElement;
    const effectiveFamily = match ? match.fontFamily : typefaceFontFamily;

    // Load Google font stylesheet if needed
    if (match?.googleFontUrl) {
      const linkId = `google-font-${match.id}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = match.googleFontUrl;
        document.head.appendChild(link);
      }
    }

    // Set CSS variable and data-font-override flag
    root.style.setProperty("--site-font", effectiveFamily);
    root.style.setProperty("--font-sans", effectiveFamily);
    root.style.setProperty("--font-display", effectiveFamily);
    root.setAttribute("data-font-override", "true");
  };

  const refreshSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/site-settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        if (data.typography?.typeface) {
          applyTypeface(data.typography.typeface);
        }
      }
    } catch (err) {
      console.warn("[SiteSettingsProvider] Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  useEffect(() => {
    if (settings.typography?.typeface) {
      applyTypeface(settings.typography.typeface);
    }
  }, [settings.typography?.typeface]);

  const updateLocalSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      typography: {
        ...prev.typography,
        ...(newSettings.typography || {}),
      },
      banners: {
        ...prev.banners,
        ...(newSettings.banners || {}),
      },
      serviceImages: {
        ...prev.serviceImages,
        ...(newSettings.serviceImages || {}),
      },
      contacts: {
        ...prev.contacts,
        ...(newSettings.contacts || {}),
      },
    }));
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateLocalSettings,
        refreshSettings,
        loading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
