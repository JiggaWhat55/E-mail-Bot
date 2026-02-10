export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'tool' | 'consumable';
  effect?: (context: any) => void;
}

export const ITEMS: Record<string, Item> = {
  'phaser_t2': {
    id: 'phaser_t2',
    name: 'Phaser Type 2',
    description: 'Standard issue Starfleet sidearm. Settings: Stun to Vaporize.',
    type: 'weapon'
  },
  'tricorder': {
    id: 'tricorder',
    name: 'Tricorder',
    description: 'Multipurpose handheld sensor and computer.',
    type: 'tool'
  },
  'hypospray': {
    id: 'hypospray',
    name: 'Hypospray',
    description: 'Medical device for injecting medication. Restores 10 Health.',
    type: 'consumable'
  },
  'engineering_kit': {
    id: 'engineering_kit',
    name: 'Engineering Kit',
    description: 'Tools for repairing ship systems.',
    type: 'tool'
  },
  'padd': {
    id: 'padd',
    name: 'PADD',
    description: 'Personal Access Display Device. Contains mission briefings.',
    type: 'tool'
  }
};
