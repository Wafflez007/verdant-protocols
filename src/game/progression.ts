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

  // dispatch Custom Event to UI
  window.dispatchEvent(new CustomEvent("level-complete", { 
    detail: { 
      hasNextLevel,
      nextLevelIndex
    } 
  }));
}

export function loadLevel(index: number) {
  const levelConfig = LEVELS[index];
  
  gameState.currentLevelIndex = index;
  gameState.isCompleted = false;
  gameState.grid = createGrid(levelConfig.mapType);
  gameState.animals = [];
  gameState.timeRemaining = levelConfig.timeLimit;
  
  console.log(`Loaded Level ${index}: ${levelConfig.name}`);
}