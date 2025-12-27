import { useEffect, useRef } from "react";
import { renderAnimals, renderGrid, TILE_SIZE } from "../game/render";
import { gameState } from "../game/gameState";
import { canvasToGrid } from "../game/input";
import { scrubTile } from "../game/scrubber";
import { startSimulation, stopSimulation } from "../game/simulation";
import { GRID_SIZE } from "../game/grid"; 
import { audioManager } from "../game/audio";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Ref to track mouse position for the "Pressure Washer" effect
  // We use a ref so the animation loop can access the latest value without re-rendering
  const mouseGridPos = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Start ecological simulation
    startSimulation();

    // --- AUDIO INIT ---
    // Browsers require a user gesture to start audio. 
    // We hook into the first click to start the engine.
    const startAudioEngine = () => {
      audioManager.init();
      audioManager.startAmbience();
      window.removeEventListener("click", startAudioEngine);
    };
    window.addEventListener("click", startAudioEngine);

    // INPUT HANDLERS
    const updateMousePos = (e: MouseEvent) => {
      const pos = canvasToGrid(canvas, e);
      mouseGridPos.current = pos;
    };

    const onMouseDown = (e: MouseEvent) => {
      gameState.isScrubbing = true;
      updateMousePos(e); // Update position immediately on click
      audioManager.startScrubSound();
    };

    const onMouseUp = () => {
      gameState.isScrubbing = false;
      audioManager.stopScrubSound();
    };

    const onMouseLeave = () => {
        gameState.isScrubbing = false;
        audioManager.stopScrubSound();
    };

    const onMouseMove = (e: MouseEvent) => {
      updateMousePos(e);
      // We REMOVED scrubTile() from here.
      // We only update position here. The loop handles the logic.
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // GAME LOOP
    let animationFrameId: number;

    const loop = () => {
      // 1. LOGIC: Handle Continuous Scrubbing
      if (gameState.isScrubbing && mouseGridPos.current) {
        scrubTile(mouseGridPos.current.x, mouseGridPos.current.y);
      }

      // 2. RENDER
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderGrid(ctx);
      renderAnimals(ctx);
      
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      stopSimulation();
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // FIX: Dynamic width/height based on your Grid and Tile settings
  const canvasSize = GRID_SIZE * TILE_SIZE; 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize}   // Now 1024px
        height={canvasSize}  // Now 1024px
        style={{ 
          border: "1px solid #333", 
          cursor: `url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="%2322d3ee" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="%2322d3ee"/></svg>') 12 12, crosshair`,
          maxWidth: "100%", // Responsive scaling if screen is small
          height: "auto"
        }}
      />
    </div>
  );
}