import React from "react";
import { audioManager } from "../game/audio";
import { gameState } from "../game/gameState";

interface Props {
  onStart: () => void;
}

export default function IntroductionModal({ onStart }: Props) {
  
  const handleStart = () => {
    audioManager.init();
    audioManager.startAmbience(gameState.currentLevelIndex);
    onStart();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* DECORATIVE TOP BAR */}
        <div style={styles.topBar}>
          <div style={styles.dotRed} />
          <div style={styles.dotYellow} />
          <div style={styles.dotGreen} />
        </div>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>VERDANT PROTOCOLS</h1>
          <div style={styles.badge}>SYS.BOOT.SEQUENCE</div>
        </div>

        <p style={styles.introText}>
          Welcome, Operator. The biosphere is collapsing. Your directive is to re-engineer the environment to support life.
        </p>

        {/* INSTRUCTIONS GRID */}
        <div style={styles.grid}>
          <InstructionCard 
            icon="🧼" 
            title="PURIFY" 
            desc="Drag to scrub toxic waste. Pollution kills life." 
          />
          <InstructionCard 
            icon="🌱" 
            title="REGROW" 
            desc="Clean soil near water naturally grows forests." 
          />
          <InstructionCard 
            icon="🔬" 
            title="EVOLVE" 
            desc="Earn biomass to upgrade your cleaning tech." 
          />
        </div>

        {/* START BUTTON */}
        <button style={styles.button} onClick={handleStart} className="start-btn">
          INITIALIZE SIMULATION
        </button>
        
        <div style={styles.footer}>
          Input: Mouse/Touch • Audio: Recommended
        </div>

      </div>
    </div>
  );
}

function InstructionCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardIcon}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDesc}>{desc}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)", 
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)",
  },
  modal: {
    width: "650px",
    maxWidth: "95vw",
    backgroundColor: "#111827",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "0", // Padding handled by children
    boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
    color: "#f3f4f6",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
  },
  topBar: {
    backgroundColor: "#1f2937",
    padding: "12px 20px",
    display: "flex",
    gap: "8px",
    borderBottom: "1px solid #374151",
  },
  dotRed: { width: 10, height: 10, borderRadius: "50%", background: "#ef4444" },
  dotYellow: { width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" },
  dotGreen: { width: 10, height: 10, borderRadius: "50%", background: "#10b981" },
  
  header: {
    padding: "40px 40px 20px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "900",
    letterSpacing: "2px",
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg, #fff 0%, #9ca3af 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#34d399",
    border: "1px solid #059669",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "1px",
  },
  introText: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "0 40px 30px",
    fontSize: "1rem",
    lineHeight: "1.5",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    padding: "0 40px 40px",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  cardIcon: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  cardTitle: {
    color: "#60a5fa",
    fontSize: "0.9rem",
    marginBottom: "8px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  cardDesc: {
    fontSize: "0.8rem",
    color: "#d1d5db",
    lineHeight: "1.4",
    margin: 0,
  },
  button: {
    display: "block",
    width: "calc(100% - 80px)",
    margin: "0 auto 20px",
    backgroundColor: "#10b981",
    color: "#064e3b",
    border: "none",
    padding: "18px",
    fontSize: "1.1rem",
    fontWeight: "800",
    letterSpacing: "2px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "filter 0.2s",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
  },
  footer: {
    textAlign: "center",
    paddingBottom: "30px",
    fontSize: "0.75rem",
    color: "#6b7280",
  }
};