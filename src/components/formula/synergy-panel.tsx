'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export interface SynergyNote {
  type: 'warn' | 'caution' | 'good' | 'info';
  text: string;
}

interface SynergyPanelProps {
  notes: SynergyNote[];
  className?: string;
}

const iconMap = {
  warn: <AlertTriangle size={14} className="text-accent-rose shrink-0" />,
  caution: <AlertCircle size={14} className="text-accent-gold shrink-0" />,
  good: <CheckCircle size={14} className="text-accent-emerald shrink-0" />,
  info: <Info size={14} className="text-text-muted shrink-0" />,
};

const bgMap = {
  warn: 'bg-accent-rose/10 border-accent-rose/20',
  caution: 'bg-accent-gold/10 border-accent-gold/20',
  good: 'bg-accent-emerald/10 border-accent-emerald/20',
  info: 'bg-surface-elevated/50 border-border-subtle',
};

export function SynergyPanel({ notes, className }: SynergyPanelProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {notes.map((note, i) => (
        <div key={i} className={cn('flex items-start gap-2 px-3 py-2 rounded-xs border text-xs leading-relaxed', bgMap[note.type])}>
          {iconMap[note.type]}
          <span className="text-text-secondary">{note.text}</span>
        </div>
      ))}
    </div>
  );
}
