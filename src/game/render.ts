import { gameState } from "./gameState";
import { Biome } from "./types"; // Ensure Biome is imported if used, otherwise remove

export const TILE_SIZE = 16; 

/**
 * Helper to darken/lighten a hex color or HSL
 */
function getBiomeStyle(biome: string, variation: number, toxicity: number): string {
  switch (biome) {
    case "toxic":
      // Grayscale/purple shifting mess
      const gray = Math.floor(50 + (100 - toxicity) * 1.5); 
      return `rgb(${gray}, ${gray}, ${gray})`;

    case "barren":
      // Earthy browns
      return `hsl(30, ${30 + variation * 20}%, ${30 + variation * 10}%)`;

    case "grass":
      // Lush greens
      return `hsl(${100 + variation * 20}, 60%, ${40 + variation * 15}%)`;

    case "wetland":
      // Teal/Cyan mix
      return `hsl(170, 50%, ${35 + variation * 10}%)`;

    case "forest":
      // Deep greens
      return `hsl(${120 + variation * 30}, 70%, ${20 + variation * 10}%)`;

    case "water":
      // Blue
      return `hsl(220, 80%, ${40 + variation * 10}%)`;

    default:
      return "#000000";
  }
}

export function renderGrid(ctx: CanvasRenderingContext2D) {
  const grid = gameState.grid;
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const tile = grid[y][x];

      ctx.fillStyle = getBiomeStyle(tile.biome, tile.variation, tile.toxicity);
      ctx.fillRect(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }
}

// --- ANIMAL RENDERING ---

const ANIMAL_ICONS: Record<string, string> = {
  herbivore: "🐇", // Rabbit
  carnivore: "🐺", // Wolf
  pollinator: "🐝", // Bee
  default: "🐾"
};

export function renderAnimals(ctx: CanvasRenderingContext2D) {
  // CONFIG: Set font size relative to tile
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${TILE_SIZE - 2}px sans-serif`; 

  for (const animal of gameState.animals) {
    const cx = animal.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = animal.y * TILE_SIZE + TILE_SIZE / 2;

    // 1. DRAW EMOJI
    // Cast to any to safely access 'type' if TS complains
    const icon = ANIMAL_ICONS[(animal as any).type] || ANIMAL_ICONS.default;
    
    // Shadow for visibility
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText(icon, cx, cy);
    ctx.shadowBlur = 0; // Reset shadow

    // 2. DRAW HEALTH BAR (If hungry)
    if (animal.energy < 90) {
      const barWidth = TILE_SIZE - 2;
      const barHeight = 3;
      const barX = cx - barWidth / 2;
      const barY = cy - TILE_SIZE / 2 - 2; // Above head

      // Background (Black)
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Fill (Green -> Red)
      const healthPct = animal.energy / 100;
      ctx.fillStyle = healthPct > 0.4 ? "#22c55e" : "#ef4444";
      ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);
    }

    // 3. DRAW STARVATION WARNING
    if (animal.energy < 20) {
      ctx.font = "10px sans-serif";
      // Small lightning bolt to indicate danger
      ctx.fillText("⚡", cx + TILE_SIZE/2, cy - TILE_SIZE/2);
      // Reset font for next loop
      ctx.font = `${TILE_SIZE - 2}px sans-serif`; 
    }
  }
}