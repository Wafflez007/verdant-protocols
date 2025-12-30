import React, { useState } from "react";

export default function Legend() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={styles.wrapper}>
      {/* TOGGLE BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          ...styles.toggleButton,
          backgroundColor: isOpen ? "rgba(17, 24, 39, 0.8)" : "#10b981", // Dark when open, Bright Green when closed (to attract attention)
          color: isOpen ? "#9ca3af" : "#064e3b",
          borderColor: isOpen ? "#374151" : "#059669"
        }}
      >
        {isOpen ? "MINIMIZE GUIDE" : "FIELD GUIDE 📋"}
      </button>

      {/* THE LEGEND PANEL */}
      {isOpen && (
        <div style={styles.panel} className="legend-panel">
          <div style={styles.header}>
            <h3 style={styles.heading}>ECO-DATABASE</h3>
            <span style={styles.version}>v2.0</span>
          </div>
          
          <div style={styles.contentContainer}>
            {/* SECTION: TERRAIN */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>🗺️</span>
                <h4 style={styles.subHeading}>TERRAIN TYPES</h4>
              </div>
              <div style={styles.grid}>
                <LegendItem color="rgb(100, 100, 100)" label="Toxic Waste" sub="Harmful. Must Scrub." isBad />
                <LegendItem color="hsl(30, 40%, 40%)" label="Barren Soil" sub="Requires Water." />
                <LegendItem color="hsl(100, 60%, 40%)" label="Grassland" sub="Basic Vegetation." />
                <LegendItem color="hsl(120, 70%, 25%)" label="Forest" sub="High Biomass." />
                <LegendItem color="hsl(170, 50%, 35%)" label="Wetland" sub="Filters Pollution." />
                <LegendItem color="hsl(220, 80%, 40%)" label="Water" sub="Source of Life." />
              </div>
            </div>

            <div style={styles.divider} />

            {/* SECTION: FAUNA */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionIcon}>🧬</span>
                <h4 style={styles.subHeading}>FAUNA & FLORA</h4>
              </div>
              <div style={styles.grid}>
                <LegendItem emoji="🐇" label="Rabbit" sub="Herbivore. Spreads seeds." />
                <LegendItem emoji="🐺" label="Wolf" sub="Carnivore. Controls pop." />
                <LegendItem emoji="🐝" label="Bee" sub="Pollinator. Boosts growth." />
              </div>
            </div>
          </div>

          <div style={styles.footer}>
             <span style={styles.tipPrefix}>TIP:</span> Biodiversity increases biomass generation.
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Sub-Component
function LegendItem({ color, emoji, label, sub, isBad }: { color?: string, emoji?: string, label: string, sub?: string, isBad?: boolean }) {
  return (
    <div style={styles.item}>
      <div style={styles.iconContainer}>
        {color && <div style={{ ...styles.swatch, backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />}
        {emoji && <span style={styles.emoji}>{emoji}</span>}
      </div>
      <div style={styles.textCol}>
        <span style={{...styles.label, color: isBad ? "#f87171" : "#e5e7eb"}}>{label}</span>
        {sub && <span style={styles.subLabel}>{sub}</span>}
      </div>
    </div>
  );
}

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    zIndex: 80, // Slightly below TechTree/StatusPanel
    display: "flex",
    flexDirection: "column-reverse", 
    alignItems: "flex-end",
    gap: "12px",
    fontFamily: "'Inter', sans-serif",
    maxWidth: "calc(100vw - 40px)", // Responsive width
  },
  toggleButton: {
    border: "1px solid",
    padding: "8px 16px",
    borderRadius: "20px", // Pill shape
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "1px",
    backdropFilter: "blur(4px)",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    textTransform: "uppercase",
  },
  panel: {
    width: "240px",
    maxWidth: "100%",
    maxHeight: "calc(100vh - 430px)", // Match StatusPanel spacing with margin buffer
    minHeight: "200px",
    backgroundColor: "rgba(17, 24, 39, 0.95)", // Matching dark theme
    backdropFilter: "blur(16px)",
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
    color: "#f3f4f6",
    animation: "slide-up 0.2s ease-out",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #374151",
    paddingBottom: "10px",
    marginBottom: "12px",
  },
  heading: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#60a5fa", 
    letterSpacing: "1px",
    fontWeight: "800",
  },
  version: {
    fontSize: "0.6rem",
    color: "#4b5563",
    fontFamily: "'Courier New', monospace",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
    overflowY: "auto",
    paddingRight: "4px", // For scrollbar
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  sectionIcon: {
    fontSize: "0.8rem",
  },
  subHeading: {
    margin: 0,
    fontSize: "0.65rem",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "700",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  item: {
    display: "flex",
    alignItems: "flex-start", // Align top for multi-line
    gap: "10px",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid transparent",
    transition: "border-color 0.2s",
  },
  iconContainer: {
    marginTop: "2px", // Visual alignment
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "16px",
  },
  swatch: {
    width: "12px",
    height: "12px",
    borderRadius: "2px",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  emoji: {
    fontSize: "0.9rem",
    lineHeight: "1",
  },
  textCol: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: "600",
    lineHeight: "1.2",
  },
  subLabel: {
    fontSize: "0.65rem",
    color: "#6b7280",
    lineHeight: "1.2",
  },
  divider: {
    height: "1px",
    backgroundColor: "#374151",
    margin: "4px 0",
  },
  footer: {
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px dashed #374151",
    fontSize: "0.65rem",
    color: "#9ca3af",
    lineHeight: "1.4",
  },
  tipPrefix: {
    color: "#10b981",
    fontWeight: "bold",
    marginRight: "4px",
  }
};