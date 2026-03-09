const BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json.data;
}

export function submitScore({ scenario, context, text, conversationHistory = [] }) {
  return request('/api/score', {
    method: 'POST',
    body: JSON.stringify({ scenario, context, text, conversation_history: conversationHistory }),
  });
}

export function chatWithCoach({ scenario, context, text, conversationHistory = [] }) {
  return request('/api/coach', {
    method: 'POST',
    body: JSON.stringify({ scenario, context, text, conversation_history: conversationHistory }),
  });
}

export function submitFeedback({ session_id, helpful, feedback_text }) {
  return request('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({ session_id, helpful, feedback_text }),
  });
}

export function submitEmail({ session_id, email }) {
  return request('/api/save-email', {
    method: 'POST',
    body: JSON.stringify({ session_id, email }),
  });
}
