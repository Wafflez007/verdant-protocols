// game/types.ts

export type Biome =
  | "toxic"
  | "barren"
  | "grass"
  | "water"
  | "wetland"
  | "forest";

export type Tile = {
  toxicity: number;   // 0–100
  moisture: number;   // 0–100
  biome: Biome;
  
  // NEW: Visual properties
  // A number between 0 and 1 assigned at creation. 
  // Used to vary the color (e.g. 0.1 = light grass, 0.9 = dark grass)
  variation: number; 
};

export type AnimalType = "herbivore" | "carnivore" | "pollinator";

export interface Animal {
  id: string;
  x: number;
  y: number;
  type: AnimalType;
  energy: number;
}