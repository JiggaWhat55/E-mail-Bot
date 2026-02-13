import type { Enemy } from '../types/game';

export const RANDOM_ENEMIES: Enemy[] = [
  {
    name: 'Ferengi Marauder',
    shields: 80,
    maxShields: 80,
    hull: 60,
    maxHull: 60,
    damage: 10,
    description: "A D'Kora class marauder. They are likely looking for profit or plunder."
  },
  {
    name: 'Klingon Bird of Prey',
    shields: 90,
    maxShields: 90,
    hull: 80,
    maxHull: 80,
    damage: 20,
    description: "A B'rel class scout. It decloaks with weapons charged!"
  },
  {
    name: 'Cardassian Galor Class',
    shields: 120,
    maxShields: 120,
    hull: 150,
    maxHull: 150,
    damage: 18,
    description: "A heavy cruiser of the Cardassian Union. Its spiral-wave disruptors are locking on."
  },
  {
    name: 'Orion Pirate Ship',
    shields: 60,
    maxShields: 60,
    hull: 50,
    maxHull: 50,
    damage: 12,
    description: "A fast, lightly armored raider. They are targeting your cargo bays."
  },
  {
    name: 'Romulan Scout',
    shields: 70,
    maxShields: 70,
    hull: 70,
    maxHull: 70,
    damage: 22,
    description: "A small scout vessel. Likely gathering intelligence."
  }
];
