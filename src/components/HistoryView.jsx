import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Trash2, Clock, AlertTriangle, CheckCircle,
  Loader2, Brain, Zap, RefreshCw,
} from 'lucide-react';

const SEVERITY_COLORS = {
  None:     'var(--success)',
  Low:      'var(--success)',
  Medium:   'var(--warn)',
  High:     '#e05252',
  Critical: 'var(--danger)',
};

const HistoryView = ({ apiUrl }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState('All'); // All | Toxic | Safe | Sarcastic

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/history`);
      if (res.data?.success) setHistory(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/history/${id}`);
      setHistory(h => h.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = history.filter(item => {
    if (filter === 'Toxic')    return item.category === 'Toxicity';
    if (filter === 'Safe')     return item.category === 'Safe';
    if (filter === 'Sarcastic') return item.isSarcastic;
    return true;
  });

  if (loading) return (
    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
      <Loader2 size={36} className="animate-spin" style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
      <p style={{ color: 'var(--text2)', fontWeight: 500 }}>Loading scan history…</p>
    </div>
  );

  if (error) return (
    <div className="card" style={{ padding: '1.5rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
      <AlertTriangle size={18} /> {error}
    </div>
  );

  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <Clock size={18} style={{ color: 'var(--text2)' }} /> Recent Scans
          <span style={{ fontSize: '.8rem', color: 'var(--text3)', fontWeight: 500 }}>({history.length})</span>
        </h2>

        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Filter pills */}
          {['All', 'Toxic', 'Safe', 'Sarcastic'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '.25rem .7rem', fontSize: '.75rem', fontWeight: 600,
                borderRadius: '999px', cursor: 'pointer', border: '1px solid',
                borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                background: filter === f ? 'var(--accent-light)' : 'var(--surface2)',
                color: filter === f ? 'var(--accent)' : 'var(--text2)',
                transition: 'all .15s',
              }}
            >{f}</button>
          ))}

          <button onClick={fetchHistory} className="btn btn-ghost" style={{ padding: '.3rem .6rem', fontSize: '.8rem' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text2)', textAlign: 'center', padding: '2.5rem 0', fontWeight: 500 }}>
          No scans found{filter !== 'All' ? ` for "${filter}"` : ''}.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
          {filtered.map(item => (
            <div key={item._id} style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '.9rem 1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              gap: '.75rem', transition: 'border-color .15s, box-shadow .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Text snippet */}
                <p style={{
                  color: 'var(--text)', fontSize: '.9rem', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  marginBottom: '.5rem',
                }}>
                  "{item.text}"
                </p>

                {/* Meta row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.4rem' }}>
                  <span style={{ fontSize: '.7rem', color: 'var(--text3)' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </span>

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '.25rem',
                    fontSize: '.72rem', fontWeight: 700,
                    color: item.category === 'Safe' ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {item.category === 'Toxicity'
                      ? <AlertTriangle size={11} />
                      : <CheckCircle size={11} />}
                    {item.category}
                  </span>

                  {item.severity && item.severity !== 'None' && (
                    <span style={{
                      fontSize: '.7rem', fontWeight: 700, padding: '.1rem .45rem',
                      borderRadius: '999px',
                      background: SEVERITY_COLORS[item.severity] + '22',
                      color: SEVERITY_COLORS[item.severity],
                      border: `1px solid ${SEVERITY_COLORS[item.severity]}`,
                    }}>
                      {item.severity}
                    </span>
                  )}

                  {item.isSarcastic && (
                    <span style={{
                      fontSize: '.7rem', fontWeight: 700, padding: '.1rem .45rem',
                      borderRadius: '999px', background: '#f3e8ff',
                      color: '#9333ea', border: '1px solid #c084fc',
                      display: 'inline-flex', alignItems: 'center', gap: '.2rem',
                    }}>
                      <Brain size={10} /> Sarcasm
                    </span>
                  )}

                  {item.harassmentType && item.harassmentType !== 'None' && (
                    <span style={{
                      fontSize: '.7rem', fontWeight: 600, padding: '.1rem .45rem',
                      borderRadius: '999px', background: 'var(--accent-light)',
                      color: 'var(--accent)', border: '1px solid var(--accent)',
                      display: 'inline-flex', alignItems: 'center', gap: '.2rem',
                    }}>
                      <Zap size={10} /> {item.harassmentType}
                    </span>
                  )}

                  <span style={{ fontSize: '.7rem', color: 'var(--text3)', fontWeight: 500 }}>
                    {item.confidence}% confidence
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                title="Delete from history"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '.3rem', borderRadius: '6px',
                  color: 'var(--text3)', flexShrink: 0, transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.color = 'var(--danger)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)'; }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
