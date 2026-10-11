import express from 'express';
import { uploadSingleResume } from '../middleware/uploadMiddleware.js';
import {
  handleCompare,
  handleGetEvaluations,
} from '../controller/compareController.js';

const router = express.Router();

router.post('/compare', uploadSingleResume, handleCompare);
router.get('/evaluations', handleGetEvaluations);

export default router;
