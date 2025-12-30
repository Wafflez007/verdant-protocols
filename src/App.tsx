import React, { useState, useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import StatusPanel from "./components/StatusPanel";
import TechTree from "./components/TechTree";
import LevelCompleteModal from "./components/LevelCompleteModal";
import Legend from "./components/Legend";
import IntroductionModal from "./components/IntroductionModal";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [nextLevelIdx, setNextLevelIdx] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  // LISTEN FOR GAME EVENTS
  useEffect(() => {
    const handleLevelComplete = (e: any) => {
      if (e.detail.isGameOver) {
        setIsGameOver(true);
        setIsGameWon(false);
        setShowLevelModal(true);
        return;
      }
      if (e.detail.isGameWon) {
        setIsGameWon(true);
        setIsGameOver(false);
        setNextLevelIdx(e.detail.nextLevelIndex);
        setShowLevelModal(true);
        return;
      }
      if (e.detail.hasNextLevel) {
        setNextLevelIdx(e.detail.nextLevelIndex);
        setIsGameOver(false);
        setIsGameWon(false);
        setShowLevelModal(true);
      } else {
        setNextLevelIdx(-1); // Final win
        setIsGameWon(true);
        setShowLevelModal(true);
      }
    };

    window.addEventListener("level-complete", handleLevelComplete);
    return () => window.removeEventListener("level-complete", handleLevelComplete);
  }, []);

  return (
    <div style={styles.appContainer}>
      {/* GLOBAL STYLES FOR ANIMATIONS */}
      <style>{`
        @keyframes scanline {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1f2937; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>

      {/* AMBIENT BACKGROUND */}
      <div style={styles.backgroundLayer} />
      <div style={styles.scanlines} />
      <div style={styles.vignette} />

      {/* MAIN GAME AREA */}
      <div style={styles.gameWrapper}>
        <header style={styles.header}>
          <div style={styles.statusDot} />
          <h1 style={styles.title}>VERDANT PROTOCOLS</h1>
          <div style={styles.versionBadge}>v0.9.2</div>
        </header>

        <div style={styles.canvasFrame}>
          {/* CORNER ACCENTS FOR TECH FEEL */}
          <div style={{...styles.corner, top: -1, left: -1, borderTop: '2px solid #10b981', borderLeft: '2px solid #10b981'}} />
          <div style={{...styles.corner, top: -1, right: -1, borderTop: '2px solid #10b981', borderRight: '2px solid #10b981'}} />
          <div style={{...styles.corner, bottom: -1, left: -1, borderBottom: '2px solid #10b981', borderLeft: '2px solid #10b981'}} />
          <div style={{...styles.corner, bottom: -1, right: -1, borderBottom: '2px solid #10b981', borderRight: '2px solid #10b981'}} />
          
          <GameCanvas />
        </div>
      </div>

      {/* UI OVERLAYS (Conditional to keep start screen clean) */}
      {!showIntro && (
        <>
          <StatusPanel />
          <TechTree />
          <Legend />
        </>
      )}

      {/* MODALS */}
      {showIntro && (
        <IntroductionModal onStart={() => setShowIntro(false)} />
      )}

      {showLevelModal && (
        <LevelCompleteModal 
          nextLevelIndex={nextLevelIdx} 
          isGameOver={isGameOver}
          isGameWon={isGameWon}
          onClose={() => setShowLevelModal(false)} 
        />
      )}
    </div>
  );
}

export default App;

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#050505",
    color: "#f3f4f6",
    fontFamily: "'Inter', system-ui, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundLayer: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 50%, #1f2937 0%, #000000 100%)",
    zIndex: 0,
  },
  scanlines: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
    backgroundSize: "100% 4px, 6px 100%",
    zIndex: 1,
    pointerEvents: "none",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)",
    zIndex: 2,
    pointerEvents: "none",
  },
  gameWrapper: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
  },
  header: {
    position: "absolute",
    top: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    pointerEvents: "none",
    opacity: 0.8,
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 10px #10b981",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "600",
    letterSpacing: "4px",
    margin: 0,
    color: "#e5e7eb",
  },
  versionBadge: {
    fontSize: "0.6rem",
    color: "#6b7280",
    border: "1px solid #374151",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  canvasFrame: {
    position: "relative",
    boxShadow: "0 0 80px -20px rgba(16, 185, 129, 0.1)",
    border: "1px solid #374151",
    backgroundColor: "#000",
    padding: "4px", // Tiny padding for "bezel" look
    // Responsive Logic
    height: "min(80vh, 80vw)",
    width: "min(80vh, 80vw)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: "20px",
    height: "20px",
    zIndex: 20,
  }
};