import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import {
  Loader2, Shield, AlertTriangle, Sun, Moon,
} from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import InputArea from './components/InputArea';
import AnalysisView from './components/AnalysisView';
import HistoryView from './components/HistoryView';
import StatsBar from './components/StatsBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);
  const [inputText, setInputText] = useState('');
  const [theme, setTheme]         = useState(() =>
    localStorage.getItem('theme') || 'light'
  );
  const [stats, setStats]         = useState(null);
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'history'

  // Apply theme to <html> data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      if (res.data?.success) setStats(res.data.data);
    } catch (_) { /* stats are non-critical */ }
  }, [API_URL]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleScan = async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setInputText(text);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/scan`, { text });
      if (response.data?.success) {
        setResult(response.data.data);
        fetchStats(); // refresh stats after each scan
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to connect to the scanning service'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* ── Top Nav ──────────────────────────────────────────────────── */}
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky', top: 0, zIndex: 100,
        padding: '.75rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={{
            background: 'var(--accent)', borderRadius: '10px',
            padding: '.45rem', display: 'flex', alignItems: 'center',
          }}>
            <Shield size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text)' }}>
            SafeSpace<span style={{ color: 'var(--accent)' }}> AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          {/* Tab Switcher */}
          <div style={{
            display: 'flex', background: 'var(--surface2)',
            border: '1px solid var(--border)', borderRadius: '8px', padding: '3px', gap: '3px',
          }}>
            {['scan','history'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '.3rem .8rem', borderRadius: '6px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '.8rem',
                background: activeTab === tab ? 'var(--accent)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text2)',
                transition: 'all .2s',
                textTransform: 'capitalize',
              }}>{tab === 'scan' ? '🔍 Scan' : '🕐 History'}</button>
            ))}
          </div>

          {/* Dark-mode toggle */}
          <button
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="btn btn-ghost"
            style={{ padding: '.45rem', borderRadius: '8px' }}
            title="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '1.75rem' }}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: 'var(--text)', lineHeight: 1.15, marginBottom: '.5rem',
          }}>
            Detect Cyberbullying &amp;{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Harassment</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
            Real-time detection of hate speech, sarcasm, threats &amp; trending social-media harassment in English &amp; Hinglish.
          </p>
        </header>

        {/* ── Stats Bar ───────────────────────────────────────────────── */}
        {stats && <StatsBar stats={stats} />}

        <main style={{ marginTop: '1.5rem' }}>
          {/* ── Scan Tab ─────────────────────────────────────────────── */}
          {activeTab === 'scan' && (
            <ErrorBoundary>
              {/* Input Card */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                <InputArea onScan={handleScan} loading={loading} />
                {error && (
                  <div style={{
                    marginTop: '1rem', padding: '1rem',
                    background: 'var(--danger-light)', border: '1px solid var(--danger)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--danger)',
                    display: 'flex', alignItems: 'center', gap: '.5rem',
                  }}>
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '.9rem' }}>{error}</span>
                  </div>
                )}
              </div>

              {/* Loading */}
              {loading && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '3rem 0', color: 'var(--text2)',
                }}>
                  <Loader2 size={36} className="animate-spin" style={{ marginBottom: '1rem', color: 'var(--accent)' }} />
                  <p style={{ fontWeight: 500 }}>Analyzing text, detecting sarcasm &amp; harassment patterns…</p>
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

          {/* ── History Tab ──────────────────────────────────────────── */}
          {activeTab === 'history' && (
            <ErrorBoundary>
              <HistoryView apiUrl={API_URL} />
            </ErrorBoundary>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
