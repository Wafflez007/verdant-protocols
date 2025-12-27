import { gameState } from "./gameState";
import { Animal } from "./types";
import { GRID_SIZE } from "./grid";

export function spawnAnimal(type: "herbivore" | "carnivore" | "pollinator", x: number, y: number) {
  const animal: Animal = {
    // FIX: Convert the number to a string to match the Type definition
    id: String(gameState.nextAnimalId++), 
    type,
    x,
    y,
    energy: 100, // Start full
  };
  gameState.animals.push(animal);
}

export function trySpawnAnimals() {
  // Cap the population to prevent lag (Max 50 animals)
  if (gameState.animals.length >= 50) return;

  const grid = gameState.grid;

  // Try to spawn in 5 random spots per tick
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const tile = grid[y][x];

    // 1. SPAWN BEES (Pollinators)
    if ((tile.biome === "grass" || tile.biome === "wetland") && Math.random() < 0.05) {
      spawnAnimal("pollinator", x, y);
    }

    // 2. SPAWN RABBITS (Herbivores)
    if (tile.biome === "forest" && Math.random() < 0.08) {
      spawnAnimal("herbivore", x, y);
    } 
    else if (tile.biome === "grass" && Math.random() < 0.01) {
      spawnAnimal("herbivore", x, y);
    }

    // 3. SPAWN WOLVES (Carnivores)
    if (tile.biome === "forest" && Math.random() < 0.05) {
      const herbivoreCount = gameState.animals.filter(a => a.type === "herbivore").length;
      
      if (herbivoreCount > 3) {
        spawnAnimal("carnivore", x, y);
      }
    }
  }
}

