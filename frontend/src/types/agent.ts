import { Product } from './product';

export interface AgentTrace {
  id: number;
  session_id: string;
  step_number: number;
  phase: 'PLAN' | 'ACT' | 'OBSERVE' | 'APPROVE';
  action_type: string;
  title: string;
  reasoning: string;
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  is_reversible: boolean;
  timestamp: string;
}

export interface CandidateComparison {
  product_id: number;
  title: string;
  brand: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  score: number;
  specs: Record<string, any>;
  pros: string[];
  cons: string[];
  image_url?: string;
  breakdown: Record<string, string>;
}

export interface TradeOffAnalysis {
  recommended_id?: number;
  recommended_product_title?: string;
  match_score?: number;
  summary_rationale?: string;
  budget_spent?: number;
  budget_remaining?: number;
  candidates?: CandidateComparison[];
}

export interface Order {
  id: string;
  session_id: string;
  product_id: number;
  product_title: string;
  unit_price: number;
  quantity: number;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface AgentSession {
  id: string;
  user_query: string;
  budget_limit: number;
  status: 'IDLE' | 'PLANNING' | 'SEARCHING' | 'COMPARING' | 'AWAITING_APPROVAL' | 'APPROVED' | 'CHECKING_OUT' | 'COMPLETED' | 'REJECTED' | 'CANCELLED' | 'FAILED';
  current_step: number;
  current_phase: string;
  parsed_intent?: {
    category?: string;
    max_price?: number;
    use_case?: string;
    priorities?: string[];
    target_tags?: string[];
    brand_affinity?: string;
  };
  candidate_product_ids?: number[];
  recommended_product_id?: number;
  recommended_product?: Product;
  candidate_products?: Product[];
  trade_off_analysis?: TradeOffAnalysis;
  cart_item?: {
    product_id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    delivery_days: number;
  };
  total_cost: number;
  is_killed: boolean;
  human_feedback?: string;
  created_at: string;
  updated_at: string;
  traces: AgentTrace[];
  order?: Order;
}
