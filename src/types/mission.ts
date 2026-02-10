export interface MissionObjective {
  id: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
  rewards: {
    xp: number;
    items?: string[];
  };
}
