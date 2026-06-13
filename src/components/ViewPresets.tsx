'use client';

import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

interface ViewPresetsProps {
  onNavigate: (lat: number, lng: number, zoom: number) => void;
}

const presets = [
  { label: 'Statewide', lat: 10.9, lng: 78.7, zoom: 6.2 },
  { label: 'Chennai Metro', lat: 13.0827, lng: 80.2707, zoom: 9.3 },
  { label: 'Western Corridor', lat: 11.05, lng: 76.94, zoom: 8 },
  { label: 'Cauvery Delta', lat: 10.79, lng: 79.14, zoom: 8.1 },
  { label: 'South Coast', lat: 8.77, lng: 78.14, zoom: 8.2 },
  { label: 'North Arcot Health Belt', lat: 12.93, lng: 79.14, zoom: 8.1 },
];

export default function ViewPresets({ onNavigate }: ViewPresetsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass-panel pointer-events-auto p-3"
    >
      <div className="mb-3 flex items-center gap-2">
        <Navigation className="h-4 w-4 text-[var(--accent-bright)]" />
        <div className="hud-text text-[11px] text-[var(--text-primary)]">Regional Presets</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onNavigate(preset.lat, preset.lng, preset.zoom)}
            className="rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-left text-[11px] text-[var(--text-secondary)] transition hover:border-white/15 hover:bg-white/8 hover:text-[var(--text-primary)]"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
