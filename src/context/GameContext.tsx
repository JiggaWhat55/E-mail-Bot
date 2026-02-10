import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import type { Character, GameState, Location, Enemy, LogEntry } from '../types/game';
import { rollTask, type TaskDifficulty, type TaskResult } from '../logic/dice';
import { LOCATIONS } from '../data/locations';
import { MISSIONS } from '../data/missions';

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
    torpedoes: 10
  },
  enemy: null
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('trek_rpg_state');
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('trek_rpg_state', JSON.stringify(state));
  }, [state]);

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

  const createCharacter = (char: Character) => {
    setState(prev => ({
      ...prev,
      character: char,
      currentLocation: LOCATIONS.bridge,
      gamePhase: 'playing',
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
        }

        if (newObjectivesCompleted.length > 0) {
           const newLogs: LogEntry[] = newObjectivesCompleted.map(_ => ({
               id: Date.now().toString() + Math.random(),
               text: `MISSION UPDATE: Objective Completed.`,
               timestamp: prev.stardate.toFixed(1),
               type: 'system' as const
           }));

           let xpGained = 0;

           if (newObjectivesCompleted.includes('return_bridge')) {
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

           return {
             ...prev,
             character: newChar,
             completedObjectives: [...prev.completedObjectives, ...newObjectivesCompleted],
             log: [...prev.log, ...newLogs]
           };
        }
        return prev;
    });
  }, []);

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
    } else {
      addLog(`FAILURE: ${description} failed.`, 'combat');
    }

    return result;
  };

  const startCombat = (enemyName: string = 'Romulan Warbird') => {
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
      currentLocation: prev.currentLocation?.id === 'bridge' ? prev.currentLocation : LOCATIONS.bridge
    }));
    addLog(`COMBAT INITIATED: ${enemyName} decloaking!`, 'combat');
  };

  const playerAttack = (weapon: 'phasers' | 'torpedoes') => {
    setState(prev => {
        if (prev.gamePhase !== 'combat' || !prev.enemy) return prev;

        const hit = Math.random() > 0.3; // 70% chance
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
            const damage = weapon === 'phasers' ? 15 : 30;
            newLogs.push({ id: Date.now().toString(), text: `Direct hit with ${weapon}!`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });

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

            const hit = Math.random() > 0.4;
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
                newLogs.push({ id: Date.now().toString(), text: `Enemy fire missed.`, type: 'system' as const, timestamp: prev.stardate.toFixed(1) });
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

  const resetGame = () => {
    setState(defaultState);
    localStorage.removeItem('trek_rpg_state');
  };

  return (
    <GameContext.Provider value={{ state, createCharacter, addLog, advanceStardate, setLocation, performTask, triggerEvent, startCombat, playerAttack, improveAttribute, improveSkill, resetGame }}>
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
