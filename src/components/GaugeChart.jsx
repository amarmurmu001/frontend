import React from 'react';

const GaugeChart = ({ confidence, label }) => {
  const isToxic = label === 'Toxic';
  const score   = isToxic ? confidence : Math.max(0, 100 - confidence);
  const radius  = 54;
  const circ    = 2 * Math.PI * radius;
  const offset  = circ - (score / 100) * circ;

  const color =
    score > 75 ? '#f87171' :
    score > 50 ? '#fbbf24' :
    '#34d399';

  const glowColor =
    score > 75 ? 'rgba(248,113,113,0.4)' :
    score > 50 ? 'rgba(251,191,36,0.4)'  :
    'rgba(52,211,153,0.4)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0' }}>
      <div style={{ position: 'relative', width: 130, height: 130 }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Gradient stroke */}
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle cx="65" cy="65" r={radius}
            fill="none"
            stroke="var(--surface3)"
            strokeWidth="10"
          />

          {/* Value arc */}
          <circle cx="65" cy="65" r={radius}
            fill="none"
            stroke={`url(#gaugeGrad)`}
            strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: `0 0 20px ${glowColor}`,
            }}
          />
        </svg>

        {/* Centre */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.03em' }}>
            {score.toFixed(0)}%
          </span>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Toxicity
          </span>
        </div>
      </div>

      {/* Label badge */}
      <span className={`badge ${isToxic ? 'badge-toxic' : 'badge-safe'}`} style={{ marginTop: 8, padding: '4px 14px', fontSize: '0.72rem' }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
};

export default GaugeChart;
