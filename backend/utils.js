import { extractText, getDocumentProxy } from 'unpdf';

export const COMMON_SKILL_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust',
  'react', 'react.js', 'next.js', 'vue', 'angular', 'node.js', 'express', 'nestjs',
  'fastapi', 'django', 'flask', 'spring boot', 'sql', 'postgresql', 'mysql', 'mongodb',
  'redis', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'github',
  'linux', 'rest api', 'graphql', 'tailwind css', 'microservices', 'unit testing',
  'jest', 'cypress', 'system design', 'agile', 'scrum', 'html5', 'css3'
];

/**
 * Extracts plain text from an uploaded buffer (PDF or TXT)
 * @param {Buffer} buffer
 * @param {string} originalName
 * @returns {Promise<string>}
 */
export async function extractTextFromBuffer(buffer, originalName) {
  const name = originalName.toLowerCase();

  if (name.endsWith('.pdf')) {
    try {
      // unpdf needs a plain Uint8Array, not a Node Buffer
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      const fullText = (text || '').trim();

      if (fullText.length < 20) {
        throw new Error('PDF appears empty or scanned with no selectable text.');
      }
      return fullText;
    } catch (err) {
      throw new Error(`Failed to extract text from PDF: ${err.message}`);
    }
  }

  if (name.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  const text = buffer.toString('utf-8');
  if (text && text.length > 20) return text;
  throw new Error('Unsupported format for server extraction. Please upload a PDF or TXT resume.');
}

/**
 * Extracts candidate name heuristically from resume text
 * @param {string} text
 * @returns {string}
 */
export function extractCandidateName(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (line.includes('@') || /http|\.com|\d{5,}/.test(line)) continue;

    const words = line.split(/\s+/);
    if (
      words.length >= 2 &&
      words.length <= 4 &&
      words.every((w) => /^[A-Z][a-zA-Z.'-]*$/i.test(w))
    ) {
      return words.join(' ');
    }
  }
  return 'Candidate';
}

/**
 * Extracts job title estimate from JD
 * @param {string} jdText
 * @returns {string}
 */
export function extractJobTitle(jdText) {
  const firstLine = jdText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 3 && l.length < 80);

  if (firstLine) {
    return firstLine.replace(/^(?:job title|role|position|opening)[:\-\s]*/i, '').trim();
  }
  return 'Target Role';
}

/**
 * Identifies keywords present in a text
 * @param {string} text
 * @returns {Set<string>}
 */
export function extractSkills(text) {
  const lower = text.toLowerCase();
  const matched = new Set();

  for (const skill of COMMON_SKILL_KEYWORDS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // allows trailing . and : so "I know Python." still matches
    const regex = new RegExp(`(?:^|[\\s,;•/|()])${escaped}(?=[\\s,;•/|().:]|$)`, 'i');
    if (regex.test(lower)) {
      matched.add(skill);
    }
  }

  return matched;
}