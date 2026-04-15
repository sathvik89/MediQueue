import React, { useState } from 'react';
import { Calendar, Clock, Stethoscope, XCircle, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/index';
import type { Appointment, AppointmentStatus } from '../../types';

interface AppointmentTableProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
}

const FILTER_OPTIONS: { value: AppointmentStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'IN_QUEUE', label: 'In Queue' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, onCancel }) => {
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = appointments
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a => a.doctorName.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDir === 'asc' ? diff : -diff;
    });

  const canCancel = (status: AppointmentStatus) => ['PENDING', 'CONFIRMED', 'IN_QUEUE'].includes(status);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by doctor or specialty..."
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', fontFamily: 'inherit', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {FILTER_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setFilter(opt.value)}
              style={{
                padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid',
                borderColor: filter === opt.value ? 'var(--primary)' : 'var(--border)',
                background: filter === opt.value ? 'var(--primary-light)' : 'var(--surface)',
                color: filter === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
              }}>
              {opt.label}
            </button>
          ))}
        </div>
        {/* Sort */}
        <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: '1px solid var(--border)', padding: '0.375rem 0.625rem', borderRadius: '0.375rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>
          Date {sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No appointments found" description="Try adjusting your search or filter" />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
                {['Token', 'Doctor', 'Date & Time', 'Type', 'Priority', 'Status', 'Action'].map(col => (
                  <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, i) => (
                <tr key={appt.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {appt.tokenNumber ? (
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>#{appt.tokenNumber}</span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                        <Stethoscope size={14} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{appt.doctorName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{appt.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.8125rem' }}>
                      <Calendar size={13} color="var(--text-secondary)" /> {appt.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      <Clock size={12} /> {appt.time}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge variant={appt.type} size="sm" /></td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge variant="PENDING" priority={appt.priority} size="sm" /></td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge variant={appt.status} size="sm" /></td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {canCancel(appt.status) ? (
                      <button onClick={() => onCancel(appt.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: '1px solid #fca5a5', borderRadius: '0.375rem', padding: '0.35rem 0.625rem', cursor: 'pointer', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                      >
                        <XCircle size={13} /> Cancel
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
