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
          Parse Resumes with <span className="text-gradient">Instant Precision</span>
        </h1>
        <p className="hero-subtitle">
          Extract structured candidate profiles, skills, education, and experience directly in your browser. Zero backend, no tracking, sub-second parsing.
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
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Want to preview without a file?</span>
          <button className="sample-btn" onClick={onSampleLoad} type="button">
            <Zap size={15} />
            <span>Load Sample Resume</span>
          </button>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon"><Zap size={20} /></div>
          <div className="feature-text">
            <h4>Real-Time Extraction</h4>
            <p>Parses within milliseconds via client-side heuristics and regex dictionary matching.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><Shield size={20} /></div>
          <div className="feature-text">
            <h4>Complete Privacy</h4>
            <p>Your resume data never leaves your device. No cloud storage, no leaks, 100% safe.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FileCheck2 size={20} /></div>
          <div className="feature-text">
            <h4>Structured JSON Export</h4>
            <p>Instant 1-click clipboard copy and formatted JSON download for HR pipelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
