// services/derivApi.ts
import {
  TickData,
  ProposalRequest,
  ProposalResponse,
  BuyContractRequest,
  BuyContractResponse,
} from "@/types/deriv";

export class DerivApiService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Function[]> = new Map();
  private requestCallbacks: Map<string, Function> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private appId: number = 1089) {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    try {
      this.ws = new WebSocket(
        `wss://ws.binaryws.com/websockets/v3?app_id=${this.appId}`
      );

      this.ws.onopen = () => {
        console.log("Deriv WebSocket connected");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit("connected", {});
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onclose = () => {
        console.log("Deriv WebSocket disconnected");
        this.isConnected = false;
        this.emit("disconnected", {});
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emit("error", error);
      };
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.initializeWebSocket();
      }, 3000 * this.reconnectAttempts);
    }
  }

  private handleMessage(data: any) {
    // Handle request callbacks
    if (data.req_id && this.requestCallbacks.has(data.req_id)) {
      const callback = this.requestCallbacks.get(data.req_id)!;
      this.requestCallbacks.delete(data.req_id);
      callback(data);
    }

    // Emit event-based messages
    if (data.msg_type === "tick") {
      this.emit("tick", data);
    } else if (data.msg_type === "proposal") {
      this.emit("proposal", data);
    } else if (data.msg_type === "buy") {
      this.emit("trade", data);
    } else if (data.msg_type === "balance") {
      this.emit("balance", data);
    } else if (data.msg_type === "authorize") {
      this.emit("authorized", data);
    } else if (data.error) {
      this.emit("error", data.error);
    }
  }

  // Authentication
  async authorize(token: string): Promise<any> {
    return this.sendRequest({ authorize: token });
  }

  // Market Data
  async subscribeTicks(symbol: string): Promise<any> {
    return this.sendRequest({
      ticks: symbol,
      subscribe: 1,
    });
  }

  async unsubscribeTicks(symbol: string): Promise<any> {
    return this.sendRequest({
      forget: symbol,
    });
  }

  async getTicksHistory(symbol: string, count: number = 1000): Promise<any> {
    return this.sendRequest({
      ticks_history: symbol,
      count: count,
      style: "ticks",
    });
  }

  async getActiveSymbols(): Promise<any> {
    return this.sendRequest({
      active_symbols: "brief",
    });
  }

  // Trading
  async proposeContract(proposal: ProposalRequest): Promise<ProposalResponse> {
    return this.sendRequest({
      proposal: 1,
      ...proposal,
    });
  }

  async buyContract(
    buyRequest: BuyContractRequest
  ): Promise<BuyContractResponse> {
    return this.sendRequest(buyRequest);
  }

  // Account
  async getBalance(): Promise<any> {
    return this.sendRequest({ balance: 1 });
  }

  async getStatement(limit: number = 100): Promise<any> {
    return this.sendRequest({
      statement: 1,
      limit: limit,
    });
  }

  // Utility Methods
  private sendRequest(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected || !this.ws) {
        reject(new Error("WebSocket not connected"));
        return;
      }

      const reqId = Date.now().toString();
      data.req_id = reqId;

      this.requestCallbacks.set(reqId, (response: any) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response);
        }
      });

      this.ws.send(JSON.stringify(data));
    });
  }

  // Event System
  on(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const derivApi = new DerivApiService();
