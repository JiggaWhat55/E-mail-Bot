import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { Character, GameState, Location } from '../types/game';

interface GameContextType {
  state: GameState;
  createCharacter: (char: Character) => void;
  addLog: (text: string, type?: 'narrative' | 'system' | 'combat') => void;
  advanceStardate: (amount: number) => void;
  setLocation: (location: Location) => void;
  resetGame: () => void;
}

const defaultState: GameState = {
  character: null,
  currentLocation: null,
  log: [],
  stardate: 41153.7, // TNG Era Start
  inventory: [],
  missionObjectives: [],
  gamePhase: 'creation', // Default to creation if no char
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

  const createCharacter = (char: Character) => {
    setState(prev => ({
      ...prev,
      character: char,
      gamePhase: 'playing',
      log: [{
        id: Date.now().toString(),
        text: `Stardate ${prev.stardate}: Character initialized. Welcome aboard, ${char.rank} ${char.name}.`,
        timestamp: prev.stardate.toFixed(1),
        type: 'system'
      }]
    }));
  };

  const addLog = (text: string, type: 'narrative' | 'system' | 'combat' = 'narrative') => {
    setState(prev => ({
      ...prev,
      log: [...prev.log, {
        id: Date.now().toString() + Math.random(),
        text,
        timestamp: prev.stardate.toFixed(1),
        type
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
    setState(prev => ({
      ...prev,
      currentLocation: location
    }));
    addLog(`Arrived at ${location.name}.`, 'system');
  };

  const resetGame = () => {
    setState(defaultState);
    localStorage.removeItem('trek_rpg_state');
  };

  return (
    <GameContext.Provider value={{ state, createCharacter, addLog, advanceStardate, setLocation, resetGame }}>
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
