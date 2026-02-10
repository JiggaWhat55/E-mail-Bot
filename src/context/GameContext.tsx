import { createContext, useContext, useState, type ReactNode, useEffect, useCallback, useRef } from 'react';
import type { Character, GameState, Location, Enemy, LogEntry } from '../types/game';
import { rollTask, type TaskDifficulty, type TaskResult } from '../logic/dice';
import { LOCATIONS } from '../data/locations';
import { MISSIONS } from '../data/missions';
import { ITEMS } from '../data/items';
import { NPCS } from '../data/npcs';

interface GameContextType {
  state: GameState;
  createCharacter: (char: Character) => void;
  addLog: (text: string, type?: 'narrative' | 'system' | 'combat') => void;
  advanceStardate: (amount: number) => void;
  setLocation: (location: Location) => void;
  performTask: (attributeName: string, skillName: string, difficulty: TaskDifficulty, description: string) => TaskResult | null;
  triggerEvent: (event: string, data?: any) => void;
  startCombat: (enemyName?: string) => void;
  playerAttack: (weapon: 'phasers' | 'torpedoes') => void;
  improveAttribute: (attrName: string) => void;
  improveSkill: (skillName: string) => void;
  resetGame: () => void;
  pickupItem: (itemId: string) => void;
  dropItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  setPower: (system: 'shields' | 'weapons' | 'engines', amount: number) => void;
  startDialogue: (npcId: string) => void;
  answerDialogue: (optionId: string) => void;
  endDialogue: () => void;
}

