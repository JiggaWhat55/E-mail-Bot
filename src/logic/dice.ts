export type TaskDifficulty = 'routine' | 'challenging' | 'difficult' | 'extreme';

export interface TaskResult {
  success: boolean;
  crit: boolean; // Critical Success
  complication: boolean; // Critical Failure
  roll: number;
  target: number;
  message: string;
}

export const DIFFICULTY_MODIFIERS: Record<TaskDifficulty, number> = {
  routine: 0,
  challenging: -2,
  difficult: -4,
  extreme: -6,
};

export const rollTask = (
  attributeValue: number,
  skillValue: number,
  difficulty: TaskDifficulty = 'routine',
  bonus: number = 0
): TaskResult => {
  const roll = Math.floor(Math.random() * 20) + 1;
  const modifier = DIFFICULTY_MODIFIERS[difficulty];
  const target = attributeValue + skillValue + modifier + bonus;

  // Natural 1 is always a Critical Success
  if (roll === 1) {
    return {
      success: true,
      crit: true,
      complication: false,
      roll,
      target,
      message: `CRITICAL SUCCESS! Rolled a natural 1.`
    };
  }

  // Natural 20 is always a Complication (Critical Failure)
  if (roll === 20) {
    return {
      success: false,
      crit: false,
      complication: true,
      roll,
      target,
      message: `CATASTROPHIC FAILURE! Rolled a natural 20.`
    };
  }

  const success = roll <= target;

  return {
    success,
    crit: roll <= skillValue && success, // If roll is under skill value, it's a crit (common mechanic)
    complication: false,
    roll,
    target,
    message: success
      ? `SUCCESS: Rolled ${roll} against target ${target}.`
      : `FAILURE: Rolled ${roll} against target ${target}.`
  };
};
