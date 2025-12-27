import { gameState } from "./gameState";
import { getNeighbors } from "./neighbors";

export function runSuccession() {
  const grid = gameState.grid;

  // Clone grid to avoid chain reactions in the same tick
  const nextGrid = grid.map(row => row.map(tile => ({ ...tile })));
  let hasChanges = false;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const tile = grid[y][x];
      const neighbors = getNeighbors(x, y);

      // Skip processing if tile is toxic (nothing grows)
      if (tile.biome === "toxic") continue;

      // --- RULE 1: Grass Spreading (Nature expands) ---
      if (tile.biome === "barren") {
        // FIX 1: Allow Wetland to act as a seed source too!
        const hasNatureNeighbor = neighbors.some(
          n => n.biome === "grass" || n.biome === "forest" || n.biome === "wetland"
        );
        
        // Growth condition: Needs a neighbor + Moisture
        if (hasNatureNeighbor && tile.moisture > 15 && Math.random() < 0.10) {
          nextGrid[y][x].biome = "grass";
          nextGrid[y][x].variation = Math.random(); 
          hasChanges = true;
        }

        // FIX 2: Wind-blown seeds (Rare chance to spawn grass from nothing)
        // This ensures that even if you scrub far from the river, life can start!
        else if (tile.moisture > 20 && Math.random() < 0.005) {
           nextGrid[y][x].biome = "grass";
           nextGrid[y][x].variation = Math.random();
           hasChanges = true;
        }
      }

      // --- RULE 2: Wetland Formation ---
      if (tile.biome === "grass") {
        const waterCount = neighbors.filter(n => n.biome === "water").length;
        
        if (waterCount >= 1 && tile.moisture > 60 && Math.random() < 0.05) {
          nextGrid[y][x].biome = "wetland";
          hasChanges = true;
        }
      }

      // --- RULE 3: Reforestation ---
      if (tile.biome === "grass") {
        const natureNeighbors = neighbors.filter(
          n => n.biome === "grass" || n.biome === "forest" || n.biome === "wetland"
        ).length;

        // Needs density (5+ neighbors) to turn into a forest
        if (natureNeighbors >= 5 && tile.moisture > 40 && Math.random() < 0.02) {
          nextGrid[y][x].biome = "forest";
          hasChanges = true;
        }
      }
    }
  }

  // Only trigger a state update if something actually changed
  if (hasChanges) {
    gameState.grid = nextGrid;
  }
}