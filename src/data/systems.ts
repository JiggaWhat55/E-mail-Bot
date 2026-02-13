import type { Location } from '../types/game';

export const STAR_SYSTEMS: Record<string, Location> = {
  vulcan: {
    id: 'vulcan',
    name: 'Vulcan System',
    description: "The home system of the Vulcans. The planet's red desert surface is visible on the viewscreen. Sensors indicate high logic levels and numerous scientific vessels.",
    availableActions: ['scan', 'warp'],
    exits: [],
    items: [],
    npcs: []
  },
  kronos: {
    id: 'kronos',
    name: 'Qo\'noS System',
    description: "The capital of the Klingon Empire. The green-tinged planet is heavily fortified. Caution is advised.",
    availableActions: ['scan', 'warp'],
    exits: [],
    items: [],
    npcs: []
  },
  romulus: {
    id: 'romulus',
    name: 'Romulus System',
    description: "Home of the Romulan Star Empire. Sensors detect a tachyon grid. You are in hostile territory.",
    availableActions: ['scan', 'warp'],
    exits: [],
    items: [],
    npcs: []
  },
  betazed: {
    id: 'betazed',
    name: 'Betazed System',
    description: "A lush, peaceful world known for its telepathic inhabitants. The planetary rings are beautiful.",
    availableActions: ['scan', 'warp'],
    exits: [],
    items: [],
    npcs: []
  },
  deep_space_9: {
    id: 'deep_space_9',
    name: 'Deep Space 9',
    description: "A Cardassian-built station near the Bajoran wormhole. A hub of commerce and diplomacy.",
    availableActions: ['scan', 'warp'],
    exits: [],
    items: [],
    npcs: []
  },
  risi: {
    id: 'risa',
    name: 'Risa System',
    description: "The pleasure planet of the Federation. Weather control systems maintain a perfect tropical climate.",
    availableActions: ['scan', 'warp'],
    exits: [],
    items: [],
    npcs: []
  }
};
