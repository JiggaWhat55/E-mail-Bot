import { createContext } from 'react';
import type { GameState, PlaneType } from '../types';

export interface GameContextType {
  gameState: GameState;
  buyPlane: (planeType: PlaneType) => void;
  sellPlane: (planeId: string) => void;
  createRoute: (originId: string, destinationId: string, assignedPlaneIds: string[]) => void;
  deleteRoute: (routeId: string) => void;
  paused: boolean;
  togglePause: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);