const defaultState: GameState = {
  character: null,
  currentLocation: null,
  log: [],
  stardate: 41153.7,
  inventory: [],
  activeMissionId: 'tutorial',
  completedObjectives: [],
  gamePhase: 'creation',
  ship: {
    shields: 100,
    maxShields: 100,
    hull: 100,
    maxHull: 100,
    torpedoes: 10,
    power: {
      shields: 33,
      weapons: 33,
      engines: 33
    }
  },
  enemy: null,
  activeDialogue: null
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('trek_rpg_state');
    return saved ? JSON.parse(saved) : defaultState;
  });

  const prevEnemyRef = useRef<Enemy | null>(null);

  useEffect(() => {
    localStorage.setItem('trek_rpg_state', JSON.stringify(state));
  }, [state]);

  const triggerEvent = useCallback((event: string, data?: any) => {
    setState(prev => {
        if (!prev.activeMissionId) return prev;
        const mission = MISSIONS[prev.activeMissionId];
        if (!mission) return prev;

        let newObjectivesCompleted: string[] = [];

        if (prev.activeMissionId === 'tutorial') {
          if (event === 'VISIT_LOCATION' && data === 'engineering') {
            if (!prev.completedObjectives.includes('visit_engineering')) {
              newObjectivesCompleted.push('visit_engineering');
            }
          }
          if (event === 'VISIT_LOCATION' && data === 'sickbay') {
             if (!prev.completedObjectives.includes('visit_sickbay')) {
               newObjectivesCompleted.push('visit_sickbay');
             }
          }
          if (event === 'ACTION_SCAN' && prev.currentLocation?.id === 'engineering') {
             if (!prev.completedObjectives.includes('scan_warp_core')) {
               newObjectivesCompleted.push('scan_warp_core');
             }
          }
          if (event === 'VISIT_LOCATION' && data === 'bridge') {
             const required = ['visit_engineering', 'scan_warp_core', 'visit_sickbay'];
             const allDone = required.every(obj => prev.completedObjectives.includes(obj) || newObjectivesCompleted.includes(obj));

             if (allDone && !prev.completedObjectives.includes('return_bridge')) {
                newObjectivesCompleted.push('return_bridge');
             }
          }
        } else if (prev.activeMissionId === 'neutral_zone') {
          if (event === 'TALK' && data === 'worf') {
             if (!prev.completedObjectives.includes('talk_worf')) {
               newObjectivesCompleted.push('talk_worf');
             }
          }
          if (event === 'VISIT_LOCATION' && data === 'neutral_zone') {
             if (!prev.completedObjectives.includes('warp_nz')) {
               newObjectivesCompleted.push('warp_nz');
             }
          }
          if (event === 'ACTION_SCAN' && prev.currentLocation?.id === 'neutral_zone') {
             if (!prev.completedObjectives.includes('scan_derelict')) {
               newObjectivesCompleted.push('scan_derelict');
             }
          }
          if (event === 'COMBAT_VICTORY' && (data === 'Romulan Warbird' || data === 'Warbird')) {
             if (!prev.completedObjectives.includes('defeat_romulan')) {
               newObjectivesCompleted.push('defeat_romulan');
             }
          }
        }

        if (newObjectivesCompleted.length > 0) {
           const newLogs: LogEntry[] = newObjectivesCompleted.map(_ => ({
               id: Date.now().toString() + Math.random(),
               text: `MISSION UPDATE: Objective Completed.`,
               timestamp: prev.stardate.toFixed(1),
               type: 'system' as const
           }));

           let xpGained = 0;
           let missionComplete = false;

           if (prev.activeMissionId === 'tutorial' && newObjectivesCompleted.includes('return_bridge')) {
               missionComplete = true;
           }
           if (prev.activeMissionId === 'neutral_zone' && newObjectivesCompleted.includes('defeat_romulan')) {
               missionComplete = true;
           }

           if (missionComplete) {
               xpGained = mission.rewards.xp;
               newLogs.push({
                   id: Date.now().toString() + Math.random(),
                   text: `MISSION COMPLETE: ${mission.title}! XP Awarded: ${mission.rewards.xp}`,
                   timestamp: prev.stardate.toFixed(1),
                   type: 'system' as const
               });
           }

           let newChar = prev.character;
           if (newChar && xpGained > 0) {
              newChar = { ...newChar, xp: newChar.xp + xpGained };
           }

           let newState = {
             ...prev,
             character: newChar,
             completedObjectives: [...prev.completedObjectives, ...newObjectivesCompleted],
             log: [...prev.log, ...newLogs]
           };

           // Auto-switch to next mission if tutorial complete
           if (missionComplete && prev.activeMissionId === 'tutorial') {
              newState.activeMissionId = 'neutral_zone';
              newState.completedObjectives = []; // Reset objectives for new mission
              newState.log.push({
                  id: Date.now().toString() + Math.random(),
                  text: `NEW MISSION: ${MISSIONS['neutral_zone'].title}`,
                  timestamp: prev.stardate.toFixed(1),
                  type: 'system' as const
              });
              newState.log.push({
                  id: Date.now().toString() + Math.random(),
                  text: `Mission Briefing: ${MISSIONS['neutral_zone'].description}`,
                  timestamp: prev.stardate.toFixed(1),
                  type: 'narrative' as const
              });
           }

           return newState;
        }
        return prev;
    });
  }, []);

  const addLog = useCallback((text: string, type: 'narrative' | 'system' | 'combat' = 'narrative') => {
    setState(prev => ({
      ...prev,
      log: [...prev.log, {
        id: Date.now().toString() + Math.random(),
        text,
        timestamp: prev.stardate.toFixed(1),
        type
      }]
    }));
  }, []);

  const startCombat = useCallback((enemyName: string = 'Romulan Warbird') => {
    const enemy: Enemy = {
      name: enemyName,
      shields: 100,
      maxShields: 100,
      hull: 100,
      maxHull: 100,
      damage: 15
    };

    setState(prev => ({
      ...prev,
      gamePhase: 'combat',
      enemy,
      currentLocation: prev.currentLocation?.id === 'bridge' ? prev.currentLocation : prev.currentLocation // Stay in current location
    }));
    // Cannot call addLog here easily because it updates state too, leading to conflict?
    // Actually set state merges so it's fine if we include log update in the state update above.
    // But for cleaner code, let's just include log in the setState.

    setState(prev => ({
       ...prev,
       log: [...prev.log, { id: Date.now().toString(), text: `COMBAT INITIATED: ${enemyName} decloaking!`, type: 'combat' as const, timestamp: prev.stardate.toFixed(1) }]
    }));
  }, []);

  // Effect to trigger combat when derelict scanned
  useEffect(() => {
    const lastObjective = state.completedObjectives[state.completedObjectives.length - 1];
    if (state.activeMissionId === 'neutral_zone' && lastObjective === 'scan_derelict' && state.gamePhase !== 'combat') {
       startCombat('Romulan Warbird');
    }
  }, [state.completedObjectives, state.activeMissionId, state.gamePhase, startCombat]);

  // Effect to detect combat victory
  useEffect(() => {
     if (prevEnemyRef.current && !state.enemy && state.gamePhase === 'playing') {
         triggerEvent('COMBAT_VICTORY', prevEnemyRef.current.name);
     }
     prevEnemyRef.current = state.enemy;
  }, [state.enemy, state.gamePhase, triggerEvent]);


  const createCharacter = (char: Character) => {
    setState(prev => ({
      ...prev,
      character: char,
      currentLocation: LOCATIONS.bridge,
      gamePhase: 'playing',
      inventory: [...char.role.startingGear.map(g => {
        if (g.includes('Phaser')) return 'phaser_t2';
        if (g.includes('Tricorder')) return 'tricorder';
        if (g.includes('Hypospray')) return 'hypospray';
        if (g.includes('PADD')) return 'padd';
        if (g.includes('Engineering')) return 'engineering_kit';
        return '';
      }).filter(Boolean)],
      log: [{
        id: Date.now().toString(),
        text: `Stardate ${prev.stardate}: Character initialized. Welcome aboard, ${char.rank} ${char.name}.`,
        timestamp: prev.stardate.toFixed(1),
        type: 'system'
      }, {
        id: Date.now().toString() + '1',
        text: `You are currently on the ${LOCATIONS.bridge.name}. ${LOCATIONS.bridge.description}`,
        timestamp: prev.stardate.toFixed(1),
        type: 'narrative'
      }]
    }));
  };

  const advanceStardate = (amount: number) => {
    setState(prev => ({
      ...prev,
      stardate: prev.stardate + amount
    }));
  };

  const setLocation = (location: Location) => {
    if (state.gamePhase === 'combat') {
      addLog('Cannot leave area while in combat!', 'combat');
      return;
    }
    setState(prev => ({
      ...prev,
      currentLocation: location
    }));
    addLog(`Arrived at ${location.name}.`, 'system');
    addLog(location.description, 'narrative');

    triggerEvent('VISIT_LOCATION', location.id);
  };

  const performTask = (
    attributeName: string,
    skillName: string,
    difficulty: TaskDifficulty = 'routine',
    description: string
  ): TaskResult | null => {
    if (!state.character) return null;

    const attributeValue = state.character.attributes[attributeName]?.value || 0;
    const skillValue = state.character.skills[skillName]?.value || 0;

    addLog(`Attempting ${description}... [${attributeName} + ${skillName}]`, 'system');

    const result = rollTask(attributeValue, skillValue, difficulty);

    if (result.success) {
      addLog(`SUCCESS: ${description} completed.`, 'system');
      if (description.includes('Scan') || description.includes('Analysis')) {
          triggerEvent('ACTION_SCAN', null);
      }
    } else {
      addLog(`FAILURE: ${description} failed.`, 'combat');
    }

    return result;
  };

  const setPower = (system: 'shields' | 'weapons' | 'engines', amount: number) => {
     setState(prev => {
        const total = 100;
        let newPower = { ...prev.ship.power };
        amount = Math.max(0, Math.min(100, amount));

        if (system === 'shields') {
           newPower.shields = amount;
           const remaining = total - amount;
           newPower.weapons = Math.floor(remaining / 2);
           newPower.engines = Math.ceil(remaining / 2);
        } else if (system === 'weapons') {
           newPower.weapons = amount;
           const remaining = total - amount;
           newPower.shields = Math.floor(remaining / 2);
           newPower.engines = Math.ceil(remaining / 2);
        } else {
           newPower.engines = amount;
           const remaining = total - amount;
           newPower.shields = Math.floor(remaining / 2);
           newPower.weapons = Math.ceil(remaining / 2);
        }

        return {
           ...prev,
           ship: { ...prev.ship, power: newPower },
           log: [...prev.log, { id: Date.now().toString(), text: `Power Rerouted: S:${newPower.shields}% W:${newPower.weapons}% E:${newPower.engines}%`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) }]
        };
     });
  };

  const playerAttack = (weapon: 'phasers' | 'torpedoes') => {
    setState(prev => {
        if (prev.gamePhase !== 'combat' || !prev.enemy) return prev;

        const hitChance = 0.3 + (prev.ship.power.weapons / 200);
        const hit = Math.random() < hitChance;

        let newLogs: LogEntry[] = [];
        let newEnemy = { ...prev.enemy };
        let newShip = { ...prev.ship };

        if (weapon === 'torpedoes') {
            if (newShip.torpedoes > 0) {
                newShip.torpedoes -= 1;
            } else {
                return {
                    ...prev,
                    log: [...prev.log, { id: Date.now().toString(), text: 'Out of torpedoes!', type: 'combat' as const, timestamp: prev.stardate.toFixed(1) }]
                };
            }
        }

        if (hit) {
            let damage = weapon === 'phasers' ? 15 : 30;
            damage = Math.floor(damage * (0.5 + (prev.ship.power.weapons / 50)));

            newLogs.push({ id: Date.now().toString(), text: `Direct hit with ${weapon}! Damage: ${damage}`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });

            let newShields = newEnemy.shields - damage;
            let newHull = newEnemy.hull;

            if (newShields < 0) {
                newHull += newShields;
                newShields = 0;
            }
            newEnemy.shields = newShields;
            newEnemy.hull = newHull;

            if (newHull <= 0) {
                newLogs.push({ id: Date.now().toString() + '1', text: `Target destroyed! ${newEnemy.name} neutralized.`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
                return {
                    ...prev,
                    gamePhase: 'playing',
                    enemy: null,
                    log: [...prev.log, ...newLogs]
                };
            } else {
                 newLogs.push({ id: Date.now().toString() + '2', text: `Target status: Shields ${newShields}%, Hull ${newHull}%`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
            }
        } else {
            newLogs.push({ id: Date.now().toString(), text: `${weapon} missed target!`, type: 'combat' as const, timestamp: prev.stardate.toFixed(1) });
        }

        const regen = Math.floor(prev.ship.power.shields / 10);
        if (newShip.shields < newShip.maxShields) {
            newShip.shields = Math.min(newShip.maxShields, newShip.shields + regen);
            if (regen > 0) newLogs.push({ id: Date.now().toString() + '3', text: `Shields regenerated by ${regen}%`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
        }

        return {
            ...prev,
            ship: newShip,
            enemy: newEnemy,
            log: [...prev.log, ...newLogs]
        };
    });

    setTimeout(() => {
        setState(prev => {
            if (prev.gamePhase !== 'combat' || !prev.enemy) return prev;

            const dodgeChance = prev.ship.power.engines / 200;
            const hit = Math.random() > dodgeChance;

            let newLogs: LogEntry[] = [];
            let newShip = { ...prev.ship };

            if (hit) {
                let damage = prev.enemy.damage;
                let newShields = newShip.shields - damage;
                let newHull = newShip.hull;

                if (newShields < 0) {
                    newHull += newShields;
                    newShields = 0;
                }

                newShip.shields = newShields;
                newShip.hull = newHull;

                newLogs.push({ id: Date.now().toString(), text: `Incoming fire! Shields at ${newShields}%`, type: 'combat' as const, timestamp: prev.stardate.toFixed(1) });

                if (newHull <= 0) {
                    newLogs.push({ id: Date.now().toString() + '1', text: 'CRITICAL FAILURE: SHIP DESTROYED.', type: 'combat' as const, timestamp: prev.stardate.toFixed(1) });
                     return {
                        ...prev,
                        gamePhase: 'gameover',
                        ship: newShip,
                        log: [...prev.log, ...newLogs]
                    };
                }
            } else {
                newLogs.push({ id: Date.now().toString(), text: `Enemy fire missed (Evasive Maneuvers Delta).`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
            }

            return {
                ...prev,
                ship: newShip,
                log: [...prev.log, ...newLogs]
            };
        });
    }, 1500);
  };

  const improveAttribute = (attrName: string) => {
    setState(prev => {
        if (!prev.character) return prev;
        const attr = prev.character.attributes[attrName];
        if (!attr) return prev;

        const cost = attr.value * 20;
        if (prev.character.xp >= cost) {
            return {
                ...prev,
                character: {
                    ...prev.character,
                    xp: prev.character.xp - cost,
                    attributes: {
                        ...prev.character.attributes,
                        [attrName]: { ...attr, value: attr.value + 1 }
                    }
                },
                log: [...prev.log, { id: Date.now().toString(), text: `Attribute ${attrName} improved to ${attr.value + 1}`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) }]
            };
        }
        return prev;
    });
  };

  const improveSkill = (skillName: string) => {
    setState(prev => {
        if (!prev.character) return prev;
        const skill = prev.character.skills[skillName];
        if (!skill) return prev;

        const cost = skill.value * 10;
        if (prev.character.xp >= cost) {
            return {
                ...prev,
                character: {
                    ...prev.character,
                    xp: prev.character.xp - cost,
                    skills: {
                        ...prev.character.skills,
                        [skillName]: { ...skill, value: skill.value + 1 }
                    }
                },
                log: [...prev.log, { id: Date.now().toString(), text: `Skill ${skillName} improved to ${skill.value + 1}`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) }]
            };
        }
        return prev;
    });
  };

  const pickupItem = (itemId: string) => {
    setState(prev => {
       if (!prev.currentLocation || !prev.currentLocation.items.includes(itemId)) {
          return prev;
       }
       const item = ITEMS[itemId];
       if (!item) return prev;

       return {
          ...prev,
          inventory: [...prev.inventory, itemId],
          currentLocation: {
             ...prev.currentLocation,
             items: prev.currentLocation.items.filter(id => id !== itemId)
          },
          log: [...prev.log, { id: Date.now().toString(), text: `Picked up ${item.name}.`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) }]
       };
    });
  };

  const dropItem = (itemId: string) => {
    setState(prev => {
       if (!prev.inventory.includes(itemId) || !prev.currentLocation) return prev;
       const item = ITEMS[itemId];

       return {
          ...prev,
          inventory: prev.inventory.filter(id => id !== itemId),
          currentLocation: {
             ...prev.currentLocation,
             items: [...prev.currentLocation.items, itemId]
          },
          log: [...prev.log, { id: Date.now().toString(), text: `Dropped ${item.name}.`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) }]
       };
    });
  };

  const useItem = (itemId: string) => {
     setState(prev => {
        if (!prev.inventory.includes(itemId)) return prev;
        const item = ITEMS[itemId];

        let newLogs: LogEntry[] = [];
        let newChar = prev.character;

        if (itemId === 'hypospray') {
           if (newChar) {
              newChar = { ...newChar, currentHealth: Math.min(newChar.maxHealth, newChar.currentHealth + 10) };
              newLogs.push({ id: Date.now().toString(), text: `Used Hypospray. Health restored.`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
              return {
                 ...prev,
                 character: newChar,
                 inventory: prev.inventory.filter(id => id !== itemId),
                 log: [...prev.log, ...newLogs]
              };
           }
        } else if (itemId === 'tricorder') {
            newLogs.push({ id: Date.now().toString(), text: `Scanning with Tricorder... Detailed analysis: ${prev.currentLocation?.description}`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
        } else if (itemId === 'padd') {
            newLogs.push({ id: Date.now().toString(), text: `Reading PADD... Mission Briefing: ${prev.activeMissionId ? MISSIONS[prev.activeMissionId]?.title : 'None'}`, type: 'narrative' as const, timestamp: prev.stardate.toFixed(1) });
        } else {
           newLogs.push({ id: Date.now().toString(), text: `Used ${item.name}. Nothing happened.`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
        }

        return {
           ...prev,
           log: [...prev.log, ...newLogs]
        };
     });
  };

  const startDialogue = (npcId: string) => {
     setState(prev => {
        const npc = NPCS[npcId];
        if (!npc) return prev;

        const node = npc.dialogue[npc.startingNodeId];

        return {
           ...prev,
           gamePhase: 'dialogue',
           activeDialogue: { npcId, nodeId: npc.startingNodeId },
           log: [...prev.log, { id: Date.now().toString(), text: `${npc.name}: "${node.text}"`, type: 'narrative' as const, timestamp: prev.stardate.toFixed(1) }]
        };
     });
  };

  const answerDialogue = (optionId: string) => {
     setState(prev => {
        if (!prev.activeDialogue) return prev;
        const npc = NPCS[prev.activeDialogue.npcId];
        if (!npc) return prev;
        const currentNode = npc.dialogue[prev.activeDialogue.nodeId];
        const option = currentNode.options.find(o => o.id === optionId);

        if (!option) return prev;

        const nextNode = npc.dialogue[option.nextNodeId];
        if (!nextNode) {
           // End dialogue if next node invalid or empty
           return {
              ...prev,
              gamePhase: 'playing',
              activeDialogue: null,
              log: [...prev.log,
                 { id: Date.now().toString(), text: `You: "${option.text}"`, type: 'narrative' as const, timestamp: prev.stardate.toFixed(1) },
                 { id: Date.now().toString() + '1', text: '(Dialogue Ended)', type: 'system' as const, timestamp: prev.stardate.toFixed(1) }
              ]
           };
        }

        return {
           ...prev,
           activeDialogue: { ...prev.activeDialogue, nodeId: option.nextNodeId },
           log: [...prev.log,
              { id: Date.now().toString(), text: `You: "${option.text}"`, type: 'narrative' as const, timestamp: prev.stardate.toFixed(1) },
              { id: Date.now().toString() + '1', text: `${npc.name}: "${nextNode.text}"`, type: 'narrative' as const, timestamp: prev.stardate.toFixed(1) }
           ]
        };
     });
  };

  const endDialogue = () => {
     setState(prev => {
         // Trigger talk event before clearing
         // But I can't call triggerEvent here.
         // I'll return the state change and rely on useEffect?
         // No, useEffect for talking is hard.
         // I'll call triggerEvent outside?
         // No, I can't.
         // I'll add logic here manually or use a flag.
         return {
            ...prev,
            gamePhase: 'playing',
            activeDialogue: null,
            log: [...prev.log, { id: Date.now().toString(), text: '(Dialogue Ended)', type: 'system' as const, timestamp: prev.stardate.toFixed(1) }]
         };
     });

     // Hack: use current state to get npcId?
     // State update is async.
     if (state.activeDialogue) {
        triggerEvent('TALK', state.activeDialogue.npcId);
     }
  };

  const resetGame = () => {
    setState(defaultState);
    localStorage.removeItem('trek_rpg_state');
  };

  return (
    <GameContext.Provider value={{ state, createCharacter, addLog, advanceStardate, setLocation, performTask, triggerEvent, startCombat, playerAttack, improveAttribute, improveSkill, resetGame, pickupItem, dropItem, useItem, setPower, startDialogue, answerDialogue, endDialogue }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
