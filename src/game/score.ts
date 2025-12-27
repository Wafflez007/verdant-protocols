// game/score.ts
import { calculateMetrics } from "./metrics";

export function calculateBiodiversityScore(): number {
  const m = calculateMetrics();
  
  // We can now just return the pre-calculated score from metrics
  // This ensures logic is consistent across the app
  return m.biodiversityScore;
}