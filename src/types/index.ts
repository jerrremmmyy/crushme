export interface Analysis {
  id: string;
  user_id: string;
  score: number;
  explanation: string;
  conversation_text: string;
  suggestions: Suggestion[];
  created_at: string;
}

export interface Suggestion {
  tone: "drole" | "charmeur" | "direct" | "mysterieux";
  tone_label: string;
  tone_emoji: string;
  message: string;
}

export interface AnalysisResult {
  score: number;
  explanation: string;
  conversation_text: string;
  suggestions: Suggestion[];
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: "active" | "trialing" | "canceled" | "past_due" | "incomplete";
  plan: "trial" | "monthly";
  current_period_end: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  age_verified: boolean;
  free_analysis_used: boolean;
  created_at: string;
}

export interface UsageLimit {
  user_id: string;
  date: string;
  count: number;
}
