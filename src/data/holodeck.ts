import type { Location, Enemy } from '../types/game';

export interface HolodeckProgram {
  id: string;
  name: string;
  description: string;
  startingLocation: Location;
  enemy?: Enemy;
}

export const HOLODECK_PROGRAMS: Record<string, HolodeckProgram> = {
  sherlock: {
    id: 'sherlock',
    name: 'Sherlock Holmes: The Speckled Band',
    description: "221B Baker Street. Fog swirls outside the window. Dr. Watson is reading by the fire.",
    startingLocation: {
        id: 'holodeck_baker_street',
        name: '221B Baker Street (Simulation)',
        description: "The sitting room is filled with scientific equipment and the smell of tobacco. A client is knocking at the door.",
        availableActions: ['investigate', 'exit_program'],
        exits: [],
        items: ['magnifying_glass', 'pipe'],
        npcs: ['holmes', 'watson']
    }
  },
  dixon: {
    id: 'dixon',
    name: 'Dixon Hill: The Big Goodbye',
    description: "1940s San Francisco. It's raining. A jazz trumpet plays in the distance.",
    startingLocation: {
        id: 'holodeck_dixon_office',
        name: 'Dixon Hill\'s Office (Simulation)',
        description: "A cluttered office with a frosted glass door. A bottle of bourbon sits on the desk.",
        availableActions: ['drink', 'exit_program'],
        exits: [],
        items: ['revolver', 'newspaper'],
        npcs: ['cyrus_redblock']
    },
    enemy: {
        name: 'Cyrus Redblock\'s Goon',
        shields: 0,
        maxShields: 0,
        hull: 20, // Health
        maxHull: 20,
        damage: 5,
        description: "A tough guy in a pinstripe suit holding a tommy gun."
    }
  },
  worf_calisthenics: {
      id: 'calisthenics',
      name: 'Klingon Calisthenics: Level 1',
      description: "A rocky alien landscape with burning fires. Warriors train here.",
      startingLocation: {
          id: 'holodeck_klingon_gym',
          name: 'Klingon Training Ground (Simulation)',
          description: "The heat is intense. Several holographic Klingons are sparring with Bat'leths.",
          availableActions: ['train', 'fight', 'exit_program'],
          exits: [],
          items: ['batleth'],
          npcs: []
      },
      enemy: {
          name: 'Holographic Warrior',
          shields: 20,
          maxShields: 20,
          hull: 50,
          maxHull: 50,
          damage: 8,
          description: "A formidable Klingon warrior simulation."
      }
  }
};
