import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'IDLE':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'PLANNING':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse';
      case 'SEARCHING':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse';
      case 'COMPARING':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse';
      case 'AWAITING_APPROVAL':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 glow-amber font-semibold animate-bounce';
      case 'APPROVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-emerald';
      case 'CHECKING_OUT':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse';
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 glow-emerald font-semibold';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 glow-rose font-semibold';
      case 'FAILED':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'AWAITING_APPROVAL':
        return '⚠️ Human Checkpoint Required';
      case 'COMPLETED':
        return '✓ Purchase Completed';
      case 'CANCELLED':
        return '🛑 Session Aborted (Kill Switch)';
      default:
        return status.replace('_', ' ');
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getBadgeStyle()}`}>
      {getLabel()}
    </span>
  );
};
