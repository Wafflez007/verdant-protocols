// game/metrics.ts
import { gameState } from "./gameState";
import { GRID_SIZE } from "./grid";

export type Metrics = {
  // Raw Biome Counts (Needed for score.ts)
  toxic: number;
  barren: number;
  grass: number;
  wetland: number;
  forest: number;
  
  // Derived Stats (Useful for UI & Game State)
  totalTiles: number;
  pollutionPercent: number; // 0-100%
  biodiversityScore: number; // Combined score
};

export function calculateMetrics(): Metrics {
  // Initialize counts
  let toxic = 0;
  let barren = 0;
  let grass = 0;
  let wetland = 0;
  let forest = 0;

  const grid = gameState.grid;
  const totalTiles = GRID_SIZE * GRID_SIZE;

  // Single pass loop for performance
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const biome = grid[y][x].biome;
      
      switch (biome) {
        case "toxic": toxic++; break;
        case "barren": barren++; break;
        case "grass": grass++; break;
        case "wetland": wetland++; break;
        case "forest": forest++; break;
        // Water is ignored in counts
      }
    }
  }

  // Calculate percentages
  const pollutionPercent = Math.floor((toxic / totalTiles) * 100);

  // Calculate Score
  // 10 pts per animal + Biome value
  const animalScore = gameState.animals.length * 10;
  const biodiversityScore = (grass * 1) + (wetland * 2) + (forest * 3) + animalScore;

  return {
    toxic,
    barren,
    grass,
    wetland,
    forest,
    totalTiles,
    pollutionPercent,
    biodiversityScore
  };
}