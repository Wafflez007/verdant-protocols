import React, { useEffect, useState } from "react";
import { calculateMetrics, Metrics } from "../game/metrics";
import { gameState } from "../game/gameState";
import { currentEventMessage } from "../game/simulation";
import { hasTech } from "../game/research";
import { LEVELS } from "../game/levels";

export default function StatusPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [, setTick] = useState(0); // Forces re-render for external gameState
  
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

  // --- LOGIC ---
  let statusMessage = "OPTIMAL";
  let statusColor = "#10b981"; 
  let isCritical = false;

  if (metrics.pollutionPercent > 80) {
    statusMessage = "CRITICAL FAIL";
    statusColor = "#ef4444";
    isCritical = true;
  } else if (metrics.pollutionPercent > 40) {
    statusMessage = "UNSTABLE";
    statusColor = "#f59e0b";
  }

  // Visual trigger for Heatwave
  const isHeatwave = currentEventMessage?.toUpperCase().includes("HEATWAVE");
  if (isHeatwave) isCritical = true;

  const bioGoal = currentLevel.goals.biodiversity;
  const pollGoal = currentLevel.goals.pollution;
  const bioProgress = Math.min(100, (metrics.biodiversityScore / bioGoal) * 100);

  return (
    <div style={styles.container} className="status-panel">
      
      {/* 1. THE FIXED OVERLAY */}
      {/* This stays pinned to the edges and never scrolls */}
      {isCritical && (
        <>
          <style>{pulseKeyframes}</style>
          <div style={styles.criticalOverlay} />
        </>
      )}

      {/* 2. THE SCROLLABLE CONTENT */}
      {/* This handles the 'multiple screen' requirement by scrolling if content is too tall */}
      <div style={styles.scrollArea}>
        
        <div style={styles.sectionHeader}>SYSTEM VITALS</div>
        
        <div style={styles.vitalsRow}>
          <div style={styles.vitalBox}>
            <span style={styles.vitalLabel}>T-MINUS</span>
            <span style={{...styles.vitalValue, color: gameState.timeRemaining < 30 ? "#ef4444" : "#f3f4f6"}}>
               {Math.floor(gameState.timeRemaining / 60)}:
               {(gameState.timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div style={{...styles.vitalBox, borderColor: statusColor, borderWidth: '1px', borderStyle: 'solid'}}>
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
            <span style={{fontSize: '1.1rem'}}>☀️</span>
            <span style={{flex: 1}}>{currentEventMessage.toUpperCase()}</span>
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

        {/* Added some bottom padding to ensure content isn't cramped when scrolling */}
        <div style={{height: '10px'}} />
      </div>
    </div>
  );
}

const pulseKeyframes = `
  @keyframes pulse-red {
    0% { border-color: rgba(239, 68, 68, 1); box-shadow: inset 0 0 15px rgba(239, 68, 68, 0.4); }
    50% { border-color: rgba(239, 68, 68, 0.3); box-shadow: inset 0 0 2px rgba(239, 68, 68, 0); }
    100% { border-color: rgba(239, 68, 68, 1); box-shadow: inset 0 0 15px rgba(239, 68, 68, 0.4); }
  }
`;

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "280px",
    // Uses vh to remain responsive on small screens
    maxHeight: "calc(100vh - 40px)", 
    backgroundColor: "rgba(17, 24, 39, 0.92)",
    backdropFilter: "blur(10px)",
    border: "1px solid #374151",
    borderRadius: "8px",
    zIndex: 90,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
    overflow: "hidden", // Prevents the overlay from scrolling
    display: "flex",
    flexDirection: "column",
  },
  scrollArea: {
    padding: "16px",
    overflowY: "auto", // The actual scrolling happens here
    flex: 1,
    scrollbarWidth: "thin", // Visual polish for Firefox
    scrollbarColor: "#4b5563 transparent",
  },
  criticalOverlay: {
    position: "absolute",
    inset: 0, 
    borderRadius: "8px",
    border: "3px solid #ef4444",
    animation: "pulse-red 1.2s infinite ease-in-out",
    pointerEvents: "none", // Allows clicks to pass through to buttons/content
    zIndex: 100, 
  },
  sectionHeader: {
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#9ca3af",
    marginBottom: "12px",
    fontWeight: "bold",
    opacity: 0.8,
  },
  vitalsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "16px",
  },
  vitalBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: "8px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50px",
  },
  vitalLabel: {
    fontSize: "0.55rem",
    marginBottom: "2px",
    fontWeight: "600",
  },
  vitalValue: {
    fontFamily: "'Courier New', monospace",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  energyWrapper: {
    marginBottom: "12px",
  },
  barLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.7rem",
    color: "#d1d5db",
    marginBottom: "4px",
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
    transition: "width 0.3s ease-out",
  },
  eventToast: {
    marginTop: "12px",
    backgroundColor: "#991b1b",
    color: "#fecaca",
    border: "1px solid #ef4444",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
  },
  goalTitle: {
    fontSize: "0.75rem",
    color: "#e5e7eb",
  },
  goalValue: {
    fontSize: "0.7rem",
    fontFamily: "'Courier New', monospace",
  }
};