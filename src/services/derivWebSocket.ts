export class DerivWebSocket {
    private ws: WebSocket | null = null;
    private appId: string;
    private messageQueue: any[] = [];
    private listeners: Map<string, Array<(data: any) => void>> = new Map();
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;
  
    constructor(appId: string = import.meta.env.VITE_APP_ID) {
      this.appId = appId;
    }
  
    async connect(): Promise<void> {
      return new Promise((resolve, reject) => {
        try {
          this.ws = new WebSocket(
            `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`
          );
  
          this.ws.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log('✅ Connected to Deriv WebSocket');
            this.processQueue();
            resolve();
          };
  
          this.ws.onmessage = (msg: MessageEvent) => {
            try {
              const data: DerivMessage = JSON.parse(msg.data);
              this.handleMessage(data);
            } catch (error) {
              console.error('Failed to parse message:', error);
            }
          };
  
          this.ws.onerror = (error: Event) => {
            console.error('❌ WebSocket error:', error);
            reject(error);
          };
  
          this.ws.onclose = () => {
            this.isConnected = false;
            console.log('🔌 WebSocket closed');
            this.attemptReconnect();
          };
        } catch (error) {
          reject(error);
        }
      });
    }
  
    private attemptReconnect(): void {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}`);
        
        this.reconnectTimeout = setTimeout(() => {
          this.connect().catch(console.error);
        }, 2000 * this.reconnectAttempts);
      }
    }
  
    send(data: any): void {
      if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      } else {
        this.messageQueue.push(data);
      }
    }
  
    private processQueue(): void {
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        this.send(msg);
      }
    }
  
    private handleMessage(data: DerivMessage): void {
      const msgType = data.msg_type;
      
      // Call specific listeners
      if (this.listeners.has(msgType)) {
        this.listeners.get(msgType)?.forEach(callback => callback(data));
      }
      
      // Call wildcard listeners
      if (this.listeners.has('*')) {
        this.listeners.get('*')?.forEach(callback => callback(data));
      }
    }
  
    on(msgType: string, callback: (data: any) => void): void {
      if (!this.listeners.has(msgType)) {
        this.listeners.set(msgType, []);
      }
      this.listeners.get(msgType)?.push(callback);
    }
  
    off(msgType: string, callback: (data: any) => void): void {
      if (this.listeners.has(msgType)) {
        const callbacks = this.listeners.get(msgType);
        if (callbacks) {
          const index = callbacks.indexOf(callback);
          if (index > -1) callbacks.splice(index, 1);
        }
      }
    }
  
    authorize(token: string): void {
      this.send({ authorize: token });
    }
  
    subscribeTicks(symbol: string): void {
      this.send({ ticks: symbol, subscribe: 1 });
    }
  
    unsubscribeTicks(subscriptionId: string): void {
      this.send({ forget: subscriptionId });
    }
  
    getProposal(params: TradeParams): void {
      this.send({
        proposal: 1,
        amount: params.amount,
        basis: params.basis || 'stake',
        contract_type: params.contractType,
        currency: params.currency || 'USD',
        duration: params.duration,
        duration_unit: params.durationUnit,
        symbol: params.symbol,
        subscribe: 1
      });
    }
  
    buy(proposalId: string, price: number): void {
      this.send({
        buy: proposalId,
        price: price
      });
    }
  
    getBalance(): void {
      this.send({ balance: 1, subscribe: 1 });
    }
  
    getActiveSymbols(): void {
      this.send({
        active_symbols: 'brief',
        product_type: 'basic'
      });
    }
  
    disconnect(): void {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      if (this.ws) {
        this.isConnected = false;
        this.ws.close();
        this.ws = null;
      }
      this.listeners.clear();
      this.messageQueue = [];
    }
  
    getConnectionState(): boolean {
      return this.isConnected;
    }
  }
  