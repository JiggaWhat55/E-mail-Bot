import type { Mission } from '../types/mission';

export const MISSIONS: Record<string, Mission> = {
  'tutorial': {
    id: 'tutorial',
    title: 'Mission 1: Systems Check',
    description: 'The Enterprise has just left drydock. Perform a systems check of key areas before we proceed to Sector 001.',
    objectives: [
      { id: 'visit_engineering', description: 'Visit Main Engineering', completed: false },
      { id: 'scan_warp_core', description: 'Perform a diagnostic scan of the Warp Core (type SCAN in Engineering)', completed: false },
      { id: 'visit_sickbay', description: 'Report to Sickbay for a physical', completed: false },
      { id: 'return_bridge', description: 'Return to the Bridge to report readiness', completed: false }
    ],
    rewards: {
      xp: 100
    }
  },
  'neutral_zone': {
    id: 'neutral_zone',
    title: 'Mission 2: The Neutral Zone',
    description: 'Starfleet Command has detected unusual energy readings near the Romulan Neutral Zone. We are ordered to investigate.',
    objectives: [
      { id: 'talk_worf', description: 'Consult with Lt. Worf on the Bridge about the threat level.', completed: false },
      { id: 'warp_nz', description: 'Set course for the Neutral Zone (Type WARP NEUTRAL ZONE on Bridge).', completed: false },
      { id: 'scan_derelict', description: 'Scan the drifting freighter found at coordinates.', completed: false },
      { id: 'defeat_romulan', description: 'Defeat the Romulan Warbird ambushing us.', completed: false }
    ],
    rewards: {
      xp: 500,
      items: ['phaser_rifle'] // Hypothetical reward
    }
  }
};
