import React from 'react';
import { TrendingUp, ShieldAlert, ShieldCheck, Brain, Zap } from 'lucide-react';

const STATS = [
  { key: 'totalScans',      label: 'Total Scans',  icon: TrendingUp,  accent: '#6366f1', suffix: '' },
  { key: 'toxicDetected',   label: 'Toxic Found',  icon: ShieldAlert, accent: '#f87171', suffix: '' },
  { key: 'safeScans',       label: 'Safe Content', icon: ShieldCheck, accent: '#34d399', suffix: '' },
  { key: 'sarcasmDetected', label: 'Sarcasm',      icon: Brain,       accent: '#a78bfa', suffix: '' },
];

const StatPill = ({ icon: Icon, label, value, accent }) => (
  <div className="stat-pill">
    <div style={{
      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
      background: accent + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid ${accent}30`,
    }}>
      <Icon size={17} color={accent} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {(value ?? 0).toLocaleString()}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
        {label}
      </div>
    </div>
  </div>
);

const StatsBar = ({ stats }) => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
    {STATS.map(s => (
      <StatPill key={s.key} icon={s.icon} label={s.label} value={stats?.[s.key]} accent={s.accent} />
    ))}
  </div>
);

export default StatsBar;
