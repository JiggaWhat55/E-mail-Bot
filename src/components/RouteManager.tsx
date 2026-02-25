import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { AIRPORTS } from '../data/airports';
import { calculateDistance } from '../utils/distance';
import { Map, ArrowRight, Trash2, Route as RouteIcon } from 'lucide-react';

export const RouteManager: React.FC = () => {
  const { gameState, createRoute, deleteRoute } = useGame();
  const [originId, setOriginId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [selectedPlanes, setSelectedPlanes] = useState<string[]>([]);

  const availablePlanes = gameState.fleet.filter(
    (p) => !gameState.routes.some((r) => r.assignedPlanes.includes(p.instanceId))
  );

  const handleCreateRoute = () => {
    if (originId && destinationId && selectedPlanes.length > 0) {
      createRoute(originId, destinationId, selectedPlanes);
      setOriginId('');
      setDestinationId('');
      setSelectedPlanes([]);
    }
  };

  const origin = AIRPORTS.find(a => a.id === originId);
  const destination = AIRPORTS.find(a => a.id === destinationId);
  const distance = origin && destination ? Math.round(calculateDistance(origin.location, destination.location)) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Route Creation Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Map className="text-blue-500" size={20} />
            <span>Create New Route</span>
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Origin</label>
            <select
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
            >
              <option value="">Select Origin</option>
              {AIRPORTS.map((airport) => (
                <option key={airport.id} value={airport.id} disabled={airport.id === destinationId}>
                  {airport.code} - {airport.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Destination</label>
            <select
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
            >
              <option value="">Select Destination</option>
              {AIRPORTS.map((airport) => (
                <option key={airport.id} value={airport.id} disabled={airport.id === originId}>
                  {airport.code} - {airport.name}
                </option>
              ))}
            </select>
          </div>

          {distance > 0 && (
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-slate-500">Distance:</span>
                    <span className="font-medium text-slate-800">{distance.toLocaleString()} km</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Est. Ticket Price:</span>
                    <span className="font-medium text-emerald-600">${Math.floor(50 + (distance * 0.15))}</span>
                </div>
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Assign Aircraft</label>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg custom-scrollbar">
                {availablePlanes.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-sm italic">No idle aircraft available.</div>
                ) : (
                    availablePlanes.map((plane) => {
                        const canReach = distance > 0 ? plane.range >= distance : true;
                        return (
                            <div key={plane.instanceId} className={`flex items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!canReach ? 'opacity-50' : ''}`}>
                                <input
                                type="checkbox"
                                id={plane.instanceId}
                                disabled={!canReach}
                                checked={selectedPlanes.includes(plane.instanceId)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                    setSelectedPlanes([...selectedPlanes, plane.instanceId]);
                                    } else {
                                    setSelectedPlanes(selectedPlanes.filter((id) => id !== plane.instanceId));
                                    }
                                }}
                                className="mr-3 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={plane.instanceId} className={`flex-1 text-sm cursor-pointer ${!canReach ? 'cursor-not-allowed' : ''}`}>
                                    <div className="font-medium">{plane.model}</div>
                                    <div className={`text-xs ${canReach ? 'text-slate-500' : 'text-red-500'}`}>
                                        Range: {plane.range} km {canReach ? '' : '(Too Short)'}
                                    </div>
                                </label>
                            </div>
                        );
                    })
                )}
            </div>
          </div>

          <button
            onClick={handleCreateRoute}
            disabled={!originId || !destinationId || selectedPlanes.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all shadow-sm hover:shadow-md ${
              !originId || !destinationId || selectedPlanes.length === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Launch Route
          </button>
        </div>
      </div>

      {/* Active Routes List */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <RouteIcon className="text-blue-500" size={20} />
            <span>Active Routes</span>
        </h3>

        {gameState.routes.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 h-full flex flex-col items-center justify-center">
                <Map size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No active routes</p>
                <p className="text-sm">Create a new route to start earning revenue.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameState.routes.map((route) => {
                const routeOrigin = AIRPORTS.find(a => a.id === route.originId);
                const routeDest = AIRPORTS.find(a => a.id === route.destinationId);

                if (!routeOrigin || !routeDest) return null;

                const routeDistance = calculateDistance(routeOrigin.location, routeDest.location);

                return (
                    <div key={route.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3 w-full justify-between px-2">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-slate-800">{routeOrigin.code}</div>
                                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{routeOrigin.name.split(' ').slice(0, 1).join(' ')}</div>
                                </div>
                                <ArrowRight className="text-slate-300" />
                                <div className="text-center">
                                    <div className="text-2xl font-black text-slate-800">{routeDest.code}</div>
                                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{routeDest.name.split(' ').slice(0, 1).join(' ')}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteRoute(route.id)}
                                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Close Route"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                                <span>Distance</span>
                                <span className="font-medium">{Math.round(routeDistance).toLocaleString()} km</span>
                            </div>
                             <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                                <span>Assigned Aircraft</span>
                                <span className="font-medium">{route.assignedPlanes.length}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Ticket Price</span>
                                <span className="font-medium text-emerald-600">${route.ticketPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
