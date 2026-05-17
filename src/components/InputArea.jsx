import React, { useState } from 'react';
import { Send, X, Sparkles } from 'lucide-react';

const QUICK_TESTS = [
  { label: '🤐 Sarcasm',    text: 'Oh wow, so brave of you. No one asked lol stay mad 🙄' },
  { label: '💀 Threat',     text: 'I will find you and maar dunga, you kutte!' },
  { label: '⚖️ Body Shame', text: 'Moti aur kaali, koi pasand nahi karega tujhe' },
  { label: '✅ Safe',       text: 'Hi! I hope you are having a wonderful day today 😊' },
];

const InputArea = ({ onScan, loading }) => {
  const [text, setText] = useState('');
  const maxLength = 1000;
  const pct = text.length / maxLength;
  const countColor = pct > 0.9 ? 'var(--danger)' : pct > 0.7 ? 'var(--warn)' : 'var(--text3)';

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 2 }}>
            Analyze Text
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
            Paste any comment, message or post — English, Hindi or Hinglish
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 999 }}>
          <Sparkles size={11} color="var(--accent2)" />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Ready</span>
        </div>
      </div>

      {/* Quick test pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.85rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text3)', fontWeight: 600, alignSelf: 'center', marginRight: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Test:
        </span>
        {QUICK_TESTS.map(q => (
          <button key={q.label} onClick={() => setText(q.text)}
            style={{
              padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 999, cursor: 'pointer', color: 'var(--text2)',
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent2)';
              e.currentTarget.style.background = 'var(--accent-light)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text2)';
              e.currentTarget.style.background = 'var(--surface2)';
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Textarea wrapper */}
      <div className="input-wrap">
        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={e => { if (e.target.value.length <= maxLength) setText(e.target.value); }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && text.trim()) onScan(text); }}
            placeholder="Type or paste text here… (Ctrl+Enter to scan)"
            style={{
              minHeight: 160, padding: '1.1rem 2.5rem 1.1rem 1.1rem',
              fontSize: '0.95rem',
              background: 'transparent',
            }}
            disabled={loading}
          />
          {text && (
            <button onClick={() => setText('')}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 6, cursor: 'pointer', padding: 4,
                color: 'var(--text3)', display: 'flex', alignItems: 'center',
                transition: 'all 0.15s',
              }}
              title="Clear"
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Bottom toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'var(--surface2)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: countColor, fontVariantNumeric: 'tabular-nums' }}>
              {text.length} / {maxLength}
            </span>
            <div style={{ width: 64, height: 3, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${Math.min(pct * 100, 100)}%`,
                background: pct > 0.9 ? 'var(--danger)' : pct > 0.7 ? 'var(--warn)' : 'linear-gradient(90deg, var(--accent), var(--purple))',
                transition: 'width 0.2s, background 0.3s',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>Ctrl+Enter</span>
            <button id="scan-button" onClick={() => { if (text.trim()) onScan(text); }}
              disabled={loading || !text.trim()}
              className="btn btn-primary"
              style={{ padding: '7px 18px', fontSize: '0.82rem' }}>
              {loading ? (
                <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Scanning…</>
              ) : (
                <><Send size={13} /> Scan Now</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
