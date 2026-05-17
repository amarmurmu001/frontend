import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import { Loader2, Shield, Sun, Moon, AlertTriangle, Zap } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import InputArea from './components/InputArea';
import AnalysisView from './components/AnalysisView';
import HistoryView from './components/HistoryView';
import StatsBar from './components/StatsBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function App() {
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);
  const [inputText, setInputText] = useState('');
  const [theme, setTheme]         = useState(() => localStorage.getItem('theme') || 'dark');
  const [stats, setStats]         = useState(null);
  const [activeTab, setActiveTab] = useState('scan');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      if (res.data?.success) setStats(res.data.data);
    } catch (_) {}
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleScan = async (text) => {
    if (!text.trim()) return;
    setLoading(true); setError(null);
    setInputText(text); setResult(null);
    try {
      const response = await axios.post(`${API_URL}/scan`, { text });
      if (response.data?.success) {
        setResult(response.data.data);
        fetchStats();
      } else throw new Error('Invalid response');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to connect to scanning service');
    } finally { setLoading(false); }
  };

  const TABS = [
    { id: 'scan',    label: '⚡ Scan' },
    { id: 'history', label: '🕐 History' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>

      {/* ── Sticky Nav ──────────────────────────────────────────────────────── */}
      <nav style={{
        background: 'rgba(6,8,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 1.5rem',
      }}>
        <div style={{
          maxWidth: 940, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '60px',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="nav-logo-icon">
              <Shield size={18} color="#fff" />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
                Cyber<span className="gradient-text">Shield</span>
              </span>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>
                AI Toxicity Detector
              </div>
            </div>
          </div>

          {/* Nav right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Status dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'var(--success-bg)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, color: 'var(--success)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 6px var(--success)' }} />
              API Live
            </div>

            {/* Tabs */}
            <div className="tab-switcher">
              {TABS.map(t => (
                <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="btn btn-ghost"
              style={{ padding: '7px', borderRadius: 8 }}
              title="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2.5rem' }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {/* Product tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', background: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            <Zap size={11} />
            Powered by BERT + Multilingual NLP
          </div>

          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Detect & Filter{' '}
            <span className="gradient-text">Toxic Content</span>
            <br />in Real Time
          </h1>

          <p style={{ color: 'var(--text2)', fontSize: '1rem', maxWidth: 520, margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
            AI-powered cyberbullying detection across English, Hindi, Hinglish and 10+ languages.
            Protect your community from hate speech, threats & harassment.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {['🌍 Multilingual', '⚡ Real-time', '🧠 Sarcasm Detection', '🔒 Privacy-first', '🚨 93% Accuracy'].map(f => (
              <span key={f} style={{ padding: '4px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 999, fontSize: '0.75rem', fontWeight: 500, color: 'var(--text2)' }}>
                {f}
              </span>
            ))}
          </div>
        </header>

        {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
        {stats && <StatsBar stats={stats} />}

        {/* ── Main Content ──────────────────────────────────────────────────── */}
        <main style={{ marginTop: '1.5rem' }}>
          {activeTab === 'scan' && (
            <ErrorBoundary>
              {/* Input Card */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
                <InputArea onScan={handleScan} loading={loading} />
                {error && (
                  <div style={{ marginTop: '1rem', padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    {error}
                  </div>
                )}
              </div>

              {/* Loading */}
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid var(--surface3)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
                    <Shield size={20} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'var(--accent)' }} />
                  </div>
                  <p style={{ color: 'var(--text2)', fontWeight: 500, fontSize: '0.9rem' }}>Analyzing with multilingual AI model…</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Preprocessing', 'BERT inference', 'Keyword scan', 'Scoring'].map((s, i) => (
                      <span key={s} style={{ padding: '2px 10px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 999, fontSize: '0.68rem', color: 'var(--text3)', fontWeight: 500, animationDelay: `${i * 0.15}s` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {!loading && result && (
                <div className="animate-in">
                  <AnalysisView result={result} scannedText={inputText} apiUrl={API_URL} />
                </div>
              )}
            </ErrorBoundary>
          )}

          {activeTab === 'history' && (
            <ErrorBoundary>
              <HistoryView apiUrl={API_URL} />
            </ErrorBoundary>
          )}
        </main>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <footer style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text3)', fontSize: '0.78rem' }}>
            CyberShield AI · Built with BERT + FastAPI · Protecting communities online
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
