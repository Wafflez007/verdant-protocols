import { Tile } from "./types";

export const GRID_SIZE = 64;

// Helper to create a single tile
function createTile(biome: "toxic" | "water" | "wetland", moisture = 0): Tile {
  return {
    toxicity: biome === "toxic" ? 100 : 0,
    moisture: moisture,
    biome: biome,
    variation: Math.random(),
  };
}

export function createGrid(mapType: "river" | "desert" = "river"): Tile[][] {
  return Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => {
      
      // --- MAP TYPE 1: RIVER VALLEY (Easy) ---
      if (mapType === "river") {
        const riverCenter = Math.floor(GRID_SIZE / 2 + Math.sin(y / 4) * 4);
        
        // River
        if (Math.abs(x - riverCenter) < 2) return createTile("water", 100);
        // Banks
        if (Math.abs(x - riverCenter) < 4) return createTile("wetland", 80);
      }

      // --- MAP TYPE 2: ARID WASTELAND (Hard) ---
      else if (mapType === "desert") {
        // Scattered Oases using Simplex-like noise (Math.sin/cos combination)
        // This creates "blobs" of water instead of a line
        const noise = Math.sin(x / 5) * Math.cos(y / 5) + Math.sin((x + y) / 10);
        
        // Very rare water spots (Oasis)
        if (noise > 1.2) return createTile("water", 100);
        if (noise > 0.9) return createTile("wetland", 60);
      }

      // Default: Toxic Wasteland
      return createTile("toxic", 0);
    })
  );
}