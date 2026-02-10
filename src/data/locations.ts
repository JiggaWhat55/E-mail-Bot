import type { Location } from '../types/game';

export const LOCATIONS: Record<string, Location> = {
  bridge: {
    id: 'bridge',
    name: 'Main Bridge',
    description: 'The nerve center of the USS Enterprise-D. Crew members work at various stations. The main viewscreen dominates the forward wall.',
    availableActions: ['scan', 'hail', 'status', 'warp'], // Added warp command
    exits: ['turbolift', 'observation'],
    items: ['padd'],
    npcs: ['picard', 'worf']
  },
  observation: {
    id: 'observation',
    name: 'Observation Lounge',
    description: 'A quiet meeting room behind the main bridge. A large table fills the center. Stars streak by the windows.',
    availableActions: ['talk', 'briefing'],
    exits: ['bridge'],
    items: [],
    npcs: ['macet']
  },
  turbolift: {
    id: 'turbolift',
    name: 'Turbolift',
    description: 'A standard turbolift car. Voice command activated.',
    availableActions: [],
    exits: ['bridge', 'engineering', 'sickbay', 'tenforward', 'transporter', 'quarters', 'cargo'],
    items: [],
    npcs: []
  },
  engineering: {
    id: 'engineering',
    name: 'Main Engineering',
    description: 'The throbbing heart of the ship. The warp core pulses with a steady blue light. Engineers rush about checking displays.',
    availableActions: ['diagnostics', 'power_management'],
    exits: ['turbolift'],
    items: ['engineering_kit'],
    npcs: ['laforge']
  },
  sickbay: {
    id: 'sickbay',
    name: 'Sickbay',
    description: 'The primary medical facility. Biobeds line the walls. The Chief Medical Officer is reviewing scans.',
    availableActions: ['heal', 'scan_self'],
    exits: ['turbolift'],
    items: ['hypospray'],
    npcs: ['crusher']
  },
  tenforward: {
    id: 'tenforward',
    name: 'Ten Forward',
    description: 'The ship\'s lounge and recreational facility. Large windows offer a stunning view of the stars.',
    availableActions: ['relax', 'talk'],
    exits: ['turbolift'],
    items: [],
    npcs: ['guinan']
  },
  transporter: {
    id: 'transporter',
    name: 'Transporter Room 1',
    description: 'One of the main transporter facilities. The pad is ready for energizing.',
    availableActions: ['transport'],
    exits: ['turbolift'],
    items: [],
    npcs: ['obrien']
  },
  quarters: {
    id: 'quarters',
    name: 'Crew Quarters',
    description: 'Your personal quarters. Standard Starfleet issue, but comfortable. A replicator is in the corner.',
    availableActions: ['rest', 'replicate'],
    exits: ['turbolift'],
    items: ['tricorder'], // Extra tricorder
    npcs: []
  },
  cargo: {
    id: 'cargo',
    name: 'Cargo Bay 4',
    description: 'A large storage area filled with crates and containers.',
    availableActions: ['inspect'],
    exits: ['turbolift'],
    items: [],
    npcs: []
  },
  neutral_zone: {
    id: 'neutral_zone',
    name: 'Neutral Zone (Space)',
    description: 'The vastness of space near the Romulan Neutral Zone. A derelict federation ship drifts silently nearby. Sensors indicate faint energy readings.',
    availableActions: ['scan', 'hail', 'status', 'warp'],
    exits: [], // Cannot exit via turbolift, must warp back
    items: [],
    npcs: []
  }
};
