/**
 * Comprehensive dictionary of categorized technology skills for matching
 */
export const SKILL_CATEGORIES = {
  'Languages': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Ruby', 'PHP',
    'Go', 'Golang', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'SQL', 'HTML', 'HTML5', 'CSS', 'CSS3', 'Bash', 'Shell'
  ],
  'Frameworks & Libraries': [
    'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte',
    'Node.js', 'Express', 'Express.js', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Spring Boot',
    'Tailwind CSS', 'Bootstrap', 'Redux', 'GraphQL', 'REST API', 'Prisma', 'Hibernate', '.NET'
  ],
  'Databases & Storage': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase', 'Supabase',
    'DynamoDB', 'Cassandra', 'Oracle', 'Elasticsearch', 'Neo4j', 'MariaDB'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub',
    'GitLab', 'Terraform', 'Linux', 'Nginx', 'Vercel', 'Netlify', 'Jenkins', 'Ansible'
  ],
  'AI / ML & Data': [
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas',
    'NumPy', 'OpenAI', 'LangChain', 'Hugging Face', 'Computer Vision', 'NLP', 'Data Science', 'Power BI', 'Tableau'
  ],
  'Tools & Methods': [
    'Agile', 'Scrum', 'Jira', 'Figma', 'Postman', 'Webpack', 'Vite', 'Jest', 'Cypress',
    'Playwright', 'Unit Testing', 'Microservices', 'System Design'
  ]
};

// Flattened list for quick lookup
const ALL_SKILLS = Object.entries(SKILL_CATEGORIES).flatMap(([category, skills]) =>
  skills.map(skill => ({ name: skill, category, normalized: skill.toLowerCase() }))
);

/**
 * Standard section heading regexes
 */
const SECTION_HEADERS = [
  { key: 'summary', regex: /^(?:summary|professional\s+summary|profile|about\s+me|career\s+objective|objective)$/i },
  { key: 'experience', regex: /^(?:work\s+experience|professional\s+experience|experience|employment\s+history|work\s+history|career\s+history)$/i },
  { key: 'education', regex: /^(?:education|academic\s+background|academics|qualifications|academic\s+qualifications)$/i },
  { key: 'skills', regex: /^(?:skills|technical\s+skills|core\s+competencies|technologies|tools\s+&?\s+technologies|tech\s+stack)$/i },
  { key: 'projects', regex: /^(?:projects|personal\s+projects|key\s+projects|academic\s+projects|technical\s+projects)$/i },
  { key: 'certifications', regex: /^(?:certifications|licenses\s+&?\s+certifications|certificates|courses)$/i }
];

/**
 * Extracts emails using regex
 */
export function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].trim() : null;
}

/**
 * Extracts phone numbers
 */
export function extractPhone(text) {
  const phoneRegexes = [
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /(?:\+?\d{1,3}[-.\s]?)?\d{10}/
  ];

  for (const regex of phoneRegexes) {
    const match = text.match(regex);
    if (match) {
      const clean = match[0].trim();
      // Verify digits count (between 10 and 15)
      const digits = clean.replace(/\D/g, '');
      if (digits.length >= 10 && digits.length <= 15) {
        return clean;
      }
    }
  }
  return null;
}

/**
 * Extracts web profiles and social links
 */
export function extractLinks(text) {
  const links = {
    linkedin: null,
    github: null,
    portfolio: null,
    others: []
  };

  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+(?:\/[^\s,)]*)?)/gi;
  const matches = text.match(urlRegex) || [];

  for (const rawUrl of matches) {
    const cleanUrl = rawUrl.replace(/[.,;)]+$/, '');
    const fullUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;

    if (/linkedin\.com\/in\/[a-zA-Z0-9-_%]+/i.test(cleanUrl)) {
      if (!links.linkedin) links.linkedin = fullUrl;
    } else if (/github\.com\/[a-zA-Z0-9-_]+/i.test(cleanUrl) && !/github\.com\/?$/i.test(cleanUrl)) {
      if (!links.github) links.github = fullUrl;
    } else if (/portfolio|vercel\.app|netlify\.app|github\.io|me\b/i.test(cleanUrl)) {
      if (!links.portfolio) links.portfolio = fullUrl;
    } else if (!cleanUrl.includes('example.com')) {
      if (links.others.length < 3 && !links.others.includes(fullUrl)) {
        links.others.push(fullUrl);
      }
    }
  }

  return links;
}

