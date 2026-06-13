'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

import { AlertEntity } from '@/lib/tn-governance-data';

interface LiveAlertsProps {
  alerts: AlertEntity[];
  onLocate: (lat: number, lng: number, districtId: string) => void;
}

const severityStyles: Record<string, string> = {
  LOW: 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10',
  ELEVATED: 'text-amber-300 border-amber-400/20 bg-amber-400/10',
  HIGH: 'text-orange-300 border-orange-400/20 bg-orange-400/10',
  CRITICAL: 'text-rose-300 border-rose-400/20 bg-rose-400/10',
};

export default function LiveAlerts({ alerts, onLocate }: LiveAlertsProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className="glass-panel pointer-events-auto overflow-hidden"
    >
      <button onClick={() => setExpanded((value) => !value)} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[var(--accent-danger)]" />
          <div>
            <div className="hud-text text-[11px] text-[var(--text-primary)]">Live Alerts</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{alerts.length} statewide escalations</div>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="max-h-[260px] space-y-2 overflow-y-auto px-4 pb-4 styled-scrollbar">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => onLocate(alert.lat, alert.lng, alert.districtId)}
                  className="w-full rounded-2xl border border-white/8 bg-black/10 p-3 text-left transition hover:border-white/15 hover:bg-white/5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className={`rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.18em] ${severityStyles[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mb-1 text-[13px] leading-snug text-[var(--text-primary)]">{alert.title}</div>
                  <div className="mb-2 text-[11px] leading-relaxed text-[var(--text-secondary)]">{alert.summary}</div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    <span>{alert.district}</span>
                    <span className="inline-flex items-center gap-1 text-[var(--accent-bright)]">
                      <MapPin className="h-3 w-3" />
                      Inspect
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
