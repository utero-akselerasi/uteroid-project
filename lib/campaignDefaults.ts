import { en } from "./translations/en";
import { id } from "./translations/id";
import type { CampaignConfig, CampaignLocaleConfig } from "./siteSettings";

// Default media for the homepage Studio Campaign section. These mirror the
// values that used to be hardcoded in TransitionCampaignSpotlight; the Go
// backend site_settings "campaign" key overrides them per field/locale.
const MEDIA = {
  left: {
    mediaType: "video" as const,
    src: "/projects/transition-feed-campaign/video-left.mp4",
    poster: "/projects/transition-feed-campaign/cover-9b98f119.webp",
  },
  middle: {
    mediaType: "image" as const,
    src: "/projects/transition-feed-campaign/feed-middle.webp",
  },
  right: {
    mediaType: "video" as const,
    src: "/projects/transition-feed-campaign/video-right.mp4",
    poster: "/projects/transition-feed-campaign/cover-9b98f119.webp",
  },
};

function buildLocale(t: typeof en.transitionCampaign): CampaignLocaleConfig {
  return {
    sectionAria: t.sectionAria,
    badgeLabel: t.badgeLabel,
    title: t.title,
    subtitle: t.subtitle,
    tagPill: t.tagPill,
    handle: t.handle,
    postLeft: { ...t.postLeft, ...MEDIA.left },
    postMiddle: { ...t.postMiddle, ...MEDIA.middle },
    postRight: { ...t.postRight, ...MEDIA.right },
  };
}

export function defaultCampaignConfig(): Required<CampaignConfig> {
  return { en: buildLocale(en.transitionCampaign), id: buildLocale(id.transitionCampaign) };
}

/** Merge a (possibly partial) DB override over the code defaults, per locale. */
export function resolveCampaignConfig(override?: CampaignConfig): Required<CampaignConfig> {
  const defaults = defaultCampaignConfig();
  const mergePost = <T extends Record<string, any>>(base: T, extra?: T): T => ({ ...base, ...(extra || {}) });
  const mergeLocale = (base: CampaignLocaleConfig, extra?: CampaignLocaleConfig): CampaignLocaleConfig => ({
    ...base,
    ...(extra || {}),
    postLeft: mergePost(base.postLeft || {}, extra?.postLeft),
    postMiddle: mergePost(base.postMiddle || {}, extra?.postMiddle),
    postRight: mergePost(base.postRight || {}, extra?.postRight),
  });
  return {
    en: mergeLocale(defaults.en, override?.en) as Required<CampaignConfig>["en"],
    id: mergeLocale(defaults.id, override?.id) as Required<CampaignConfig>["id"],
  };
}
