import React, { useEffect, useState } from "react";
import { gameState } from "../game/gameState";
import { TECH_TREE, purchaseTech, hasTech } from "../game/research";

export default function TechTree() {
  const [isOpen, setIsOpen] = useState(true); // Default to collapsed to save space
  const [, setTick] = useState(0);

  // Poll for biomass updates
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(interval);
  }, []);

  const totalUpgrades = TECH_TREE.length;
  const unlockedUpgrades = TECH_TREE.filter(t => hasTech(t.id)).length;
  const progressPercent = (unlockedUpgrades / totalUpgrades) * 100;

  // --- MINIMIZED VIEW ---
  if (!isOpen) {
    return (
      <button 
        style={styles.minimizedBtn} 
        onClick={() => setIsOpen(true)}
        title="Open Research Lab"
      >
        <div style={styles.iconCircle}>🧬</div>
        <div style={styles.minimizedInfo}>
          <span style={styles.miniLabel}>RESEARCH</span>
          <span style={styles.miniValue}>{gameState.biomass} Bio</span>
        </div>
        <div style={styles.miniProgress}>
          <div style={{...styles.miniBar, width: `${progressPercent}%`}} />
        </div>
      </button>
    );
  }

  // --- MAXIMIZED VIEW ---
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h3 style={styles.title}>RESEARCH LAB</h3>
          <span style={styles.subtitle}>{unlockedUpgrades}/{totalUpgrades} PROTOCOLS ONLINE</span>
        </div>
        <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
      </div>

      <div style={styles.currencyDisplay}>
        <span style={{fontSize: "1.4rem", marginRight: "8px"}}>🧬</span> 
        <span style={{fontSize: "1.2rem", fontWeight: "bold", color: "#10b981"}}>
          {gameState.biomass}
        </span>
        <span style={{fontSize: "0.8rem", color: "#9ca3af", marginLeft: "6px"}}>BIOMASS AVAILABLE</span>
      </div>

      <div style={styles.list}>
        {TECH_TREE.map((tech) => {
          const isUnlocked = hasTech(tech.id);
          const canAfford = gameState.biomass >= tech.cost;

          return (
            <div 
              key={tech.id} 
              style={{
                ...styles.card,
                opacity: isUnlocked ? 0.5 : 1,
                borderColor: isUnlocked ? "#10b981" : canAfford ? "#3b82f6" : "#374151",
                backgroundColor: isUnlocked ? "rgba(16, 185, 129, 0.1)" : "rgba(0,0,0,0.3)"
              }}
            >
              <div style={styles.cardHeader}>
                <span style={styles.techName}>{tech.name}</span>
                {isUnlocked ? (
                  <span style={styles.ownedTag}>ACTIVE</span>
                ) : (
                  <button
                    style={{
                      ...styles.buyButton,
                      backgroundColor: canAfford ? "#2563eb" : "#374151",
                      cursor: canAfford ? "pointer" : "not-allowed",
                      color: canAfford ? "white" : "#9ca3af"
                    }}
                    onClick={() => purchaseTech(tech.id)}
                    disabled={!canAfford}
                  >
                    {tech.cost} 🧬
                  </button>
                )}
              </div>
              <p style={styles.desc}>{tech.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  // Minimized Styles
  minimizedBtn: {
    position: "absolute",
    top: "80px", // Below header
    left: "20px",
    zIndex: 90,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    backdropFilter: "blur(8px)",
    border: "1px solid #374151",
    padding: "10px 16px",
    borderRadius: "30px",
    cursor: "pointer",
    color: "#f3f4f6",
    transition: "all 0.2s",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    textAlign: "left",
  },
  iconCircle: {
    width: "32px",
    height: "32px",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
  },
  minimizedInfo: {
    display: "flex",
    flexDirection: "column",
  },
  miniLabel: {
    fontSize: "0.6rem",
    color: "#9ca3af",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  miniValue: {
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#10b981",
  },
  miniProgress: {
    position: "absolute",
    bottom: "-2px",
    left: "20px",
    right: "20px",
    height: "2px",
    backgroundColor: "#374151",
    borderRadius: "2px",
    overflow: "hidden",
  },
  miniBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },

  // Maximized Styles
  container: {
    position: "absolute",
    top: "20px",
    left: "20px",
    width: "300px",
    maxHeight: "calc(100vh - 40px)",
    backgroundColor: "rgba(17, 24, 39, 0.95)",
    backdropFilter: "blur(16px)",
    border: "1px solid #4b5563",
    borderRadius: "12px",
    padding: "20px",
    color: "#f3f4f6",
    fontFamily: "'Inter', sans-serif",
    zIndex: 100,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    animation: "fade-in 0.2s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    borderBottom: "1px solid #374151",
    paddingBottom: "12px",
  },
  title: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#60a5fa",
  },
  subtitle: {
    fontSize: "0.6rem",
    color: "#9ca3af",
    marginTop: "4px",
    display: "block",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    fontSize: "1.5rem",
    lineHeight: "1",
    cursor: "pointer",
    padding: "0 4px",
  },
  currencyDisplay: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: "10px",
    borderRadius: "8px",
    border: "1px dashed #059669",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
    paddingRight: "4px", // Make room for scrollbar
  },
  card: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "12px",
    transition: "all 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  techName: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#e5e7eb",
  },
  desc: {
    margin: 0,
    fontSize: "0.75rem",
    color: "#9ca3af",
    lineHeight: "1.4",
  },
  buyButton: {
    border: "none",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "6px 12px",
    transition: "transform 0.1s",
  },
  ownedTag: {
    fontSize: "0.6rem",
    fontWeight: "800",
    color: "#10b981",
    letterSpacing: "0.5px",
  }
};