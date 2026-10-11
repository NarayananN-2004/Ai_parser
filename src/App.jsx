import React, { useState } from 'react';
import Navbar from './components/Navbar';
import UploadBox from './components/UploadBox';
import ResultView from './components/ResultView';
import { extractText } from './lib/extractText';
import { parseResume } from './lib/parseResume';
import { calculateResumeScore } from './lib/scoreResume';
import { SAMPLE_RESUME_TEXT } from './data/sampleResume';
import { AlertCircle, Loader2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const handleFileSelect = async (file) => {
    setError(null);
    setLoading(true);
    setLoadingMessage(`Extracting text from ${file.name}...`);

    try {
      // Step 1: Client-side text extraction
      const rawText = await extractText(file);
      
      setLoadingMessage('Calculating AI parser score & document quality...');
      
      // Step 2: Rule-based parsing
      const result = parseResume(rawText, file.name);

      // Step 3: Compute AI parser score
      const scoreResult = calculateResumeScore(result);
      result.scoreResult = scoreResult;
      
      // Smooth micro-delay for realistic UI feedback
      setTimeout(() => {
        setParsedData(result);
        setLoading(false);
      }, 400);
    } catch (err) {
      console.error('Parsing error:', err);
      setError(err.message || 'Failed to process resume file.');
      setLoading(false);
    }
  };

  const handleSampleLoad = () => {
    setError(null);
    setLoading(true);
    setLoadingMessage('Evaluating sample resume score...');

    setTimeout(() => {
      const result = parseResume(SAMPLE_RESUME_TEXT, 'alex_morgan_sample_resume.pdf');
      result.scoreResult = calculateResumeScore(result);
      setParsedData(result);
      setLoading(false);
    }, 450);
  };

  const handleReset = () => {
    setParsedData(null);
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
              Document Intelligence in Progress
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {loadingMessage}
            </p>
          </div>
        ) : parsedData ? (
          <ResultView data={parsedData} onReset={handleReset} />
        ) : (
          <UploadBox
            onFileSelect={handleFileSelect}
            onSampleLoad={handleSampleLoad}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}
