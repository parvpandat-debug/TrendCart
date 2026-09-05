import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { PhaseStepIndicator } from './components/common/PhaseStepIndicator';
import { AgentChatInput } from './components/agent/AgentChatInput';
import { LiveSessionControls } from './components/agent/LiveSessionControls';
import { ReasoningTrace } from './components/agent/ReasoningTrace';
import { ProductComparison } from './components/agent/ProductComparison';
import { ApprovalCheckpoint } from './components/agent/ApprovalCheckpoint';
import { OrderReceiptCard } from './components/agent/OrderReceiptCard';
import { MetricCardsRow } from './components/analytics/MetricCardsRow';
import { AdoptionGrowthChart } from './components/analytics/AdoptionGrowthChart';
import { CategoryShareChart } from './components/analytics/CategoryShareChart';
import { DecisionSpeedChart } from './components/analytics/DecisionSpeedChart';
import { LiveMarketSimulator } from './components/analytics/LiveMarketSimulator';
import { PolicyGuardrails } from './components/trust/PolicyGuardrails';
import { AuditLogTable } from './components/trust/AuditLogTable';
import { CatalogExplorer } from './components/catalog/CatalogExplorer';
import { apiClient } from './api/client';
import { AgentSession } from './types/agent';
import { AnalyticsDashboardResponse } from './types/analytics';
import { AuditLog, AuditStats } from './types/audit';
import { Bot, LineChart, ShieldCheck, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'agent' | 'analytics' | 'trust' | 'catalog'>('agent');
  
  // Agent State
  const [currentSession, setCurrentSession] = useState<AgentSession | null>(null);
  const [pastSessions, setPastSessions] = useState<AgentSession[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboardResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Trust & Audit State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Initial Data Load
  useEffect(() => {
    loadDashboardData();
    loadAuditData();
    loadPastSessions();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await apiClient.getAnalyticsDashboard();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to load analytics dashboard:', err);
    }
  };

  const loadAuditData = async () => {
    setIsAuditLoading(true);
    try {
      const [logs, stats] = await Promise.all([
        apiClient.getAuditLogs({ limit: 100 }),
        apiClient.getAuditStats(),
      ]);
      setAuditLogs(logs);
      setAuditStats(stats);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsAuditLoading(false);
    }
  };

  const loadPastSessions = async () => {
    try {
      const sessions = await apiClient.listSessions();
      setPastSessions(sessions);
      if (sessions.length > 0 && !currentSession) {
        setCurrentSession(sessions[0]);
      }
    } catch (err) {
      console.error('Failed to load past sessions:', err);
    }
  };

  // Agent Operations
  const handleStartSession = async (query: string, budgetLimit: number) => {
    setIsAgentLoading(true);
    setAgentError(null);
    try {
      // 1. Create session
      const newSession = await apiClient.createSession(query, budgetLimit);
      setCurrentSession(newSession);

      // 2. Auto-run until human checkpoint
      const pausedSession = await apiClient.autoRunSession(newSession.id);
      setCurrentSession(pausedSession);

      // Refresh audits and past sessions
      loadAuditData();
      loadPastSessions();
      loadDashboardData();
    } catch (err: any) {
      setAgentError(err.message || 'Failed to execute agent shopping loop.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleStepForward = async () => {
    if (!currentSession) return;
    setIsAgentLoading(true);
    setAgentError(null);
    try {
      const updated = await apiClient.stepSession(currentSession.id);
      setCurrentSession(updated);
      loadAuditData();
    } catch (err: any) {
      setAgentError(err.message || 'Step failed.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleAutoRun = async () => {
    if (!currentSession) return;
    setIsAgentLoading(true);
    setAgentError(null);
    try {
      const updated = await apiClient.autoRunSession(currentSession.id);
      setCurrentSession(updated);
      loadAuditData();
    } catch (err: any) {
      setAgentError(err.message || 'Auto-run failed.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleApprovePurchase = async (feedback?: string) => {
    if (!currentSession) return;
    setIsAgentLoading(true);
    setAgentError(null);
    try {
      const completed = await apiClient.approveDecision(currentSession.id, 'APPROVE', feedback);
      setCurrentSession(completed);
      loadAuditData();
      loadDashboardData();
    } catch (err: any) {
      setAgentError(err.message || 'Approval execution failed.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleRejectPurchase = async (feedback?: string) => {
    if (!currentSession) return;
    setIsAgentLoading(true);
    setAgentError(null);
    try {
      const rejected = await apiClient.approveDecision(currentSession.id, 'REJECT', feedback);
      setCurrentSession(rejected);
      loadAuditData();
    } catch (err: any) {
      setAgentError(err.message || 'Rejection failed.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleModifyCriteria = async (feedback: string) => {
    if (!currentSession) return;
    setIsAgentLoading(true);
    setAgentError(null);
    try {
      const revised = await apiClient.approveDecision(currentSession.id, 'MODIFY', feedback);
      setCurrentSession(revised);
      loadAuditData();
    } catch (err: any) {
      setAgentError(err.message || 'Criteria revision failed.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleKillSwitch = async (reason: string) => {
    if (!currentSession) return;
    setIsAgentLoading(true);
    try {
      const killed = await apiClient.killSession(currentSession.id, reason);
      setCurrentSession(killed);
      loadAuditData();
    } catch (err: any) {
      setAgentError(err.message || 'Kill switch failed.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleSimulateMonth = async () => {
    setIsSimulating(true);
    try {
      const res = await apiClient.simulateMonth();
      if (res.dashboard) {
        setAnalyticsData(res.dashboard);
      }
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDelegateGoalFromCatalog = (prompt: string, budget: number) => {
    setActiveTab('agent');
    handleStartSession(prompt, budget);
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Ambient background glows */}
      <div className="ambient-gradient-1" />
      <div className="ambient-gradient-2" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSessionCount={pastSessions.filter((s) => s.status === 'AWAITING_APPROVAL').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 space-y-6">
        
        {/* Error Banner if any */}
        {agentError && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{agentError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAgentError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: AGENT STUDIO & SHOPPING COMMAND CENTER */}
        {/* ========================================================================= */}
        {activeTab === 'agent' && (
          <div className="space-y-6">
            
            {/* Goal Input & Preset Prompts */}
            <AgentChatInput onStartSession={handleStartSession} isLoading={isAgentLoading} />

            {/* If an active session exists, render the live execution pipeline */}
            {currentSession && (
              <div className="space-y-5 animate-fade-in">
                
                {/* 6-Phase Pipeline Stepper */}
                <PhaseStepIndicator
                  currentStep={currentSession.current_step}
                  status={currentSession.status}
                />

                {/* Live Session Controls & Kill Switch */}
                <LiveSessionControls
                  session={currentSession}
                  onStepForward={handleStepForward}
                  onAutoRun={handleAutoRun}
                  onKillSwitch={handleKillSwitch}
                  isLoading={isAgentLoading}
                />

                {/* Human-in-the-Loop Approval Checkpoint Banner (When status is AWAITING_APPROVAL) */}
                {currentSession.status === 'AWAITING_APPROVAL' && (
                  <ApprovalCheckpoint
                    session={currentSession}
                    onApprove={handleApprovePurchase}
                    onReject={handleRejectPurchase}
                    onModify={handleModifyCriteria}
                    isLoading={isAgentLoading}
                  />
                )}

                {/* Order Confirmation Receipt (When status is COMPLETED) */}
                {currentSession.status === 'COMPLETED' && currentSession.order && (
                  <OrderReceiptCard
                    order={currentSession.order}
                    onViewAudit={() => setActiveTab('trust')}
                    onNewSession={() => setCurrentSession(null)}
                  />
                )}

                {/* Side-by-Side Product Trade-Off Comparison Matrix */}
                {currentSession.trade_off_analysis && (
                  <ProductComparison
                    tradeOffAnalysis={currentSession.trade_off_analysis}
                    budgetLimit={currentSession.budget_limit}
                  />
                )}

                {/* Live Agent Reasoning Trace Timeline */}
                <ReasoningTrace traces={currentSession.traces || []} />

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI GROWTH ANALYTICS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && analyticsData && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Live Horizon Simulator Banner */}
            <LiveMarketSimulator
              onSimulateMonth={handleSimulateMonth}
              isLoading={isSimulating}
              latestPeriod={analyticsData.time_series[analyticsData.time_series.length - 1]?.date}
            />

            {/* KPI Stat Cards */}
            <MetricCardsRow kpis={analyticsData.kpis} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stacked Adoption Area Chart */}
              <AdoptionGrowthChart data={analyticsData.time_series} />

              {/* Category Breakdown Bar Chart */}
              <CategoryShareChart categories={analyticsData.category_breakdown} />
            </div>

            {/* Decision Speed & Latency Curve */}
            <DecisionSpeedChart
              data={analyticsData.time_series}
              efficiencyMetrics={analyticsData.efficiency_metrics}
            />

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TRUST & SAFETY AUDIT TRAIL */}
        {/* ========================================================================= */}
        {activeTab === 'trust' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Policy Explanations & Compliance Card */}
            <PolicyGuardrails stats={auditStats || undefined} />

            {/* Verifiable Action Ledger Table */}
            <AuditLogTable
              logs={auditLogs}
              isLoading={isAuditLoading}
              onRefresh={loadAuditData}
            />

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MOCK PRODUCT CATALOG EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="animate-fade-in">
            <CatalogExplorer onDelegateGoal={handleDelegateGoalFromCatalog} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-background-border bg-background-dark/80 backdrop-blur-xl py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">TrendCart Platform</span>
            <span>— AI Growth Analytics & Autonomous Agentic Commerce Demo</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-emerald-400 font-semibold">● Local SQLite Backend</span>
            <span className="text-cyan-400 font-semibold">● Deterministic Loop</span>
            <span className="text-purple-400 font-semibold">● Verifiable Ledger</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
