import { AVAILABLE_TYPEFACES } from "./siteSettings";

export interface FontConfig {
  fontFamily: string;
  googleFontUrl?: string;
  preloadUrl?: string;
}

/**
 * Get font configuration for a given typeface
 * Returns the font family and Google Fonts URL if applicable
 */
export function getFontConfig(typeface: string): FontConfig {
  const match = AVAILABLE_TYPEFACES.find(
    (t) => t.fontFamily === typeface || t.name === typeface
  );

  if (!match) {
    // Fallback to default
    return {
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    };
  }

  return {
    fontFamily: match.fontFamily,
    googleFontUrl: match.googleFontUrl,
  };
}

/**
 * Check if a font is a Google Font (not a system font)
 */
export function isGoogleFont(typeface: string): boolean {
  const match = AVAILABLE_TYPEFACES.find(
    (t) => t.fontFamily === typeface || t.name === typeface
  );
  return !!match?.googleFontUrl;
}
