import React from 'react';
import { AIRPORTS } from '../data/airports';
import { Globe, MapPin, TrendingUp, DollarSign } from 'lucide-react';

export const AirportList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {AIRPORTS.map((airport) => (
        <div key={airport.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{airport.code}</h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{airport.country}</p>
              </div>
            </div>
          </div>

          <h4 className="text-sm font-medium text-slate-900 mb-4 h-10 line-clamp-2">{airport.name}</h4>

          <div className="space-y-3 text-sm text-slate-600">
             <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                 <div className="flex items-center space-x-2 text-slate-400">
                     <TrendingUp size={14} />
                     <span>Passenger Demand</span>
                 </div>
                 <div className="flex items-center">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mr-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${airport.demand}%` }}></div>
                    </div>
                    <span className="font-medium text-slate-800">{airport.demand}</span>
                 </div>
             </div>

             <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                 <div className="flex items-center space-x-2 text-slate-400">
                     <DollarSign size={14} />
                     <span>Landing Fees</span>
                 </div>
                 <span className="font-medium text-slate-800">${airport.fees.toLocaleString()}</span>
             </div>

             <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-2 text-slate-400">
                     <MapPin size={14} />
                     <span>Coordinates</span>
                 </div>
                 <span className="font-mono text-xs text-slate-500">{airport.location.lat.toFixed(2)}, {airport.location.lng.toFixed(2)}</span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
