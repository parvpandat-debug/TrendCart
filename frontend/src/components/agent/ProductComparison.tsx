import React from 'react';
import { Award, Check, X, Star, DollarSign, Cpu, HardDrive, Monitor, BatteryCharging } from 'lucide-react';
import { TradeOffAnalysis } from '../../types/agent';

interface ProductComparisonProps {
  tradeOffAnalysis: TradeOffAnalysis;
  budgetLimit: number;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ tradeOffAnalysis, budgetLimit }) => {
  const candidates = tradeOffAnalysis.candidates || [];

  if (candidates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header & Agent Summary Rationale */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-background-panel to-purple-950/40 border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Autonomous Comparative Analysis & Recommendation
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
          {tradeOffAnalysis.summary_rationale}
        </p>
      </div>

      {/* Side-by-Side Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {candidates.map((item, idx) => {
          const isWinner = idx === 0;
          const isUnderBudget = item.price <= budgetLimit;

          return (
            <div
              key={item.product_id}
              className={`relative rounded-2xl flex flex-col justify-between overflow-hidden transition-all ${
                isWinner
                  ? 'bg-background-panel border-2 border-cyan-400/80 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/20'
                  : 'bg-background-card/80 border border-background-border'
              }`}
            >
              {/* Winner Top Banner */}
              {isWinner && (
                <div className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 px-3 py-1 flex items-center justify-between text-slate-950 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>#1 Top Agent Recommendation</span>
                  </span>
                  <span className="bg-slate-950 text-cyan-300 px-1.5 py-0.2 rounded font-mono text-[10px]">
                    Score: {item.score}/100
                  </span>
                </div>
              )}

              <div className="p-4 space-y-3.5 flex-1">
                {/* Product Image & Title */}
                <div className="flex items-start gap-3">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-background-border shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                      {item.brand}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold">{item.rating}</span>
                      <span className="text-slate-500 text-[10px]">({item.review_count})</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Budget Impact */}
                <div className="p-2.5 rounded-xl bg-background-dark/80 border border-background-border flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-white font-mono">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ${item.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium block ${isUnderBudget ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUnderBudget
                        ? `✓ $${(budgetLimit - item.price).toFixed(2)} below budget cap`
                        : `✗ Exceeds budget by $${(item.price - budgetLimit).toFixed(2)}`}
                    </span>
                  </div>

                  {!isWinner && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Score</span>
                      <span className="text-xs font-bold text-slate-300 font-mono">{item.score}/100</span>
                    </div>
                  )}
                </div>

                {/* Key Specs Snapshot */}
                <div className="space-y-1 text-[11px] text-slate-300">
                  {item.specs.cpu && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate text-slate-300">{item.specs.cpu}</span>
                    </div>
                  )}
                  {item.specs.ram_gb && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <HardDrive className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="text-slate-300">{item.specs.ram_gb}GB RAM • {item.specs.storage_gb || 512}GB SSD</span>
                    </div>
                  )}
                  {item.specs.display && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Monitor className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate text-slate-300">{item.specs.display}</span>
                    </div>
                  )}
                </div>

                {/* Pros & Cons Bullets */}
                <div className="space-y-2 pt-2 border-t border-background-border/80">
                  <div className="space-y-1">
                    {item.pros.slice(0, 3).map((pro, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-1.5 text-[11px] text-emerald-300/90">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{pro}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    {item.cons.slice(0, 2).map((con, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-[11px] text-amber-400/90">
                        <X className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
