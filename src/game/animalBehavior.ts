import { gameState } from "./gameState";
import { GRID_SIZE } from "./grid";
import { Animal } from "./types";

// Helper: Check if a coordinate is safe (inside grid AND not toxic)
function isValidMove(x: number, y: number): boolean {
  const gridSize = gameState.grid.length; // Dynamic grid size
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return false;
  const tile = gameState.grid[y][x];
  return tile.biome !== "toxic"; // Animals refuse to enter toxic tiles
}

// Helper: Find a specific biome nearby (simple "smell" mechanic)
function scanForBiome(animal: Animal, targetBiomes: string[]): { x: number, y: number } | null {
  // Look in a 3x3 area around the animal
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue; // Skip self

      const nx = animal.x + dx;
      const ny = animal.y + dy;

      if (isValidMove(nx, ny)) {
        const tile = gameState.grid[ny][nx];
        if (targetBiomes.includes(tile.biome)) {
          return { x: dx, y: dy }; // Return direction to food
        }
      }
    }
  }
  return null;
}

export function updateAnimals() {
  // 1. Filter out dead animals (Energy <= 0)
  // We filter first to clean up the array
  gameState.animals = gameState.animals.filter(a => a.energy > 0);

  for (const animal of gameState.animals) {
    const currentTile = gameState.grid[animal.y][animal.x];

    // --- STEP 1: METABOLISM ---
    // Animals burn energy every tick.
    // If they are on a Forest/Grass, they eat and regain energy.
    if (currentTile.biome === "forest" || currentTile.biome === "grass") {
      animal.energy = Math.min(100, animal.energy + 5); // Eat
    } else {
      animal.energy -= 2; // Starve slowly
    }

    // --- STEP 2: MOVEMENT AI ---
    let moveX = 0;
    let moveY = 0;

    // AI Rule: If hungry (energy < 60), look for food (Forest/Wetland/Grass)
    if (animal.energy < 60) {
      const foodDir = scanForBiome(animal, ["forest", "wetland", "grass"]);
      if (foodDir) {
        moveX = foodDir.x;
        moveY = foodDir.y;
      }
    }

    // AI Rule: If no food found or not hungry, wander randomly (but safely)
    if (moveX === 0 && moveY === 0) {
      // Try random moves until we find a safe one (up to 3 tries)
      for (let i = 0; i < 3; i++) {
        const rx = Math.floor(Math.random() * 3) - 1;
        const ry = Math.floor(Math.random() * 3) - 1;
        if (isValidMove(animal.x + rx, animal.y + ry)) {
          moveX = rx;
          moveY = ry;
          break;
        }
      }
    }

    // Apply Movement
    animal.x += moveX;
    animal.y += moveY;

    // Clamp just in case
    animal.x = Math.max(0, Math.min(GRID_SIZE - 1, animal.x));
    animal.y = Math.max(0, Math.min(GRID_SIZE - 1, animal.y));

    // --- STEP 3: ECOLOGICAL EFFECT (Pollination) ---
    // Only spread seeds if the animal is healthy (Energy > 50)
    // and moving over barren land.
    if (animal.type === "pollinator" && animal.energy > 50) {
      const newTile = gameState.grid[animal.y][animal.x];
      
      if (newTile.biome === "barren" && Math.random() < 0.15) {
        // "Poop" seeds: Turn barren land into grass
        newTile.biome = "grass";
        newTile.variation = Math.random(); // Give it a new texture look
        
        // Cost energy to plant seeds
        animal.energy -= 5;
      }
    }
  }
}