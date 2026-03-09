import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service role bypasses RLS
);

/**
 * Fetch a session by ID (used for building the scorecard email).
 * @param {string} session_id
 * @returns {Promise<object>} The full session row
 */
export async function getSession(session_id) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', session_id)
    .single();

  if (error) throw new Error(`Failed to get session: ${error.message}`);
  return data;
}

/**
 * Write a new session after scoring completes.
 * @param {object} data - All session fields except session_id and created_at
 * @returns {Promise<{session_id: string}>}
 */
export async function createSession(data) {
  const { data: row, error } = await supabase
    .from('sessions')
    .insert(data)
    .select('session_id')
    .single();

  if (error) throw new Error(`Failed to create session: ${error.message}`);
  return row;
}

/**
 * Fetch lightweight session metadata for the admin dashboard.
 * Deliberately excludes input_text, context answers, and scoring_response
 * to keep the payload small and avoid returning sensitive content.
 * @returns {Promise<Array>}
 */
export async function getSessionsMetadata() {
  const { data, error } = await supabase
    .from('sessions')
    .select('session_id, created_at, scenario, overall_score, ifs_score, nci_score, aas_score, word_count, email')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);
  return data;
}

/**
 * Fetch session content for the admin sessions view.
 * The email column is NEVER selected here — by design, content and identity
 * are kept separate so the admin cannot link submissions to specific people.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getSessionsContent(limit = 50) {
  const { data, error } = await supabase
    .from('sessions')
    .select('session_id, created_at, scenario, context_q1, context_q2, context_q3, input_text, word_count, overall_score, ifs_score, nci_score, aas_score')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);
  return data;
}

/**
 * Fetch all sessions that have an email address, for the admin email list.
 * Returns only the columns needed — never returns input_text or scoring content.
 * @returns {Promise<Array>}
 */
export async function getEmailList() {
  const { data, error } = await supabase
    .from('sessions')
    .select('email, scenario, created_at, overall_score')
    .not('email', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch email list: ${error.message}`);
  return data;
}

/**
 * Save optional email after results are shown.
 * @param {string} session_id
 * @param {string} email
 */
export async function saveEmail(session_id, email) {
  const { error } = await supabase
    .from('sessions')
    .update({ email })
    .eq('session_id', session_id);

  if (error) throw new Error(`Failed to save email: ${error.message}`);
}

/**
 * Delete all personal data linked to an email address.
 * Keeps the row (for aggregate metrics) but nulls out the email,
 * input_text, and context answers — the sensitive content is gone.
 * @param {string} email
 * @returns {Promise<number>} Number of sessions affected
 */
export async function deleteDataByEmail(email) {
  const { data, error } = await supabase
    .from('sessions')
    .update({
      email: null,
      input_text: null,
      context_q1: null,
      context_q2: null,
      context_q3: null,
    })
    .eq('email', email)
    .select('session_id');

  if (error) throw new Error(`Failed to delete data: ${error.message}`);
  return data.length;
}

/**
 * Purge input_text and context answers from sessions older than N days.
 * Scores and metadata are preserved for aggregate analytics.
 * @param {number} olderThanDays
 * @returns {Promise<number>} Number of sessions purged
 */
export async function purgeOldContent(olderThanDays = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  const { data, error } = await supabase
    .from('sessions')
    .update({ input_text: null, context_q1: null, context_q2: null, context_q3: null })
    .lt('created_at', cutoff.toISOString())
    .not('input_text', 'is', null)
    .select('session_id');

  if (error) throw new Error(`Failed to purge content: ${error.message}`);
  return data.length;
}

/**
 * Save thumbs up/down feedback and optional free-text.
 * @param {string} session_id
 * @param {boolean} helpful
 * @param {string|null} feedback_text
 */
export async function saveFeedback(session_id, helpful, feedback_text = null) {
  const { error } = await supabase
    .from('sessions')
    .update({ feedback_helpful: helpful, feedback_text })
    .eq('session_id', session_id);

  if (error) throw new Error(`Failed to save feedback: ${error.message}`);
}
