import type { Location } from '../types/game';

export const LOCATIONS: Record<string, Location> = {
  bridge: {
    id: 'bridge',
    name: 'Main Bridge',
    description: 'The nerve center of the USS Enterprise-D. Crew members work at various stations. The main viewscreen dominates the forward wall.',
    availableActions: ['scan', 'hail', 'status'],
    exits: ['turbolift']
  },
  turbolift: {
    id: 'turbolift',
    name: 'Turbolift',
    description: 'A standard turbolift car. Voice command activated.',
    availableActions: [],
    exits: ['bridge', 'engineering', 'sickbay', 'tenforward', 'transporter', 'quarters', 'cargo']
  },
  engineering: {
    id: 'engineering',
    name: 'Main Engineering',
    description: 'The throbbing heart of the ship. The warp core pulses with a steady blue light. Engineers rush about checking displays.',
    availableActions: ['diagnostics', 'power_management'],
    exits: ['turbolift']
  },
  sickbay: {
    id: 'sickbay',
    name: 'Sickbay',
    description: 'The primary medical facility. Biobeds line the walls. The Chief Medical Officer is reviewing scans.',
    availableActions: ['heal', 'scan_self'],
    exits: ['turbolift']
  },
  tenforward: {
    id: 'tenforward',
    name: 'Ten Forward',
    description: 'The ship\'s lounge and recreational facility. Large windows offer a stunning view of the stars.',
    availableActions: ['relax', 'talk'],
    exits: ['turbolift']
  },
  transporter: {
    id: 'transporter',
    name: 'Transporter Room 1',
    description: 'One of the main transporter facilities. The pad is ready for energizing.',
    availableActions: ['transport'],
    exits: ['turbolift']
  },
  quarters: {
    id: 'quarters',
    name: 'Crew Quarters',
    description: 'Your personal quarters. Standard Starfleet issue, but comfortable. A replicator is in the corner.',
    availableActions: ['rest', 'replicate'],
    exits: ['turbolift']
  },
  cargo: {
    id: 'cargo',
    name: 'Cargo Bay 4',
    description: 'A large storage area filled with crates and containers.',
    availableActions: ['inspect'],
    exits: ['turbolift']
  }
};
