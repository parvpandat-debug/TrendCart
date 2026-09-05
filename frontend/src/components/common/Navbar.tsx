import React from 'react';
import { Bot, LineChart, ShieldCheck, ShoppingBag, Zap, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'agent' | 'analytics' | 'trust' | 'catalog';
  setActiveTab: (tab: 'agent' | 'analytics' | 'trust' | 'catalog') => void;
  activeSessionCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, activeSessionCount = 0 }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-background-border bg-background-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('agent')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background-dark animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                TrendCart
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Agentic Commerce
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">Autonomous Shopping & Growth Telemetry</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-background-card/80 border border-background-border">
          <button
            onClick={() => setActiveTab('agent')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'agent'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Agent Studio</span>
            {activeSessionCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-500 text-slate-950 font-bold">
                {activeSessionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>AI Growth Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('trust')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'trust'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trust & Safety Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Mock Catalog</span>
          </button>
        </nav>

        {/* Live System Guard Status & Wallet */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-300">Guardrails: Active</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-background-panel border border-background-border text-xs text-slate-300">
            <span className="text-slate-500 text-[11px]">Wallet:</span>
            <span className="font-semibold text-cyan-400 font-mono">$5,000.00</span>
          </div>
        </div>

      </div>
    </header>
  );
};
