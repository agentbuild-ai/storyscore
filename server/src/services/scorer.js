import { chat } from './ai.js';
import { loadPrompt, loadCalibration } from '../prompts/loader.js';

const SCENARIO_LABELS = {
  pitching_to_executives: 'Pitching to Executives',
  talking_to_manager: 'Talking to Your Manager',
  explaining_to_stakeholders: 'Explaining Technical Work to Stakeholders',
};

// Map each scenario to its available calibration files (by filename, no extension)
const CALIBRATION_FILES = {
  pitching_to_executives: [
    'pitching-executives-strong',
    'pitching-executives-mid',
    'pitching-executives-weak',
  ],
  talking_to_manager: [],
  explaining_to_stakeholders: [],
};

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Extract JSON from a model response that may include markdown code fences
 * or surrounding prose (common with smaller Ollama models).
 */
function extractJSON(raw) {
  // Strip markdown code fences if present
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return JSON.parse(fenced[1].trim());

  // Try to find a top-level JSON object
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    return JSON.parse(raw.slice(start, end + 1));
  }

  throw new Error('No JSON object found in model response');
}

/**
 * Format calibration examples for injection into the Pass 1 system prompt.
 */
function formatCalibrationExamples(scenario) {
  const files = CALIBRATION_FILES[scenario] || [];
  if (files.length === 0) {
    return '(No calibration examples available for this scenario yet. Score strictly according to the rubric bands above.)';
  }

  return files
    .map((filename, i) => {
      const ex = loadCalibration(filename);
      const tier = ['Strong', 'Mid', 'Weak'][i] ?? `Example ${i + 1}`;
      const scenarioLabel = SCENARIO_LABELS[ex.scenario] || ex.scenario;

      return `### Calibration Example ${i + 1} — ${tier} (Overall: ${ex.overall_score})

SCENARIO: ${scenarioLabel}

CONTEXT:
- Context Answer 1 (Audience): ${ex.context.q1_audience}
- Context Answer 2 (Desired Outcome): ${ex.context.q2_ask}
- Context Answer 3 (Additional Context): ${ex.context.q3_time || 'not provided'}

TEXT:
${ex.text}

SCORING:
- Impact-First Score: ${ex.expected_scores.impact_first.score}
  Reasoning: ${ex.expected_scores.impact_first.reasoning}

- Narrative Coherence Index: ${ex.expected_scores.narrative_coherence.score}
  Reasoning: ${ex.expected_scores.narrative_coherence.reasoning}

- Audience Adaptation Score: ${ex.expected_scores.audience_adaptation.score}
  Reasoning: ${ex.expected_scores.audience_adaptation.reasoning}

- Overall Score: ${ex.overall_score}
- Notes: ${ex.notes}`;
    })
    .join('\n\n---\n\n');
}

function buildPass1System(scenario) {
  const prompt = loadPrompt('pass1-scoring');
  const examples = formatCalibrationExamples(scenario);
  return prompt.replace('[INSERT CALIBRATION EXAMPLES]', examples);
}

function buildPass1UserMessage(scenario, context, text) {
  const scenarioLabel = SCENARIO_LABELS[scenario] || scenario;
  return `TASK: Score the following communication. Do NOT rewrite or improve it. Return ONLY the JSON scoring object defined in the output schema.

SCENARIO: ${scenarioLabel}

CONTEXT:
- Context Answer 1 (Audience): ${context.q1 || 'not provided'}
- Context Answer 2 (Desired Outcome): ${context.q2 || 'not provided'}
- Context Answer 3 (Additional Context): ${context.q3 || 'not provided'}

TEXT TO SCORE:
<user_submission>
${text}
</user_submission>`;
}

function buildPass2UserMessage(pass1Result, scenario, context, text) {
  const scenarioLabel = SCENARIO_LABELS[scenario] || scenario;
  return `PASS 1 SCORES:
${JSON.stringify(pass1Result, null, 2)}

ORIGINAL TEXT:
<user_submission>
${text}
</user_submission>

SCENARIO AND CONTEXT:
- Scenario: ${scenarioLabel}
- Context Answer 1 (Audience): ${context.q1 || 'not provided'}
- Context Answer 2 (Desired Outcome): ${context.q2 || 'not provided'}
- Context Answer 3 (Additional Context): ${context.q3 || 'not provided'}`;
}

