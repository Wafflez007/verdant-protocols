// game/simulation.ts
import { runSuccession } from "./succession";
import { trySpawnAnimals } from "./rewilding";
import { updateAnimals } from "./animalBehavior"; 
import { checkProgression } from "./progression"; 
import { gameState } from "./gameState";
import { calculateMetrics } from "./metrics"; 
import { triggerRandomEvent } from "./events";
import { hasTech } from "./research";

let intervalId: number | null = null;
let tickCount = 0;

// Export message variable for UI
export let currentEventMessage = ""; 

export function startSimulation() {
  if (intervalId !== null) return;

  // Run the simulation 10 times per second (100ms) for smoother feel
  intervalId = window.setInterval(() => {
    tickCount++;

    // 1. FAST UPDATES (Every 100ms)
    updateAnimals(); 

    // STAMINA RECHARGE
    // If player is NOT scrubbing, recharge energy
    if (!gameState.isScrubbing) {
      // DEFAULT: 1% per tick
      let rechargeRate = 1; 
      
      // UPGRADE: 3% per tick
      if (hasTech("regen_1")) rechargeRate = 3; 

      // MAX ENERGY LOGIC (See below)
      let maxEnergy = 100;
      if (hasTech("capacity_1")) maxEnergy = 200;

      gameState.sprayEnergy = Math.min(maxEnergy, gameState.sprayEnergy + rechargeRate);
    }

    // 2. MEDIUM UPDATES (Every 500ms / 5 ticks)
    if (tickCount % 5 === 0) {
      trySpawnAnimals();
    }

    // 3. SLOW UPDATES (Every 1000ms / 10 ticks)
    if (tickCount % 10 === 0) {
      runSuccession();
      checkProgression();

      // PHASE 1: TIMER LOGIC
      if (gameState.timeRemaining > 0 && !gameState.isCompleted) {
        gameState.timeRemaining--;
        
        // GAME OVER CHECK
        if (gameState.timeRemaining <= 0) {
           window.dispatchEvent(new CustomEvent("level-complete", { 
            detail: { hasNextLevel: false, isGameOver: true } 
          }));
          stopSimulation();
        }
      }

      // RANDOM EVENTS (1% Chance every second)
      if (Math.random() < 0.01) {
         currentEventMessage = triggerRandomEvent();
         // Clear message after 5 seconds
         setTimeout(() => { currentEventMessage = ""; }, 5000);
      }

      // BIOMASS INCOME
      const metrics = calculateMetrics();
      const income = Math.floor(metrics.biodiversityScore / 10);
      
      if (metrics.biodiversityScore > 0) {
         gameState.biomass += Math.max(1, income);
      }
    }
    
  }, 100);
}

export function stopSimulation() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}