import React, { useState, useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { DerivWebSocket } from '../services/derivWebSocket';
import { BlocklyBuilder } from '../components/BlocklyBuilder';
import { BotLogs } from '../components/BotLogs';
import { AccountInfo } from '../components/AccountInfo';
import { BotControls } from '../components/BotControls';
import { LogEntry, BotConfig, TickData, BalanceData } from '../types/deriv.types';
import { Code } from 'lucide-react';
import Layout from '@/layouts/Layout';

export const BotBuilder: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentTick, setCurrentTick] = useState<number>(0);
  const [previousTick, setPreviousTick] = useState<number>(0);
  
  const wsRef = useRef<DerivWebSocket | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const botIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new DerivWebSocket('1089'); // Replace with your app_id
    
    wsRef.current.connect()
      .then(() => {
        setIsConnected(true);
        addLog('success', 'Connected to Deriv WebSocket');
        
        // Subscribe to balance updates
        wsRef.current?.getBalance();
      })
      .catch((error) => {
        addLog('error', 'Failed to connect to WebSocket', error);
        setIsConnected(false);
      });

    // Set up event listeners
    wsRef.current.on('balance', (data: BalanceData) => {
      if (data.balance) {
        setBalance(data.balance.balance);
        setCurrency(data.balance.currency);
      }
    });

    wsRef.current.on('tick', (data: TickData) => {
      if (data.tick) {
        setPreviousTick(currentTick);
        setCurrentTick(data.tick.quote);
      }
    });

    wsRef.current.on('buy', (data: any) => {
      if (data.buy) {
        addLog('success', `Trade executed: ${data.buy.longcode}`, {
          contract_id: data.buy.contract_id,
          buy_price: data.buy.buy_price,
          payout: data.buy.payout
        });
      }
    });

    wsRef.current.on('error', (data: any) => {
      addLog('error', data.error?.message || 'Unknown error', data.error);
    });

    // Cleanup
    return () => {
      if (botIntervalRef.current) {
        clearInterval(botIntervalRef.current);
      }
      wsRef.current?.disconnect();
    };
  }, []);

  const addLog = (
    type: LogEntry['type'],
    message: string,
    data?: any
  ): void => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      type,
      message,
      data
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleTokenSubmit = (token: string): void => {
    if (wsRef.current && isConnected) {
      wsRef.current.authorize(token);
      addLog('info', 'Authorizing with API token...');
      
      wsRef.current.on('authorize', (data: any) => {
        if (data.authorize) {
          addLog('success', `Authorized: ${data.authorize.email}`);
          wsRef.current?.getBalance();
        }
      });
    } else {
      addLog('error', 'Not connected to WebSocket');
    }
  };

  const handleWorkspaceChange = (workspace: Blockly.WorkspaceSvg): void => {
    workspaceRef.current = workspace;
  };

  const handleStartBot = (): void => {
    if (!workspaceRef.current) {
      addLog('error', 'No workspace available');
      return;
    }

    if (!isConnected) {
      addLog('error', 'Not connected to Deriv WebSocket');
      return;
    }

    try {
      // Generate code from blocks (simplified - in production use proper code generation)
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xml);
      
      addLog('info', 'Starting bot execution...');
      setIsRunning(true);
      
      // Simple bot execution logic
      executeBotLogic();
    } catch (error) {
      addLog('error', 'Failed to start bot', error);
      setIsRunning(false);
    }
  };

  const executeBotLogic = (): void => {
    // This is a simplified execution - in production, you'd parse Blockly blocks
    // and execute them according to their logic
    
    // Example: Subscribe to ticks for a symbol
    wsRef.current?.subscribeTicks('R_10');
    addLog('info', 'Subscribed to R_10 ticks');

    // Demo: Check tick conditions and place trades
    botIntervalRef.current = setInterval(() => {
      if (currentTick > previousTick && currentTick !== 0) {
        addLog('info', `Current tick (${currentTick}) > Previous tick (${previousTick})`);
        
        // Example trade placement
        wsRef.current?.getProposal({
          symbol: 'R_10',
          contractType: 'CALL',
          amount: 1,
          duration: 5,
          durationUnit: 't',
          basis: 'stake',
          currency: 'USD'
        });
      }
    }, 2000);
  };

  const handleStopBot = (): void => {
    if (botIntervalRef.current) {
      clearInterval(botIntervalRef.current);
      botIntervalRef.current = null;
    }
    setIsRunning(false);
    addLog('warning', 'Bot stopped');
  };

  const handleSaveBot = (): void => {
    if (!workspaceRef.current) {
      addLog('error', 'No workspace to save');
      return;
    }

    try {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xml);
      
      const botConfig: BotConfig = {
        id: `bot-${Date.now()}`,
        name: `My Bot ${new Date().toLocaleDateString()}`,
        xml: xmlText,
        code: '', // Would contain generated code
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // Save to localStorage
      const savedBots = JSON.parse(localStorage.getItem('deriv_bots') || '[]');
      savedBots.push(botConfig);
      localStorage.setItem('deriv_bots', JSON.stringify(savedBots));
      
      addLog('success', `Bot saved: ${botConfig.name}`);
    } catch (error) {
      addLog('error', 'Failed to save bot', error);
    }
  };

  const handleLoadBot = (): void => {
    try {
      const savedBots = JSON.parse(localStorage.getItem('deriv_bots') || '[]');
      
      if (savedBots.length === 0) {
        addLog('warning', 'No saved bots found');
        return;
      }

      // Load the most recent bot
      const latestBot = savedBots[savedBots.length - 1];
      
      if (workspaceRef.current && latestBot.xml) {
        const xml = Blockly.Xml.textToDom(latestBot.xml);
        workspaceRef.current.clear();
        Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        
        addLog('success', `Bot loaded: ${latestBot.name}`);
      }
    } catch (error) {
      addLog('error', 'Failed to load bot', error);
    }
  };

  const handleClearWorkspace = (): void => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      addLog('info', 'Workspace cleared');
    }
  };

  const handleClearLogs = (): void => {
    setLogs([]);
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Code className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Deriv Bot Builder
            </h1>
          </div>
          <p className="text-gray-600">
            Create and run automated trading bots using drag-and-drop blocks
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <BotControls
            isRunning={isRunning}
            onStart={handleStartBot}
            onStop={handleStopBot}
            onSave={handleSaveBot}
            onLoad={handleLoadBot}
            onClear={handleClearWorkspace}
            disabled={!isConnected}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Blockly Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-xl font-semibold mb-4">Bot Builder</h2>
              <BlocklyBuilder
                onWorkspaceChange={handleWorkspaceChange}
              />
            </div>
          </div>

          {/* Right Column - Account & Logs */}
          <div className="space-y-6">
            <AccountInfo
              balance={balance}
              currency={currency}
              isConnected={isConnected}
              onTokenSubmit={handleTokenSubmit}
            />

            <BotLogs
              logs={logs}
              onClear={handleClearLogs}
            />
          </div>
        </div>

        {/* Market Data Display */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Market Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Current Tick</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentTick.toFixed(2)}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Previous Tick</div>
              <div className="text-2xl font-bold text-purple-600">
                {previousTick.toFixed(2)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Change</div>
              <div className={`text-2xl font-bold ${
                currentTick > previousTick ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentTick > previousTick ? '↑' : '↓'} {Math.abs(currentTick - previousTick).toFixed(2)}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-2xl font-bold text-yellow-600">
                {isRunning ? 'RUNNING' : 'IDLE'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default BotBuilder;