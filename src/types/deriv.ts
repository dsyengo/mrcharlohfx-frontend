// types/deriv.ts
export interface DerivConfig {
  appId: number;
  endpoint: string;
}

export interface AuthState {
  token: string;
  isAuthenticated: boolean;
  loginId: string;
  currency: string;
  balance: number;
}

export interface Market {
  symbol: string;
  displayName: string;
  market: string;
  submarket: string;
  tradeTypes: TradeType[];
}

export interface TradeType {
  name: string;
  value: string;
  basis: "stake" | "payout";
}

export interface TickData {
  ask: number;
  bid: number;
  epoch: number;
  id: string;
  pip_size: number;
  quote: number;
  symbol: string;
  digit?: number;
}

export interface ProposalRequest {
  amount: number;
  basis: string;
  contract_type: string;
  currency: string;
  duration: number;
  duration_unit: string;
  symbol: string;
  barrier?: string;
  barrier2?: string;
}

export interface ProposalResponse {
  proposal: number;
  ask_price: number;
  display_value: string;
  id: string;
  payout: number;
  spot: number;
}

export interface BuyContractRequest {
  buy: string;
  price: number;
  parameters?: {
    amount: number;
    basis: string;
    contract_type: string;
    currency: string;
    duration: number;
    duration_unit: string;
    symbol: string;
  };
}

export interface BuyContractResponse {
  buy: {
    balance_after: number;
    contract_id: number;
    longcode: string;
    payout: number;
    purchase_time: number;
    shortcode: string;
    transaction_id: number;
  };
}

// types/analytics.ts
export interface DigitAnalysis {
  digit: number;
  frequency: number;
  percentage: number;
  lastSeen: number;
  streak: number;
  expectedValue: number;
}

export interface VolatilityMetrics {
  currentVolatility: number;
  averageVolatility: number;
  volatilityTrend: "increasing" | "decreasing" | "stable";
  tickVariance: number;
}

export interface MovingAverage {
  period: number;
  value: number;
  trend: "up" | "down" | "neutral";
}

export interface AnomalyDetection {
  type: "spike" | "drop" | "stagnation";
  severity: "low" | "medium" | "high";
  timestamp: number;
  value: number;
  expectedRange: [number, number];
}

// types/strategy.ts
export interface StrategyRule {
  id: string;
  condition: StrategyCondition;
  action: TradeAction;
  enabled: boolean;
}

export interface StrategyCondition {
  type: "digit_pattern" | "moving_average" | "volatility" | "custom";
  operator: "contains" | "equals" | "greater" | "less" | "crosses";
  value: any;
  lookbackPeriod?: number;
}

export interface TradeAction {
  type: "digit_match" | "rise_fall" | "touch" | "higher_lower";
  digit?: number;
  amount: number;
  duration: number;
}

export interface BacktestResult {
  strategyId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  accuracy: number;
  totalPayout: number;
  totalStake: number;
  netProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: BacktestTrade[];
  period: {
    start: Date;
    end: Date;
  };
}

export interface BacktestTrade {
  timestamp: Date;
  action: TradeAction;
  result: "win" | "loss";
  payout: number;
  stake: number;
  digit?: number;
  marketCondition: string;
}
