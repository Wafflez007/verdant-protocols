export type LevelConfig = {
  id: number;
  name: string;
  mapType: "river" | "desert";
  goals: {
    biodiversity: number;
    pollution: number; // Max allowed pollution %
  };
  description: string;
  timeLimit: number;
};

export const LEVELS: LevelConfig[] = [
  {
    id: 0,
    name: "River Valley",
    mapType: "river",
    goals: { biodiversity: 7000, pollution: 10 },
    description: "A polluted river valley. Scrub the banks to restore the flow.",
    timeLimit: 180
  },
  {
    id: 1,
    name: "Arid Wasteland",
    mapType: "desert",
    goals: { biodiversity: 8000, pollution: 0 },
    description: "Water is scarce here. Connect the scattered oases to survive.",
    timeLimit: 120 
  }
];