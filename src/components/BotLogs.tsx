import React from 'react';
import { Activity, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { LogEntry } from '../types/deriv.types';

interface BotLogsProps {
  logs: LogEntry[];
  onClear?: () => void;
}

export const BotLogs: React.FC<BotLogsProps> = ({ logs, onClear }) => {
  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          <h3 className="font-semibold">Bot Logs</h3>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No logs yet. Start your bot to see activity.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100"
            >
              <div className="mt-0.5">{getIcon(log.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-gray-800 break-words">{log.message}</div>
                {log.data && (
                  <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};