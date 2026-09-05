export interface AuditLog {
  id: number;
  session_id?: string;
  actor: 'AGENT' | 'USER' | 'SAFETY_GUARD' | 'SYSTEM';
  action: string;
  is_irreversible: boolean;
  status: 'SUCCESS' | 'BLOCKED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'KILLED';
  details: string;
  payload?: Record<string, any>;
  timestamp: string;
}

export interface AuditStats {
  total_actions: number;
  reversible_count: number;
  irreversible_count: number;
  human_interventions: number;
  blocked_actions: number;
  compliance_score_pct: number;
}
