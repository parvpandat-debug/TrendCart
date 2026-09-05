import React, { useState } from 'react';
import { Sparkles, DollarSign, Send, ArrowRight, Laptop, Headphones, Armchair, Shield } from 'lucide-react';

interface AgentChatInputProps {
  onStartSession: (query: string, budgetLimit: number) => void;
  isLoading: boolean;
}

const DEMO_PRESETS = [
  {
    icon: Laptop,
    category: 'Laptops',
    title: 'Budget Creator Laptop',
    prompt: 'Find me a budget laptop under $700 for video editing',
    budget: 700,
  },
  {
    icon: Headphones,
    category: 'Audio',
    title: 'Travel ANC Headphones',
    prompt: 'Find me wireless noise-cancelling headphones for flights under $350',
    budget: 350,
  },
  {
    icon: Armchair,
    category: 'Workspace',
    title: 'Ergonomic Coding Peripherals',
    prompt: 'Find me a quiet ergonomic mouse and mechanical keyboard for programming under $300',
    budget: 300,
  },
  {
    icon: Laptop,
    category: 'Laptops',
    title: 'Developer Workstation',
    prompt: 'Find me a high-end 32GB RAM laptop for software development and local AI under $1600',
    budget: 1600,
  },
];

export const AgentChatInput: React.FC<AgentChatInputProps> = ({ onStartSession, isLoading }) => {
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState(700);
  const [showBudgetCustom, setShowBudgetCustom] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onStartSession(query.trim(), budget);
  };

  const handlePresetSelect = (preset: typeof DEMO_PRESETS[0]) => {
    setQuery(preset.prompt);
    setBudget(preset.budget);
  };

  return (
    <div className="w-full space-y-4">
      {/* Interactive Chat Bar */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 rounded-2xl bg-gradient-to-b from-background-panel to-background-card border border-background-border focus-within:border-cyan-500/60 focus-within:ring-4 focus-within:ring-cyan-500/10 shadow-2xl transition-all">
          
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Instruct the autonomous agent (e.g., 'Find me a budget laptop under $700 for video editing')..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2 py-1"
            disabled={isLoading}
          />

          {/* Budget Limit Setting */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background-dark/80 border border-background-border">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400">Budget Cap:</span>
            <div className="flex items-center text-cyan-400 font-mono text-xs font-semibold">
              <span>$</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min={50}
                max={5000}
                step={25}
                className="w-16 bg-transparent text-cyan-400 font-mono text-xs font-semibold focus:outline-none border-b border-cyan-500/30 text-center"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Agent Active...</span>
              </span>
            ) : (
              <>
                <span>Launch Agent</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Demo Scenario Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-medium text-[11px] uppercase tracking-wider text-slate-500">
            Quick-Start Demo Goals
          </span>
          <span className="text-[11px] text-slate-500">Click to load realistic criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DEMO_PRESETS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="flex items-start gap-3 p-3 rounded-xl bg-background-card/60 hover:bg-background-card border border-background-border hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-background-panel border border-background-border group-hover:border-cyan-500/30 text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                      {preset.title}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-medium">
                      &lt;${preset.budget}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    "{preset.prompt}"
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
