import { Tile, Animal } from "./types";
import { createGrid } from "./grid";
import { LEVELS } from "./levels"; 

export type TechId = 
  | "efficiency_1" 
  | "radius_1" 
  | "radius_2" 
  | "regen_1"      
  | "capacity_1"   
  | "seeding_1";   

export const gameState: {
  grid: Tile[][];
  isScrubbing: boolean;
  animals: Animal[];
  nextAnimalId: number;
  isCompleted: boolean;
  biomass: number;
  unlockedTechs: TechId[];
  timeRemaining: number;
  sprayEnergy: number;
  currentLevelIndex: number;
} = {
  // Default to Level 0 map
  grid: createGrid(LEVELS[0].mapType), // Optional: Also sync map type dynamically
  isScrubbing: false,
  animals: [],
  nextAnimalId: 1,
  isCompleted: false,
  biomass: 0,
  unlockedTechs: [],
  
  // 2. USE THE LEVEL CONFIG FOR TIME
  timeRemaining: LEVELS[0].timeLimit, 
  
  sprayEnergy: 100,
  
  // Start at Level 0
  currentLevelIndex: 0,
};