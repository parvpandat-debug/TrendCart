import { AgentSession } from '../types/agent';
import { Product } from '../types/product';
import { AnalyticsDashboardResponse } from '../types/analytics';
import { AuditLog, AuditStats } from '../types/audit';

const API_BASE = '/api';

export const apiClient = {
  // Agent Endpoints
  async createSession(user_query: string, budget_limit: number = 1000.0): Promise<AgentSession> {
    const res = await fetch(`${API_BASE}/agent/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_query, budget_limit }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async listSessions(): Promise<AgentSession[]> {
    const res = await fetch(`${API_BASE}/agent/sessions`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getSession(sessionId: string): Promise<AgentSession> {
    const res = await fetch(`${API_BASE}/agent/sessions/${sessionId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async stepSession(sessionId: string): Promise<AgentSession> {
    const res = await fetch(`${API_BASE}/agent/sessions/${sessionId}/step`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async autoRunSession(sessionId: string): Promise<AgentSession> {
    const res = await fetch(`${API_BASE}/agent/sessions/${sessionId}/auto-run`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async approveDecision(sessionId: string, decision: 'APPROVE' | 'REJECT' | 'MODIFY', feedback?: string): Promise<AgentSession> {
    const res = await fetch(`${API_BASE}/agent/sessions/${sessionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, feedback }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async killSession(sessionId: string, reason?: string): Promise<AgentSession> {
    const res = await fetch(`${API_BASE}/agent/sessions/${sessionId}/kill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reason || 'User triggered emergency kill switch' }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Catalog Endpoints
  async getProducts(params?: { category?: string; max_price?: number; search?: string; tag?: string }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.max_price) searchParams.append('max_price', params.max_price.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tag) searchParams.append('tag', params.tag);

    const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getCategories(): Promise<{ name: string; count: number }[]> {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Analytics Endpoints
  async getAnalyticsDashboard(): Promise<AnalyticsDashboardResponse> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async simulateMonth(): Promise<{ success: boolean; new_period: string; dashboard: AnalyticsDashboardResponse }> {
    const res = await fetch(`${API_BASE}/analytics/simulate-month`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Trust & Safety Audit Endpoints
  async getAuditLogs(params?: { session_id?: string; is_irreversible?: boolean; status?: string; limit?: number }): Promise<AuditLog[]> {
    const searchParams = new URLSearchParams();
    if (params?.session_id) searchParams.append('session_id', params.session_id);
    if (params?.is_irreversible !== undefined) searchParams.append('is_irreversible', params.is_irreversible.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/audit/logs?${searchParams.toString()}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getAuditStats(): Promise<AuditStats> {
    const res = await fetch(`${API_BASE}/audit/stats`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
