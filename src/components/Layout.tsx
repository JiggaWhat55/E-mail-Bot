import React from 'react';
import { useGame } from '../hooks/useGame';
import { LayoutDashboard, Plane, Map, Globe, Pause, Play } from 'lucide-react';

export type View = 'dashboard' | 'fleet' | 'routes' | 'airports';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const { gameState, paused, togglePause } = useGame();

  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'fleet', label: 'Fleet', icon: <Plane size={20} /> },
    { id: 'routes', label: 'Routes', icon: <Map size={20} /> },
    { id: 'airports', label: 'Airports', icon: <Globe size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-lg z-10">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">SkyTycoon</h1>
          <p className="text-xs text-slate-400 mt-1">Airline Management Sim</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-700 bg-slate-950">
           <div className="text-xs text-slate-400 mb-2">GAME STATUS</div>
           <div className="flex items-center justify-between">
              <div>
                  <div className="text-sm font-bold text-white">Day {gameState.day}</div>
                  <div className="text-xs text-emerald-400">${gameState.cash.toLocaleString()}</div>
              </div>
              <button
                onClick={togglePause}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                  {paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 relative">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{currentView}</h2>
            <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                    Routes: <span className="font-bold text-gray-800">{gameState.routes.length}</span>
                </div>
                <div className="text-sm text-gray-500">
                    Fleet: <span className="font-bold text-gray-800">{gameState.fleet.length}</span>
                </div>
            </div>
        </header>
        <div className="p-8 pb-20">
            {children}
        </div>
      </main>
    </div>
  );
};
