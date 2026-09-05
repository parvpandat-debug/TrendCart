import React, { useState } from 'react';
import { ShieldCheck, User, Bot, AlertTriangle, ChevronDown, ChevronRight, Filter, Clock, Search } from 'lucide-react';
import { AuditLog } from '../../types/audit';

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, isLoading, onRefresh }) => {
  const [filterActor, setFilterActor] = useState<string>('ALL');
  const [filterReversibility, setFilterReversibility] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const filteredLogs = logs.filter((log) => {
    if (filterActor !== 'ALL' && log.actor !== filterActor) return false;
    if (filterReversibility === 'REVERSIBLE' && log.is_irreversible) return false;
    if (filterReversibility === 'IRREVERSIBLE' && !log.is_irreversible) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.session_id && log.session_id.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getActorIcon = (actor: string) => {
    switch (actor) {
      case 'AGENT':
        return <Bot className="w-3.5 h-3.5 text-cyan-400" />;
      case 'USER':
        return <User className="w-3.5 h-3.5 text-purple-400" />;
      case 'SAFETY_GUARD':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PENDING_APPROVAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold animate-pulse';
      case 'BLOCKED':
      case 'REJECTED':
      case 'KILLED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl bg-background-panel border border-background-border overflow-hidden shadow-xl space-y-3">
      
      {/* Table Toolbar / Filters */}
      <div className="p-4 border-b border-background-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-background-card/40">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, details, session ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-background-dark/80 border border-background-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Actor Filter */}
          <select
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-background-dark/80 border border-background-border text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="ALL">All Actors</option>
            <option value="AGENT">Agent Only</option>
            <option value="USER">User Actions</option>
            <option value="SAFETY_GUARD">Safety Guard</option>
          </select>

          {/* Reversibility Filter */}
          <select
            value={filterReversibility}
            onChange={(e) => setFilterReversibility(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-background-dark/80 border border-background-border text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="ALL">All Reversibility</option>
            <option value="REVERSIBLE">🟢 Reversible Actions</option>
            <option value="IRREVERSIBLE">🔴 Irreversible (Financial/Cart)</option>
          </select>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>

      </div>

      {/* Log Entries Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-background-border bg-background-dark/60 text-slate-400 font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-3">Actor</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Reversibility</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-3 text-right">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-border/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No audit logs match current filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                          {getActorIcon(log.actor)}
                          <span>{log.actor}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-200 whitespace-nowrap text-[11px]">
                        {log.action}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            log.is_irreversible
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {log.is_irreversible ? '🔴 Irreversible' : '🟢 Reversible'}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate font-sans">
                        {log.details}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {log.payload && Object.keys(log.payload).length > 0 ? (
                          <button
                            type="button"
                            onClick={() => toggleExpand(log.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono font-medium cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                        ) : (
                          <span className="text-slate-600 font-mono text-[10px]">—</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable JSON Payload Row */}
                    {isExpanded && log.payload && (
                      <tr className="bg-slate-950/90">
                        <td colSpan={7} className="p-3 pl-8">
                          <div className="p-3 rounded-xl bg-background-dark border border-slate-800 text-[11px] font-mono text-slate-300">
                            <span className="text-cyan-400 font-semibold block mb-1">Payload Snapshot:</span>
                            <pre className="overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
