export interface DialogueOption {
  id: string;
  text: string;
  nextNodeId: string;
  condition?: (state: any) => boolean;
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
