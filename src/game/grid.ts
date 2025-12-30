import { Tile } from "./types";

export const GRID_SIZE = 64; // Default size for river and desert
export const LARGE_GRID_SIZE = 96; // Larger size for forest(50% bigger)

// Helper to create a single tile
function createTile(biome: "toxic" | "water" | "wetland" | "forest", moisture = 0): Tile {
  return {
    toxicity: biome === "toxic" ? 100 : 0,
    moisture: moisture,
    biome: biome,
    variation: Math.random(),
  };
}

export function createGrid(mapType: "river" | "desert" | "forest" | "tundra" = "river"): Tile[][] {
  // Use larger grid for forest and tundra maps
  const gridSize = (mapType === "forest" || mapType === "tundra") ? LARGE_GRID_SIZE : GRID_SIZE;
  
  return Array.from({ length: gridSize }, (_, y) =>
    Array.from({ length: gridSize }, (_, x) => {
      
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

      // --- MAP TYPE 3: ANCIENT FOREST (Medium) ---
      else if (mapType === "forest") {
        // Multiple winding streams through dense forest - increased spread
        const stream1 = Math.floor(gridSize / 4 + Math.sin(y / 6) * 8);
        const stream2 = Math.floor(gridSize / 2 + Math.cos(y / 5) * 6);
        const stream3 = Math.floor((3 * gridSize) / 4 + Math.sin(y / 7) * 7);
        
        // Toxic waste patches (industrial pollution) - MUCH MORE toxic areas
        const toxicNoise = Math.sin(x / 9) * Math.cos(y / 7) + Math.cos((x - y) / 11);
        if (toxicNoise > 0.3) return createTile("toxic", 0); // Much lower threshold = more toxic
        
        // Additional toxic patches for edges
        const edgeToxic = Math.sin(x / 5) * Math.cos(y / 8);
        if (edgeToxic > 0.5) return createTile("toxic", 0); // More edge toxic areas
        
        // More concentrated toxic zones
        const zoneToxic = Math.sin(x / 7) * Math.sin(y / 6);
        if (zoneToxic > 0.4) return createTile("toxic", 0);
        
        // Three streams for better coverage (only small water areas)
        if (Math.abs(x - stream1) < 2 || Math.abs(x - stream2) < 2 || Math.abs(x - stream3) < 2) {
          return createTile("water", 100);
        }
        // Stream banks - wetlands (reduced)
        if (Math.abs(x - stream1) < 3 || Math.abs(x - stream2) < 3 || Math.abs(x - stream3) < 3) {
          return createTile("wetland", 85);
        }
        
        // Forest noise pattern - much stricter to reduce clean areas
        const forestNoise = Math.sin(x / 4) * Math.cos(y / 5) + Math.sin((x + y) / 10);
        
        // Very limited forest patches (only the best spots)
        if (forestNoise > 0.8) return createTile("forest", 60);
        // Less dense areas but still forested (reduced)
        if (forestNoise > 0.5) return createTile("wetland", 50);
      }

      // --- MAP TYPE 4: FROZEN TUNDRA (Hard) ---
      else if (mapType === "tundra") {
        // Frozen lake in center with harsh conditions
        const centerX = gridSize / 2;
        const centerY = gridSize / 2;
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        
        // Tundra noise for ice patches
        const tundraPattern = Math.sin(x / 7) * Math.cos(y / 7) + Math.sin((x - y) / 12);
        
        // Heavy toxic contamination (nuclear/industrial waste) - reduced to prevent too many dark spots
        const toxicPattern = Math.sin(x / 6) * Math.cos(y / 5) + Math.sin((x + y) / 9);
        if (toxicPattern > 1.0) return createTile("toxic", 0); // Increased threshold to reduce dark areas
        
        // Central frozen lake
        if (distFromCenter < 15) return createTile("water", 80); // Larger lake for bigger map
        
        // Ice-covered wetlands around lake
        if (distFromCenter < 22) return createTile("wetland", 40); // Larger wetland ring
        
        // Scattered water pockets (melting ice)
        if (tundraPattern > 1.0 && distFromCenter > 25) return createTile("water", 60);
        if (tundraPattern > 0.6 && distFromCenter > 25) return createTile("wetland", 30);
      }

      // Default: Toxic Wasteland
      return createTile("toxic", 0);
    })
  );
}