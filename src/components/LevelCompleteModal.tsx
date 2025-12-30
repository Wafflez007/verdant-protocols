import React from "react";
import { LEVELS } from "../game/levels";
import { loadLevel } from "../game/progression";
import { startSimulation } from "../game/simulation";

interface Props {
  nextLevelIndex: number;
  onClose: () => void;
  isGameOver?: boolean;
  isGameWon?: boolean; // Add this prop
}

export default function LevelCompleteModal({ nextLevelIndex, onClose, isGameOver, isGameWon }: Props) {
  const nextLevel = LEVELS[nextLevelIndex];
  const isFinalWin = isGameWon || !nextLevel; // Use isGameWon flag

  const handleNext = () => {
  if (isGameOver) {
      // --- RETRY LOGIC ---
      // 1. Reset the current level state (Grid, Timer, Animals)
      loadLevel(nextLevelIndex); 
      
      // 2. CRITICAL FIX: Restart the game loop!
      startSimulation(); 
      
      // 3. Close the modal
      onClose();
    } else if (isFinalWin) {
      window.location.reload(); // Hard reload for game completion
    } else {
      // --- NEXT LEVEL LOGIC ---
      loadLevel(nextLevelIndex);
      onClose(); 
      // Note: Simulation usually keeps running between levels, 
      // but strictly speaking, it doesn't hurt to call startSimulation() here too 
      // just in case logic changes later.
    }
  };

 if (isGameOver) {
    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.modal, borderColor: "#ef4444" }}>
          <div style={styles.header}>
            <h2 style={{ ...styles.title, color: "#ef4444" }}>MISSION FAILED</h2>
            <div style={{ ...styles.line, backgroundColor: "#ef4444" }} />
          </div>
          <div style={styles.content}>
            <p style={styles.message}>
              Time limit exceeded. <br/>
              Ecological collapse imminent.
            </p>
          </div>
          {/* Ensure this button calls handleNext */}
          <button style={{ ...styles.button, backgroundColor: "#ef4444" }} onClick={handleNext}>
            RETRY SIMULATION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isFinalWin ? "PLANET RESTORED" : "SECTOR SECURED"}
          </h2>
          <div style={styles.line} />
        </div>

        {/* Content */}
        <div style={styles.content}>
          <p style={styles.message}>
            {isFinalWin 
              ? "All ecosystems restored! You have saved the planet. Victory achieved."
              : "Ecological integrity restored to 100%. Biomass synthesis efficient."
            }
          </p>

          {!isFinalWin && (
            <div style={styles.nextMissionBox}>
              <span style={styles.label}>INCOMING TRANSMISSION...</span>
              <h3 style={styles.missionTitle}>Next Region: {nextLevel.name}</h3>
              <p style={styles.missionDesc}>{nextLevel.description}</p>
            </div>
          )}
        </div>

        {/* Footer / Button */}
        <button style={styles.button} onClick={handleNext}>
          {isFinalWin ? "REBOOT SYSTEM" : "INITIATE TRANSPORT_"}
        </button>
      </div>
    </div>
  );
}

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Dark overlay
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
  },
  modal: {
    width: "450px",
    backgroundColor: "#111827",
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    color: "#f3f4f6",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: "900",
    letterSpacing: "3px",
    color: "#10b981", // Emerald Green
    textShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
  },
  line: {
    width: "60px",
    height: "4px",
    backgroundColor: "#10b981",
    margin: "12px auto 0",
    borderRadius: "2px",
  },
  content: {
    marginBottom: "32px",
  },
  message: {
    color: "#9ca3af",
    fontSize: "0.95rem",
    lineHeight: "1.5",
    marginBottom: "24px",
  },
  nextMissionBox: {
    backgroundColor: "rgba(31, 41, 55, 0.5)",
    border: "1px dashed #4b5563",
    padding: "16px",
    borderRadius: "8px",
    textAlign: "left",
  },
  label: {
    fontSize: "0.7rem",
    color: "#3b82f6", // Blue
    fontWeight: "bold",
    letterSpacing: "1px",
    display: "block",
    marginBottom: "4px",
  },
  missionTitle: {
    margin: "0 0 4px 0",
    fontSize: "1.1rem",
    color: "#e5e7eb",
  },
  missionDesc: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#3b82f6", // Blue button
    color: "white",
    border: "none",
    padding: "14px 28px",
    fontSize: "1rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    transition: "transform 0.1s, box-shadow 0.2s",
    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)", // Blue glow
  },
};