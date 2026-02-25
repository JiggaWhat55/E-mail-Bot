import React from 'react';
import { useGame } from '../hooks/useGame';
import type { LogEntry } from '../types';

export const LogViewer: React.FC = () => {
  const { gameState } = useGame();

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-50';
      case 'warning': return 'text-amber-500 bg-amber-50';
      case 'error': return 'text-red-500 bg-red-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-800">Mission Log</h3>
        <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">{gameState.logs.length} Entries</span>
      </div>
      <div className="overflow-y-auto p-4 space-y-2 max-h-96 custom-scrollbar">
        {gameState.logs.map((log) => (
          <div key={log.id} className={`flex items-start space-x-3 text-sm p-3 rounded-lg border border-transparent hover:border-slate-100 transition-colors ${getLogColor(log.type)}`}>
            <span className="font-mono text-xs opacity-70 mt-0.5 min-w-[3rem]">Day {log.day}</span>
            <span className="flex-1 font-medium">{log.message}</span>
          </div>
        ))}
        {gameState.logs.length === 0 && (
          <div className="text-center text-slate-400 py-8 italic">No recent activity</div>
        )}
      </div>
    </div>
  );
};
