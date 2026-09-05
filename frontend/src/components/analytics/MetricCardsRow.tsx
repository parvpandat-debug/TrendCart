import React from 'react';
import { Bot, TrendingUp, Zap, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KPICard } from '../../types/analytics';

interface MetricCardsRowProps {
  kpis: KPICard[];
}

export const MetricCardsRow: React.FC<MetricCardsRowProps> = ({ kpis }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-5 h-5 text-cyan-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const isPositive = kpi.change_direction === 'up';
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-background-panel border border-background-border hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                {getIcon(kpi.icon)}
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    isPositive ? 'text-emerald-400' : 'text-cyan-400'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(kpi.change_pct)}%
                </span>
                <span className="text-[11px] text-slate-500 truncate">{kpi.subtitle}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
