// game/events.ts
import { gameState } from "./gameState";
import { GRID_SIZE } from "./grid";

export function triggerRandomEvent() {
  const roll = Math.random();

  // 1. TOXIC SPILL (5% chance of occurring when called)
  // Spawns a blob of toxic waste somewhere random
  if (roll < 0.3) { // 30% chance if event triggers
    const cx = Math.floor(Math.random() * GRID_SIZE);
    const cy = Math.floor(Math.random() * GRID_SIZE);
    console.log("⚠️ ALERT: Toxic Spill Detected!");

    // Create a mini spill (Radius 4)
    for (let y = cy - 4; y <= cy + 4; y++) {
      for (let x = cx - 4; x <= cx + 4; x++) {
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
          if (Math.random() < 0.7) { // Patchy spill
            gameState.grid[y][x].biome = "toxic";
            gameState.grid[y][x].toxicity = 100;
          }
        }
      }
    }
    return "⚠️ TOXIC LEAK DETECTED";
  }

  // 2. DROUGHT (70% chance)
  // Dries out the land, killing grass
  else {
    console.log("☀️ ALERT: Solar Flare causing drought!");
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const tile = gameState.grid[y][x];
        // Reduce moisture globally
        tile.moisture = Math.max(0, tile.moisture - 30);
        
        // Kill grass if it gets too dry
        if (tile.biome === "grass" && tile.moisture < 10) {
          tile.biome = "barren";
        }
      }
    }
    return "☀️ HEATWAVE: MOISTURE CRITICAL";
  }
}