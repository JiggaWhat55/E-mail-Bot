import React, { useState } from 'react';
import { GameProvider } from './context/GameProvider';
import { Layout, type View } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FleetManager } from './components/FleetManager';
import { RouteManager } from './components/RouteManager';
import { AirportList } from './components/AirportList';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'fleet':
        return <FleetManager />;
      case 'routes':
        return <RouteManager />;
      case 'airports':
        return <AirportList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
