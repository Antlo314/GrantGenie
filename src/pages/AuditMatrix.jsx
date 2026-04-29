import React from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { AlertTriangle, CheckCircle, Info, ShieldCheck, XCircle } from 'lucide-react';
import './AuditMatrix.css';

const AuditMatrix = () => {
  return (
    <div className="page-container">
      <Navbar title="Audit Matrix" />
      
      <div className="page-content animate-fade-in">
        
        <div className="audit-header">
          <div className="audit-title-section">
            <ShieldCheck className="text-gold" size={32} />
            <div>
              <h3 className="font-display">Pre-Submission Audit: Lumina Foundation</h3>
              <p className="text-muted">Draft evaluated against Lumina's 2026 grading rubric.</p>
            </div>
          </div>
          <button className="btn btn-primary">Export Audit Report</button>
        </div>

        <div className="audit-grid">
          
          {/* Main Score Circular Progress */}
          <GlassCard className="score-panel flex-col items-center justify-center">
            <h4 className="font-display text-muted text-center mb-4">Overall Submission Readiness</h4>
            <div className="circular-progress">
              <svg viewBox="0 0 100 100">
                <circle className="progress-bg" cx="50" cy="50" r="45"></circle>
                <circle className="progress-value" cx="50" cy="50" r="45" strokeDasharray="282.7" strokeDashoffset="42.4"></circle>
              </svg>
              <div className="progress-text">
                <span className="score font-display">85</span>
                <span className="max-score">/100</span>
              </div>
            </div>
            <p className="mt-4 text-center text-primary">Solid draft. Fix the critical warnings below before submission.</p>
          </GlassCard>

          {/* Detailed Breakdown */}
          <GlassCard className="breakdown-panel">
            <h4 className="font-display mb-4">Rubric Breakdown</h4>
            
            <div className="rubric-item">
              <div className="rubric-header">
                <span className="rubric-label">Narrative Strength & Tone</span>
                <span className="rubric-score text-emerald">28/30</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar bg-emerald" style={{ width: '93%' }}></div>
              </div>
            </div>

            <div className="rubric-item">
              <div className="rubric-header">
                <span className="rubric-label">Alignment with Funder Goals</span>
                <span className="rubric-score text-emerald">25/25</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar bg-emerald" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="rubric-item">
              <div className="rubric-header">
                <span className="rubric-label">Budget Feasibility</span>
                <span className="rubric-score text-gold">15/25</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar bg-gold" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="rubric-item">
              <div className="rubric-header">
                <span className="rubric-label">Compliance & Documentation</span>
                <span className="rubric-score text-primary">17/20</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
              </div>
            </div>

          </GlassCard>

          {/* Actionable Feedback */}
          <GlassCard className="feedback-panel">
            <h4 className="font-display mb-4">Oracle Feedback</h4>
            
            <div className="feedback-list">
              <div className="feedback-item warning">
                <AlertTriangle className="feedback-icon" size={20} />
                <div className="feedback-content">
                  <h5>Budget Justification Weak</h5>
                  <p>The narrative mentions deploying 500 terminals, but the attached budget template only accounts for 350. Please align the narrative with the financial documentation.</p>
                  <button className="btn-ghost text-sm mt-2 text-gold">Auto-Fix with Oracle Writer</button>
                </div>
              </div>

              <div className="feedback-item error">
                <XCircle className="feedback-icon" size={20} />
                <div className="feedback-content">
                  <h5>Missing Vault Document</h5>
                  <p>Lumina Foundation requires a signed Board of Directors list. The current list in the Data Vault expired in 2024.</p>
                  <button className="btn-ghost text-sm mt-2 text-gold">Upload to Vault</button>
                </div>
              </div>

              <div className="feedback-item success">
                <CheckCircle className="feedback-icon" size={20} />
                <div className="feedback-content">
                  <h5>Strong Impact Metrics</h5>
                  <p>Excellent use of the 2025 Impact Report. Quantitative data (40% increase) significantly strengthens the proposal.</p>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default AuditMatrix;
