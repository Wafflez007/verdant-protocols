// game/neighbors.ts
import { gameState } from "./gameState";
import { Tile } from "./types";
import { GRID_SIZE } from "./grid";

// Cache directions to avoid recreating this array 1000 times/sec
const DIRECTIONS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1]
];

export function getNeighbors(x: number, y: number): Tile[] {
  const neighbors: Tile[] = [];
  const grid = gameState.grid;

  // Unrolled loop for performance (faster than nested for-loops in JS engines)
  // Top Row
  if (y > 0) {
    if (x > 0) neighbors.push(grid[y - 1][x - 1]);            // Top-Left
    neighbors.push(grid[y - 1][x]);                           // Top-Mid
    if (x < GRID_SIZE - 1) neighbors.push(grid[y - 1][x + 1]); // Top-Right
  }

  // Middle Row
  if (x > 0) neighbors.push(grid[y][x - 1]);                  // Left
  if (x < GRID_SIZE - 1) neighbors.push(grid[y][x + 1]);      // Right

  // Bottom Row
  if (y < GRID_SIZE - 1) {
    if (x > 0) neighbors.push(grid[y + 1][x - 1]);            // Bot-Left
    neighbors.push(grid[y + 1][x]);                           // Bot-Mid
    if (x < GRID_SIZE - 1) neighbors.push(grid[y + 1][x + 1]); // Bot-Right
  }

  return neighbors;
}