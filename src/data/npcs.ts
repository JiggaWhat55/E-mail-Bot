import type { NPC } from '../types/dialogue';

export const NPCS: Record<string, NPC> = {
  'picard': {
    id: 'picard',
    name: 'Captain Jean-Luc Picard',
    description: 'The Captain of the Enterprise. He looks authoritative and calm.',
    startingNodeId: 'root',
    dialogue: {
      'root': {
        id: 'root',
        text: 'Ensign, report. What is your status?',
        options: [
          { id: '1', text: 'All systems normal, Captain.', nextNodeId: 'status_ok' },
          { id: '2', text: 'We are ready to depart, sir.', nextNodeId: 'depart' },
          { id: '3', text: 'I have some questions about the mission.', nextNodeId: 'mission_brief' }
        ]
      },
      'status_ok': {
        id: 'status_ok',
        text: 'Excellent. Carry on.',
        options: []
      },
      'depart': {
        id: 'depart',
        text: 'Make it so.',
        options: []
      },
      'mission_brief': {
        id: 'mission_brief',
        text: 'We are to patrol the Neutral Zone. There have been reports of Romulan activity.',
        options: [
          { id: '1', text: 'Understood, Captain.', nextNodeId: 'root' }
        ]
      }
    }
  },
  'worf': {
    id: 'worf',
    name: 'Lt. Worf',
    description: 'The Klingon Security Chief. He looks ready for battle.',
    startingNodeId: 'root',
    dialogue: {
      'root': {
        id: 'root',
        text: 'I am detecting no immediate threats. But we must remain vigilant.',
        options: [
          { id: '1', text: 'Agreed, Lieutenant.', nextNodeId: 'vigilant' },
          { id: '2', text: 'Any tactical recommendations?', nextNodeId: 'tactical' }
        ]
      },
      'vigilant': {
        id: 'vigilant',
        text: 'The Romulans are without honor. They will strike from the shadows.',
        options: []
      },
      'tactical': {
        id: 'tactical',
        text: 'Keep shields at standby. I recommend weapon power at 50% minimally while in the Neutral Zone.',
        options: []
      }
    }
  },
  'laforge': {
    id: 'laforge',
    name: 'Lt. Cmdr. Geordi La Forge',
    description: 'Chief Engineer. He is wearing his VISOR.',
    startingNodeId: 'root',
    dialogue: {
      'root': {
        id: 'root',
        text: 'Warp core is stable. Efficiency at 98%.',
        options: [
          { id: '1', text: 'Good work, Geordi.', nextNodeId: 'thanks' },
          { id: '2', text: 'Can we get more power to shields?', nextNodeId: 'shields' }
        ]
      },
      'thanks': {
        id: 'thanks',
        text: 'Just doing my job, Ensign.',
        options: []
      },
      'shields': {
        id: 'shields',
        text: 'I can reroute from life support... kidding! I\'ll see what I can do with the EPS manifolds.',
        options: []
      }
    }
  },
  'guinan': {
    id: 'guinan',
    name: 'Guinan',
    description: 'The mysterious bartender of Ten Forward.',
    startingNodeId: 'root',
    dialogue: {
      'root': {
        id: 'root',
        text: 'You look like you have the weight of the galaxy on your shoulders. Prune juice?',
        options: [
          { id: '1', text: 'Sure, why not.', nextNodeId: 'prune' },
          { id: '2', text: 'Just water, please.', nextNodeId: 'water' },
          { id: '3', text: 'Do you sense anything unusual?', nextNodeId: 'sense' }
        ]
      },
      'prune': {
        id: 'prune',
        text: 'A warrior\'s drink.',
        options: []
      },
      'water': {
        id: 'water',
        text: 'Hydration is important.',
        options: []
      },
      'sense': {
        id: 'sense',
        text: 'The timeline is... shifting. Be careful out there.',
        options: []
      }
    }
  },
  'macet': {
    id: 'macet',
    name: 'Gul Macet',
    description: 'A stern Cardassian Gul with a scar running down his neck.',
    startingNodeId: 'root',
    dialogue: {
      'root': {
        id: 'root',
        text: 'So, the Federation sends an Ensign to negotiate. Typical arrogance.',
        options: [
          {
            id: '1',
            text: 'I assure you, I speak with the full authority of Captain Picard.',
            nextNodeId: 'insulted', // Fallback/Fail
            skillCheck: { attribute: 'Presence', skill: 'Diplomacy', difficulty: 'challenging' },
            successNodeId: 'impressed',
            failNodeId: 'insulted'
          },
          { id: '2', text: 'We are here to talk peace, Gul Macet.', nextNodeId: 'peace' }
        ]
      },
      'impressed': {
        id: 'impressed',
        text: 'Hmph. Perhaps you have some backbone after all. Very well. What are your terms?',
        options: [
            { id: '1', text: 'We propose a demilitarized zone in the Parallax sector.', nextNodeId: 'dmz' }
        ]
      },
      'insulted': {
        id: 'insulted',
        text: 'Don\'t waste my time with empty platitudes. Bring me your Captain.',
        options: [] // End dialogue
      },
      'peace': {
         id: 'peace',
         text: 'Peace is for the weak. We want the mineral rights to the sector.',
         options: [
             { id: '1', text: 'Those rights belong to the Bajorans.', nextNodeId: 'insulted' },
             {
                id: '2',
                text: 'Perhaps we can share the surveys?',
                nextNodeId: 'insulted',
                skillCheck: { attribute: 'Intellect', skill: 'Diplomacy', difficulty: 'difficult' },
                successNodeId: 'impressed',
                failNodeId: 'insulted'
             }
         ]
      },
      'dmz': {
         id: 'dmz',
         text: 'Acceptable. Assuming you remove your listening posts.',
         options: [
             { id: '1', text: 'Agreed.', nextNodeId: 'agreed' }
         ]
      },
      'agreed': {
          id: 'agreed',
          text: 'Then we have an accord.',
          options: []
      }
    }
  }
};
