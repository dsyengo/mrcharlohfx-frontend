import React from 'react';
import { Play, Square, Save, FolderOpen, Trash2 } from 'lucide-react';

interface BotControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export const BotControls: React.FC<BotControlsProps> = ({
  isRunning,
  onStart,
  onStop,
  onSave,
  onLoad,
  onClear,
  disabled = false
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {!isRunning ? (
        <button
          onClick={onStart}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          Start Bot
        </button>
      ) : (
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Square className="w-4 h-4" />
          Stop Bot
        </button>
      )}

      <button
        onClick={onSave}
        disabled={disabled || isRunning}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save className="w-4 h-4" />
        Save
      </button>

      <button
        onClick={onLoad}
        disabled={disabled || isRunning}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FolderOpen className="w-4 h-4" />
        Load
      </button>

      <button
        onClick={onClear}
        disabled={disabled || isRunning}
        className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Clear
      </button>
    </div>
  );
};