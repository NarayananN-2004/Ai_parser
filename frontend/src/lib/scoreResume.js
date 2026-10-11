/**
 * Computes an AI Parser Resume Score (0 - 100) based on resume completeness,
 * contact detail presence, skill depth, experience, education, and project records.
 *
 * Weighting:
 * - Contact & Identity: 20 pts
 * - Skills & Tech Stack: 30 pts
 * - Work Experience: 25 pts
 * - Education & Academics: 15 pts
 * - Projects & Practical Work: 10 pts
 */
export function calculateResumeScore(parsedData) {
  const { basics, skills, experience, education, projects, rawText } = parsedData;

  const breakdowns = [];

  // 1. Contact & Identity (20 pts)
  let contactScore = 0;
  const contactItems = [];
  if (basics.name && basics.name !== 'Candidate') {
    contactScore += 6;
    contactItems.push('Candidate name detected');
  } else {
    contactItems.push('Missing explicit candidate name');
  }

  if (basics.email) {
    contactScore += 5;
    contactItems.push('Professional email verified');
  } else {
    contactItems.push('Missing email address');
  }

  if (basics.phone) {
    contactScore += 4;
    contactItems.push('Phone number included');
  } else {
    contactItems.push('Missing contact phone number');
  }

  const linksCount = (basics.links?.linkedin ? 1 : 0) + (basics.links?.github ? 1 : 0) + (basics.links?.portfolio ? 1 : 0);
  if (linksCount >= 2) {
    contactScore += 5;
    contactItems.push('Multiple portfolio/social profiles present');
  } else if (linksCount === 1) {
    contactScore += 3;
    contactItems.push('Single web profile detected');
  } else {
    contactItems.push('No LinkedIn/GitHub/Portfolio link found');
  }

  breakdowns.push({
    category: 'Contact & Profiles',
    score: Math.min(20, contactScore),
    maxScore: 20,
    status: contactScore >= 16 ? 'excellent' : contactScore >= 11 ? 'good' : 'warning',
    feedback: contactItems
  });

  // 2. Skills & Technical Breadth (30 pts)
  let skillsScore = 0;
  const skillItems = [];
  const skillCount = skills?.total || 0;
  const categoriesCount = Object.keys(skills?.categorized || {}).length;

  if (skillCount >= 15) {
    skillsScore += 18;
    skillItems.push(`High skill density (${skillCount} keywords identified)`);
  } else if (skillCount >= 8) {
    skillsScore += 14;
    skillItems.push(`Moderate skill depth (${skillCount} keywords identified)`);
  } else if (skillCount >= 3) {
    skillsScore += 8;
    skillItems.push(`Limited skill keywords (${skillCount} found)`);
  } else {
    skillsScore += 2;
    skillItems.push('Very few technical skills identified');
  }

  if (categoriesCount >= 4) {
    skillsScore += 12;
    skillItems.push(`Broad domain coverage (${categoriesCount} distinct domains)`);
  } else if (categoriesCount >= 2) {
    skillsScore += 8;
    skillItems.push(`Balanced coverage across ${categoriesCount} skill areas`);
  } else {
    skillsScore += 3;
    skillItems.push('Skills restricted to only 1 domain');
  }

  breakdowns.push({
    category: 'Skills & Keywords',
    score: Math.min(30, skillsScore),
    maxScore: 30,
    status: skillsScore >= 24 ? 'excellent' : skillsScore >= 16 ? 'good' : 'warning',
    feedback: skillItems
  });

  // 3. Work Experience (25 pts)
  let expScore = 0;
  const expItems = [];
  const expEntries = experience || [];

  if (expEntries.length >= 3) {
    expScore += 14;
    expItems.push(`${expEntries.length} career positions identified`);
  } else if (expEntries.length >= 1) {
    expScore += 10;
    expItems.push(`${expEntries.length} employment role(s) logged`);
  } else {
    expItems.push('No recognized work experience section');
  }

  const datedEntries = expEntries.filter(e => e.period);
  if (datedEntries.length >= 1) {
    expScore += 6;
    expItems.push('Clear employment duration timelines');
  }

  const totalBulletPoints = expEntries.reduce((acc, curr) => acc + (curr.highlights?.length || 0), 0);
  if (totalBulletPoints >= 6) {
    expScore += 5;
    expItems.push('Quantified achievements and bullet points');
  } else if (totalBulletPoints >= 2) {
    expScore += 3;
    expItems.push('Brief role descriptions provided');
  }

  breakdowns.push({
    category: 'Work Experience',
    score: Math.min(25, expScore),
    maxScore: 25,
    status: expScore >= 20 ? 'excellent' : expScore >= 12 ? 'good' : 'warning',
    feedback: expItems
  });

  // 4. Education & Qualifications (15 pts)
  let eduScore = 0;
  const eduItems = [];
  const eduEntries = education || [];

  if (eduEntries.length >= 1) {
    eduScore += 10;
    eduItems.push(`Degree or institution identified (${eduEntries[0].title || 'Academics'})`);
  } else {
    eduItems.push('No formal education section detected');
  }

  if (eduEntries.some(e => e.period)) {
    eduScore += 5;
    eduItems.push('Graduation / study period specified');
  }

  breakdowns.push({
    category: 'Education & Academics',
    score: Math.min(15, eduScore),
    maxScore: 15,
    status: eduScore >= 12 ? 'excellent' : eduScore >= 8 ? 'good' : 'warning',
    feedback: eduItems
  });

  // 5. Projects & Practical Portfolio (10 pts)
  let projScore = 0;
  const projItems = [];
  const projEntries = projects || [];

  if (projEntries.length >= 2) {
    projScore += 10;
    projItems.push(`${projEntries.length} notable technical projects showcased`);
  } else if (projEntries.length === 1) {
    projScore += 7;
    projItems.push('1 technical project highlighted');
  } else {
    projItems.push('No dedicated projects section');
  }

  breakdowns.push({
    category: 'Projects & Highlights',
    score: Math.min(10, projScore),
    maxScore: 10,
    status: projScore >= 8 ? 'excellent' : projScore >= 5 ? 'good' : 'warning',
    feedback: projItems
  });

  const totalScore = Math.min(
    100,
    breakdowns.reduce((acc, b) => acc + b.score, 0)
  );

  let ratingTier = 'Needs Improvement';
  let badgeColor = '#f43f5e';
  let ratingSummary = 'The resume is missing key sections or contact information.';

  if (totalScore >= 85) {
    ratingTier = 'Exceptional';
    badgeColor = '#10b981';
    ratingSummary = 'Optimized for modern ATS and AI screening filters with strong keyword density.';
  } else if (totalScore >= 70) {
    ratingTier = 'Strong Candidate';
    badgeColor = '#6366f1';
    ratingSummary = 'Well-structured resume with solid core competencies and experience details.';
  } else if (totalScore >= 50) {
    ratingTier = 'Moderate / Average';
    badgeColor = '#f59e0b';
    ratingSummary = 'Good foundation, but adding more quantifiable bullet points and skills will boost your score.';
  }

  return {
    totalScore,
    ratingTier,
    badgeColor,
    ratingSummary,
    breakdowns
  };
}
