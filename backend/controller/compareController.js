import { extractTextFromBuffer } from '../utils.js';
import {
  analyzeMatch,
  saveEvaluationRecord,
  fetchRecentEvaluations,
} from '../service/compareService.js';
import { getDBStatus } from '../config/db.js';

/**
 * Handle POST /api/compare
 */
export async function handleCompare(req, res, next) {
  try {
    const file = req.file;
    const { jobDescription, sampleResumeText } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required for comparison.' });
    }

    let resumeText = '';
    let fileName = 'sample_resume.pdf';

    if (file) {
      fileName = file.originalname;
      resumeText = await extractTextFromBuffer(file.buffer, file.originalname);
    } else if (sampleResumeText && sampleResumeText.trim()) {
      resumeText = sampleResumeText.trim();
      fileName = 'alex_morgan_resume.pdf';
    } else {
      return res.status(400).json({
        error: 'Please upload a resume file (PDF) or select the sample resume.',
      });
    }

    // Business logic execution via service layer
    const comparison = analyzeMatch(resumeText, jobDescription.trim());

    // Persistence via service layer
    const savedId = await saveEvaluationRecord(comparison, fileName, jobDescription);

    return res.json({
      success: true,
      evaluationId: savedId,
      fileName,
      dbSaved: !!savedId,
      ...comparison,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Handle GET /api/evaluations
 */
export async function handleGetEvaluations(req, res, next) {
  try {
    const dbConnected = getDBStatus();
    if (!dbConnected) {
      return res.json({ success: true, evaluations: [], dbConnected: false });
    }
    const evaluations = await fetchRecentEvaluations();
    return res.json({ success: true, evaluations, dbConnected: true });
  } catch (err) {
    return next(err);
  }
}
