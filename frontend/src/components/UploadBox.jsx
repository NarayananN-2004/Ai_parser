import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Sparkles, Zap, Shield, FileCheck2 } from 'lucide-react';

export default function UploadBox({ onFileSelect, onSampleLoad, loading }) {
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
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="upload-container">
      <div className="hero-section">
        <div className="hero-tag">
          <Sparkles size={15} />
          <span>Client-Side Document Intelligence</span>
        </div>
        <h1 className="hero-title">
          Evaluate Resumes with <span className="text-gradient">AI Parser Score</span>
        </h1>
        <p className="hero-subtitle">
          Instantly evaluate candidate document strength, keyword density, section completeness, and profile readiness directly in your browser.
        </p>
      </div>

      <div className="upload-card-wrapper">
        <div
          className={`upload-card ${isDragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
            onChange={handleChange}
          />

          <div className="upload-icon-box">
            <UploadCloud size={38} />
          </div>

          <h3 className="upload-card-title">Drop your resume here, or browse</h3>
          <p className="upload-card-desc">
            Supports standard PDF, Word (.docx), and Plain Text (.txt) formats
          </p>

          <div className="format-pills">
            <span className="format-pill">PDF</span>
            <span className="format-pill">DOCX</span>
            <span className="format-pill">TXT</span>
          </div>
        </div>

        <div className="sample-trigger-row">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Want to check a score preview?</span>
          <button className="sample-btn" onClick={onSampleLoad} type="button">
            <Zap size={15} />
            <span>Score Sample Resume</span>
          </button>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon"><Zap size={20} /></div>
          <div className="feature-text">
            <h4>Instant 0–100 Score</h4>
            <p>Calculates parser readiness based on industry ATS heuristics &amp; section balance.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><Shield size={20} /></div>
          <div className="feature-text">
            <h4>Complete Privacy</h4>
            <p>Your resume data never leaves your device. No cloud storage, no leaks, 100% private.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FileCheck2 size={20} /></div>
          <div className="feature-text">
            <h4>Category Breakdown</h4>
            <p>Detailed analysis across contacts, skills breadth, experience depth, and academics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
