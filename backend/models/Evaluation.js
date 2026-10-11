import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      default: 'Candidate',
    },
    resumeFileName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      default: 'Target Role',
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    ratingTier: {
      type: String,
      enum: ['Exceptional Match', 'Strong Match', 'Moderate Fit', 'Low Fit'],
      default: 'Moderate Fit',
    },
    matchedSkills: [
      {
        type: String,
      },
    ],
    missingSkills: [
      {
        type: String,
      },
    ],
    breakdowns: [
      {
        category: String,
        score: Number,
        maxScore: Number,
        feedback: [String],
      },
    ],
    resumeExtractedPreview: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
