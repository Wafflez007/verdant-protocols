import { gameState } from "./gameState";
import { calculateMetrics } from "./metrics";
import { audioManager } from "./audio";
import { LEVELS } from "./levels";
import { createGrid } from "./grid";

export function checkProgression() {
  if (gameState.isCompleted) return;

  const metrics = calculateMetrics();
  const currentLevel = LEVELS[gameState.currentLevelIndex];

  const isHealthy = metrics.biodiversityScore >= currentLevel.goals.biodiversity;
  const isClean = metrics.pollutionPercent <= currentLevel.goals.pollution;

  if (isHealthy && isClean) {
    completeLevel();
  }
}

function completeLevel() {
  gameState.isCompleted = true;
  audioManager.playWinSound();
  
  const nextLevelIndex = gameState.currentLevelIndex + 1;
  const hasNextLevel = nextLevelIndex < LEVELS.length;
  const isGameWon = !hasNextLevel; // This is the final level

  // dispatch Custom Event to UI
  window.dispatchEvent(new CustomEvent("level-complete", { 
    detail: { 
      hasNextLevel,
      nextLevelIndex,
      isGameWon // Add flag for final win
    } 
  }));
}

export function loadLevel(index: number) {
  const levelConfig = LEVELS[index];
  
  gameState.currentLevelIndex = index;
  gameState.isCompleted = false;
  
  // Reset biomass to 0 for new level (but keep unlockedTechs)
  gameState.biomass = 0;
  
  // Check if we have saved progress for this level
  if (gameState.savedGrids[index]) {
    // Deep clone the saved grid to restore progress
    gameState.grid = gameState.savedGrids[index].map(row => 
      row.map(tile => ({ ...tile }))
    );
    console.log(`Restored saved progress for Level ${index}: ${levelConfig.name}`);
  } else {
    // Create fresh grid for first attempt
    gameState.grid = createGrid(levelConfig.mapType);
    console.log(`Created new grid for Level ${index}: ${levelConfig.name}`);
  }
  
  gameState.animals = [];
  gameState.timeRemaining = levelConfig.timeLimit;
  
  // Switch to the new level's music
  audioManager.startAmbience(index);
}