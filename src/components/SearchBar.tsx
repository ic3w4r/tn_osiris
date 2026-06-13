'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface SearchTarget {
  id: string;
  label: string;
  sublabel: string;
  lat: number;
  lng: number;
}

interface SearchBarProps {
  items: SearchTarget[];
  onLocate: (item: SearchTarget) => void;
}

export default function SearchBar({ items, onLocate }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return items.slice(0, 6);
    return items
      .filter((item) => `${item.label} ${item.sublabel}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [items, value]);

  const handleSelect = (item: SearchTarget) => {
    onLocate(item);
    setOpen(false);
    setValue('');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass-panel-sm flex items-center gap-2 px-3 py-2 text-[11px] font-mono tracking-[0.18em] text-[var(--text-muted)] transition hover:text-[var(--accent-bright)]"
      >
        <Search className="h-3.5 w-3.5" />
        SEARCH DISTRICT / ASSET
      </button>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="glass-panel flex items-center gap-2 px-3 py-2.5">
        <Search className="h-4 w-4 text-[var(--accent-bright)]" />
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
              setValue('');
            }
            if (event.key === 'Enter' && results[0]) {
              handleSelect(results[0]);
            }
          }}
          placeholder="District, scheme, project, asset..."
          className="flex-1 bg-transparent text-[12px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />
        <button onClick={() => { setOpen(false); setValue(''); }} className="text-[var(--text-muted)] transition hover:text-[var(--text-primary)]">
          <X className="h-4 w-4" />
        </button>
      </div>

      {results.length > 0 && (
        <div className="glass-panel absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="flex w-full items-center gap-3 border-b border-white/6 px-3 py-3 text-left transition last:border-b-0 hover:bg-white/5"
            >
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[var(--accent-bright)]" />
              <div className="min-w-0">
                <div className="truncate text-[12px] text-[var(--text-primary)]">{item.label}</div>
                <div className="truncate text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{item.sublabel}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
