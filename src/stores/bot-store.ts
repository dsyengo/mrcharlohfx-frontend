// stores/bot-store.ts
import { create } from 'zustand';
import { TradingBot, BotBlock, BotTemplate } from '@/types/bot';

interface BotState {
  currentBot: TradingBot | null;
  isRunning: boolean;
  botTemplates: BotTemplate[];
  
  // Actions
  setCurrentBot: (bot: TradingBot) => void;
  createNewBot: (name: string) => void;
  updateBlock: (blockId: string, updates: Partial<BotBlock>) => void;
  addBlock: (block: Omit<BotBlock, 'id'>) => void;
  removeBlock: (blockId: string) => void;
  importBot: (botData: string) => void;
  exportBot: () => string;
  runBot: () => void;
  stopBot: () => void;
}

export const useBotStore = create<BotState>((set, get) => ({
  currentBot: null,
  isRunning: false,
  botTemplates: [],

  setCurrentBot: (bot) => set({ currentBot: bot }),

  createNewBot: (name) => {
    const newBot: TradingBot = {
      id: crypto.randomUUID(),
      name,
      description: '',
      version: '1.0.0',
      blocks: [],
      created: new Date(),
      updated: new Date(),
    };
    set({ currentBot: newBot });
  },

  updateBlock: (blockId, updates) => {
    const { currentBot } = get();
    if (!currentBot) return;

    const updatedBlocks = currentBot.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );

    set({
      currentBot: {
        ...currentBot,
        blocks: updatedBlocks,
        updated: new Date(),
      },
    });
  },

  addBlock: (blockData) => {
    const { currentBot } = get();
    if (!currentBot) return;

    const newBlock: BotBlock = {
      ...blockData,
      id: crypto.randomUUID(),
    };

    set({
      currentBot: {
        ...currentBot,
        blocks: [...currentBot.blocks, newBlock],
        updated: new Date(),
      },
    });
  },

  removeBlock: (blockId) => {
    const { currentBot } = get();
    if (!currentBot) return;

    const updatedBlocks = currentBot.blocks.filter(block => block.id !== blockId);
    
    set({
      currentBot: {
        ...currentBot,
        blocks: updatedBlocks,
        updated: new Date(),
      },
    });
  },

  importBot: (botData) => {
    try {
      const bot = JSON.parse(botData) as TradingBot;
      bot.updated = new Date();
      set({ currentBot: bot });
    } catch (error) {
      console.error('Failed to import bot:', error);
      throw new Error('Invalid bot file format');
    }
  },

  exportBot: () => {
    const { currentBot } = get();
    if (!currentBot) throw new Error('No bot to export');
    return JSON.stringify(currentBot, null, 2);
  },

  runBot: () => set({ isRunning: true }),
  stopBot: () => set({ isRunning: false }),
}));