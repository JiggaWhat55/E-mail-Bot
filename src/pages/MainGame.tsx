import { type FC, useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { LCARSLayout } from '../components/LCARSLayout';
import { LCARSButton } from '../components/LCARSButton';
import { LogDisplay } from '../components/LogDisplay';
import { StatDisplay } from '../components/StatDisplay';

export const MainGame: FC = () => {
  const { state, addLog } = useGame();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.log.length === 0) {
       addLog("System initialized. Awaiting input.", 'system');
    }
  }, []);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    addLog(`> ${cmd}`, 'narrative'); // User input echo

    // Simple parser for now - in a real game this would be much more complex
    const command = cmd.trim().toUpperCase();

    if (command === 'STATUS') {
       addLog(`Ship Systems: NOMINAL\nShields: 100%\nWarp Core: ONLINE\nLocation: SECTOR 001`, 'system');
    } else if (command === 'SCAN') {
       addLog(`Scanning current sector...\nNo anomalies detected.\nTraffic: Minimal.`, 'system');
    } else if (command === 'HELP') {
       addLog(`Available commands: STATUS, SCAN, LOG, MISSION, INVENTORY`, 'system');
    } else if (command === 'RED ALERT') {
       addLog(`CONDITION RED! SHIELDS UP! WEAPONS ARMED!`, 'combat');
    } else {
       addLog(`Command not recognized: ${cmd}. Try HELP for a list of commands.`, 'system');
    }

    setInput('');
    // Keep focus
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  return (
    <LCARSLayout>
      <div className="flex h-full gap-6">
        {/* Main Log Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
           <div className="flex-1 min-h-0 bg-black/40 rounded-lg border border-lcars-blue/20 overflow-hidden flex flex-col">
              <LogDisplay logs={state.log} />
           </div>

           {/* Command Input Area */}
           <div className="mt-4 pt-2 flex gap-2 items-center">
              <span className="text-lcars-orange font-bold text-xl animate-pulse">_</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
                className="flex-1 bg-transparent border-b-2 border-lcars-orange text-lcars-orange p-2 font-mono text-xl focus:outline-none focus:border-lcars-light-orange placeholder-lcars-orange/30"
                placeholder="ENTER COMMAND..."
                autoFocus
              />
              <LCARSButton label="ENGAGE" onClick={() => handleCommand(input)} className="w-auto mb-0" />
           </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="w-80 shrink-0 pl-4 border-l border-lcars-light-purple/20 flex flex-col overflow-y-auto custom-scrollbar">
           {state.character && <StatDisplay character={state.character} />}

           <div className="mt-8">
              <h3 className="text-lcars-orange border-b border-lcars-orange mb-4 uppercase tracking-widest text-sm">Ship Functions</h3>
              <div className="space-y-4">
                 <LCARSButton label="SENSORS" color="blue" onClick={() => handleCommand('SCAN')} />
                 <LCARSButton label="COMMUNICATIONS" color="purple" onClick={() => handleCommand('HAIL')} />
                 <LCARSButton label="TACTICAL" color="red" onClick={() => handleCommand('RED ALERT')} />
                 <LCARSButton label="STATUS REPORT" color="yellow" onClick={() => handleCommand('STATUS')} />
              </div>
           </div>

           <div className="mt-auto pt-8 opacity-50">
              <h4 className="text-xs text-lcars-blue mb-1">SYSTEM DIAGNOSTICS</h4>
              <div className="grid grid-cols-4 gap-1">
                 {[...Array(16)].map((_, i) => (
                    <div key={i} className={`h-2 rounded-sm ${Math.random() > 0.8 ? 'bg-lcars-red animate-pulse' : 'bg-lcars-orange'}`}></div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </LCARSLayout>
  );
};
