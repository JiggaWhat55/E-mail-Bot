import type { TaskDifficulty } from '../logic/dice';

export interface SkillCheck {
  attribute: string;
  skill: string;
  difficulty: TaskDifficulty;
}

export interface DialogueOption {
  id: string;
  text: string;
  nextNodeId: string;
  condition?: (state: any) => boolean;
  skillCheck?: SkillCheck;
  successNodeId?: string;
  failNodeId?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  options: DialogueOption[];
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogue: Record<string, DialogueNode>; // nodeId -> Node
  startingNodeId: string;
}
