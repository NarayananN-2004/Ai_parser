import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  Briefcase,
  Zap,
  Sparkles,
  CheckCircle,
  FileCheck,
  ChevronRight,
  Database
} from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_RESUME_TEXT } from '../data/sampleData';

export default function CompareBox({ onCompare, loading, dbStatus }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [usingSampleResume, setUsingSampleResume] = useState(false);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTIONS[0].content);
  const [selectedJdPreset, setSelectedJdPreset] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
      setUsingSampleResume(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setUsingSampleResume(false);
    }
  };

  const handleUseSampleResume = () => {
    setResumeFile(null);
    setUsingSampleResume(true);
  };

  const handleSelectPreset = (idx) => {
    setSelectedJdPreset(idx);
    setJobDescription(SAMPLE_JOB_DESCRIPTIONS[idx].content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeFile && !usingSampleResume) {
      alert('Please upload a resume file (PDF) or select the sample resume.');
      return;
    }
    if (!jobDescription.trim()) {
      alert('Please enter or select a Job Description.');
      return;
    }

    onCompare({
      file: resumeFile,
      useSample: usingSampleResume,
      sampleText: SAMPLE_RESUME_TEXT,
      jobDescription: jobDescription.trim(),
    });
  };

  return (
    <div className="compare-input-section">
      <div className="hero-section">
        <div className="hero-tag">
          <Sparkles size={15} />
          <span>Resume &amp; JD Comparison Engine</span>
        </div>
        <h1 className="hero-title">
          Compare Resume with <span className="text-gradient">Job Description</span>
        </h1>
        <p className="hero-subtitle">
          Upload a candidate resume PDF and supply a target job description to calculate candidate alignment, keyword overlap, and qualification fit via our Express + MongoDB backend.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="compare-dual-panel">
        {/* LEFT PANEL: RESUME PDF */}
        <div className="input-card">
          <div className="input-card-header">
            <div className="card-badge">
              <FileText size={16} />
              <span>1. Resume File (PDF)</span>
            </div>
            {usingSampleResume && (
              <span className="active-pill">Using Sample: Alex Morgan</span>
            )}
            {resumeFile && (
              <span className="active-pill file-loaded">
                <CheckCircle size={12} /> {resumeFile.name}
              </span>
            )}
          </div>

          <div
            className={`upload-zone-compact ${isDragActive ? 'drag-active' : ''} ${resumeFile || usingSampleResume ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="upload-icon-small">
              <UploadCloud size={28} />
            </div>

            {resumeFile ? (
              <div className="file-info-box">
                <FileCheck size={22} color="#10b981" />
                <div>
                  <p className="selected-filename">{resumeFile.name}</p>
                  <span className="file-size-hint">
                    {(resumeFile.size / 1024).toFixed(1)} KB • Click to change
                  </span>
                </div>
              </div>
            ) : usingSampleResume ? (
              <div className="file-info-box">
                <FileCheck size={22} color="#6366f1" />
                <div>
                  <p className="selected-filename">alex_morgan_resume.pdf</p>
                  <span className="file-size-hint">Sample Full Stack Profile Loaded</span>
                </div>
              </div>
            ) : (
              <div>
                <p className="upload-prompt">Drop resume PDF here or click to browse</p>
                <span className="upload-subprompt">Accepts .PDF and .TXT</span>
              </div>
            )}
          </div>

          <div className="panel-actions-row">
            <button
              type="button"
              className={`sample-shortcut-btn ${usingSampleResume ? 'active' : ''}`}
              onClick={handleUseSampleResume}
            >
              <Zap size={14} />
              <span>Use Sample Resume (Alex Morgan)</span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: JOB DESCRIPTION */}
        <div className="input-card">
          <div className="input-card-header">
            <div className="card-badge">
              <Briefcase size={16} />
              <span>2. Target Job Description (JD)</span>
            </div>
            <div className="jd-presets-row">
              {SAMPLE_JOB_DESCRIPTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-btn ${selectedJdPreset === idx ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(idx)}
                >
                  {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="jd-textarea-wrapper">
            <textarea
              className="jd-textarea"
              placeholder="Paste job description text here (requirements, qualifications, tech stack, responsibilities)..."
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setSelectedJdPreset(-1);
              }}
              rows={9}
            />
          </div>

          <div className="jd-meta-hint">
            <span>{jobDescription.length} characters</span>
            <span>Targeting keywords &amp; requirements</span>
          </div>
        </div>

        {/* SUBMIT BUTTON ROW */}
        <div className="compare-submit-row">
          <button type="submit" className="btn-compare-primary" disabled={loading}>
            <Sparkles size={18} />
            <span>{loading ? 'Analyzing with Express Backend...' : 'Compare Resume & JD Score'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
