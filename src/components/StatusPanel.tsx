import React, { useEffect, useState } from "react";
import { calculateMetrics, Metrics } from "../game/metrics";
import { gameState } from "../game/gameState";
import { currentEventMessage } from "../game/simulation";
import { hasTech } from "../game/research";
import { LEVELS } from "../game/levels";

export default function StatusPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [, setTick] = useState(0); // Forces re-render for gameState updates
  
  const maxEnergy = hasTech("capacity_1") ? 200 : 100;
  const energyPercent = (gameState.sprayEnergy / maxEnergy) * 100;
  const currentLevel = LEVELS[gameState.currentLevelIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(calculateMetrics());
      setTick(t => t + 1);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return null;

  // Status Logic
  let statusMessage = "OPTIMAL";
  let statusColor = "#10b981"; 
  let isCritical = false;

  // Pollutions Logic
  if (metrics.pollutionPercent > 80) {
    statusMessage = "CRITICAL FAIL";
    statusColor = "#ef4444";
    isCritical = true;
  } else if (metrics.pollutionPercent > 40) {
    statusMessage = "UNSTABLE";
    statusColor = "#f59e0b";
  }

  // If a Heatwave event is active, we also treat it as a critical visual state
  if (currentEventMessage?.includes("HEATWAVE")) {
      isCritical = true;
  }

  const bioGoal = currentLevel.goals.biodiversity;
  const pollGoal = currentLevel.goals.pollution;
  const bioProgress = Math.min(100, (metrics.biodiversityScore / bioGoal) * 100);

  return (
    <div style={styles.container} className="status-panel">
      
      {/* 1. THE OVERLAY: Stays fixed to the container edges */}
      {isCritical && (
        <>
          <style>{pulseKeyframes}</style>
          <div style={styles.criticalOverlay} />
        </>
      )}

      {/* 2. THE SCROLLABLE WRAPPER: Only this part moves */}
      <div style={styles.scrollWrapper}>
        
        <div style={styles.sectionHeader}>SYSTEM VITALS</div>
        
        <div style={styles.vitalsRow}>
          <div style={styles.vitalBox}>
            <span style={styles.vitalLabel}>T-MINUS</span>
            <span style={{...styles.vitalValue, color: gameState.timeRemaining < 30 ? "#ef4444" : "#f3f4f6"}}>
               {Math.floor(gameState.timeRemaining / 60)}:
               {(gameState.timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div style={{...styles.vitalBox, borderColor: statusColor}}>
            <span style={{...styles.vitalLabel, color: statusColor}}>INTEGRITY</span>
            <span style={{...styles.vitalValue, color: statusColor, fontSize: "0.8rem"}}>
              {statusMessage}
            </span>
          </div>
        </div>

        <div style={styles.energyWrapper}>
          <div style={styles.barLabelRow}>
            <span>SCRUBBER ENERGY</span>
            <span>{Math.floor(gameState.sprayEnergy)}/{maxEnergy}</span>
          </div>
          <div style={styles.barTrack}>
            <div style={{
              ...styles.barFill, 
              width: `${energyPercent}%`,
              backgroundColor: gameState.sprayEnergy < 20 ? "#ef4444" : "#3b82f6"
            }} />
          </div>
        </div>

        {currentEventMessage && (
          <div style={styles.eventToast}>
            <span style={{marginRight: '8px'}}>☀️</span>
            {currentEventMessage.toUpperCase()}
          </div>
        )}

        <div style={styles.divider} />

        <div style={styles.sectionHeader}>MISSION: {currentLevel.name.toUpperCase()}</div>

        <div style={styles.goalContainer}>
          <div style={styles.goalInfo}>
            <span style={styles.goalTitle}>Biodiversity</span>
            <span style={styles.goalValue}>{metrics.biodiversityScore} / {bioGoal}</span>
          </div>
          <div style={styles.barTrack}>
            <div style={{
              ...styles.barFill, 
              width: `${bioProgress}%`,
              backgroundColor: metrics.biodiversityScore >= bioGoal ? "#10b981" : "#8b5cf6"
            }} />
          </div>
        </div>

        <div style={styles.goalContainer}>
          <div style={styles.goalInfo}>
            <span style={styles.goalTitle}>Toxicity Levels</span>
            <span style={{
               ...styles.goalValue, 
               color: metrics.pollutionPercent > pollGoal ? "#ef4444" : "#10b981"
            }}>
              {metrics.pollutionPercent}% (Target: &lt;{pollGoal}%)
            </span>
          </div>
          <div style={styles.barTrack}>
            <div style={{
              ...styles.barFill, 
              width: `${Math.min(100, metrics.pollutionPercent)}%`,
              backgroundColor: metrics.pollutionPercent > pollGoal ? "#ef4444" : "#10b981"
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation CSS
const pulseKeyframes = `
  @keyframes pulse-red {
    0% { border-color: rgba(239, 68, 68, 1); box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.5); }
    50% { border-color: rgba(239, 68, 68, 0.2); box-shadow: inset 0 0 0px rgba(239, 68, 68, 0); }
    100% { border-color: rgba(239, 68, 68, 1); box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.5); }
  }
`;

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "300px",
    maxHeight: "450px", 
    backgroundColor: "rgba(11, 17, 30, 0.95)",
    backdropFilter: "blur(12px)",
    border: "1px solid #374151",
    borderRadius: "12px",
    zIndex: 90,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7)",
    overflow: "hidden", // CRITICAL: This clips the scroll content but NOT the overlay
    display: "flex",
    flexDirection: "column",
  },
  scrollWrapper: {
    padding: "20px",
    overflowY: "auto",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  criticalOverlay: {
    position: "absolute",
    inset: 0, 
    borderRadius: "12px",
    border: "3px solid #ef4444",
    animation: "pulse-red 1.5s infinite ease-in-out",
    pointerEvents: "none",
    zIndex: 100, // Stays above the scrolling text
  },
  sectionHeader: {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#9ca3af",
    marginBottom: "12px",
    fontWeight: "bold",
  },
  vitalsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  vitalBox: {
    backgroundColor: "rgba(0,0,0,0.4)",
    border: "1px solid #374151",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  vitalLabel: {
    fontSize: "0.6rem",
    color: "#6b7280",
    marginBottom: "4px",
  },
  vitalValue: {
    fontFamily: "'Courier New', monospace",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  energyWrapper: {
    marginBottom: "15px",
  },
  barLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.75rem",
    color: "#e5e7eb",
    marginBottom: "6px",
  },
  barTrack: {
    height: "8px",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  eventToast: {
    marginTop: "10px",
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    border: "1px solid #ef4444",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "0.8rem",
    textAlign: "center",
    fontWeight: "900",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
  },
  divider: {
    height: "1px",
    backgroundColor: "#374151",
    margin: "20px 0",
  },
  goalContainer: {
    marginBottom: "16px",
  },
  goalInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  goalTitle: {
    fontSize: "0.8rem",
    color: "#d1d5db",
  },
  goalValue: {
    fontSize: "0.75rem",
    fontFamily: "'Courier New', monospace",
  }
};