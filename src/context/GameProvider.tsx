import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, Plane, Route, LogEntry, PlaneType } from '../types';
import { AIRPORTS } from '../data/airports';
import { calculateDistance } from '../utils/distance';
import { GameContext } from './GameContext';

const INITIAL_CASH = 50000000; // 50M start

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    cash: INITIAL_CASH,
    reputation: 50,
    fleet: [],
    routes: [],
    day: 1,
    logs: [{ id: 'init', day: 1, message: 'Welcome to Airline Manager!', type: 'info' }],
  });

  const [paused, setPaused] = useState(false);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setGameState(prev => ({
      ...prev,
      logs: [
        { id: Date.now().toString() + Math.random(), day: prev.day, message, type },
        ...prev.logs.slice(0, 49),
      ],
    }));
  }, []);

  const buyPlane = (planeType: PlaneType) => {
    if (gameState.cash >= planeType.purchaseCost) {
      const newPlane: Plane = {
        ...planeType,
        instanceId: `plane-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'idle',
      };
      setGameState(prev => ({
        ...prev,
        cash: prev.cash - planeType.purchaseCost,
        fleet: [...prev.fleet, newPlane],
      }));
      addLog(`Purchased ${planeType.model} for $${planeType.purchaseCost.toLocaleString()}`, 'success');
    } else {
      addLog('Insufficient funds to purchase plane', 'error');
    }
  };

  const sellPlane = (planeId: string) => {
    const plane = gameState.fleet.find(p => p.instanceId === planeId);
    if (plane) {
      const sellPrice = Math.floor(plane.purchaseCost * 0.7);
      setGameState(prev => ({
        ...prev,
        cash: prev.cash + sellPrice,
        fleet: prev.fleet.filter(p => p.instanceId !== planeId),
        // Remove from routes if assigned
        routes: prev.routes.map(r => ({
           ...r,
           assignedPlanes: r.assignedPlanes.filter(pid => pid !== planeId)
        })).filter(r => r.assignedPlanes.length > 0)
      }));
      addLog(`Sold ${plane.model} for $${sellPrice.toLocaleString()}`, 'warning');
    }
  };

  const createRoute = (originId: string, destinationId: string, assignedPlaneIds: string[]) => {
    const origin = AIRPORTS.find(a => a.id === originId);
    const destination = AIRPORTS.find(a => a.id === destinationId);

    if (!origin || !destination) return;

    const distance = calculateDistance(origin.location, destination.location);

    // Check if planes can make it
    const validPlanes = assignedPlaneIds.filter(id => {
        const plane = gameState.fleet.find(p => p.instanceId === id);
        return plane && plane.range >= distance;
    });

    if (validPlanes.length === 0) {
        addLog('No assigned planes have the range for this route.', 'error');
        return;
    }

    // Ticket price logic
    const ticketPrice = 50 + (distance * 0.15);

    const newRoute: Route = {
      id: `route-${Date.now()}`,
      originId,
      destinationId,
      assignedPlanes: validPlanes,
      ticketPrice,
    };

    setGameState(prev => ({
      ...prev,
      routes: [...prev.routes, newRoute],
    }));
    addLog(`Created new route from ${origin.code} to ${destination.code}`, 'success');
  };

  const deleteRoute = (routeId: string) => {
      setGameState(prev => ({
          ...prev,
          routes: prev.routes.filter(r => r.id !== routeId)
      }));
      addLog('Route deleted', 'info');
  };

  const tick = useCallback(() => {
    setGameState(prev => {
        let dailyRevenue = 0;
        let dailyCosts = 0;

        prev.routes.forEach(route => {
            const origin = AIRPORTS.find(a => a.id === route.originId)!;
            const destination = AIRPORTS.find(a => a.id === route.destinationId)!;
            const distance = calculateDistance(origin.location, destination.location);

            route.assignedPlanes.forEach(planeId => {
                const plane = prev.fleet.find(p => p.instanceId === planeId);
                if (!plane) return;

                const demand = (origin.demand + destination.demand) / 2;
                const loadFactor = Math.min(1, demand / 100);
                const passengers = Math.floor(plane.capacity * loadFactor);

                const flightRevenue = passengers * route.ticketPrice;
                const flightCost = (distance * plane.operatingCost) + ((origin.fees + destination.fees) / 2);

                const flightTime = distance / plane.speed;
                const flightsPerDay = Math.floor(24 / (flightTime + 1)); // +1 hour turnaround

                if (flightsPerDay > 0) {
                     dailyRevenue += flightRevenue * flightsPerDay;
                     dailyCosts += flightCost * flightsPerDay;
                }
            });
        });

        const profit = dailyRevenue - dailyCosts;

        const newLog: LogEntry = {
            id: `day-${prev.day + 1}`,
            day: prev.day + 1,
            message: `Day ${prev.day + 1}: Profit $${Math.floor(profit).toLocaleString()}`,
            type: profit >= 0 ? 'success' : 'warning'
        };

        return {
            ...prev,
            day: prev.day + 1,
            cash: prev.cash + profit,
            logs: [newLog, ...prev.logs].slice(0, 50)
        };
    });
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!paused) {
      interval = setInterval(() => {
        tick();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [paused, tick]);

  const togglePause = () => setPaused(prev => !prev);

  return (
    <GameContext.Provider value={{ gameState, buyPlane, sellPlane, createRoute, deleteRoute, paused, togglePause }}>
      {children}
    </GameContext.Provider>
  );
};
