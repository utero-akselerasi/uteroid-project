// Shared marker so route-level "scroll to top" effects can distinguish
// Back/Forward (popstate) navigations — where the browser must restore
// the previous scroll position — from fresh link-click navigations.
let lastPopAt = 0;

export function notePopNavigation() {
  lastPopAt = Date.now();
}

export function wasRecentPopNavigation(): boolean {
  return Date.now() - lastPopAt < 1500;
}
