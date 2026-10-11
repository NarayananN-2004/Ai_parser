import { extractCandidateName, extractJobTitle, extractSkills } from '../utils.js';
import { Evaluation } from '../models/Evaluation.js';
import { getDBStatus } from '../config/db.js';

/**
 * Compare resume text against job description text
 * @param {string} resumeText
 * @param {string} jdText
 * @returns {object}
 */
export function analyzeMatch(resumeText, jdText) {
  const candidateName = extractCandidateName(resumeText);
  const jobTitle = extractJobTitle(jdText);

  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jdText);

  // Extract individual words for contextual overlap
  const jdWords = jdText.toLowerCase().match(/\b[a-z]{3,15}\b/g) || [];
  const resumeLower = resumeText.toLowerCase();

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of jdSkills) {
    if (resumeSkills.has(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // 1. Skill Match Component (40 pts)
  let skillScore = 0;
  if (jdSkills.size > 0) {
    const matchRatio = matchedSkills.length / jdSkills.size;
    skillScore = Math.round(matchRatio * 40);
  } else {
    skillScore = Math.min(40, resumeSkills.size * 3);
  }

  // 2. Keyword & Responsibility Overlap (25 pts)
  const uniqueJdKeywords = Array.from(new Set(jdWords)).filter(
    (w) => !['and', 'the', 'for', 'with', 'you', 'will', 'that', 'this', 'have', 'from', 'our', 'team', 'work'].includes(w)
  );
  let overlapHits = 0;
  for (const kw of uniqueJdKeywords.slice(0, 50)) {
    if (resumeLower.includes(kw)) {
      overlapHits++;
    }
  }
  const keywordScore = Math.min(
    25,
    uniqueJdKeywords.length > 0 ? Math.round((overlapHits / Math.min(uniqueJdKeywords.length, 50)) * 25) : 15
  );

  // 3. Experience & Seniority Fit (20 pts)
  let expScore = 12;
  if (/senior|lead|architect/i.test(jdText)) {
    if (/senior|lead|years|architect|spearheaded|architected/i.test(resumeText)) {
      expScore = 20;
    } else {
      expScore = 10;
    }
  } else {
    expScore = 18;
  }

  // 4. Education & Formal Alignment (15 pts)
  let eduScore = 10;
  if (/degree|bachelor|master|computer science|engineering/i.test(jdText)) {
    if (/bachelor|master|b\.?s|b\.?tech|computer science|degree/i.test(resumeText)) {
      eduScore = 15;
    } else {
      eduScore = 8;
    }
  } else {
    eduScore = 15;
  }

  const matchScore = Math.min(100, Math.max(15, skillScore + keywordScore + expScore + eduScore));

  let ratingTier = 'Moderate Fit';
  let badgeColor = '#f59e0b';
  if (matchScore >= 80) {
    ratingTier = 'Exceptional Match';
    badgeColor = '#10b981';
  } else if (matchScore >= 65) {
    ratingTier = 'Strong Match';
    badgeColor = '#6366f1';
  } else if (matchScore < 45) {
    ratingTier = 'Low Fit';
    badgeColor = '#f43f5e';
  }

  const breakdowns = [
    {
      category: 'Core Skills Match',
      score: skillScore,
      maxScore: 40,
      feedback: [
        `${matchedSkills.length} of ${jdSkills.size || 'required'} target skills identified in resume`,
        missingSkills.length > 0
          ? `Missing: ${missingSkills.slice(0, 4).join(', ')}`
          : 'High keyword alignment with JD requirements',
      ],
    },
    {
      category: 'Role & Responsibilities Overlap',
      score: keywordScore,
      maxScore: 25,
      feedback: [
        `${overlapHits} context matches against target job description language`,
        'Relevant terminology present across experience highlights',
      ],
    },
    {
      category: 'Experience & Seniority Fit',
      score: expScore,
      maxScore: 20,
      feedback: [
        expScore >= 16 ? 'Seniority level aligns with JD expectations' : 'Experience level may require closer alignment',
      ],
    },
    {
      category: 'Education & Qualifications',
      score: eduScore,
      maxScore: 15,
      feedback: [
        eduScore >= 12 ? 'Academic background satisfies JD prerequisites' : 'Ensure degree/certifications are prominently displayed',
      ],
    },
  ];

  return {
    candidateName,
    jobTitle,
    matchScore,
    ratingTier,
    badgeColor,
    matchedSkills,
    missingSkills,
    breakdowns,
    resumeExtractedPreview: resumeText.slice(0, 600) + '...',
  };
}

/**
 * Persists an evaluation record to MongoDB if database connection is available
 */
export async function saveEvaluationRecord(comparison, fileName, jobDescription) {
  if (!getDBStatus()) return null;

  try {
    const evaluationDoc = new Evaluation({
      candidateName: comparison.candidateName,
      resumeFileName: fileName,
      jobTitle: comparison.jobTitle,
      jobDescription: jobDescription.trim(),
      matchScore: comparison.matchScore,
      ratingTier: comparison.ratingTier,
      matchedSkills: comparison.matchedSkills,
      missingSkills: comparison.missingSkills,
      breakdowns: comparison.breakdowns,
      resumeExtractedPreview: comparison.resumeExtractedPreview,
    });
    const saved = await evaluationDoc.save();
    return saved._id;
  } catch (err) {
    console.warn('Could not save evaluation to MongoDB:', err.message);
    return null;
  }
}

/**
 * Fetches recent evaluations
 */
export async function fetchRecentEvaluations(limit = 10) {
  if (!getDBStatus()) return [];
  return Evaluation.find().sort({ createdAt: -1 }).limit(limit);
}
