export interface BotBlock {
    id: string;
    type: 'trigger' | 'condition' | 'action';
    name: string;
    parameters: Record<string, any>;
    next?: string; // ID of next block
  }
  
  export interface TradingBot {
    id: string;
    name: string;
    description: string;
    version: string;
    blocks: BotBlock[];
    created: Date;
    updated: Date;
  }
  
  export interface BotTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    blocks: BotBlock[];
  }