function formatHistory(conversationHistory) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return '(This is the first exchange.)';
  }
  return conversationHistory
    .map(m => m.role === 'user'
      ? `User:\n<user_submission>\n${m.text}\n</user_submission>`
      : `Coach: ${m.text}`)
    .join('\n\n');
}

export function buildPass3UserMessage({ scenario, context, text, pass1Result, pass2Result, conversationHistory }) {
  const scenarioLabel = SCENARIO_LABELS[scenario] || scenario;
  const topPoint = pass2Result.coaching_points?.[0];

  return `SCENARIO: ${scenarioLabel}

CONTEXT:
- Audience: ${context.q1 || 'not provided'}
- Goal: ${context.q2 || 'not provided'}
- Additional context: ${context.q3 || 'not provided'}

CONVERSATION HISTORY:
${formatHistory(conversationHistory)}

USER'S LATEST SUBMISSION (just scored):
<user_submission>
${text}
</user_submission>

SCORING RESULTS:
- Overall: ${pass1Result.overall_score} / 100 (${pass1Result.overall_label})
- Impact-First Score (IFS): ${pass1Result.metrics.impact_first.score} — ${pass1Result.metrics.impact_first.primary_driver || ''}
- Narrative Coherence (NCI): ${pass1Result.metrics.narrative_coherence.score} — ${pass1Result.metrics.narrative_coherence.primary_driver || ''}
- Audience Adaptation (AAS): ${pass1Result.metrics.audience_adaptation.score} — ${pass1Result.metrics.audience_adaptation.primary_driver || ''}

TOP COACHING INSIGHT FROM ANALYSIS:
${topPoint ? `${topPoint.headline}: ${topPoint.detail}` : 'See scoring results above.'}
${topPoint?.text_reference ? `Key phrase from their text: "${topPoint.text_reference}"` : ''}

Generate your coaching reply now.`;
}

export function buildCoachOnlyMessage({ scenario, context, text, conversationHistory }) {
  const scenarioLabel = SCENARIO_LABELS[scenario] || scenario;

  return `SCENARIO: ${scenarioLabel}

CONTEXT:
- Audience: ${context.q1 || 'not provided'}
- Goal: ${context.q2 || 'not provided'}
- Additional context: ${context.q3 || 'not provided'}

CONVERSATION HISTORY:
${formatHistory(conversationHistory)}

USER'S LATEST MESSAGE (conversational — not scored):
<user_submission>
${text}
</user_submission>

Generate your coaching reply now.`;
}

/**
 * Run the full three-pass scoring + coaching pipeline.
 *
 * @param {object} params
 * @param {string} params.scenario            - e.g. 'pitching_to_executives'
 * @param {object} params.context             - { q1, q2, q3 } — all optional
 * @param {string} params.text                - The user's submitted communication
 * @param {Array}  params.conversationHistory - Prior chat exchanges [{role, text}]
 * @returns {Promise<{pass1, pass2, word_count}>}
 */
export async function score({ scenario, context = {}, text, conversationHistory = [] }) {
  // ── Pass 1: Analytical Scoring ────────────────────────────────────────────
  const pass1System = buildPass1System(scenario);
  const pass1User = buildPass1UserMessage(scenario, context, text);

  const pass1Raw = await chat({
    system: pass1System,
    messages: [{ role: 'user', content: pass1User }],
    temperature: 0,
    maxTokens: 2048,
  });

  let pass1Result;
  try {
    pass1Result = extractJSON(pass1Raw);
  } catch (err) {
    throw new Error(
      `Pass 1 returned invalid JSON: ${err.message}\n\nRaw (first 500 chars): ${pass1Raw.slice(0, 500)}`
    );
  }

  // ── Pass 2: Coaching Generation ───────────────────────────────────────────
  const pass2System = loadPrompt('pass2-coaching');
  const pass2User = buildPass2UserMessage(pass1Result, scenario, context, text);

  const pass2Raw = await chat({
    system: pass2System,
    messages: [{ role: 'user', content: pass2User }],
    temperature: 0.3,
    maxTokens: 2048,
  });

  let pass2Result;
  try {
    pass2Result = extractJSON(pass2Raw);
  } catch (err) {
    throw new Error(
      `Pass 2 returned invalid JSON: ${err.message}\n\nRaw (first 500 chars): ${pass2Raw.slice(0, 500)}`
    );
  }

  return {
    pass1: pass1Result,
    pass2: pass2Result,
    word_count: countWords(text),
  };
}
