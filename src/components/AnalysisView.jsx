import React, { useState } from 'react';
import axios from 'axios';
import {
  FileText, Flag, CheckCircle2, MessageSquare,
  AlertTriangle, ShieldCheck, Zap, Brain, Tag,
} from 'lucide-react';
import GaugeChart from './GaugeChart';
import HighlightedText from './HighlightedText';

const SEVERITY_CONFIG = {
  None:     { className: 'badge-safe',     label: '✅ Safe' },
  Low:      { className: 'badge-low',      label: '⬇ Low Severity' },
  Medium:   { className: 'badge-medium',   label: '⚠ Medium Severity' },
  High:     { className: 'badge-high',     label: '🔴 High Severity' },
  Critical: { className: 'badge-critical', label: '🚨 Critical' },
};

const AnalysisView = ({ result, scannedText, apiUrl }) => {
  const [downloading, setDownloading] = useState(false);
  const [reporting, setReporting]     = useState(false);
  const [reported, setReported]       = useState(false);

  const {
    label, confidence, toxic_keywords, polite_suggestion,
    categories = [], severity = 'None',
    is_sarcastic = false, harassment_type = 'None',
  } = result;

  const isToxic = label === 'Toxic';
  const sevConf = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.None;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(`${apiUrl}/report/pdf`, {
        text: scannedText, label, confidence, toxic_keywords,
      }, { responseType: 'blob' });

      const url  = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', 'CyberComplaint_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { alert('Failed to generate PDF Report.'); }
    finally  { setDownloading(false); }
  };

  const handleReportNGO = async () => {
    setReporting(true);
    try {
      await axios.post(`${apiUrl}/report/ngo`, { text: scannedText, label });
      setReported(true);
    } catch { alert('Failed to report to NGO.'); }
    finally  { setReporting(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ── Top row: Gauge + Meta ──────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)',
        gap: '1rem',
      }}
        className="analysis-grid"
      >
        {/* Gauge Card */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '.5rem', fontSize: '.95rem' }}>
            Toxicity Score
          </h3>
          <GaugeChart confidence={confidence} label={label} />
        </div>

        {/* Meta / Details Card */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.85rem' }}>

          {/* Status Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.5rem' }}>
            <span className={`badge ${isToxic ? 'badge-toxic' : 'badge-safe'}`}>
              {isToxic ? <AlertTriangle size={11} /> : <ShieldCheck size={11} />}
              {label}
            </span>
            <span className={`badge ${sevConf.className}`}>
              {sevConf.label}
            </span>
            {is_sarcastic && (
              <span className="badge badge-sarcasm">
                <Brain size={11} /> Sarcasm Detected
              </span>
            )}
            {isToxic && harassment_type !== 'None' && (
              <span className="badge badge-category">
                <Zap size={11} /> {harassment_type}
              </span>
            )}
          </div>

          {/* Category Tags */}
          {categories.length > 0 && (
            <div>
              <p style={{ fontSize: '.72rem', color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.35rem' }}>
                <Tag size={11} style={{ display: 'inline', marginRight: '3px' }} />Categories
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                {categories.map(cat => (
                  <span key={cat} className="badge badge-category">{cat}</span>
                ))}
              </div>
            </div>
          )}

          {/* Polite Suggestion */}
          {isToxic && polite_suggestion && (
            <div>
              <p style={{ fontSize: '.72rem', color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.35rem' }}>
                ✏️ Suggested Revision
              </p>
              <div style={{
                padding: '.75rem 1rem',
                background: 'var(--success-light)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--success)',
                fontStyle: 'italic',
                fontSize: '.9rem',
              }}>
                "{polite_suggestion}"
              </div>
            </div>
          )}

          {/* Keyword count pill */}
          {toxic_keywords.length > 0 && (
            <p style={{ fontSize: '.8rem', color: 'var(--text2)' }}>
              <strong>{toxic_keywords.length}</strong> flagged keyword{toxic_keywords.length > 1 ? 's' : ''} detected
            </p>
          )}
        </div>
      </div>

      {/* ── Highlighted Text ───────────────────────────────────────────────── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '.75rem', fontSize: '.95rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <MessageSquare size={16} style={{ color: 'var(--text2)' }} /> Scanned Content
        </h3>
        <div style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          fontSize: '.95rem', lineHeight: 1.7,
          color: 'var(--text)',
        }}>
          <HighlightedText text={scannedText} toxicKeywords={toxic_keywords} />
        </div>
      </div>

      {/* ── Action Buttons ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
        <button onClick={handleDownloadPDF} disabled={downloading} className="btn btn-secondary" style={{ flex: '1 1 160px' }}>
          <FileText size={16} />
          {downloading ? 'Generating…' : 'PDF Report'}
        </button>

        {isToxic && (
          <button
            onClick={handleReportNGO}
            disabled={reporting || reported}
            className={`btn ${reported ? 'btn-ghost' : 'btn-danger'}`}
            style={{ flex: '1 1 160px' }}
          >
            {reported ? (
              <><CheckCircle2 size={16} /> Reported</>
            ) : (
              <><Flag size={16} /> Report to NGO</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AnalysisView;
