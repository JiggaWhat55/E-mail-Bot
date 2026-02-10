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
  },
  'cardassian_summit': {
    id: 'cardassian_summit',
    title: 'Mission 3: The Parallax Accord',
    description: 'We are to mediate a territorial dispute with the Cardassian Union. Gul Macet is waiting in the Observation Lounge.',
    objectives: [
       { id: 'visit_observation', description: 'Proceed to the Observation Lounge from the Bridge.', completed: false },
       { id: 'negotiate_macet', description: 'Negotiate with Gul Macet. Ensure a peaceful resolution.', completed: false },
       { id: 'report_picard', description: 'Report the success to Captain Picard on the Bridge.', completed: false }
    ],
    rewards: {
        xp: 1000
    }
  },
  'resistance': {
    id: 'resistance',
    title: 'Mission 4: Resistance',
    description: 'A Borg Scout Ship has been detected in Sector 001. It is adapting to our frequencies. Upgrade the ship and intercept immediately.',
    objectives: [
       { id: 'upgrade_ship', description: 'Perform at least one system upgrade in Engineering.', completed: false },
       { id: 'intercept_borg', description: 'Warp to the Wolf 359 Sector (WARP WOLF 359) to intercept.', completed: false },
       { id: 'defeat_borg', description: 'Destroy the Borg Scout Ship.', completed: false }
    ],
    rewards: {
        xp: 2000
    }
  }
};
