import { GameProvider, useGame } from './context/GameContext';
import { CharacterCreation } from './pages/CharacterCreation';
import { MainGame } from './pages/MainGame';

const AppContent = () => {
  const { state } = useGame();

  if (state.gamePhase === 'creation' || !state.character) {
    return <CharacterCreation />;
  }

  return <MainGame />;
};

const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
