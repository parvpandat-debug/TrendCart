import React, { useState } from 'react';
import { Play, SkipForward, OctagonAlert, ShieldCheck, DollarSign, Check, X } from 'lucide-react';
import { AgentSession } from '../../types/agent';
import { StatusBadge } from '../common/StatusBadge';

interface LiveSessionControlsProps {
  session: AgentSession;
  onStepForward: () => void;
  onAutoRun: () => void;
  onKillSwitch: (reason: string) => void;
  isLoading: boolean;
}

export const LiveSessionControls: React.FC<LiveSessionControlsProps> = ({
  session,
  onStepForward,
  onAutoRun,
  onKillSwitch,
  isLoading,
}) => {
  const [confirmKill, setConfirmKill] = useState(false);
  const [killReason, setKillReason] = useState('User manually triggered emergency abort');

  const isTerminal = ['COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED'].includes(session.status);
  const isAwaitingApproval = session.status === 'AWAITING_APPROVAL';

  const handleExecuteKill = () => {
    onKillSwitch(killReason);
    setConfirmKill(false);
  };

  return (
    <div className="w-full p-4 rounded-2xl bg-background-panel/90 border border-background-border backdrop-blur-xl space-y-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Session Status & Goal Preview */}
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Session ID:</span>
            <span className="text-xs font-mono text-cyan-400 font-medium">{session.id.slice(0, 8)}...</span>
            <StatusBadge status={session.status} />
          </div>
          <p className="text-sm font-semibold text-slate-200 line-clamp-1">
            "{session.user_query}"
          </p>
        </div>

        {/* Budget & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Budget Limit Tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background-card border border-background-border text-xs">
            <span className="text-slate-400">Budget Limit:</span>
            <span className="font-mono font-bold text-emerald-400">${session.budget_limit.toFixed(2)}</span>
          </div>

          {/* Stepper Buttons (Enabled if active & not waiting for approval) */}
          {!isTerminal && !isAwaitingApproval && (
            <>
              <button
                type="button"
                onClick={onStepForward}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition-all cursor-pointer"
                title="Execute single next micro-step"
              >
                <SkipForward className="w-3.5 h-3.5 text-cyan-400" />
                <span>Step Next</span>
              </button>

              <button
                type="button"
                onClick={onAutoRun}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Pilot to Checkpoint</span>
              </button>
            </>
          )}

          {/* Emergency Kill Switch */}
          {!isTerminal && (
            <div className="relative">
              {!confirmKill ? (
                <button
                  type="button"
                  onClick={() => setConfirmKill(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 shadow-sm transition-all cursor-pointer"
                >
                  <OctagonAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>Kill Switch</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/60 p-1 rounded-xl">
                  <span className="text-[11px] font-bold text-rose-300 px-2">Abort Task?</span>
                  <button
                    type="button"
                    onClick={handleExecuteKill}
                    className="p-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                    title="Confirm Abort"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmKill(false)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
