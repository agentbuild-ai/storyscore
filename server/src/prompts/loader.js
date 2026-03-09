import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname, '../../../prompts');

/**
 * Load a prompt template by filename (without extension).
 * @param {string} name - e.g. 'pass1-scoring'
 * @returns {string} The prompt text
 */
export function loadPrompt(name) {
  const filePath = join(PROMPTS_DIR, `${name}.md`);
  return readFileSync(filePath, 'utf-8');
}

/**
 * Load a calibration JSON file by name.
 * @param {string} name - e.g. 'pitching-executives-strong'
 * @returns {object} Parsed JSON calibration example
 */
export function loadCalibration(name) {
  const filePath = join(PROMPTS_DIR, 'calibration', `${name}.json`);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}
