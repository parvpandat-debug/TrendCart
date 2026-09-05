import React from 'react';
import { ShieldCheck, UserCheck, Lock, OctagonAlert, FileText, CheckCircle2 } from 'lucide-react';
import { AuditStats } from '../../types/audit';

interface PolicyGuardrailsProps {
  stats?: AuditStats;
}

export const PolicyGuardrails: React.FC<PolicyGuardrailsProps> = ({ stats }) => {
  const policies = [
    {
      icon: UserCheck,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      title: 'Human Checkpoint Gate (Mandatory)',
      rule: 'Rule AC-01',
      description:
        'All irreversible actions (adding to live cart, charging simulated wallet, placing orders) are hard-blocked by an automated state pause until explicit human authorization is granted.',
      status: 'Enforced',
    },
    {
      icon: Lock,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      title: 'Dynamic Spending Limit Guardrail',
      rule: 'Rule AC-02',
      description:
        'The agent cannot propose or checkout any item whose price exceeds the user-configured budget ceiling without explicit constraint override.',
      status: 'Enforced',
    },
    {
      icon: OctagonAlert,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      title: 'Instant Task Kill Switch',
      rule: 'Rule AC-03',
      description:
        'Provides immediate cancellation capability at any step of the agent execution loop, terminating background actions and preventing order execution.',
      status: 'Active',
    },
    {
      icon: FileText,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      title: 'Immutable Audit Trail',
      rule: 'Rule AC-04',
      description:
        'Every internal micro-action, classification, and user decision is timestamped and stored in a tamper-evident audit ledger with full input/output payloads.',
      status: 'Logging',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Compliance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-background-panel to-background-card border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Trust & Safety Enforcement Protocol</h3>
            <p className="text-xs text-slate-400">
              Deterministic guardrails ensure user agency, financial safety, and full transparency.
            </p>
          </div>
        </div>

        {stats && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-background-dark border border-background-border text-right">
              <span className="text-[10px] text-slate-500 font-mono block">Safety Compliance</span>
              <span className="text-xs font-mono font-bold text-emerald-400">100.0%</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-background-dark border border-background-border text-right">
              <span className="text-[10px] text-slate-500 font-mono block">Human Interventions</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{stats.human_interventions}</span>
            </div>
          </div>
        )}
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {policies.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-background-panel border border-background-border hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${p.bg} ${p.border} ${p.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{p.rule}</span>
                    <h4 className="text-xs font-bold text-slate-200">{p.title}</h4>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {p.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1 font-sans">
                {p.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
