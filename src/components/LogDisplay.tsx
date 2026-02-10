import { type FC, useRef, useEffect } from 'react';
import type { LogEntry } from '../types/game';

interface LogDisplayProps {
  logs: LogEntry[];
}

export const LogDisplay: FC<LogDisplayProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col space-y-4 p-4 font-mono text-lg leading-relaxed h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {logs.map((log) => (
        <div
          key={log.id}
          className={`
            p-4 rounded-r-xl border-l-4 shadow-lg backdrop-blur-sm transition-all duration-300 animate-fade-in
            ${log.type === 'narrative'
              ? 'border-lcars-blue bg-gradient-to-r from-lcars-blue/10 to-transparent text-lcars-light-blue'
              : log.type === 'system'
              ? 'border-lcars-orange bg-gradient-to-r from-lcars-orange/10 to-transparent text-lcars-orange font-bold'
              : 'border-lcars-red bg-gradient-to-r from-lcars-red/10 to-transparent text-lcars-red font-bold uppercase tracking-wider'}
          `}
        >
          <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
             <span className="text-xs text-white/50 uppercase tracking-widest font-lcars">SD {log.timestamp}</span>
             <span className="text-[10px] text-white/30 font-mono">LOG-{log.id.slice(-4)}</span>
          </div>
          <p className="whitespace-pre-wrap">{log.text}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
