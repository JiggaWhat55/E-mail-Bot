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
  }
};
