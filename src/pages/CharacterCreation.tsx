import { type FC, useState } from 'react';
import { useGame } from '../context/GameContext';
import { LCARSLayout } from '../components/LCARSLayout';
import { LCARSButton } from '../components/LCARSButton';
import type { Character, Species, Role, Attribute, Skill } from '../types/game';

const SPECIES_OPTIONS: Species[] = [
  { name: 'Human', bonusAttributes: ['Presence', 'Willpower', 'Adaptability'], trait: 'Versatile: +1 to any attribute of choice (handled by base stats)' },
  { name: 'Vulcan', bonusAttributes: ['Intellect', 'Strength'], trait: 'Logical Mind: Resistance to emotional manipulation.' },
  { name: 'Klingon', bonusAttributes: ['Strength', 'Willpower'], trait: 'Warrior Spirit: Bonus to melee combat.' },
  { name: 'Betazoid', bonusAttributes: ['Presence', 'Perception'], trait: 'Empath: Can sense emotions.' },
];

const ROLE_OPTIONS: Role[] = [
  { name: 'Command', bonusSkills: ['Command', 'Diplomacy'], startingGear: ['Phaser Type 2', 'PADD'] },
  { name: 'Operations', bonusSkills: ['Engineering', 'Science'], startingGear: ['Tricorder', 'Engineering Kit'] },
  { name: 'Security', bonusSkills: ['Phaser', 'Unarmed Combat'], startingGear: ['Phaser Rifle', 'Armor'] },
  { name: 'Medical', bonusSkills: ['Medicine', 'First Aid'], startingGear: ['Medical Tricorder', 'Hypospray'] },
  { name: 'Science', bonusSkills: ['Science', 'Computer Use'], startingGear: ['Tricorder', 'Sample Kit'] },
];

const INITIAL_ATTRIBUTES: Record<string, Attribute> = {
  Strength: { name: 'Strength', value: 7 },
  Agility: { name: 'Agility', value: 7 },
  Intellect: { name: 'Intellect', value: 7 },
  Willpower: { name: 'Willpower', value: 7 },
  Perception: { name: 'Perception', value: 7 },
  Presence: { name: 'Presence', value: 7 },
};

const INITIAL_SKILLS: Record<string, Skill> = {
  Command: { name: 'Command', value: 1 },
  Diplomacy: { name: 'Diplomacy', value: 1 },
  Engineering: { name: 'Engineering', value: 1 },
  Science: { name: 'Science', value: 1 },
  Medicine: { name: 'Medicine', value: 1 },
  Phaser: { name: 'Phaser', value: 1 },
  'Unarmed Combat': { name: 'Unarmed Combat', value: 1 },
  'Computer Use': { name: 'Computer Use', value: 1 },
};

