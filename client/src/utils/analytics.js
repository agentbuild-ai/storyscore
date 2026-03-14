let _posthog = null;

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return;

  // Dynamic import keeps PostHog out of the main bundle,
  // preventing the rrweb TDZ crash on startup.
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: true,
      autocapture: false,
      disable_session_recording: true,
    });
    _posthog = posthog;
  }).catch(() => {});
}

export function track(event, props = {}) {
  _posthog?.capture(event, props);
}
