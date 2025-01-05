export function calculateAdherence(actual: number, goal: number): number {
    if (goal === 0) return actual === 0 ? 100 : 0;
    return (actual / goal) * 100;
  }
  