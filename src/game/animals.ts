// game/animals.ts
import { Animal, AnimalType } from "./types";
import { gameState } from "./gameState";

// Factory function to create animals easily
export function createAnimal(x: number, y: number, type: AnimalType): Animal {
  return {
    id: (gameState.nextAnimalId++).toString(),
    x,
    y,
    type,
    energy: 100, // Default energy
  };
}