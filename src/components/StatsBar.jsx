import React from 'react';
import { ShieldAlert, ShieldCheck, Zap, SmilePlus, TrendingUp } from 'lucide-react';

const StatCard = ({ icon, label, value, accent }) => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '.8rem 1.1rem',
    display: 'flex', alignItems: 'center', gap: '.8rem',
    flex: '1 1 130px', minWidth: 0,
    transition: 'box-shadow .2s',
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
  >
    <div style={{
      background: accent + '22', borderRadius: '8px',
      padding: '.45rem', display: 'flex', flexShrink: 0,
    }}>
      {React.cloneElement(icon, { size: 18, color: accent })}
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '.72rem', color: 'var(--text2)', marginTop: '.15rem', fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

const StatsBar = ({ stats }) => {
  const {
    total = 0, toxic = 0, safe = 0,
    sarcastic = 0, critical = 0
  } = stats;

  return (
    <div style={{
      display: 'flex', gap: '.75rem', flexWrap: 'wrap',
      marginBottom: '.5rem',
    }}>
      <StatCard icon={<TrendingUp />}  label="Total Scans"  value={total}    accent="#6366f1" />
      <StatCard icon={<ShieldAlert />} label="Toxic"        value={toxic}    accent="#ef4444" />
      <StatCard icon={<ShieldCheck />} label="Safe"         value={safe}     accent="#10b981" />
      <StatCard icon={<SmilePlus />}   label="Sarcasm"      value={sarcastic} accent="#9333ea" />
      <StatCard icon={<Zap />}         label="Critical"     value={critical} accent="#f59e0b" />
    </div>
  );
};

export default StatsBar;
