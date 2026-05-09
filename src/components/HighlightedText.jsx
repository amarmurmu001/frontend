import React from 'react';

const HighlightedText = ({ text, toxicKeywords }) => {
  if (!text) return null;

  if (!toxicKeywords || toxicKeywords.length === 0) {
    return (
      <span style={{ color: 'var(--text)', lineHeight: 1.7, fontWeight: 400 }}>
        {text}
      </span>
    );
  }

  // Escape keywords and build regex
  const escaped = toxicKeywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex   = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts   = text.split(regex);

  return (
    <span style={{ color: 'var(--text)', lineHeight: 1.7 }}>
      {parts.map((part, i) => {
        const isKeyword = toxicKeywords.some(
          kw => kw.toLowerCase() === part.toLowerCase()
        );
        return isKeyword ? (
          <mark key={i} className="toxic-highlight" title={`Flagged: "${part}"`}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};

export default HighlightedText;
