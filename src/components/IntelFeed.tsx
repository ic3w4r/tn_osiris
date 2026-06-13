'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronUp, Newspaper, RadioTower } from 'lucide-react';

import { FeedItem } from '@/lib/tn-governance-data';

interface IntelFeedProps {
  feed: FeedItem[];
  onLocate?: (lat: number, lng: number, districtId: string) => void;
}

type DepartmentChannel = {
  department: string;
  count: number;
  heat: number;
  severity: FeedItem['severity'];
  latest: FeedItem;
  districts: number;
};

function severityWeight(severity: FeedItem['severity']) {
  if (severity === 'CRITICAL') return 4;
  if (severity === 'HIGH') return 3;
  if (severity === 'ELEVATED') return 2;
  return 1;
}

function severityTone(severity: FeedItem['severity']) {
  if (severity === 'CRITICAL') return 'text-rose-300 border-rose-400/20 bg-rose-400/10';
  if (severity === 'HIGH') return 'text-orange-300 border-orange-400/20 bg-orange-400/10';
  if (severity === 'ELEVATED') return 'text-amber-300 border-amber-400/20 bg-amber-400/10';
  return 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10';
}

function heatBarClass(heat: number) {
  if (heat >= 80) return 'bg-rose-400';
  if (heat >= 60) return 'bg-orange-400';
  if (heat >= 40) return 'bg-amber-400';
  return 'bg-emerald-400';
}

export default function IntelFeed({ feed, onLocate }: IntelFeedProps) {
  const [expanded, setExpanded] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState<string>('All');

  const channels = useMemo<DepartmentChannel[]>(() => {
    const grouped = new Map<string, FeedItem[]>();
    for (const item of feed) {
      const items = grouped.get(item.department) ?? [];
      items.push(item);
      grouped.set(item.department, items);
    }

    return Array.from(grouped.entries())
      .map(([department, items]) => {
        const weighted = items.reduce((sum, item) => sum + severityWeight(item.severity), 0);
        const heat = Math.min(100, Math.round((weighted / (items.length * 4)) * 100));
        const latest = [...items].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))[0];
        const severity = [...items].sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity))[0].severity;
        const districts = new Set(items.map((item) => item.districtId)).size;
        return { department, count: items.length, heat, severity, latest, districts };
      })
      .sort((a, b) => b.heat - a.heat);
  }, [feed]);

  const filteredFeed = useMemo(() => {
    if (activeDepartment === 'All') return feed;
    return feed.filter((item) => item.department === activeDepartment);
  }, [activeDepartment, feed]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.45 }}
      className="glass-panel pointer-events-auto overflow-hidden"
    >
      <button onClick={() => setExpanded((value) => !value)} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-[var(--accent-warm)]" />
          <div>
            <div className="hud-text text-[11px] text-[var(--text-primary)]">Governance Feed</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{feed.length} recent signals</div>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="border-t border-white/6 px-4 py-3">
              <div className="mb-3 flex items-center gap-2">
                <RadioTower className="h-4 w-4 text-[var(--accent-bright)]" />
                <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Department Source Layers</div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveDepartment('All')}
                  className={`rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] transition ${
                    activeDepartment === 'All' ? 'border-white/14 bg-white/10 text-[var(--text-primary)]' : 'border-white/8 bg-white/4 text-[var(--text-muted)]'
                  }`}
                >
                  All Channels
                </button>
                {channels.map((channel) => (
                  <button
                    key={channel.department}
                    onClick={() => setActiveDepartment(channel.department)}
                    className={`rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] transition ${
                      activeDepartment === channel.department ? 'border-white/14 bg-white/10 text-[var(--text-primary)]' : 'border-white/8 bg-white/4 text-[var(--text-muted)]'
                    }`}
                  >
                    {channel.department}
                  </button>
                ))}
              </div>

              <div className="max-h-[180px] space-y-2 overflow-y-auto styled-scrollbar pr-1">
                {channels.map((channel) => (
                  <button
                    key={channel.department}
                    onClick={() => {
                      setActiveDepartment(channel.department);
                      onLocate?.(channel.latest.lat, channel.latest.lng, channel.latest.districtId);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      activeDepartment === channel.department ? 'border-white/14 bg-white/8' : 'border-white/8 bg-black/10 hover:border-white/12 hover:bg-white/5'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[12px] text-[var(--text-primary)]">{channel.department}</div>
                        <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          {channel.count} updates · {channel.districts} districts
                        </div>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.18em] ${severityTone(channel.severity)}`}>
                        Heat {channel.heat}
                      </span>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/6">
                      <div className={`h-full rounded-full ${heatBarClass(channel.heat)}`} style={{ width: `${channel.heat}%` }} />
                    </div>
                    <div className="text-[10px] leading-relaxed text-[var(--text-secondary)]">
                      {channel.latest.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[320px] space-y-2 overflow-y-auto border-t border-white/6 px-4 pb-4 pt-3 styled-scrollbar">
              {filteredFeed.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onLocate?.(item.lat, item.lng, item.districtId)}
                  className="w-full rounded-2xl border border-white/8 bg-black/10 p-3 text-left transition hover:border-white/15 hover:bg-white/5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.18em] ${severityTone(item.severity)}`}>
                      {item.department}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mb-1 text-[13px] leading-snug text-[var(--text-primary)]">{item.title}</div>
                  <div className="mb-2 text-[11px] leading-relaxed text-[var(--text-secondary)]">{item.summary}</div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--accent-bright)]">
                    <span>{item.district}</span>
                    <span className="inline-flex items-center gap-1">
                      Locate
                      <ArrowUpRight className="h-3 w-3" />
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
