import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Code,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';

// Crisp brand icon SVGs
const LinkedinIcon = ({ size = 14, color = '#60a5fa' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 14, color = '#e2e8f0' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function ResultView({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const candidateSafeName = (data.basics?.name || 'resume')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute('download', `${candidateSafeName}_parsed.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const { basics, skills, experience, education, projects, meta, rawText } = data;
  const initials = basics.name
    ? basics.name.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'CV';

  return (
    <div className="result-container">
      {/* Top Banner / Candidate Summary Card */}
      <div className="candidate-header-card">
        <div className="candidate-main-info">
          <div className="candidate-avatar-row">
            <div className="candidate-avatar">{initials}</div>
            <div>
              <h2 className="candidate-name">{basics.name || 'Candidate'}</h2>
              <div className="candidate-meta-badges">
                <span>{meta.fileName || 'Uploaded Resume'}</span>
                <span>•</span>
                <span>{skills.total} skills identified</span>
              </div>
            </div>
          </div>

          <div className="contact-pills-row">
            {basics.email && (
              <a href={`mailto:${basics.email}`} className="contact-pill">
                <Mail size={14} color="#818cf8" />
                <span>{basics.email}</span>
              </a>
            )}
            {basics.phone && (
              <a href={`tel:${basics.phone}`} className="contact-pill">
                <Phone size={14} color="#34d399" />
                <span>{basics.phone}</span>
              </a>
            )}
            {basics.links?.linkedin && (
              <a
                href={basics.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-pill"
              >
                <LinkedinIcon size={14} color="#60a5fa" />
                <span>LinkedIn</span>
              </a>
            )}
            {basics.links?.github && (
              <a
                href={basics.links.github}
                target="_blank"
                rel="noreferrer"
                className="contact-pill"
              >
                <GithubIcon size={14} color="#e2e8f0" />
                <span>GitHub</span>
              </a>
            )}
            {basics.links?.portfolio && (
              <a
                href={basics.links.portfolio}
                target="_blank"
                rel="noreferrer"
                className="contact-pill"
              >
                <Globe size={14} color="#06b6d4" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>

        <div className="candidate-actions">
          <button className="btn-secondary" onClick={handleCopyJSON} title="Copy JSON">
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
          <button className="btn-primary" onClick={handleDownloadJSON} title="Download JSON">
            <Download size={16} />
            <span>Download JSON</span>
          </button>
          <button className="btn-secondary" onClick={onReset} title="Upload Another">
            <RotateCcw size={16} />
            <span>New Parse</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Sparkles size={16} />
          <span>Overview &amp; Skills</span>
          <span className="tab-count-badge">{skills.total}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          <Briefcase size={16} />
          <span>Experience</span>
          <span className="tab-count-badge">{experience.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          <GraduationCap size={16} />
          <span>Education</span>
          <span className="tab-count-badge">{education.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FolderGit2 size={16} />
          <span>Projects</span>
          <span className="tab-count-badge">{projects.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          <Code size={16} />
          <span>JSON Schema</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          <FileText size={16} />
          <span>Extracted Text</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-panel">
        {/* TAB 1: OVERVIEW & SKILLS */}
        {activeTab === 'overview' && (
          <>
            {basics.summary && (
              <div className="content-card">
                <div className="card-title-row">
                  <Sparkles size={18} className="card-title-icon" />
                  <h3>Professional Summary</h3>
                </div>
                <p className="summary-text">{basics.summary}</p>
              </div>
            )}

            <div className="content-card">
              <div className="card-title-row">
                <Code size={18} className="card-title-icon" />
                <h3>Extracted Technical Skills ({skills.total})</h3>
              </div>

              {Object.keys(skills.categorized || {}).length === 0 ? (
                <p className="empty-tab-notice">No recognized skills extracted.</p>
              ) : (
                Object.entries(skills.categorized).map(([category, list]) => (
                  <div key={category} className="skill-category-group">
                    <h4 className="category-name">{category}</h4>
                    <div className="skills-badges-wrap">
                      {list.map(skill => (
                        <span key={skill} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* TAB 2: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="content-card">
            <div className="card-title-row">
              <Briefcase size={18} className="card-title-icon" />
              <h3>Work History</h3>
            </div>

            {experience.length === 0 ? (
              <p className="empty-tab-notice">No experience section detected.</p>
            ) : (
              experience.map((exp, index) => (
                <div key={index} className="timeline-card">
                  <div className="timeline-card-header">
                    <span className="timeline-title">{exp.role}</span>
                    {exp.period && <span className="timeline-period">{exp.period}</span>}
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="highlights-list">
                      {exp.highlights.map((item, hIdx) => (
                        <li key={hIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: EDUCATION */}
        {activeTab === 'education' && (
          <div className="content-card">
            <div className="card-title-row">
              <GraduationCap size={18} className="card-title-icon" />
              <h3>Education &amp; Qualifications</h3>
            </div>

            {education.length === 0 ? (
              <p className="empty-tab-notice">No education entries detected.</p>
            ) : (
              education.map((edu, index) => (
                <div key={index} className="timeline-card">
                  <div className="timeline-card-header">
                    <span className="timeline-title">{edu.title}</span>
                    {edu.period && <span className="timeline-period">{edu.period}</span>}
                  </div>
                  {edu.details && edu.details.length > 0 && (
                    <ul className="highlights-list">
                      {edu.details.map((item, dIdx) => (
                        <li key={dIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="content-card">
            <div className="card-title-row">
              <FolderGit2 size={18} className="card-title-icon" />
              <h3>Projects</h3>
            </div>

            {projects.length === 0 ? (
              <p className="empty-tab-notice">No project section detected.</p>
            ) : (
              projects.map((proj, index) => (
                <div key={index} className="timeline-card">
                  <div className="timeline-card-header">
                    <span className="timeline-title">{proj.title}</span>
                  </div>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="highlights-list">
                      {proj.highlights.map((item, hIdx) => (
                        <li key={hIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: JSON SCHEMA */}
        {activeTab === 'json' && (
          <div className="content-card">
            <div className="card-title-row" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Code size={18} className="card-title-icon" />
                <h3>Standardized JSON Payload</h3>
              </div>
              <button className="btn-secondary" onClick={handleCopyJSON} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="json-viewer-box">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {/* TAB 6: RAW EXTRACTED TEXT */}
        {activeTab === 'raw' && (
          <div className="content-card">
            <div className="card-title-row">
              <FileText size={18} className="card-title-icon" />
              <h3>Client-Side Extracted Plain Text</h3>
            </div>
            <div className="raw-text-viewer">
              {rawText || 'No text extracted.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
