import { type FC, useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { LCARSLayout } from '../components/LCARSLayout';
import { LCARSButton } from '../components/LCARSButton';
import { LogDisplay } from '../components/LogDisplay';
import { StatDisplay } from '../components/StatDisplay';
import { LOCATIONS } from '../data/locations';
import { MISSIONS } from '../data/missions';

export const MainGame: FC = () => {
  const { state, addLog, setLocation, triggerEvent, startCombat, playerAttack, performTask } = useGame();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.log.length === 0) {
       addLog("System initialized. Awaiting input.", 'system');
    }
  }, []);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    addLog(`> ${cmd}`, 'narrative');

    const command = cmd.trim().toUpperCase();
    const parts = command.split(' ');
    const mainCmd = parts[0];
    const arg = parts.slice(1).join(' '); // Rejoin the rest as arguments

    if (state.gamePhase === 'combat') {
       // Combat Commands
       if (mainCmd === 'FIRE') {
          if (arg === 'PHASERS' || arg === 'PHASER') {
             playerAttack('phasers');
          } else if (arg === 'TORPEDOES' || arg === 'TORPEDO' || arg === 'PHOTON TORPEDOES') {
             playerAttack('torpedoes');
          } else {
             addLog('Unknown weapon. Usage: FIRE PHASERS | FIRE TORPEDOES', 'system');
          }
       } else if (mainCmd === 'STATUS') {
          addLog(`Shields: ${state.ship.shields}%\nHull: ${state.ship.hull}%\nTorpedoes: ${state.ship.torpedoes}`, 'system');
          if (state.enemy) {
             addLog(`Target: ${state.enemy.name}\nShields: ${state.enemy.shields}%\nHull: ${state.enemy.hull}%`, 'combat');
          }
       } else if (mainCmd === 'HELP') {
          addLog(`Combat Commands:\n- FIRE PHASERS\n- FIRE TORPEDOES\n- STATUS`, 'system');
       } else {
          addLog('Combat engaged! Focus on tactical systems! (Type FIRE PHASERS or FIRE TORPEDOES)', 'combat');
       }
    } else {
       // Normal Commands
       if (mainCmd === 'STATUS') {
          addLog(`Ship Systems: NOMINAL\nShields: ${state.ship.shields}%\nHull: ${state.ship.hull}%\nWarp Core: ONLINE\nLocation: SECTOR 001`, 'system');
       } else if (mainCmd === 'SCAN') {
          const result = performTask('Intellect', 'Science', 'routine', 'Scanning area');
          if (result && result.success) {
             addLog(`Scan Complete: No anomalies detected. Sector secure.`, 'narrative');
             triggerEvent('ACTION_SCAN');
          } else {
             addLog(`Scan inconclusive. Sensors experiencing interference.`, 'narrative');
          }
       } else if (mainCmd === 'HELP') {
          addLog(`Available commands:
- MOVE [LOCATION] (or GO [LOCATION])
- LOOK (Describe current area)
- STATUS (Ship status)
- SCAN (Sensors)
- RED ALERT (Combat stations)
- MISSION (View objectives)
- INVENTORY
- SIMULATE (Start Combat Sim)`, 'system');
       } else if (mainCmd === 'RED ALERT') {
          addLog(`CONDITION RED! SHIELDS UP! WEAPONS ARMED!`, 'combat');
       } else if (mainCmd === 'SIMULATE') {
          startCombat('Holographic Warbird');
       } else if (mainCmd === 'LOOK') {
          if (state.currentLocation) {
             addLog(`${state.currentLocation.name}\n${state.currentLocation.description}`, 'narrative');
             const exitNames = state.currentLocation.exits.map(id => LOCATIONS[id]?.name || id).join(', ');
             addLog(`Exits: ${exitNames}`, 'system');
          } else {
             addLog('Location data unavailable.', 'system');
          }
       } else if (mainCmd === 'MISSION') {
          if (state.activeMissionId && MISSIONS[state.activeMissionId]) {
             const m = MISSIONS[state.activeMissionId];
             addLog(`CURRENT MISSION: ${m.title}`, 'system');
             addLog(m.description, 'narrative');
             addLog('OBJECTIVES:', 'system');
             m.objectives.forEach(obj => {
                const done = state.completedObjectives.includes(obj.id);
                addLog(`[${done ? 'COMPLETE' : 'PENDING'}] ${obj.description}`, done ? 'system' : 'narrative');
             });
          } else {
             addLog('No active mission.', 'system');
          }
       } else if (mainCmd === 'MOVE' || mainCmd === 'GO') {
          if (!arg) {
             addLog('Move where? (Usage: MOVE [LOCATION])', 'system');
             if (state.currentLocation) {
                const exitNames = state.currentLocation.exits.map(id => LOCATIONS[id]?.name || id).join(', ');
                addLog(`Available exits: ${exitNames}`, 'system');
             }
          } else {
             // Find matching exit
             if (state.currentLocation) {
                const targetId = state.currentLocation.exits.find(id => {
                   const loc = LOCATIONS[id];
                   return loc.name.toUpperCase().includes(arg) || loc.id.toUpperCase() === arg;
                });

                if (targetId) {
                   setLocation(LOCATIONS[targetId]);
                } else {
                   addLog(`Cannot move to '${arg}'. Check available exits.`, 'system');
                }
             } else {
                // Fallback
                const targetKey = Object.keys(LOCATIONS).find(k => LOCATIONS[k].name.toUpperCase().includes(arg));
                if (targetKey) {
                   setLocation(LOCATIONS[targetKey]);
                } else {
                   addLog('Navigation systems offline.', 'combat');
                }
             }
          }
       } else {
          addLog(`Command not recognized: ${mainCmd}. Try HELP.`, 'system');
       }
    }

    setInput('');
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  return (
    <LCARSLayout>
      <div className="flex h-full gap-6">
        {/* Main Log Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
           <div className={`flex-1 min-h-0 bg-black/40 rounded-lg border ${state.gamePhase === 'combat' ? 'border-lcars-red shadow-[0_0_15px_rgba(204,0,0,0.3)]' : 'border-lcars-blue/20'} overflow-hidden flex flex-col relative transition-all duration-500`}>
              <LogDisplay logs={state.log} />

              {/* Overlay Location Name or Combat Status */}
              {state.gamePhase === 'combat' && state.enemy ? (
                 <div className="absolute top-2 right-4 text-right pointer-events-none">
                    <div className="text-lcars-red text-4xl font-lcars font-bold uppercase animate-pulse">RED ALERT</div>
                    <div className="text-lcars-orange text-xl font-mono">TARGET: {state.enemy.name}</div>
                    <div className="flex gap-2 justify-end mt-1">
                       <div className="text-xs text-lcars-blue">SHIELDS: {state.enemy.shields}%</div>
                       <div className="text-xs text-lcars-blue">HULL: {state.enemy.hull}%</div>
                    </div>
                 </div>
              ) : (
                 state.currentLocation && (
                    <div className="absolute top-2 right-4 text-lcars-orange/20 text-4xl font-lcars font-bold pointer-events-none uppercase">
                       {state.currentLocation.name}
                    </div>
                 )
              )}
           </div>

           {/* Command Input Area */}
           <div className="mt-4 pt-2 flex gap-2 items-center">
              <span className={`font-bold text-xl animate-pulse ${state.gamePhase === 'combat' ? 'text-lcars-red' : 'text-lcars-orange'}`}>_</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
                className={`flex-1 bg-transparent border-b-2 ${state.gamePhase === 'combat' ? 'border-lcars-red text-lcars-red placeholder-lcars-red/30 focus:border-red-400' : 'border-lcars-orange text-lcars-orange placeholder-lcars-orange/30 focus:border-lcars-light-orange'} p-2 font-mono text-xl focus:outline-none transition-colors duration-300`}
                placeholder="ENTER COMMAND..."
                autoFocus
              />
              <LCARSButton label="ENGAGE" color={state.gamePhase === 'combat' ? 'red' : 'orange'} onClick={() => handleCommand(input)} className="w-auto mb-0" />
           </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="w-80 shrink-0 pl-4 border-l border-lcars-light-purple/20 flex flex-col overflow-y-auto custom-scrollbar">
           {state.character && <StatDisplay character={state.character} />}

           <div className="mt-8">
              <h3 className={`border-b mb-4 uppercase tracking-widest text-sm ${state.gamePhase === 'combat' ? 'text-lcars-red border-lcars-red' : 'text-lcars-orange border-lcars-orange'}`}>
                 {state.gamePhase === 'combat' ? 'Tactical Systems' : 'Ship Functions'}
              </h3>

              <div className="space-y-4">
                 {state.gamePhase === 'combat' ? (
                    <>
                       <div className="bg-black/50 p-2 rounded border border-lcars-red/30 mb-2">
                          <div className="flex justify-between text-xs text-lcars-red mb-1">
                             <span>SHIELDS</span>
                             <span>{state.ship.shields}%</span>
                          </div>
                          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                             <div className="h-full bg-lcars-blue" style={{ width: `${state.ship.shields}%` }}></div>
                          </div>

                          <div className="flex justify-between text-xs text-lcars-orange mt-2 mb-1">
                             <span>HULL</span>
                             <span>{state.ship.hull}%</span>
                          </div>
                          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                             <div className="h-full bg-lcars-orange" style={{ width: `${state.ship.hull}%` }}></div>
                          </div>

                          <div className="flex justify-between text-xs text-white mt-2">
                             <span>TORPEDOES</span>
                             <span>{state.ship.torpedoes}</span>
                          </div>
                       </div>

                       <LCARSButton label="FIRE PHASERS" color="red" onClick={() => handleCommand('FIRE PHASERS')} />
                       <LCARSButton label="FIRE TORPEDOES" color="orange" onClick={() => handleCommand('FIRE TORPEDOES')} />
                       <LCARSButton label="STATUS REPORT" color="yellow" onClick={() => handleCommand('STATUS')} />
                    </>
                 ) : (
                    <>
                       <LCARSButton label="Scan Area" color="blue" onClick={() => handleCommand('SCAN')} />
                       <LCARSButton label="Look Around" color="purple" onClick={() => handleCommand('LOOK')} />
                       <LCARSButton label="Status" color="yellow" onClick={() => handleCommand('STATUS')} />
                       <LCARSButton label="Mission" color="orange" onClick={() => handleCommand('MISSION')} />
                       <LCARSButton label="Simulate Combat" color="red" onClick={() => handleCommand('SIMULATE')} className="opacity-50 hover:opacity-100" />

                       <div className="pt-4 border-t border-lcars-orange/30">
                          <h4 className="text-xs text-lcars-light-blue mb-2 uppercase">Navigation</h4>
                          {state.currentLocation?.exits.map(exitId => (
                             <LCARSButton
                                key={exitId}
                                label={LOCATIONS[exitId]?.name || exitId}
                                color="orange"
                                onClick={() => handleCommand(`MOVE ${LOCATIONS[exitId]?.name || exitId}`)}
                                className="text-sm py-2"
                             />
                          ))}
                       </div>
                    </>
                 )}
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
