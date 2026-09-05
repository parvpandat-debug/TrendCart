export interface KPICard {
  title: string;
  value: string;
  change_pct: number;
  change_direction: 'up' | 'down';
  subtitle: string;
  icon: string;
}

export interface TimeSeriesPoint {
  date: string;
  total_transactions: number;
  agentic_transactions: number;
  ai_assisted_transactions: number;
  human_only_transactions: number;
  agentic_adoption_rate: number;
  avg_decision_time_sec: number;
  budget_savings_usd: number;
}

export interface CategoryAdoption {
  category: string;
  agentic_share_pct: number;
  total_volume: number;
  growth_yoy_pct: number;
}

export interface AnalyticsDashboardResponse {
  kpis: KPICard[];
  time_series: TimeSeriesPoint[];
  category_breakdown: CategoryAdoption[];
  efficiency_metrics: Record<string, any>;
}
