# 🌱 Verdant Protocols

A browser-based ecological restoration game built with React and TypeScript. Transform polluted wastelands into thriving ecosystems through strategic environmental management.

## 📍 Overview

Players must reduce pollution, manage water distribution, and reintroduce animal species to achieve biodiversity goals across three increasingly challenging levels. Watch nature reclaim degraded lands through dynamic biome succession as tiles evolve from toxic wastelands → barren soil → grasslands → wetlands → forests.

### 🎮 What is this game about?

Transform toxic wastelands into vibrant ecosystems through strategic environmental management:
- **Scrub pollution** from contaminated tiles to reduce toxicity
- **Observe biome succession** as tiles naturally evolve from barren → grass → wetland → forest
- **Manage water flow** and moisture levels to create diverse habitats
- **Introduce wildlife** including herbivores, carnivores, and pollinators
- **Research technologies** to unlock advanced restoration tools
- **Complete level objectives** within time limits while maintaining pollution below thresholds

### 🛠️ Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Styling:** CSS3 with custom animations
- **Canvas Rendering:** HTML5 Canvas for game visuals
- **State Management:** React Hooks (useState, useEffect)
- **Build Tool:** Create React App with react-scripts
- **Testing:** Jest + React Testing Library

## 🚀 Quick Start & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd verdant-protocols
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

The app will automatically reload when you make changes to the source code.

### Additional Scripts

- **Run tests:** `npm test` - Launches the test runner in interactive watch mode
- **Build for production:** `npm run build` - Creates an optimized production build in the `build/` folder
- **Eject configuration:** `npm run eject` - Removes Create React App abstraction (one-way operation)

## ✨ Features

### Progression System
- **🔬 Technology Tree:** Research upgrades to unlock powerful restoration tools
- **🗺️ Multiple Levels:** Three unique maps with distinct challenges:
  - **River Valley:** Polluted waterway restoration
  - **Arid Wasteland:** Desert oasis connectivity
  - **Ancient Forest:** Dense woodland revival
- **🎯 Level Objectives:** Meet biodiversity targets while keeping pollution below maximum thresholds
- **🏆 Win/Loss Conditions:** Strategic resource management determines success

### UI Components
- **Status Panel:** Displays current metrics, timer, and progress
- **Tech Tree:** Visual research interface for unlocking upgrades
- **Legend:** Quick reference for biome types and tile states
- **Level Complete Modal:** Shows results and next level transition
- **Game Canvas:** Main rendering area with interactive tile grid

## 📁 Project Structure

```
verdant-protocols/
├── public/                      # Static assets
│   ├── index.html              # HTML entry point
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots file
├── src/
│   ├── components/             # React UI components
│   │   ├── GameCanvas.tsx      # Main game rendering component
│   │   ├── StatusPanel.tsx     # Metrics and timer display
│   │   ├── TechTree.tsx        # Research tree interface
│   │   ├── Legend.tsx          # Biome legend/reference
│   │   ├── LevelCompleteModal.tsx   # End-of-level UI
│   │   └── IntroductionModal.tsx    # Tutorial/intro screen
│   │
│   ├── game/                   # Core game logic (TypeScript)
│   │   ├── types.ts            # Type definitions (Biome, Tile, Animal)
│   │   ├── gameState.ts        # Central game state management
│   │   ├── levels.ts           # Level configurations and objectives
│   │   ├── grid.ts             # Grid initialization and utilities
│   │   ├── simulation.ts       # Main game loop and updates
│   │   ├── succession.ts       # Biome evolution logic
│   │   ├── neighbors.ts        # Tile neighbor calculations
│   │   ├── animals.ts          # Animal spawning and management
│   │   ├── animalBehavior.ts   # AI movement and interactions
│   │   ├── render.ts           # Canvas drawing functions
│   │   ├── input.ts            # Mouse/keyboard input handling
│   │   ├── scrubber.ts         # Pollution cleaning mechanic
│   │   ├── research.ts         # Technology tree system
│   │   ├── progression.ts      # Level advancement logic
│   │   ├── score.ts            # Biodiversity scoring
│   │   ├── metrics.ts          # Statistics calculation
│   │   ├── goals.ts            # Objective checking
│   │   ├── events.ts           # Random event system
│   │   ├── audio.ts            # Sound and music management
│   │   └── rewilding.ts        # Wildlife introduction logic
│   │
│   ├── App.tsx                 # Root application component
│   ├── App.css                 # Application styles
│   ├── index.tsx               # React entry point
│   ├── index.css               # Global styles
│   ├── react-app-env.d.ts      # TypeScript declarations
│   ├── setupTests.ts           # Test configuration
│   ├── reportWebVitals.ts      # Performance monitoring
│   └── App.test.tsx            # Application tests
│
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── README.md                   # Project documentation
└── TO-DO.txt                   # Development task list
```

### Key Architecture Patterns

- **Component-Based UI:** React components for modular interface elements
- **Separation of Concerns:** Game logic isolated in `game/` directory
- **Event-Driven Communication:** Custom events for level completion and state changes
- **Canvas Rendering:** Direct canvas manipulation for performant tile rendering
- **Modular Game Systems:** Each mechanic (animals, biomes, research) in separate modules

---

Built with ❤️ using React and TypeScript
