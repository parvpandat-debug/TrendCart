import React from 'react';
import { FastForward, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';

interface LiveMarketSimulatorProps {
  onSimulateMonth: () => void;
  isLoading: boolean;
  latestPeriod?: string;
}

export const LiveMarketSimulator: React.FC<LiveMarketSimulatorProps> = ({
  onSimulateMonth,
  isLoading,
  latestPeriod = '2025-12',
}) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-background-panel to-cyan-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Macro Market Simulation Engine
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Current Horizon: {latestPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Step forward into 2026 to procedurally model accelerating agentic penetration and autonomous transaction growth.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSimulateMonth}
        disabled={isLoading}
        className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Simulating Market...</span>
          </>
        ) : (
          <>
            <FastForward className="w-4 h-4" />
            <span>Simulate Next Month (+1 Mo)</span>
          </>
        )}
      </button>
    </div>
  );
};
