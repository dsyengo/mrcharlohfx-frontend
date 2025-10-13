export interface DerivMessage {
    msg_type: string;
    [key: string]: any;
  }
  
  export interface TickData {
    tick?: {
      ask: number;
      bid: number;
      epoch: number;
      id: string;
      pip_size: number;
      quote: number;
      symbol: string;
    };
    subscription?: {
      id: string;
    };
  }
  
  export interface BalanceData {
    balance?: {
      balance: number;
      currency: string;
      id: string;
      loginid: string;
    };
    subscription?: {
      id: string;
    };
  }
  
  export interface ProposalData {
    proposal?: {
      ask_price: number;
      date_start: number;
      display_value: string;
      id: string;
      longcode: string;
      payout: number;
    };
    subscription?: {
      id: string;
    };
  }
  
  export interface BuyResponse {
    buy?: {
      balance_after: number;
      buy_price: number;
      contract_id: number;
      longcode: string;
      payout: number;
      purchase_time: number;
      start_time: number;
      transaction_id: number;
    };
  }
  
  export interface BotConfig {
    id: string;
    name: string;
    xml: string;
    code: string;
    createdAt: number;
    updatedAt: number;
  }
  
  export interface TradeParams {
    symbol: string;
    contractType: 'CALL' | 'PUT';
    amount: number;
    duration: number;
    durationUnit: 't' | 'm' | 's';
    basis?: 'stake' | 'payout';
    currency?: string;
  }
  
  export interface LogEntry {
    id: string;
    timestamp: number;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
    data?: any;
  }