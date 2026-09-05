import React from 'react';
import { Brain, Search, Filter, Layers, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

interface PhaseStepIndicatorProps {
  currentStep: number;
  status: string;
}

export const PhaseStepIndicator: React.FC<PhaseStepIndicatorProps> = ({ currentStep, status }) => {
  const steps = [
    { num: 1, label: 'Goal Plan', icon: Brain, phase: 'PLAN' },
    { num: 2, label: 'Catalog Scan', icon: Search, phase: 'ACT' },
    { num: 3, label: 'Utility Score', icon: Filter, phase: 'OBSERVE' },
    { num: 4, label: 'Trade-Offs', icon: Layers, phase: 'OBSERVE' },
    { num: 5, label: 'Human Checkpoint', icon: ShieldAlert, phase: 'APPROVE' },
    { num: 6, label: 'Checkout', icon: CheckCircle2, phase: 'ACT' },
  ];

  return (
    <div className="w-full py-3 px-4 rounded-xl bg-background-card/90 border border-background-border">
      <div className="flex items-center justify-between relative">
        {/* Step Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
        
        {steps.map((s) => {
          const Icon = s.icon;
          const isCompleted = currentStep > s.num || (currentStep === 6 && status === 'COMPLETED');
          const isCurrent = currentStep === s.num && status !== 'COMPLETED' && status !== 'CANCELLED' && status !== 'REJECTED';
          const isApprovalStep = s.num === 5 && status === 'AWAITING_APPROVAL';
          const isCancelled = (status === 'CANCELLED' || status === 'REJECTED') && currentStep === s.num;

          let stepCircleStyle = 'bg-slate-900 border-slate-700 text-slate-500';
          let labelStyle = 'text-slate-500';

          if (isApprovalStep) {
            stepCircleStyle = 'bg-amber-500/20 border-amber-400 text-amber-300 ring-4 ring-amber-500/20 animate-pulse';
            labelStyle = 'text-amber-300 font-semibold';
          } else if (isCancelled) {
            stepCircleStyle = 'bg-rose-500/20 border-rose-400 text-rose-300';
            labelStyle = 'text-rose-400 font-medium';
          } else if (isCurrent) {
            stepCircleStyle = 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-4 ring-cyan-500/20';
            labelStyle = 'text-cyan-300 font-semibold';
          } else if (isCompleted) {
            stepCircleStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
            labelStyle = 'text-slate-300';
          }

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${stepCircleStyle}`}
              >
                {isCancelled ? <XCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="text-center">
                <span className={`text-[11px] block transition-colors ${labelStyle}`}>
                  {s.label}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500">
                  {s.phase}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
