import React from 'react';
import { Bell, BellOff, Calendar, Clock, AlertCircle, Info } from 'lucide-react';
import { EmptyState } from '../ui/index';
import type { Notification, NotificationType } from '../../types';

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  QUEUE_UPDATE:         { icon: Bell,          color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  APPOINTMENT_REMINDER: { icon: Calendar,      color: '#5b21b6', bg: '#ede9fe', border: '#c4b5fd' },
  FOLLOW_UP:           { icon: Clock,          color: '#047857', bg: '#d1fae5', border: '#6ee7b7' },
  GENERAL:             { icon: Info,           color: '#4b5563', bg: '#f3f4f6', border: '#d1d5db' },
};

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkRead }) => {
  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  if (notifications.length === 0) {
    return <EmptyState icon={BellOff} title="No notifications" description="You're all caught up! Check back later." />;
  }

  const renderItem = (notif: Notification) => {
    const cfg = typeConfig[notif.type];
    const Icon = cfg.icon;
    return (
      <div key={notif.id}
        onClick={() => !notif.isRead && onMarkRead(notif.id)}
        style={{
          display: 'flex', gap: '0.875rem', padding: '1rem 1.25rem',
          background: notif.isRead ? 'transparent' : 'var(--primary-light)',
          borderBottom: '1px solid var(--border)',
          cursor: notif.isRead ? 'default' : 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!notif.isRead) (e.currentTarget as HTMLDivElement).style.background = '#dbeafe'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = notif.isRead ? 'transparent' : 'var(--primary-light)'; }}
      >
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, flexShrink: 0 }}>
          <Icon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ fontWeight: notif.isRead ? 600 : 700, color: 'var(--text-dark)', fontSize: '0.875rem' }}>
              {notif.title}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(notif.createdAt)}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notif.body}</p>
          {!notif.isRead && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Tap to mark as read</div>}
        </div>
        {!notif.isRead && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '0.5rem' }} />
        )}
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', overflow: 'hidden' }}>
      {unread.length > 0 && (
        <>
          <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <AlertCircle size={12} /> Unread ({unread.length})
            </span>
          </div>
          {unread.map(renderItem)}
        </>
      )}
      {read.length > 0 && (
        <>
          <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Earlier
            </span>
          </div>
          {read.map(renderItem)}
        </>
      )}
    </div>
  );
};