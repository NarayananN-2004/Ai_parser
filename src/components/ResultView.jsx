import React from 'react';
import {
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
  UserCheck
} from 'lucide-react';

export default function ResultView({ data, onReset }) {
  const { basics, meta, scoreResult } = data;
  const { totalScore, ratingTier, badgeColor, ratingSummary, breakdowns } = scoreResult;

  // Compute circular meter parameters
  const radius = 72;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="result-container">
      {/* Top Banner / Candidate Score Hero */}
      <div className="score-hero-card">
        <div className="score-hero-left">
          <div className="score-circle-wrapper">
            <svg height={radius * 2} width={radius * 2} className="score-svg-meter">
              <circle
                stroke="rgba(255, 255, 255, 0.08)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={badgeColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                transform={`rotate(-90 ${radius} ${radius})`}
              />
            </svg>
            <div className="score-number-center">
              <span className="score-digit">{totalScore}</span>
              <span className="score-max">/100</span>
            </div>
          </div>

          <div className="score-hero-details">
            <div className="score-tag-badge" style={{ borderColor: badgeColor, color: badgeColor, background: `${badgeColor}15` }}>
              <Award size={14} />
              <span>{ratingTier}</span>
            </div>
            <h2 className="score-candidate-name">{basics.name || 'Candidate'}</h2>
            <p className="score-summary-desc">{ratingSummary}</p>
            <div className="score-file-pill">
              <FileText size={13} />
              <span>{meta.fileName || 'Uploaded Resume'}</span>
            </div>
          </div>
        </div>

        <div className="score-hero-actions">
          <button className="btn-primary" onClick={onReset} title="Score Another Resume">
            <RotateCcw size={16} />
            <span>Score Another Resume</span>
          </button>
        </div>
      </div>

      {/* Category Breakdown Score Cards */}
      <div className="score-breakdown-section">
        <div className="section-header-row">
          <TrendingUp size={20} className="section-icon-glow" />
          <h3 className="section-title">Score Breakdown &amp; Analysis</h3>
        </div>

        <div className="breakdown-grid">
          {breakdowns.map((cat, idx) => {
            const percent = Math.round((cat.score / cat.maxScore) * 100);
            return (
              <div key={idx} className="breakdown-card">
                <div className="breakdown-card-top">
                  <div>
                    <h4 className="breakdown-cat-title">{cat.category}</h4>
                    <span className="breakdown-status-label">{percent}% strength</span>
                  </div>
                  <div className="breakdown-score-badge">
                    <span className="score-pts">{cat.score}</span>
                    <span className="score-denom">/{cat.maxScore}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="breakdown-progress-track">
                  <div
                    className="breakdown-progress-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor:
                        percent >= 80 ? 'var(--accent-emerald)' : percent >= 55 ? 'var(--primary)' : 'var(--accent-amber)'
                    }}
                  />
                </div>

                {/* Feedback bullets */}
                <ul className="breakdown-feedback-list">
                  {cat.feedback.map((item, fIdx) => (
                    <li key={fIdx}>
                      {cat.status === 'warning' && fIdx === cat.feedback.length - 1 ? (
                        <AlertTriangle size={13} color="var(--accent-amber)" />
                      ) : (
                        <CheckCircle2 size={13} color="var(--accent-emerald)" />
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
