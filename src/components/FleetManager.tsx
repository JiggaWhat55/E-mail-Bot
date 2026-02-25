import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { PLANE_TYPES } from '../data/planes';
import { Plane as PlaneIcon, PlusCircle, Trash2, Fuel, Gauge, Users } from 'lucide-react';
import type { PlaneType } from '../types';

export const FleetManager: React.FC = () => {
  const { gameState, buyPlane, sellPlane } = useGame();
  const [activeTab, setActiveTab] = useState<'owned' | 'market'>('owned');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'flying': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`pb-2 px-4 font-medium transition-colors duration-200 ${
            activeTab === 'owned' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('owned')}
        >
          My Fleet ({gameState.fleet.length})
        </button>
        <button
          className={`pb-2 px-4 font-medium transition-colors duration-200 ${
            activeTab === 'market' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('market')}
        >
          Aircraft Market
        </button>
      </div>

      {activeTab === 'owned' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameState.fleet.map((plane) => (
            <div key={plane.instanceId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                         <PlaneIcon className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{plane.model}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium uppercase mt-1 ${getStatusColor(plane.status)}`}>
                          {plane.status}
                        </span>
                    </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                   <span className="flex items-center space-x-2"><Users size={14} /> <span>Capacity</span></span>
                   <span className="font-medium text-gray-900">{plane.capacity} pax</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                   <span className="flex items-center space-x-2"><Gauge size={14} /> <span>Speed</span></span>
                   <span className="font-medium text-gray-900">{plane.speed} km/h</span>
                </div>
                 <div className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                   <span className="flex items-center space-x-2"><Fuel size={14} /> <span>Range</span></span>
                   <span className="font-medium text-gray-900">{plane.range} km</span>
                </div>
              </div>

              <button
                onClick={() => sellPlane(plane.instanceId)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 size={16} />
                <span>Sell Aircraft</span>
              </button>
            </div>
          ))}
          {gameState.fleet.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
              No aircraft in fleet. Visit the Market to purchase one.
            </div>
          )}
        </div>
      )}

      {activeTab === 'market' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANE_TYPES.map((type: PlaneType) => (
            <div key={type.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <PlaneIcon size={120} className="text-slate-900 transform -rotate-12 translate-x-4 -translate-y-4" />
               </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{type.model}</h3>
                <p className="text-emerald-600 font-bold text-xl mb-4">${type.purchaseCost.toLocaleString()}</p>

                <div className="space-y-3 text-sm text-gray-600 mb-6 relative z-10">
                    <div className="flex justify-between">
                        <span>Range:</span>
                        <span className="font-medium">{type.range} km</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span className="font-medium">{type.capacity} pax</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Speed:</span>
                        <span className="font-medium">{type.speed} km/h</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Operating Cost:</span>
                        <span className="font-medium">${type.operatingCost}/km</span>
                    </div>
                </div>
              </div>

              <button
                onClick={() => buyPlane(type)}
                disabled={gameState.cash < type.purchaseCost}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative z-10 ${
                  gameState.cash >= type.purchaseCost
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <PlusCircle size={18} />
                <span>Purchase</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
