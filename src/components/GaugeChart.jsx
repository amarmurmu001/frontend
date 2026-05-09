import React from 'react';
import { motion } from 'framer-motion';

const GaugeChart = ({ confidence, label }) => {
  const isToxic = label === 'Toxic';

  const radius        = 60;
  const circumference = 2 * Math.PI * radius;
  const toxicityScore = isToxic ? confidence : Math.max(0, 100 - confidence);
  const strokeDashoffset = circumference - (toxicityScore / 100) * circumference;

  const strokeColor =
    toxicityScore > 75 ? 'var(--danger)' :
    toxicityScore > 50 ? 'var(--warn)'   :
    'var(--success)';

  const textColor =
    toxicityScore > 75 ? 'var(--danger)' :
    toxicityScore > 50 ? 'var(--warn)'   :
    'var(--success)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 140 140">
          {/* Track */}
          <circle cx="70" cy="70" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="12" />
          {/* Animated fill */}
          <motion.circle
            cx="70" cy="70" r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Centre label */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: textColor, lineHeight: 1 }}>
            {toxicityScore.toFixed(0)}%
          </span>
          <span style={{ fontSize: '.65rem', fontWeight: 600, color: 'var(--text2)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Toxicity
          </span>
        </div>
      </div>

      {/* Label badge */}
      <div style={{ marginTop: '.75rem' }}>
        <span style={{
          display: 'inline-block', padding: '.3rem .9rem',
          borderRadius: '999px', fontSize: '.8rem', fontWeight: 700,
          background: isToxic ? 'var(--danger-light)' : 'var(--success-light)',
          color: isToxic ? 'var(--danger)' : 'var(--success)',
          border: `1px solid ${isToxic ? 'var(--danger)' : 'var(--success)'}`,
        }}>
          {label.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default GaugeChart;
