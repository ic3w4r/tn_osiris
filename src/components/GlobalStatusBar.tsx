'use client';

import { motion } from 'framer-motion';

import { GovernanceDashboardData } from '@/lib/tn-governance-data';

interface GlobalStatusBarProps {
  data: GovernanceDashboardData;
}

export default function GlobalStatusBar({ data }: GlobalStatusBarProps) {
  const ticker = [
    `${data.statewideSummary.monitoredDistricts} districts monitored`,
    `${data.statewideSummary.pendingGrievances.toLocaleString()} pending grievances`,
    `${data.statewideSummary.delayedProjects} delayed projects`,
    `Tender risk exposure ₹${data.statewideSummary.tenderValueAtRiskCrore} Cr`,
    `Scheme delivery rate ${data.statewideSummary.schemeDeliveryRate}%`,
    `Budget utilization ${data.statewideSummary.budgetUtilization}%`,
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="fixed inset-x-0 bottom-0 z-[220] hidden md:block"
    >
      <div className="h-[30px] border-t border-white/10 bg-[rgba(6,17,30,0.94)] text-[10px] font-mono text-[var(--text-secondary)] backdrop-blur-xl">
        <div className="flex h-full items-center">
          <div className="flex h-full flex-shrink-0 items-center gap-2 border-r border-white/10 bg-[rgba(4,11,20,0.98)] px-4">
            <span className="text-[var(--accent-bright)]">STATE OPS</span>
            <span className="text-[var(--text-muted)]">LIVE</span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex items-center animate-ticker whitespace-nowrap">
              {[...ticker, ...ticker].map((item, index) => (
                <span key={`${item}-${index}`} className="mx-5 inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-bright)]/70" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex h-full flex-shrink-0 items-center border-l border-white/10 px-4 text-[var(--text-muted)]">
            TN GRID
          </div>
        </div>
      </div>
    </motion.div>
  );
}
