import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TimeSeriesPoint } from '../../types/analytics';

interface AdoptionGrowthChartProps {
  data: TimeSeriesPoint[];
}

export const AdoptionGrowthChart: React.FC<AdoptionGrowthChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
      const agentic = payload.find((p: any) => p.dataKey === 'agentic_transactions')?.value || 0;
      const agenticPct = total > 0 ? ((agentic / total) * 100).toFixed(1) : 0;

      return (
        <div className="p-3.5 rounded-xl bg-background-panel border border-cyan-500/40 shadow-xl backdrop-blur-xl text-xs space-y-2">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5 font-mono">
            <span className="font-bold text-slate-200">{label}</span>
            <span className="text-cyan-400 font-semibold">{agenticPct}% Autonomous</span>
          </div>

          <div className="space-y-1">
            {payload.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}:
                </span>
                <span className="font-mono font-bold text-white">
                  {p.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-background-panel border border-background-border space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white">
            Macro AI Adoption: Autonomous vs Human-Only Commerce
          </h3>
          <p className="text-xs text-slate-400">
            24-month transaction volume growth showing autonomous agent expansion
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Autonomous Agent
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            AI-Assisted
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            Human-Only
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAgentic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorAssisted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0.0} />
              </linearGradient>
            </defs>

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
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="agentic_transactions"
              name="Autonomous Agent"
              stroke="#06B6D4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAgentic)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="ai_assisted_transactions"
              name="AI-Assisted"
              stroke="#8B5CF6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAssisted)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="human_only_transactions"
              name="Human-Only"
              stroke="#64748B"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorHuman)"
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
