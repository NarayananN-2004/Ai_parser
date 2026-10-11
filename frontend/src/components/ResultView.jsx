import React from 'react';
import {
  RotateCcw,
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
  Briefcase,
  Check,
  X,
  Database,
  ArrowRight
} from 'lucide-react';

export default function ResultView({ data, onReset }) {
  const {
    candidateName,
    jobTitle,
    matchScore,
    ratingTier,
    badgeColor,
    matchedSkills = [],
    missingSkills = [],
    breakdowns = [],
    fileName,
    dbSaved
  } = data;

  // Compute circular meter parameters
  const radius = 72;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  return (
    <div className="result-container">
      {/* Top Banner / Match Score Hero */}
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
              <span className="score-digit">{matchScore}</span>
              <span className="score-max">/100</span>
            </div>
          </div>

          <div className="score-hero-details">
            <div
              className="score-tag-badge"
              style={{ borderColor: badgeColor, color: badgeColor, background: `${badgeColor}15` }}
            >
              <Award size={14} />
              <span>{ratingTier}</span>
            </div>
            <h2 className="score-candidate-name">{candidateName || 'Candidate'}</h2>
            <div className="match-role-badge">
              <Briefcase size={14} color="#06b6d4" />
              <span>Target Role: <strong>{jobTitle}</strong></span>
            </div>
            <div className="score-file-pill">
              <FileText size={13} />
              <span>Resume: {fileName || 'Uploaded PDF'}</span>
              {dbSaved && (
                <>
                  <span>•</span>
                  <Database size={12} color="#10b981" />
                  <span style={{ color: '#10b981' }}>Saved to MongoDB</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="score-hero-actions">
          <button className="btn-primary" onClick={onReset} title="Compare Another">
            <RotateCcw size={16} />
            <span>New Comparison</span>
          </button>
        </div>
      </div>

      {/* Skills Overlap & Gaps */}
      <div className="skills-comparison-row">
        <div className="skills-match-card matched-card">
          <div className="card-heading-clean">
            <Check size={16} color="#10b981" />
            <h4>Matched JD Requirements ({matchedSkills.length})</h4>
          </div>
          {matchedSkills.length > 0 ? (
            <div className="skill-pills-wrap">
              {matchedSkills.map((s) => (
                <span key={s} className="pill matched-pill">
                  ✓ {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-notice">No exact skill keywords matched with JD.</p>
          )}
        </div>

        <div className="skills-match-card missing-card">
          <div className="card-heading-clean">
            <X size={16} color="#f43f5e" />
            <h4>Missing / Recommended Keywords ({missingSkills.length})</h4>
          </div>
          {missingSkills.length > 0 ? (
            <div className="skill-pills-wrap">
              {missingSkills.map((s) => (
                <span key={s} className="pill missing-pill">
                  + {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-notice" style={{ color: '#10b981' }}>
              All target skills from JD identified in the resume!
            </p>
          )}
        </div>
      </div>

      {/* Category Breakdown Score Cards */}
      <div className="score-breakdown-section">
        <div className="section-header-row">
          <TrendingUp size={20} className="section-icon-glow" />
          <h3 className="section-title">Fit Breakdown &amp; Alignment Analysis</h3>
        </div>

        <div className="breakdown-grid">
          {breakdowns.map((cat, idx) => {
            const percent = Math.round((cat.score / cat.maxScore) * 100);
            return (
              <div key={idx} className="breakdown-card">
                <div className="breakdown-card-top">
                  <div>
                    <h4 className="breakdown-cat-title">{cat.category}</h4>
                    <span className="breakdown-status-label">{percent}% alignment</span>
                  </div>
                  <div className="breakdown-score-badge">
                    <span className="score-pts">{cat.score}</span>
                    <span className="score-denom">/{cat.maxScore}</span>
                  </div>
                </div>

                <div className="breakdown-progress-track">
                  <div
                    className="breakdown-progress-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor:
                        percent >= 75
                          ? 'var(--accent-emerald)'
                          : percent >= 50
                          ? 'var(--primary)'
                          : 'var(--accent-amber)',
                    }}
                  />
                </div>

                <ul className="breakdown-feedback-list">
                  {cat.feedback &&
                    cat.feedback.map((item, fIdx) => (
                      <li key={fIdx}>
                        {fIdx === 0 ? (
                          <CheckCircle2 size={13} color="var(--accent-emerald)" />
                        ) : (
                          <ArrowRight size={13} color="var(--primary)" />
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
