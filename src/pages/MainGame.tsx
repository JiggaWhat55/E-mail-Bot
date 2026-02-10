import { type FC, useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { LCARSLayout } from '../components/LCARSLayout';
import { LCARSButton } from '../components/LCARSButton';
import { LogDisplay } from '../components/LogDisplay';
import { StatDisplay } from '../components/StatDisplay';
import { LOCATIONS } from '../data/locations';
import { MISSIONS } from '../data/missions';
import { ITEMS } from '../data/items';
import { NPCS } from '../data/npcs';

export const MainGame: FC = () => {
  const { state, addLog, setLocation, triggerEvent, startCombat, playerAttack, performTask, pickupItem, dropItem, useItem, setPower, startDialogue, answerDialogue, endDialogue, upgradeShip, combatAction } = useGame();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.log.length === 0) {
       addLog("System initialized. Awaiting input.", 'system');
    }
  }, []);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    // Echo user input unless in dialogue (cleaner log)
    if (state.gamePhase !== 'dialogue') {
       addLog(`> ${cmd}`, 'narrative');
    }

    const command = cmd.trim().toUpperCase();
    const parts = command.split(' ');
    const mainCmd = parts[0];
    const arg = parts.slice(1).join(' ');

    if (state.gamePhase === 'dialogue') {
       // Dialogue Mode
       if (mainCmd === 'EXIT' || mainCmd === 'BYE') {
          endDialogue();
       } else {
          // Check if number
          if (state.activeDialogue) {
             answerDialogue(cmd.trim()); // Pass raw ID (numbers usually)
          }
       }
    } else if (state.gamePhase === 'combat') {
       if (mainCmd === 'FIRE') {
          if (arg === 'PHASERS' || arg === 'PHASER') {
             playerAttack('phasers');
          } else if (arg === 'TORPEDOES' || arg === 'TORPEDO' || arg === 'PHOTON TORPEDOES') {
             playerAttack('torpedoes');
          } else {
             addLog('Unknown weapon. Usage: FIRE PHASERS | FIRE TORPEDOES', 'system');
          }
       } else if (mainCmd === 'EVASIVE') {
          combatAction('evasive');
       } else if (mainCmd === 'REPAIR') {
          combatAction('repair');
       } else if (mainCmd === 'STATUS') {
          addLog(`Shields: ${state.ship.shields}%\nHull: ${state.ship.hull}%\nTorpedoes: ${state.ship.torpedoes}`, 'system');
          addLog(`Power: Shields ${state.ship.power.shields}% | Weapons ${state.ship.power.weapons}% | Engines ${state.ship.power.engines}%`, 'system');
          if (state.enemy) {
             addLog(`Target: ${state.enemy.name}\nShields: ${state.enemy.shields}%\nHull: ${state.enemy.hull}%`, 'combat');
          }
       } else if (mainCmd === 'POWER') {
          const powerParts = arg.split(' ');
          const system = powerParts[0]?.toLowerCase();
          const amount = parseInt(powerParts[1]);

          if (['shields', 'weapons', 'engines'].includes(system) && !isNaN(amount)) {
             setPower(system as 'shields' | 'weapons' | 'engines', amount);
          } else {
             addLog('Usage: POWER [SHIELDS|WEAPONS|ENGINES] [0-100]', 'system');
          }
       } else if (mainCmd === 'HELP') {
          addLog(`Combat Commands:\n- FIRE PHASERS\n- FIRE TORPEDOES\n- EVASIVE (Increases Dodge, Costs Energy)\n- REPAIR (Restores Hull)\n- POWER [SYSTEM] [AMOUNT]\n- STATUS`, 'system');
       } else {
          addLog('Combat engaged! Focus on tactical systems!', 'combat');
       }
    } else {
       // Normal Commands
       if (mainCmd === 'STATUS') {
          addLog(`Ship Systems: NOMINAL\nShields: ${state.ship.shields}%\nHull: ${state.ship.hull}%\nWarp Core: ONLINE\nLocation: SECTOR 001`, 'system');
          addLog(`Power: Shields ${state.ship.power.shields}% | Weapons ${state.ship.power.weapons}% | Engines ${state.ship.power.engines}%`, 'system');
       } else if (mainCmd === 'SCAN') {
          const result = performTask('Intellect', 'Science', 'routine', 'Scanning area');
          if (result && result.success) {
             addLog(`Sensors Report: ${state.currentLocation?.description || 'Standard readings.'}`, 'narrative');
             triggerEvent('ACTION_SCAN');
          } else {
             addLog(`Scan inconclusive. Sensors experiencing interference.`, 'narrative');
          }
       } else if (mainCmd === 'UPGRADE') {
          if (state.currentLocation?.id !== 'engineering') {
             addLog('Upgrades can only be performed in Engineering.', 'system');
          } else if (!arg) {
             addLog('Usage: UPGRADE [SHIELDS|PHASERS|ENGINES]', 'system');
             addLog(`Costs: Shields ${(state.ship.shieldLevel||0)+1 * 200}XP | Phasers ${(state.ship.phaserLevel||0)+1 * 200}XP | Engines ${(state.ship.engineLevel||0)+1 * 200}XP`, 'system');
          } else {
             const system = arg.toLowerCase();
             if (['shields', 'phasers', 'engines'].includes(system)) {
                 upgradeShip(system as 'shields' | 'phasers' | 'engines');
             } else {
                 addLog('Invalid system. Options: SHIELDS, PHASERS, ENGINES', 'system');
             }
          }
       } else if (mainCmd === 'WARP') {
          if (!arg) {
              addLog('Usage: WARP [LOCATION]', 'system');
          } else {
              const targetKey = Object.keys(LOCATIONS).find(k =>
                  LOCATIONS[k].name.toUpperCase().includes(arg) || k.toUpperCase() === arg
              );

              if (targetKey) {
                 if (targetKey === 'neutral_zone') {
                     if (state.currentLocation?.id === 'bridge') {
                        setLocation(LOCATIONS[targetKey]);
                        triggerEvent('WARP', targetKey);
                        addLog(`WARP ENGAGED. En route to ${LOCATIONS[targetKey].name}...`, 'system');
                     } else {
                        addLog('Warp command only available from Main Bridge.', 'system');
                     }
                 } else if (targetKey === 'bridge') {
                     if (state.currentLocation?.id === 'neutral_zone') {
                        setLocation(LOCATIONS[targetKey]);
                        addLog('Warping back to Sector 001 (USS Enterprise).', 'narrative');
                     } else {
                        addLog('Already on the ship. Use MOVE.', 'system');
                     }
                 } else {
                     addLog(`Cannot warp to ${LOCATIONS[targetKey].name}. Internal location.`, 'system');
                 }
              } else {
                 addLog(`Unknown destination: ${arg}`, 'system');
              }
          }
       } else if (mainCmd === 'HELP') {
          addLog(`Available commands:
- MOVE [LOCATION] (or GO [LOCATION])
- LOOK (Describe current area)
- TALK [NPC]
- STATUS (Ship status)
- SCAN (Sensors)
- WARP [LOCATION] (Ship movement)
- RED ALERT (Combat stations)
- MISSION (View objectives)
- INVENTORY
- PICKUP [ITEM]
- DROP [ITEM]
- USE [ITEM]
- UPGRADE [SYSTEM] (In Engineering)
- POWER [SYSTEM] [AMOUNT]
- SIMULATE (Start Combat Sim)`, 'system');
       } else if (mainCmd === 'RED ALERT') {
          addLog(`CONDITION RED! SHIELDS UP! WEAPONS ARMED!`, 'combat');
       } else if (mainCmd === 'SIMULATE') {
          startCombat('Holographic Warbird');
       } else if (mainCmd === 'LOOK') {
          if (state.currentLocation) {
             addLog(`${state.currentLocation.name}\n${state.currentLocation.description}`, 'narrative');

             if (state.currentLocation.items && state.currentLocation.items.length > 0) {
                 const itemNames = state.currentLocation.items.map(id => ITEMS[id]?.name || id).join(', ');
                 addLog(`Items here: ${itemNames}`, 'narrative');
             }
             if (state.currentLocation.npcs && state.currentLocation.npcs.length > 0) {
                 const npcNames = state.currentLocation.npcs.map(id => NPCS[id]?.name || id).join(', ');
                 addLog(`Personnel here: ${npcNames}`, 'narrative');
             }

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
                const targetKey = Object.keys(LOCATIONS).find(k => LOCATIONS[k].name.toUpperCase().includes(arg));
                if (targetKey) {
                   setLocation(LOCATIONS[targetKey]);
                } else {
                   addLog('Navigation systems offline.', 'combat');
                }
             }
          }
       } else if (mainCmd === 'INVENTORY' || mainCmd === 'INV' || mainCmd === 'I') {
          if (state.inventory.length === 0) {
              addLog('Inventory empty.', 'system');
          } else {
              addLog('INVENTORY:', 'system');
              state.inventory.forEach(id => {
                  const item = ITEMS[id];
                  addLog(`- ${item ? item.name : id}`, 'narrative');
              });
          }
       } else if (mainCmd === 'PICKUP' || mainCmd === 'GET' || mainCmd === 'TAKE') {
           if (!arg) {
               addLog('Pickup what?', 'system');
           } else {
               const itemId = state.currentLocation?.items.find(id => {
                   const item = ITEMS[id];
                   return item.name.toUpperCase().includes(arg) || id.toUpperCase() === arg;
               });
               if (itemId) {
                   pickupItem(itemId);
               } else {
                   addLog(`No item '${arg}' found here.`, 'system');
               }
           }
       } else if (mainCmd === 'DROP') {
           if (!arg) {
               addLog('Drop what?', 'system');
           } else {
               const itemId = state.inventory.find(id => {
                   const item = ITEMS[id];
                   return item.name.toUpperCase().includes(arg) || id.toUpperCase() === arg;
               });
               if (itemId) {
                   dropItem(itemId);
               } else {
                   addLog(`You don't have '${arg}'.`, 'system');
               }
           }
       } else if (mainCmd === 'USE') {
           if (!arg) {
               addLog('Use what?', 'system');
           } else {
               const itemId = state.inventory.find(id => {
                   const item = ITEMS[id];
                   return item.name.toUpperCase().includes(arg) || id.toUpperCase() === arg;
               });
               if (itemId) {
                   useItem(itemId);
               } else {
                   addLog(`You don't have '${arg}'.`, 'system');
               }
           }
       } else if (mainCmd === 'POWER') {
          const powerParts = arg.split(' ');
          const system = powerParts[0]?.toLowerCase();
          const amount = parseInt(powerParts[1]);

          if (['shields', 'weapons', 'engines'].includes(system) && !isNaN(amount)) {
             setPower(system as 'shields' | 'weapons' | 'engines', amount);
          } else {
             addLog('Usage: POWER [SHIELDS|WEAPONS|ENGINES] [0-100]', 'system');
          }
       } else if (mainCmd === 'TALK' || mainCmd === 'SPEAK') {
          if (!arg) {
             addLog('Talk to whom?', 'system');
          } else {
             const npcId = state.currentLocation?.npcs.find(id => {
                const npc = NPCS[id];
                return npc.name.toUpperCase().includes(arg) || id.toUpperCase() === arg;
             });
             if (npcId) {
                startDialogue(npcId);
             } else {
                addLog(`No one named '${arg}' is here.`, 'system');
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

              {/* Dialogue Options Overlay */}
              {state.gamePhase === 'dialogue' && state.activeDialogue && (
                 <div className="absolute bottom-0 left-0 w-full bg-black/80 border-t border-lcars-blue p-4">
                    {(() => {
                       const npc = NPCS[state.activeDialogue.npcId];
                       const node = npc.dialogue[state.activeDialogue.nodeId];
                       return (
                          <div className="grid grid-cols-1 gap-2">
                             {node.options.length > 0 ? (
                                node.options.map(opt => (
                                   <button
                                      key={opt.id}
                                      onClick={() => answerDialogue(opt.id)}
                                      className="text-left text-lcars-blue hover:text-lcars-orange hover:bg-white/10 px-2 py-1 rounded font-mono"
                                   >
                                      {opt.id}. {opt.text}
                                      {opt.skillCheck && (
                                         <span className="ml-2 text-xs text-lcars-purple opacity-70">
                                             [{opt.skillCheck.attribute} + {opt.skillCheck.skill}]
                                         </span>
                                      )}
                                   </button>
                                ))
                             ) : (
                                <button
                                   onClick={() => endDialogue()}
                                   className="text-left text-lcars-blue hover:text-lcars-orange hover:bg-white/10 px-2 py-1 rounded font-mono"
                                >
                                   (End Conversation)
                                </button>
                             )}
                          </div>
                       );
                    })()}
                 </div>
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
                placeholder={state.gamePhase === 'dialogue' ? "SELECT OPTION..." : "ENTER COMMAND..."}
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
                 {/* Power Distribution Panel */}
                 <div className="bg-black/50 p-2 rounded border border-lcars-orange/30 mb-2">
                    <h4 className="text-xs text-lcars-yellow mb-1 uppercase">Power Distribution</h4>
                    {['shields', 'weapons', 'engines'].map(sys => {
                       const val = state.ship.power[sys as keyof typeof state.ship.power];
                       return (
                          <div key={sys} className="flex items-center justify-between mb-1">
                             <span className="text-[10px] text-lcars-light-blue uppercase w-12">{sys.charAt(0)}: {val}%</span>
                             <div className="flex-1 mx-2 h-1 bg-gray-900 rounded-full">
                                <div className="h-full bg-lcars-yellow" style={{ width: `${val}%` }}></div>
                             </div>
                             <div className="flex gap-1">
                                <button onClick={() => setPower(sys as any, val - 10)} className="text-[10px] bg-lcars-red text-black w-4 rounded">-</button>
                                <button onClick={() => setPower(sys as any, val + 10)} className="text-[10px] bg-lcars-blue text-black w-4 rounded">+</button>
                             </div>
                          </div>
                       );
                    })}
                 </div>

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
                       <div className="flex gap-2">
                           <LCARSButton label="EVASIVE" color="blue" onClick={() => handleCommand('EVASIVE')} className="flex-1" />
                           <LCARSButton label="REPAIR" color="blue" onClick={() => handleCommand('REPAIR')} className="flex-1" />
                       </div>
                       <LCARSButton label="STATUS REPORT" color="yellow" onClick={() => handleCommand('STATUS')} />
                    </>
                 ) : (
                    <>
                       <LCARSButton label="Scan Area" color="blue" onClick={() => handleCommand('SCAN')} />
                       <LCARSButton label="Look Around" color="purple" onClick={() => handleCommand('LOOK')} />
                       <LCARSButton label="Status" color="yellow" onClick={() => handleCommand('STATUS')} />
                       <LCARSButton label="Mission" color="orange" onClick={() => handleCommand('MISSION')} />
                       <LCARSButton label="Inventory" color="orange" onClick={() => handleCommand('INVENTORY')} />
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