/**
 * Extracts Candidate Name using heuristic rules
 */
export function extractName(lines) {
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip lines with emails, links, or digits
    if (line.includes('@') || /https?:|\.com|\.in|\.org/i.test(line) || /\d/.test(line)) {
      continue;
    }

    // Skip standard section headings
    if (SECTION_HEADERS.some(h => h.regex.test(line))) {
      continue;
    }

    // Skip words like Resume, Curriculum Vitae
    if (/^(?:resume|curriculum\s+vitae|cv|profile|bio)$/i.test(line)) {
      continue;
    }

    // Candidate names typically have 2 to 4 words, each capitalized
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4) {
      const isAlpha = words.every(w => /^[A-Z][a-zA-Z.'-]*$/i.test(w));
      if (isAlpha) {
        return words.join(' ');
      }
    } else if (words.length === 1 && /^[A-Z][a-zA-Z]{2,}$/.test(words[0])) {
      return words[0];
    }
  }

  return 'Candidate';
}

/**
 * Detects sections by analyzing headings
 */
export function segmentSections(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim());
  const sections = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    other: []
  };

  let currentSection = 'header';

  for (const line of lines) {
    if (!line) continue;

    // Check if line is a section heading
    let matchedHeader = null;
    const cleanHeaderCandidate = line.replace(/[:\-—_|#*]/g, '').trim();

    for (const h of SECTION_HEADERS) {
      if (h.regex.test(cleanHeaderCandidate)) {
        matchedHeader = h.key;
        break;
      }
    }

    if (matchedHeader) {
      currentSection = matchedHeader;
      continue;
    }

    if (sections[currentSection]) {
      sections[currentSection].push(line);
    } else {
      sections.other.push(line);
    }
  }

  return {
    lines,
    sections: Object.fromEntries(
      Object.entries(sections).map(([k, v]) => [k, v.join('\n')])
    )
  };
}

/**
 * Extracts skills by scanning full text against dictionary & skills section
 */
export function extractSkills(text, skillsSectionText) {
  const extracted = new Map();
  const searchCorpus = (skillsSectionText + '\n\n' + text);

  for (const item of ALL_SKILLS) {
    // Exact word boundary matching
    const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?:^|[\\s,;•/|()])${escaped}(?=[\\s,;•/|()]|$)`, 'i');

    if (pattern.test(searchCorpus)) {
      if (!extracted.has(item.category)) {
        extracted.set(item.category, new Set());
      }
      extracted.get(item.category).add(item.name);
    }
  }

  const result = {};
  for (const [cat, skillSet] of extracted.entries()) {
    result[cat] = Array.from(skillSet);
  }

  // Calculate total skills found
  const total = Object.values(result).reduce((acc, curr) => acc + curr.length, 0);

  return {
    categorized: result,
    all: Object.values(result).flat(),
    total
  };
}

/**
 * Parses Education entries into structured format
 */
export function parseEducation(educationText) {
  if (!educationText) return [];

  const lines = educationText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const degreeRegex = /(?:bachelor|master|b\.?s|m\.?s|b\.?tech|m\.?tech|b\.?e|phd|associate|diploma|higher\s+secondary)/i;
  const yearRegex = /\b(19\d\d|20\d\d)\b(?:\s*[-–—to]+\s*(?:19\d\d|20\d\d|present|current))?/i;

  const entries = [];
  let currentEntry = null;

  for (const line of lines) {
    const isDegree = degreeRegex.test(line);
    const hasYear = yearRegex.test(line);
    const isInstitution = /(?:university|institute|college|school|academy)/i.test(line);

    if (isDegree || isInstitution) {
      if (currentEntry) entries.push(currentEntry);
      
      const yearMatch = line.match(yearRegex);
      currentEntry = {
        title: line.replace(yearRegex, '').trim(),
        period: yearMatch ? yearMatch[0] : null,
        details: []
      };
    } else if (currentEntry) {
      if (!currentEntry.period && hasYear) {
        currentEntry.period = line.match(yearRegex)[0];
      } else {
        currentEntry.details.push(line);
      }
    } else {
      currentEntry = {
        title: line,
        period: null,
        details: []
      };
    }
  }

  if (currentEntry) entries.push(currentEntry);

  return entries.length > 0 ? entries : (lines.length > 0 ? [{ title: lines[0], details: lines.slice(1) }] : []);
}

/**
 * Parses Experience entries into structured format
 */
export function parseExperience(experienceText) {
  if (!experienceText) return [];

  const lines = experienceText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const dateRegex = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)?\.?\s*(?:\d{4})\s*[-–—to]+\s*(?:present|current|\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\.?\s*\d{4})/i;
  
  const entries = [];
  let currentEntry = null;

  for (const line of lines) {
    const hasDate = dateRegex.test(line);
    const isJobTitle = /(?:engineer|developer|lead|architect|manager|designer|intern|specialist|consultant|analyst)/i.test(line);

    if (hasDate || isJobTitle) {
      if (currentEntry) entries.push(currentEntry);

      const dateMatch = line.match(dateRegex);
      currentEntry = {
        role: line.replace(dateRegex, '').replace(/[|•-]\s*$/, '').trim(),
        period: dateMatch ? dateMatch[0] : null,
        highlights: []
      };
    } else if (currentEntry) {
      const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
      if (cleanLine) {
        currentEntry.highlights.push(cleanLine);
      }
    } else {
      currentEntry = {
        role: line,
        period: null,
        highlights: []
      };
    }
  }

  if (currentEntry) entries.push(currentEntry);

  return entries;
}

/**
 * Parses Projects entries
 */
export function parseProjects(projectsText) {
  if (!projectsText) return [];

  const lines = projectsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const entries = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      if (!current) {
        current = { title: 'Highlighted Project', highlights: [] };
      }
      current.highlights.push(line.replace(/^[•\-\*]\s*/, '').trim());
    } else if (line.length < 80 && !line.endsWith('.')) {
      if (current) entries.push(current);
      current = {
        title: line,
        highlights: []
      };
    } else if (current) {
      current.highlights.push(line);
    }
  }

  if (current) entries.push(current);
  return entries;
}

/**
 * Main parser function: takes raw extracted text and converts into structured JSON
 * @param {string} rawText
 * @param {string} fileName
 * @returns {object} structured resume data
 */
export function parseResume(rawText, fileName = '') {
  const { lines, sections } = segmentSections(rawText);

  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const links = extractLinks(rawText);
  const name = extractName(lines);
  const skills = extractSkills(rawText, sections.skills || '');
  const education = parseEducation(sections.education);
  const experience = parseExperience(sections.experience);
  const projects = parseProjects(sections.projects);

  const summary = (sections.summary || sections.header || '')
    .split('\n')
    .filter(l => !l.includes(name) && !l.includes('@') && !l.includes('http') && l.length > 20)
    .slice(0, 4)
    .join(' ')
    .trim();

  return {
    meta: {
      fileName,
      parsedAt: new Date().toISOString(),
      characterCount: rawText.length,
      lineCount: lines.length
    },
    basics: {
      name: name || 'Candidate',
      email: email || null,
      phone: phone || null,
      links: links,
      summary: summary || null
    },
    skills,
    experience,
    education,
    projects,
    rawText
  };
}
