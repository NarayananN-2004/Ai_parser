import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CompareBox from './components/CompareBox';
import ResultView from './components/ResultView';
import { AlertCircle } from 'lucide-react';
import './App.css';

export default function App() {
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const handleCompare = async ({ file, useSample, sampleText, jobDescription }) => {
    setError(null);
    setLoading(true);
    setLoadingMessage('Uploading & extracting text via Express backend...');

    try {
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);

      if (file) {
        formData.append('resume', file);
      } else if (useSample && sampleText) {
        formData.append('sampleResumeText', sampleText);
      }

      setLoadingMessage('Comparing Resume against Job Description & saving to MongoDB...');

      const apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/compare`
        : '/api/compare';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Comparison request failed.');
      }

      setComparisonResult(data);
      setLoading(false);
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err.message || 'Failed to compare resume with job description.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setComparisonResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <Navbar onReset={handleReset} />

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              Resume &amp; JD Evaluation in Progress
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {loadingMessage}
            </p>
          </div>
        ) : comparisonResult ? (
          <ResultView data={comparisonResult} onReset={handleReset} />
        ) : (
          <CompareBox onCompare={handleCompare} loading={loading} />
        )}
      </main>
    </div>
  );
}
