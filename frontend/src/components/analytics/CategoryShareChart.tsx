import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CategoryAdoption } from '../../types/analytics';

interface CategoryShareChartProps {
  categories: CategoryAdoption[];
}

const COLORS = ['#06B6D4', '#8B5CF6', '#3B82F6', '#10B981'];

export const CategoryShareChart: React.FC<CategoryShareChartProps> = ({ categories }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryAdoption;
      return (
        <div className="p-3 rounded-xl bg-background-panel border border-cyan-500/40 shadow-xl text-xs space-y-1">
          <span className="font-bold text-white block">{data.category}</span>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>Agent Adoption Share:</span>
            <span className="font-bold text-cyan-400 font-mono">{data.agentic_share_pct.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>Monthly Volume:</span>
            <span className="font-bold text-white font-mono">{data.total_volume.toLocaleString()} orders</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>YoY Growth:</span>
            <span className="font-bold text-emerald-400 font-mono">+{data.growth_yoy_pct.toFixed(1)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-background-panel border border-background-border space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white">
          Agent Penetration by Retail Category
        </h3>
        <p className="text-xs text-slate-400">
          Percentage of purchases executed autonomously by category
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categories} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#64748B"
              fontSize={11}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={{ stroke: '#1F293D' }}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="#E2E8F0"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1F293D' }}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="agentic_share_pct" radius={[0, 8, 8, 0]} barSize={22}>
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
