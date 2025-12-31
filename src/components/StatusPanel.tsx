import React, { useEffect, useState } from "react";
import { calculateMetrics, Metrics } from "../game/metrics";
import { gameState } from "../game/gameState";
import { currentEventMessage } from "../game/simulation";
import { hasTech } from "../game/research";
import { LEVELS } from "../game/levels";

export default function StatusPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  
  const maxEnergy = hasTech("capacity_1") ? 200 : 100;
  const energyPercent = (gameState.sprayEnergy / maxEnergy) * 100;
  const currentLevel = LEVELS[gameState.currentLevelIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(calculateMetrics());
    }, 250);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return null;

  // Status Logic
  let statusMessage = "OPTIMAL";
  let statusColor = "#10b981"; // Emerald
  let isCritical = false;

  if (metrics.pollutionPercent > 80) {
    statusMessage = "CRITICAL FAIL";
    statusColor = "#ef4444";
    isCritical = true;
  } else if (metrics.pollutionPercent > 40) {
    statusMessage = "UNSTABLE";
    statusColor = "#f59e0b";
  }

  // Goals
  const bioGoal = currentLevel.goals.biodiversity;
  const pollGoal = currentLevel.goals.pollution;
  const bioProgress = Math.min(100, (metrics.biodiversityScore / bioGoal) * 100);

  return (
    <div style={styles.container} className="status-panel">
      
      {/* --- SECTION 1: SYSTEM VITALS --- */}
      <div style={styles.sectionHeader}>SYSTEM VITALS</div>
      
      {/* Warning Flash */}
      {isCritical && <div style={styles.criticalOverlay} />}

      <div style={styles.vitalsRow}>
        {/* TIMER */}
        <div style={styles.vitalBox}>
          <span style={styles.vitalLabel}>T-MINUS</span>
          <span style={{...styles.vitalValue, color: gameState.timeRemaining < 30 ? "#ef4444" : "#f3f4f6"}}>
             {Math.floor(gameState.timeRemaining / 60)}:
             {(gameState.timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* STATUS */}
        <div style={{...styles.vitalBox, borderColor: statusColor}}>
          <span style={{...styles.vitalLabel, color: statusColor}}>INTEGRITY</span>
          <span style={{...styles.vitalValue, color: statusColor, fontSize: "0.8rem"}}>
            {statusMessage}
          </span>
        </div>
      </div>

      {/* ENERGY BAR */}
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
        <div style={styles.eventToast}>{currentEventMessage}</div>
      )}

      <div style={styles.divider} />

      {/* --- SECTION 2: MISSION METRICS --- */}
      <div style={styles.sectionHeader}>MISSION: {currentLevel.name.toUpperCase()}</div>

      {/* BIODIVERSITY GOAL */}
      <div style={styles.goalContainer}>
        <div style={styles.goalInfo}>
          <span style={styles.goalTitle}>Biodiversity</span>
          <span style={styles.goalValue}>{metrics.biodiversityScore} / {bioGoal}</span>
        </div>
        <div style={styles.barTrack}>
          <div style={{
            ...styles.barFill, 
            width: `${bioProgress}%`,
            backgroundColor: metrics.biodiversityScore >= bioGoal ? "#10b981" : "#8b5cf6" // Purple to Green
          }} />
        </div>
      </div>

      {/* POLLUTION GOAL */}
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
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "280px",
    maxHeight: "calc(100vh - 430px)", // Leave space for Legend at bottom + 50px margin between panels
    overflowY: "auto",
    backgroundColor: "rgba(17, 24, 39, 0.9)", // Increased opacity
    backdropFilter: "blur(12px)",
    border: "1px solid #374151",
    borderRadius: "8px",
    padding: "16px",
    fontFamily: "'Inter', monospace", // Monospace for numbers
    zIndex: 90,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    boxSizing: "border-box",
  },
criticalOverlay: {
  position: "sticky", // Change from absolute to sticky
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: "-16px", // Offset the padding of the parent container
  height: "calc(100% + 32px)", // Ensure it covers the full height
  width: "calc(100% + 32px)", 
  borderRadius: "8px",
  border: "2px solid #ef4444",
  animation: "pulse-red 1s infinite",
  pointerEvents: "none",
  zIndex: 100, // Keep it above everything
},
  sectionHeader: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#6b7280",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  vitalsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "16px",
  },
  vitalBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    border: "1px solid #374151",
    padding: "8px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  vitalLabel: {
    fontSize: "0.55rem",
    color: "#9ca3af",
    letterSpacing: "1px",
    marginBottom: "4px",
  },
  vitalValue: {
    fontFamily: "'Courier New', monospace",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  energyWrapper: {
    marginBottom: "10px",
  },
  barLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.7rem",
    color: "#d1d5db",
    marginBottom: "4px",
    fontWeight: "500",
  },
  barTrack: {
    height: "6px",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s ease-out, background-color 0.3s",
  },
  divider: {
    height: "1px",
    backgroundColor: "#374151",
    margin: "16px 0",
  },
  goalContainer: {
    marginBottom: "12px",
  },
  goalInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "4px",
    width: "100%",
    boxSizing: "border-box",
  },
  goalTitle: {
    fontSize: "0.75rem",
    color: "#e5e7eb",
    fontWeight: "500",
  },
  goalValue: {
    fontSize: "0.7rem",
    color: "#9ca3af",
    fontFamily: "'Courier New', monospace",
  },
  eventToast: {
    marginTop: "12px",
    backgroundColor: "#7f1d1d", // Dark red bg
    color: "#fca5a5", // Light red text
    border: "1px solid #ef4444",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    textAlign: "center",
    fontWeight: "bold",
    animation: "fade-in 0.3s ease-out",
  }
};