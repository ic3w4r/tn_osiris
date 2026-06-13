'use client';

import { memo } from 'react';
import { AlertTriangle, Building2, FolderKanban, Landmark, ListChecks, MapPinned, ReceiptIndianRupee } from 'lucide-react';

const layers = [
  { key: 'districts', label: 'District Risk', icon: MapPinned, color: '#24c4b0', metric: 'districts' },
  { key: 'grievances', label: 'Grievance Heat', icon: AlertTriangle, color: '#ff8f3d', metric: 'grievances' },
  { key: 'projects', label: 'Delayed Projects', icon: FolderKanban, color: '#ff5f6d', metric: 'projects' },
  { key: 'schemes', label: 'Schemes', icon: ListChecks, color: '#72e06a', metric: 'schemes' },
  { key: 'tenders', label: 'Tender Risk', icon: ReceiptIndianRupee, color: '#f6c453', metric: 'tenders' },
  { key: 'assets', label: 'Asset Track', icon: Building2, color: '#7ab8ff', metric: 'assets' },
  { key: 'disasters', label: 'Disaster Watch', icon: Landmark, color: '#b595ff', metric: 'alerts' },
];

interface LayerPanelProps {
  counts: Record<string, number>;
  activeLayers: Record<string, boolean>;
  setActiveLayers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

function LayerPanel({ counts, activeLayers, setActiveLayers }: LayerPanelProps) {
  return (
    <div className="glass-panel pointer-events-auto p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="hud-text text-[11px] text-[var(--text-primary)]">Monitoring Layers</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Toggle the statewide intelligence stack</div>
        </div>
        <div className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-mono text-[var(--accent-bright)]">
          {Object.values(activeLayers).filter(Boolean).length}/{layers.length}
        </div>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const active = activeLayers[layer.key];
          return (
            <button
              key={layer.key}
              onClick={() => setActiveLayers((current) => ({ ...current, [layer.key]: !current[layer.key] }))}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                active ? 'border-white/12 bg-white/6' : 'border-transparent bg-black/10 hover:border-white/10 hover:bg-white/4'
              }`}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] text-[var(--text-primary)]">{layer.label}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {(counts[layer.metric] ?? 0).toLocaleString()} tracked
                </div>
              </div>
              <div className={`layer-toggle ${active ? 'active' : ''}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(LayerPanel);
