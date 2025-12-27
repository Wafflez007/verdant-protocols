import { gameState, TechId } from "./gameState";

export type TechDefinition = {
  id: TechId;
  name: string;
  description: string;
  cost: number;
};

export const TECH_TREE: TechDefinition[] = [
  {
    id: "efficiency_1",
    name: "High-Pressure Nozzle",
    description: "Scrubber cleans pollution 50% faster.",
    cost: 50
  },
  {
    id: "radius_1",
    name: "Wide-Angle Spray",
    description: "Increases brush size by 50%.",
    cost: 100
  },
  {
    id: "radius_2",
    name: "Industrial Sprayer",
    description: "Maximizes brush size (Double radius).",
    cost: 150
  },
  {
    id: "regen_1",
    name: "Solar Capacitor",
    description: "Spray energy recharges 3x faster.",
    cost: 200
  },
  {
    id: "capacity_1",
    name: "Reserve Tank",
    description: "Doubles maximum spray energy (200%).",
    cost: 250
  },
  {
    id: "seeding_1",
    name: "Bio-Seed Injection",
    description: "Scrubbing barren land instantly plants grass (20% chance).",
    cost: 300
  }
];

export function purchaseTech(techId: TechId): boolean {
  const tech = TECH_TREE.find(t => t.id === techId);
  if (!tech) return false;

  if (gameState.biomass >= tech.cost && !gameState.unlockedTechs.includes(techId)) {
    gameState.biomass -= tech.cost;
    gameState.unlockedTechs.push(techId);
    return true;
  }
  return false;
}

export function hasTech(techId: TechId): boolean {
  return gameState.unlockedTechs.includes(techId);
}