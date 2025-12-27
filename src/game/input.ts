// game/input.ts
import { TILE_SIZE } from "./render";
import { GRID_SIZE } from "./grid";

export function canvasToGrid(
  canvas: HTMLCanvasElement,
  event: MouseEvent
) {
  const rect = canvas.getBoundingClientRect();

  // FIX: Calculate the scaling ratio (Visual Size vs Internal Size)
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Apply the scale to the mouse coordinates
  const rawX = ((event.clientX - rect.left) * scaleX) / TILE_SIZE;
  const rawY = ((event.clientY - rect.top) * scaleY) / TILE_SIZE;

  // Clamp values to stay inside the grid
  const x = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(rawX)));
  const y = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(rawY)));

  return { x, y };
}