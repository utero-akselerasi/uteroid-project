import DOMPurify from "isomorphic-dompurify";

// ─────────────────────────────────────────────
// HTML sanitization
// ─────────────────────────────────────────────
// The CMS already sanitizes on write. This is defense in depth: anything
// that reaches dangerouslySetInnerHTML passes through here first, so a
// compromised or misconfigured CMS cannot inject script into this site.

const ALLOWED_TAGS = [
  "p", "br", "hr",
  "h2", "h3", "h4",
  "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li",
  "blockquote", "figure", "figcaption",
  "a", "img",
  "code", "pre",
  "table", "thead", "tbody", "tr", "th", "td",
];

const ALLOWED_ATTR = [
  "href", "target", "rel",
  "src", "alt", "width", "height", "loading",
  "colspan", "rowspan",
];

let hooksInstalled = false;

function installHooks(): void {
  if (hooksInstalled) return;
  hooksInstalled = true;

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    const tag = node.nodeName?.toLowerCase();

    // Stripping a blocked URL leaves the element behind: an <img> with no
    // src renders as a broken-image icon. Drop it instead.
    if (tag === "img" && !node.getAttribute("src")) {
      node.remove();
      return;
    }

    // An <a> without href is not a link; keep its text, drop the wrapper.
    if (tag === "a") {
      if (!node.getAttribute("href")) {
        node.replaceWith(...Array.from(node.childNodes));
        return;
      }
      // Links out of the article open in a new tab without leaking the
      // referrer or handing the opener to the target page.
      if (/^https?:/i.test(node.getAttribute("href") ?? "")) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    }
  });
}

export function sanitizeArticleHtml(html: string | null | undefined): string {
  if (!html) return "";
  installHooks();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Block javascript:/data: URLs in href and src.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
  });
}
