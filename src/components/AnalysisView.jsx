import React, { useState } from 'react';
import axios from 'axios';
import {
  FileText, Flag, CheckCircle2, MessageSquare,
  AlertTriangle, ShieldCheck, Zap, Brain, Tag, TrendingUp,
} from 'lucide-react';
import GaugeChart from './GaugeChart';
import HighlightedText from './HighlightedText';

const SEV = {
  None:     { cls: 'badge-safe',     label: '✅ Safe',            color: 'var(--success)' },
  Low:      { cls: 'badge-low',      label: '↓ Low Severity',     color: 'var(--success)' },
  Medium:   { cls: 'badge-medium',   label: '⚠ Medium Severity',  color: 'var(--warn)' },
  High:     { cls: 'badge-high',     label: '🔴 High Severity',   color: 'var(--orange)' },
  Critical: { cls: 'badge-critical', label: '🚨 Critical',        color: 'var(--danger)' },
};

const Section = ({ icon: Icon, title, children }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <Icon size={13} color="var(--text3)" />
      <span className="section-label">{title}</span>
    </div>
    {children}
  </div>
);

const AnalysisView = ({ result, scannedText, apiUrl }) => {
  const [downloading, setDownloading] = useState(false);
  const [reporting, setReporting]     = useState(false);
  const [reported, setReported]       = useState(false);

  const {
    label, confidence, toxic_keywords = [], polite_suggestion,
    categories = [], severity = 'None',
    is_sarcastic = false, harassment_type = 'None',
  } = result;

  const isToxic = label === 'Toxic';
  const sevConf = SEV[severity] || SEV.None;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(`${apiUrl}/report/pdf`,
        { text: scannedText, label, confidence, toxic_keywords },
        { responseType: 'blob' });
      const url  = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', 'CyberShield_Report.pdf');
      document.body.appendChild(link); link.click(); link.remove();
    } catch { alert('PDF generation not available.'); }
    finally { setDownloading(false); }
  };

  const handleReportNGO = async () => {
    setReporting(true);
    try {
      await axios.post(`${apiUrl}/report/ngo`, { text: scannedText, label });
      setReported(true);
    } catch { alert('Failed to report.'); }
    finally { setReporting(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* ── Verdict Banner ───────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 20px',
        background: isToxic ? 'var(--danger-bg)' : 'var(--success-bg)',
        border: `1px solid ${isToxic ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`,
        borderRadius: 'var(--radius)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isToxic
            ? <AlertTriangle size={20} color="var(--danger)" />
            : <ShieldCheck size={20} color="var(--success)" />
          }
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: isToxic ? 'var(--danger)' : 'var(--success)' }}>
              {isToxic ? 'Toxic Content Detected' : 'Content Appears Safe'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 1 }}>
              {isToxic
                ? `Flagged as ${harassment_type !== 'None' ? harassment_type : 'General Harassment'} with ${confidence}% confidence`
                : `No harmful content detected · ${confidence}% confidence`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span className={`badge ${isToxic ? 'badge-toxic' : 'badge-safe'}`}>
            {isToxic ? <AlertTriangle size={10} /> : <ShieldCheck size={10} />} {label}
          </span>
          <span className={`badge ${sevConf.cls}`}>{sevConf.label}</span>
          {is_sarcastic && <span className="badge badge-sarcasm"><Brain size={10} /> Sarcasm</span>}
          {isToxic && harassment_type !== 'None' && (
            <span className="badge badge-category"><Zap size={10} /> {harassment_type}</span>
          )}
        </div>
      </div>

      {/* ── Gauge + Details ──────────────────────────────────────────────────── */}
      <div className="analysis-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '1rem' }}>

        {/* Gauge */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span className="section-label" style={{ marginBottom: 0 }}>Toxicity Score</span>
          <GaugeChart confidence={confidence} label={label} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>
              {toxic_keywords.length > 0
                ? `${toxic_keywords.length} keyword${toxic_keywords.length > 1 ? 's' : ''} flagged`
                : 'No toxic keywords found'}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* Categories */}
          {categories.length > 0 && (
            <Section icon={Tag} title="Detection Categories">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {categories.map(cat => (
                  <span key={cat} className="badge badge-category">{cat}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Polite suggestion */}
          {isToxic && polite_suggestion && polite_suggestion !== 'Please rephrase your message to be more respectful.' && (
            <Section icon={MessageSquare} title="Suggested Revision">
              <div style={{
                padding: '10px 14px',
                background: 'var(--success-bg)',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--success)', fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.6,
              }}>
                "{polite_suggestion}"
              </div>
            </Section>
          )}

          {/* Confidence breakdown */}
          <Section icon={TrendingUp} title="Confidence Breakdown">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Toxic Probability',  value: isToxic ? confidence : 100 - confidence, color: 'var(--danger)' },
                { label: 'Safe Probability',   value: isToxic ? 100 - confidence : confidence, color: 'var(--success)' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text2)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.color }}>{item.value}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: 2, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── Scanned Text ─────────────────────────────────────────────────────── */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <Section icon={MessageSquare} title="Scanned Content">
          <div style={{
            padding: '14px 16px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', lineHeight: 1.75,
            color: 'var(--text)', fontFamily: 'inherit',
          }}>
            <HighlightedText text={scannedText} toxicKeywords={toxic_keywords} />
          </div>
        </Section>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={handleDownloadPDF} disabled={downloading}
          className="btn btn-secondary" style={{ flex: '1 1 160px' }}>
          <FileText size={14} />
          {downloading ? 'Generating…' : 'Download PDF Report'}
        </button>
        {isToxic && (
          <button onClick={handleReportNGO} disabled={reporting || reported}
            className={`btn ${reported ? 'btn-ghost' : 'btn-danger'}`}
            style={{ flex: '1 1 160px' }}>
            {reported
              ? <><CheckCircle2 size={14} /> Reported Successfully</>
              : <><Flag size={14} /> Report to NGO</>
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default AnalysisView;
