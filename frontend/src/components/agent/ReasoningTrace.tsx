import React, { useState } from 'react';
import { Brain, Zap, Search, ShieldCheck, ChevronDown, ChevronRight, Terminal, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { AgentTrace } from '../../types/agent';

interface ReasoningTraceProps {
  traces: AgentTrace[];
  isStreaming?: boolean;
}

export const ReasoningTrace: React.FC<ReasoningTraceProps> = ({ traces, isStreaming = false }) => {
  const [expandedTraceIds, setExpandedTraceIds] = useState<Record<number, boolean>>({});

  const toggleTrace = (id: number) => {
    setExpandedTraceIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getPhaseMeta = (phase: string) => {
    switch (phase) {
      case 'PLAN':
        return { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
      case 'ACT':
        return { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
      case 'OBSERVE':
        return { icon: Search, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
      case 'APPROVE':
        return { icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
      default:
        return { icon: Terminal, color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' };
    }
  };

  if (traces.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-background-panel border border-background-border text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
          <Terminal className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-300">Agent Reasoning Trace</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Give the agent a shopping goal above to view its autonomous step-by-step reasoning and decision graph.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-background-panel border border-background-border overflow-hidden shadow-xl">
      {/* Trace Header */}
      <div className="px-5 py-3.5 border-b border-background-border flex items-center justify-between bg-background-card/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Autonomous Reasoning Trace ({traces.length} steps)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Deterministic State Machine</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {traces.map((trace) => {
          const meta = getPhaseMeta(trace.phase);
          const Icon = meta.icon;
          const isExpanded = expandedTraceIds[trace.id] || false;

          return (
            <div
              key={trace.id}
              className="p-3.5 rounded-xl bg-background-card/80 border border-background-border hover:border-slate-700 transition-all"
            >
              {/* Step Title Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg border ${meta.bg} ${meta.color} mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        Step {trace.step_number} • {trace.phase}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200">
                        {trace.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                      {trace.reasoning}
                    </p>
                  </div>
                </div>

                {/* Right Metadata */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      trace.is_reversible
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {trace.is_reversible ? '🟢 Reversible' : '🔴 Irreversible'}
                  </span>
                  
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(trace.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Collapsible Structured I/O Inspector */}
              {(trace.input_data || trace.output_data) && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => toggleTrace(trace.id)}
                    className="flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>{isExpanded ? 'Hide' : 'Inspect'} Structured I/O Payload</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                      {trace.input_data && (
                        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                          <span className="text-slate-400 font-semibold block mb-1">Input Data:</span>
                          <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(trace.input_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      {trace.output_data && (
                        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                          <span className="text-cyan-400 font-semibold block mb-1">Output Data:</span>
                          <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(trace.output_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
