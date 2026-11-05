import { getFontConfig } from "@/lib/font-loader";
import { defaultSiteSettings } from "@/lib/siteSettings";
import fs from "fs";
import path from "path";

/**
 * Server-side font loader that injects the Google Font link tag
 * and sets CSS variables on the HTML element to prevent FOUT
 */
export default function ServerFontLoader() {
  let typeface = defaultSiteSettings.typography.typeface;

  // Try to read from local settings file (server-side only)
  try {
    const settingsFile = path.join(process.cwd(), "data", "site-settings.json");
    if (fs.existsSync(settingsFile)) {
      const data = JSON.parse(fs.readFileSync(settingsFile, "utf-8"));
      if (data.typography?.typeface) {
        typeface = data.typography.typeface;
      }
    }
  } catch (err) {
    // Silent fallback to default
  }

  const config = getFontConfig(typeface);

  return (
    <>
      {config.googleFontUrl && (
        <link
          rel="stylesheet"
          href={config.googleFontUrl}
          precedence="high"
        />
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --site-font: ${config.fontFamily};
              --font-sans: ${config.fontFamily};
              --font-display: ${config.fontFamily};
            }
          `,
        }}
      />
    </>
  );
}
