import React from 'react';
import { useGame } from '../hooks/useGame';
import { LogViewer } from './LogViewer';
import { DollarSign, Star, Plane, Route as RouteIcon } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { gameState } = useGame();

  const stats = [
    { label: 'Total Cash', value: `$${gameState.cash.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Reputation', value: `${gameState.reputation}%`, icon: <Star size={24} />, color: 'text-amber-500 bg-amber-50' },
    { label: 'Fleet Size', value: gameState.fleet.length, icon: <Plane size={24} />, color: 'text-blue-500 bg-blue-50' },
    { label: 'Active Routes', value: gameState.routes.length, icon: <RouteIcon size={24} />, color: 'text-violet-500 bg-violet-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                   <h3 className="font-semibold text-slate-800">Financial Overview</h3>
               </div>
               <div className="p-8 flex items-center justify-center min-h-[300px] text-slate-400">
                   {/* Placeholder for a chart */}
                   <div className="text-center">
                       <p className="text-lg font-medium mb-2">Financial Charts Coming Soon</p>
                       <p className="text-sm opacity-70">Track your daily revenue and expenses here.</p>
                   </div>
               </div>
           </div>
        </div>
        <div className="lg:col-span-1">
          <LogViewer />
        </div>
      </div>
    </div>
  );
};
