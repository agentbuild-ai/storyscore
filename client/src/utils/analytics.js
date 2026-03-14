const KEY  = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

function getDistinctId() {
  let id = localStorage.getItem('ph_distinct_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('ph_distinct_id', id);
  }
  return id;
}

// No SDK — sends directly to the PostHog capture API.
// Avoids the posthog-js rrweb TDZ crash entirely.
export function initAnalytics() {
  if (!KEY) return;
  // Fire a pageview on init
  track('$pageview', { $current_url: window.location.href });
}

export function track(event, props = {}) {
  if (!KEY) return;
  fetch(`${HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: KEY,
      event,
      distinct_id: getDistinctId(),
      properties: { ...props, $lib: 'storyscore-fetch' },
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});
}
