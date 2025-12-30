import { gameState } from "./gameState";
import { hasTech } from "./research";

export function scrubTile(centerX: number, centerY: number) {

  // NEW: Check Energy
  if (gameState.sprayEnergy <= 0) return;

  // FIX: Increased drain from 0.1 to 0.5
  // Since this runs at 60FPS, 0.5 = 30 energy/sec. 
  // This balances against the +10 energy/sec recharge in simulation.ts.
  gameState.sprayEnergy = Math.max(0, gameState.sprayEnergy - 0.1);
  
  // --- NEW: DYNAMIC STATS BASED ON TECH ---
  let radius = 3;
  if (hasTech("radius_1")) radius += 1;
  if (hasTech("radius_2")) radius += 2;

  let power = 4;
  if (hasTech("efficiency_1")) power *= 1.5;
  // ----------------------------------------

  const gridSize = gameState.grid.length; // Dynamic grid size

  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;

      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > radius) continue;

      const tile = gameState.grid[y][x];

      if (tile.biome === "toxic") {
        const falloff = 1 - (distance / (radius + 1));
        const cleanAmount = Math.max(0.5, power * falloff);

        tile.toxicity = Math.max(0, tile.toxicity - cleanAmount);

        // --- CHECK: IS IT FULLY CLEAN? ---
        if (tile.toxicity <= 0) {
          // 1. First, make it barren
          tile.biome = "barren";
          tile.toxicity = 0;
          tile.moisture = 60; 

          // 2. FIX: Check for seeds ONLY when tile becomes barren
          // This prevents grass from growing on top of toxic waste
          if (hasTech("seeding_1")) {
            // 20% Chance to turn barren immediately into grass
            if (Math.random() < 0.20) {
              tile.biome = "grass";
              tile.variation = Math.random();
            }
          }
        } 
      }
    }
  }
}