export const CharacterCreation: FC = () => {
  const { createCharacter } = useGame();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [attributes, setAttributes] = useState(INITIAL_ATTRIBUTES);
  const [attributePoints, setAttributePoints] = useState(5);

  const handleAttributeChange = (attrName: string, delta: number) => {
    if (delta > 0 && attributePoints <= 0) return;
    if (delta < 0 && attributes[attrName].value <= 7) return;

    setAttributes(prev => ({
      ...prev,
      [attrName]: { ...prev[attrName], value: prev[attrName].value + delta }
    }));
    setAttributePoints(prev => prev - delta);
  };

  const handleFinish = () => {
    if (!selectedSpecies || !selectedRole || !name) return;

    // Apply species bonuses
    const finalAttributes = { ...attributes };
    selectedSpecies.bonusAttributes.forEach(attrName => {
      if (finalAttributes[attrName]) {
        finalAttributes[attrName] = {
          ...finalAttributes[attrName],
          value: finalAttributes[attrName].value + 1
        };
      }
    });

    // Apply role bonuses
    const finalSkills = { ...INITIAL_SKILLS };
    selectedRole.bonusSkills.forEach(skillName => {
      if (finalSkills[skillName]) {
        finalSkills[skillName] = {
            ...finalSkills[skillName],
            value: finalSkills[skillName].value + 1
        };
      }
    });

    const newCharacter: Character = {
      name,
      species: selectedSpecies,
      role: selectedRole,
      attributes: finalAttributes,
      skills: finalSkills,
      maxHealth: finalAttributes.Strength.value + finalAttributes.Willpower.value,
      currentHealth: finalAttributes.Strength.value + finalAttributes.Willpower.value,
      maxStress: finalAttributes.Willpower.value + finalAttributes.Presence.value,
      currentStress: finalAttributes.Willpower.value + finalAttributes.Presence.value,
      rank: 'Ensign', // Start as Ensign
      department: selectedRole.name,
      xp: 0
    };

    createCharacter(newCharacter);
  };

  return (
    <LCARSLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl mb-4 text-lcars-orange border-b border-lcars-orange pb-2">
          PERSONNEL FILE INITIALIZATION: STEP {step} / 4
        </h2>

        {step === 1 && (
          <div>
            <h3 className="text-xl mb-4 text-lcars-blue">SELECT SPECIES</h3>
            <div className="grid grid-cols-2 gap-4">
              {SPECIES_OPTIONS.map(species => (
                <LCARSButton
                  key={species.name}
                  label={species.name}
                  color={selectedSpecies?.name === species.name ? 'orange' : 'blue'}
                  onClick={() => setSelectedSpecies(species)}
                />
              ))}
            </div>
            {selectedSpecies && (
               <div className="mt-4 p-4 border border-lcars-light-purple rounded bg-lcars-light-purple/10">
                  <h4 className="text-lcars-light-purple font-bold">{selectedSpecies.name} Traits</h4>
                  <p>{selectedSpecies.trait}</p>
                  <p>Bonus: {selectedSpecies.bonusAttributes.join(', ')}</p>
               </div>
            )}
            <div className="mt-8 flex justify-end">
               <LCARSButton label="PROCEED" onClick={() => setStep(2)} disabled={!selectedSpecies} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl mb-4 text-lcars-blue">SELECT ASSIGNMENT (ROLE)</h3>
            <div className="grid grid-cols-2 gap-4">
              {ROLE_OPTIONS.map(role => (
                <LCARSButton
                  key={role.name}
                  label={role.name}
                  color={selectedRole?.name === role.name ? 'orange' : 'blue'}
                  onClick={() => setSelectedRole(role)}
                />
              ))}
            </div>
            {selectedRole && (
               <div className="mt-4 p-4 border border-lcars-light-purple rounded bg-lcars-light-purple/10">
                  <h4 className="text-lcars-light-purple font-bold">{selectedRole.name} Proficiency</h4>
                  <p>Bonus Skills: {selectedRole.bonusSkills.join(', ')}</p>
                  <p>Equipment: {selectedRole.startingGear.join(', ')}</p>
               </div>
            )}
            <div className="mt-8 flex justify-between">
               <LCARSButton label="BACK" color="red" onClick={() => setStep(1)} className="w-auto px-8" />
               <LCARSButton label="PROCEED" onClick={() => setStep(3)} disabled={!selectedRole} className="w-auto px-8" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-xl mb-4 text-lcars-blue">ATTRIBUTE CALIBRATION</h3>
            <div className="mb-4 text-center text-lcars-yellow font-bold text-2xl">
               POINTS AVAILABLE: {attributePoints}
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {Object.values(attributes).map(attr => (
                <div key={attr.name} className="flex items-center justify-between border-b border-gray-800 pb-2">
                   <span className="w-32 uppercase text-lcars-light-blue">{attr.name}</span>
                   <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleAttributeChange(attr.name, -1)}
                        className="w-8 h-8 rounded-full bg-lcars-red text-black font-bold flex items-center justify-center hover:bg-white"
                        disabled={attr.value <= 7}
                      >-</button>
                      <span className="text-2xl w-8 text-center">{attr.value}</span>
                      <button
                        onClick={() => handleAttributeChange(attr.name, 1)}
                        className="w-8 h-8 rounded-full bg-lcars-blue text-black font-bold flex items-center justify-center hover:bg-white"
                        disabled={attributePoints <= 0}
                      >+</button>
                   </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
               <LCARSButton label="BACK" color="red" onClick={() => setStep(2)} className="w-auto px-8" />
               <LCARSButton label="PROCEED" onClick={() => setStep(4)} disabled={attributePoints > 0} className="w-auto px-8" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-xl mb-4 text-lcars-blue">IDENTITY CONFIRMATION</h3>
            <div className="mb-6">
               <label className="block text-lcars-orange mb-2">ENTER NAME</label>
               <input
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-black border-2 border-lcars-light-purple text-white p-4 text-2xl font-mono uppercase focus:outline-none focus:border-lcars-orange"
                 placeholder="EX: JEAN-LUC PICARD"
               />
            </div>
            <div className="border border-lcars-blue p-4 mb-6 text-sm font-mono">
               <p><span className="text-gray-500">SPECIES:</span> {selectedSpecies?.name}</p>
               <p><span className="text-gray-500">ASSIGNMENT:</span> {selectedRole?.name}</p>
               <p><span className="text-gray-500">RANK:</span> ENSIGN</p>
            </div>
            <div className="mt-8 flex justify-between">
               <LCARSButton label="BACK" color="red" onClick={() => setStep(3)} className="w-auto px-8" />
               <LCARSButton label="ENGAGE" color="orange" onClick={handleFinish} disabled={!name} className="w-auto px-8" />
            </div>
          </div>
        )}
      </div>
    </LCARSLayout>
  );
};
