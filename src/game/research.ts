import { gameState, TechId } from "./gameState";

export type TechDefinition = {
  id: TechId;
  name: string;
  description: string;
  cost: number;
};

// SORTED: Cheapest -> Most Expensive
export const TECH_TREE: TechDefinition[] = [
  // --- TIER 1: THE BASICS ---
  {
    id: "efficiency_1",
    name: "High-Pressure Nozzle",
    description: "Scrubber cleans pollution 50% faster.",
    cost: 50 // Accessible after first failed run
  },
  {
    id: "radius_1",
    name: "Wide-Angle Spray",
    description: "Increases brush size by +1 (approx 50% larger).",
    cost: 150 // A good goal for early game
  },

  // --- TIER 2: ENERGY MANAGEMENT ---
  {
    id: "capacity_1",
    name: "Reserve Tank",
    description: "Doubles maximum spray energy to 200%.",
    cost: 300 // Allows for longer bursts during emergencies
  },
  {
    id: "regen_1",
    name: "Solar Capacitor",
    description: "Spray energy recharges 3x faster.",
    cost: 500 // Very powerful, needs a mid-game price tag
  },

  // --- TIER 3: INDUSTRIAL TECH ---
  {
    id: "radius_2",
    name: "Industrial Sprayer",
    description: "Maximizes brush size (Adds +2 radius).",
    cost: 800 // Huge impact, expensive
  },
  {
    id: "seeding_1",
    name: "Bio-Seed Injection",
    description: "Scrubbing barren land instantly plants grass (20% chance).",
    cost: 1200 // Ultimate automation for beating tight timers
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