/**
 * Unified AI client — switches between Ollama (development) and Claude (testing/production)
 * based on the AI_PROVIDER environment variable.
 *
 * Usage:
 *   import { chat } from './services/ai.js';
 *
 *   const response = await chat({
 *     system: 'You are a scoring engine...',
 *     messages: [{ role: 'user', content: '...' }],
 *     temperature: 0,       // optional, defaults to 0
 *     maxTokens: 2048,      // optional, defaults to 2048
 *   });
 *   // response is always a plain string (the model's reply)
 */

import Anthropic from '@anthropic-ai/sdk';
import { Ollama } from 'ollama';

const PROVIDER = process.env.AI_PROVIDER || 'ollama';

// ─── Ollama ───────────────────────────────────────────────────────────────────

const ollamaClient = new Ollama({
  host: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
});

async function chatOllama({ system, messages, temperature = 0, maxTokens = 2048, jsonMode = true }) {
  const allMessages = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages;

  const response = await ollamaClient.chat({
    model: process.env.OLLAMA_MODEL || 'llama3.1',
    messages: allMessages,
    ...(jsonMode && { format: 'json' }),  // only force JSON for structured scoring passes
    options: {
      temperature,
      num_predict: maxTokens,
    },
  });

  return response.message.content;
}

// ─── Claude ───────────────────────────────────────────────────────────────────

const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function chatClaude({ system, messages, temperature = 0, maxTokens = 2048, jsonMode = true, model }) {
  const resolvedModel = model || process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
  // For structured JSON passes, prefill the assistant turn with '{' so Claude is
  // constrained to output pure JSON — no markdown fences, no stray control characters.
  const allMessages = jsonMode
    ? [...messages, { role: 'assistant', content: '{' }]
    : messages;

  const response = await anthropicClient.messages.create({
    model: resolvedModel,
    max_tokens: maxTokens,
    temperature,
    // Wrap system prompt in array format to enable prompt caching.
    // Claude caches the static system prompt across requests, cutting TTFT on cache hits.
    ...(system && {
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    }),
    messages: allMessages,
  });

  // Prepend the prefilled '{' back since Claude's response continues from it
  const text = response.content[0].text;
  return jsonMode ? '{' + text : text;
}

// ─── Unified export ───────────────────────────────────────────────────────────

/**
 * @param {object} params
 * @param {string} [params.system]       - System prompt text
 * @param {Array}  params.messages       - Array of {role, content} message objects
 * @param {number} [params.temperature]  - Sampling temperature (default: 0)
 * @param {number} [params.maxTokens]    - Max tokens to generate (default: 2048)
 * @returns {Promise<string>}            - Model reply as a plain string
 */
export async function chat(params) {
  if (PROVIDER === 'claude') {
    return chatClaude(params);
  }
  return chatOllama(params);
}

export function getProvider() {
  return PROVIDER;
}
