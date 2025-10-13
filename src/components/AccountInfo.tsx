import React, { useState } from 'react';
import { Wallet, Eye, EyeOff } from 'lucide-react';

interface AccountInfoProps {
  balance: number;
  currency: string;
  isConnected: boolean;
  onTokenSubmit: (token: string) => void;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  balance,
  currency,
  isConnected,
  onTokenSubmit
}) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5" />
        <h3 className="font-semibold">Account</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Connection Status</div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Balance</div>
          <div className="text-2xl font-bold mt-1">
            {balance.toFixed(2)} {currency}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="text-sm text-gray-700 font-medium">
            API Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Deriv API token"
              className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Authorize
          </button>
        </form>

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          <strong>Note:</strong> Get your API token from{' '}
          <a
            href="https://app.deriv.com/account/api-token"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Deriv API Token Settings
          </a>
        </div>
      </div>
    </div>
  );
};