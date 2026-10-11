import React from 'react';
import { FileText, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ onReset }) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="logo-group" onClick={onReset} style={{ cursor: 'pointer' }}>
          <div className="logo-icon-wrapper">
            <FileText size={22} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="logo-title">ResumeAI</span>
            <span className="logo-badge">Parser</span>
          </div>
        </div>

        <div className="nav-actions">
          <div className="privacy-badge">
            <span className="pulse-dot"></span>
            <ShieldCheck size={14} />
            <span>100% In-Browser &amp; Private</span>
          </div>
        </div>
      </div>
    </header>
  );
}
