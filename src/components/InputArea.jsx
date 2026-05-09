import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

const QUICK_TESTS = [
  { label: '🤐 Sarcasm',    text: 'Oh wow, so brave of you. No one asked lol stay mad 🙄' },
  { label: '💀 Threat',     text: 'I will find you and maar dunga, you kutte!' },
  { label: '⚖️ Body Shame', text: 'Moti aur kaali, koi pasand nahi karega tujhe' },
  { label: '✅ Safe',       text: 'Hi! I hope you are having a wonderful day today 😊' },
];

const InputArea = ({ onScan, loading }) => {
  const [text, setText] = useState('');
  const maxLength = 1000;

  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) setText(e.target.value);
  };

  const handleScan = () => {
    if (text.trim()) onScan(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleScan();
  };

  const pct = text.length / maxLength;
  const countColor = pct > 0.9 ? 'var(--danger)' : pct > 0.7 ? 'var(--warn)' : 'var(--text3)';

  return (
    <div>
      {/* Quick test pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '.75rem' }}>
        <span style={{ fontSize: '.72rem', color: 'var(--text2)', fontWeight: 600, alignSelf: 'center', marginRight: '.25rem' }}>Quick Test:</span>
        {QUICK_TESTS.map(q => (
          <button key={q.label} onClick={() => setText(q.text)}
            style={{
              padding: '.25rem .6rem', fontSize: '.72rem', fontWeight: 600,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '999px', cursor: 'pointer', color: 'var(--text2)',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Textarea wrapper */}
      <div style={{
        border: '2px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        transition: 'border-color .2s',
        background: 'var(--surface)',
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste text in English or Hinglish… (Ctrl+Enter to scan)"
            style={{
              minHeight: '150px', padding: '1rem 1rem .5rem',
              fontSize: '.95rem', lineHeight: 1.65,
              background: 'var(--surface)', color: 'var(--text)',
            }}
            disabled={loading}
          />
          {text && (
            <button onClick={() => setText('')}
              style={{
                position: 'absolute', top: '.75rem', right: '.75rem',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: '6px', cursor: 'pointer', padding: '.2rem',
                color: 'var(--text2)', display: 'flex', alignItems: 'center',
                transition: 'all .15s',
              }}
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '.65rem 1rem',
          background: 'var(--surface2)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span style={{ fontSize: '.75rem', fontWeight: 600, color: countColor }}>
              {text.length} / {maxLength}
            </span>
            {/* Mini progress bar */}
            <div style={{ width: '60px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: `${Math.min(pct * 100, 100)}%`,
                background: pct > 0.9 ? 'var(--danger)' : pct > 0.7 ? 'var(--warn)' : 'var(--accent)',
                transition: 'width .2s, background .2s',
              }} />
            </div>
          </div>

          <button
            id="scan-button"
            onClick={handleScan}
            disabled={loading || !text.trim()}
            className="btn btn-primary"
            style={{ padding: '.5rem 1.2rem' }}
          >
            {loading ? 'Scanning…' : 'Scan Now'}
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
