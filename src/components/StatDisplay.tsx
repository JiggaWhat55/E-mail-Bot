import type { FC } from 'react';
import { useGame } from '../context/GameContext';
import type { Character } from '../types/game';

interface StatDisplayProps {
  character: Character;
}

export const StatDisplay: FC<StatDisplayProps> = ({ character }) => {
  const { improveAttribute, improveSkill } = useGame();

  const getAttributeCost = (value: number) => value * 20;
  const getSkillCost = (value: number) => value * 10;

  return (
    <div className="bg-black/80 border-l-4 border-lcars-blue pl-4 py-2 font-mono text-sm mb-4">
      <div className="flex justify-between border-b border-lcars-orange mb-2 pb-1">
        <span className="text-lcars-orange font-bold uppercase tracking-widest text-lg">{character.rank} {character.name}</span>
        <div className="text-right">
           <span className="text-lcars-light-blue uppercase text-xs block pb-1">{character.department}</span>
           <span className="text-white text-xs block">XP: {character.xp}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <h3 className="text-lcars-purple mb-2 uppercase tracking-wide border-b border-lcars-purple/30 pb-1">Attributes</h3>
          {Object.values(character.attributes).map((attr) => {
             const cost = getAttributeCost(attr.value);
             const canAfford = character.xp >= cost;
             return (
                <div key={attr.name} className="flex justify-between items-center mb-1 group hover:bg-white/5 px-1 rounded transition-colors relative">
                  <span className="uppercase text-gray-400 text-xs tracking-wider">{attr.name}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-lcars-orange font-bold">{attr.value}</span>
                     {canAfford && (
                        <button
                           onClick={() => improveAttribute(attr.name)}
                           className="text-[10px] bg-lcars-orange/20 hover:bg-lcars-orange text-lcars-orange hover:text-black px-1 rounded transition-colors"
                           title={`Improve for ${cost} XP`}
                        >
                           +
                        </button>
                     )}
                  </div>
                </div>
             );
          })}
        </div>
        <div>
          <h3 className="text-lcars-light-blue mb-2 uppercase tracking-wide border-b border-lcars-light-blue/30 pb-1">Skills</h3>
          {Object.values(character.skills).map((skill) => {
             const cost = getSkillCost(skill.value);
             const canAfford = character.xp >= cost;
             return (
                <div key={skill.name} className="flex justify-between items-center mb-1 group hover:bg-white/5 px-1 rounded transition-colors">
                  <span className="uppercase text-gray-400 text-xs tracking-wider">{skill.name}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-lcars-blue font-bold">{skill.value}</span>
                     {canAfford && (
                        <button
                           onClick={() => improveSkill(skill.name)}
                           className="text-[10px] bg-lcars-blue/20 hover:bg-lcars-blue text-lcars-blue hover:text-black px-1 rounded transition-colors"
                           title={`Improve for ${cost} XP`}
                        >
                           +
                        </button>
                     )}
                  </div>
                </div>
             );
          })}
        </div>
      </div>

      <div className="mt-6 pt-2">
         <div className="flex items-center justify-between mb-2">
            <span className="text-lcars-red uppercase text-xs w-16">Health</span>
            <div className="flex-1 bg-gray-900 h-3 rounded-full overflow-hidden border border-gray-700 mx-2">
               <div className="bg-lcars-red h-full transition-all duration-500" style={{ width: `${(character.currentHealth / character.maxHealth) * 100}%` }}></div>
            </div>
            <span className="text-white text-xs w-8 text-right">{character.currentHealth}/{character.maxHealth}</span>
         </div>
         <div className="flex items-center justify-between">
            <span className="text-lcars-yellow uppercase text-xs w-16">Stress</span>
            <div className="flex-1 bg-gray-900 h-3 rounded-full overflow-hidden border border-gray-700 mx-2">
               <div className="bg-lcars-yellow h-full transition-all duration-500" style={{ width: `${(character.currentStress / character.maxStress) * 100}%` }}></div>
            </div>
            <span className="text-white text-xs w-8 text-right">{character.currentStress}/{character.maxStress}</span>
         </div>
      </div>
    </div>
  );
};
