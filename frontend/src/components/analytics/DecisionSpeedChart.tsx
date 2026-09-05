import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesPoint } from '../../types/analytics';
import { Zap, Clock, Shield } from 'lucide-react';

interface DecisionSpeedChartProps {
  data: TimeSeriesPoint[];
  efficiencyMetrics: Record<string, any>;
}

export const DecisionSpeedChart: React.FC<DecisionSpeedChartProps> = ({ data, efficiencyMetrics }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const speed = payload[0].value;
      return (
        <div className="p-3 rounded-xl bg-background-panel border border-cyan-500/40 shadow-xl text-xs space-y-1">
          <span className="font-bold text-white block">{label}</span>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>Autonomous Decision Latency:</span>
            <span className="font-bold text-amber-400 font-mono">{speed.toFixed(2)}s</span>
          </div>
          <p className="text-[10px] text-slate-400">vs 2,700s (45m) human comparison benchmark</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-background-panel border border-background-border space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Agent Decision Latency Curve
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Time required to parse, search catalog, and construct trade-off matrix
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono font-semibold">
          <span>Speedup: 2,250x vs Manual</span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F293D' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F293D' }}
              tickFormatter={(v) => `${v}s`}
              domain={[0, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="avg_decision_time_sec"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: '#F59E0B', r: 3 }}
              activeDot={{ r: 6, fill: '#FBBF24', stroke: '#0B0F19', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Efficiency Highlights Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-background-border text-xs">
        <div className="p-2 rounded-lg bg-background-card">
          <span className="text-[10px] text-slate-500 block">Guardrail Interventions</span>
          <span className="font-mono font-bold text-white">{efficiencyMetrics.total_guardrail_interventions || 510}</span>
        </div>
        <div className="p-2 rounded-lg bg-background-card">
          <span className="text-[10px] text-slate-500 block">Budget Overshoot</span>
          <span className="font-mono font-bold text-emerald-400">0.0%</span>
        </div>
        <div className="p-2 rounded-lg bg-background-card">
          <span className="text-[10px] text-slate-500 block">Checkpoint Compliance</span>
          <span className="font-mono font-bold text-emerald-400">100%</span>
        </div>
        <div className="p-2 rounded-lg bg-background-card">
          <span className="text-[10px] text-slate-500 block">Human Baseline</span>
          <span className="font-mono font-bold text-slate-400">45 mins</span>
        </div>
      </div>
    </div>
  );
};
