class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // --- SPRAYER STATE ---
  private scrubOsc: OscillatorNode | null = null;
  private scrubGain: GainNode | null = null;
  private scrubLfo: OscillatorNode | null = null;
  private isScrubbingPlaying: boolean = false;

  // --- MUSIC STATE ---
  private nextNoteTime: number = 0;
  private isMusicPlaying: boolean = false;
  private melodyTimeout: number | null = null;
  private noteIndex = 0;
  private currentLevelMelody: number = 0; // Track which level's melody is playing
  
  // --- MELODIES FOR EACH LEVEL ---
  // Format: [Frequency, Duration (beats)]
  // 0 frequency = Rest
  
  // LEVEL 0: "The Village Restored" (River Valley)
  // A cheerful C-Major tune inspired by Harvest Moon: Back to Nature
  // Tempo: 120 BPM (Marching tempo)
  private melodyLevel0: [number, number][] = [
    // INTRO (Fanfare-ish)
    [523.25, 0.5], [659.25, 0.5], [783.99, 1],    // C - E - G
    [523.25, 0.5], [659.25, 0.5], [783.99, 1],    // C - E - G
    [880.00, 0.5], [783.99, 0.5], [698.46, 0.5], [659.25, 0.5], // A - G - F - E
    [587.33, 2], // D (Hold)

    // MAIN THEME (Bouncy!)
    [523.25, 1], [392.00, 0.5], [523.25, 0.5], // C - G(low) - C
    [659.25, 1], [523.25, 1],                  // E - C
    [587.33, 0.5], [659.25, 0.5], [698.46, 1], // D - E - F
    [659.25, 0.5], [587.33, 0.5], [523.25, 1], // E - D - C

    [392.00, 1], [523.25, 1],                  // G(low) - C
    [659.25, 1.5], [783.99, 0.5],              // E - G
    [880.00, 1], [783.99, 1],                  // A - G
    [587.33, 2],                               // D (Hold)
    
    // REPEAT LOOP
    [523.25, 1], [659.25, 1],                  // C - E
    [783.99, 1], [1046.50, 1],                 // G - C(high)
    [880.00, 0.5], [1046.50, 0.5], [880.00, 1],// A - C - A
    [783.99, 2],                               // G (Hold)
    
    [0, 1], // Rest before loop
  ];

  // LEVEL 1: "Valley Dawn" (Arid Wasteland)
  // A gentle, pastoral tune inspired by Stardew Valley Overture
  // Tempo: 90 BPM (Contemplative)
  private melodyLevel1: [number, number][] = [
    // INTRO - Gentle awakening
    [392.00, 2],   // G (soft start)
    [440.00, 1],   // A
    [493.88, 1],   // B
    [523.25, 2],   // C (hold)
    [0, 0.5],      // Rest
    
    // VERSE 1 - Morning theme
    [659.25, 1.5], // E
    [587.33, 0.5], // D
    [523.25, 1],   // C
    [587.33, 1],   // D
    [659.25, 2],   // E (hold)
    [0, 0.5],      // Rest
    
    [783.99, 1],   // G
    [659.25, 1],   // E
    [587.33, 1],   // D
    [523.25, 1],   // C
    [493.88, 2],   // B (hold)
    [0, 0.5],      // Rest
    
    // VERSE 2 - Building up
    [523.25, 1],   // C
    [587.33, 1],   // D
    [659.25, 1.5], // E
    [698.46, 0.5], // F
    [783.99, 2],   // G (hold)
    [0, 0.5],      // Rest
    
    [880.00, 1],   // A
    [783.99, 1],   // G
    [659.25, 1],   // E
    [587.33, 1],   // D
    [523.25, 3],   // C (long hold)
    [0, 1],        // Rest
    
    // BRIDGE - Contemplative
    [392.00, 1],   // G (lower)
    [440.00, 1],   // A
    [493.88, 1],   // B
    [523.25, 1],   // C
    [587.33, 2],   // D (hold)
    [523.25, 2],   // C (hold)
    [0, 0.5],      // Rest
    
    // OUTRO - Settling down
    [659.25, 1.5], // E
    [587.33, 0.5], // D
    [523.25, 2],   // C
    [493.88, 1],   // B
    [440.00, 1],   // A
    [392.00, 3],   // G (peaceful end)
    [0, 2],        // Long rest before loop
  ];

  // LEVEL 2: "Maple Memories" (Ancient Forest)
  // An adventurous, nostalgic tune inspired by MapleStory Login Theme
  // Tempo: 110 BPM (Upbeat adventure)
  private melodyLevel2: [number, number][] = [
    // INTRO - Iconic opening
    [659.25, 0.5], // E
    [783.99, 0.5], // G
    [880.00, 1],   // A (hold)
    [783.99, 0.5], // G
    [659.25, 0.5], // E
    [523.25, 1],   // C
    [587.33, 2],   // D (hold)
    [0, 0.5],      // Rest
    
    // VERSE 1 - Adventurous melody
    [523.25, 0.5], // C
    [587.33, 0.5], // D
    [659.25, 0.75],// E
    [698.46, 0.25],// F
    [783.99, 1],   // G
    [880.00, 1],   // A
    [783.99, 0.5], // G
    [659.25, 0.5], // E
    [587.33, 1.5], // D (hold)
    [0, 0.5],      // Rest
    
    // Repeat motif
    [659.25, 0.5], // E
    [783.99, 0.5], // G
    [880.00, 1],   // A
    [1046.50, 0.5],// C (high)
    [880.00, 0.5], // A
    [783.99, 1],   // G
    [659.25, 2],   // E (hold)
    [0, 0.5],      // Rest
    
    // BRIDGE - Nostalgic section
    [523.25, 1],   // C
    [659.25, 1],   // E
    [587.33, 1],   // D
    [523.25, 1],   // C
    [493.88, 1.5], // B
    [440.00, 0.5], // A
    [493.88, 2],   // B (hold)
    [0, 0.5],      // Rest
    
    // CHORUS - Uplifting
    [783.99, 0.5], // G
    [880.00, 0.5], // A
    [1046.50, 1],  // C (high)
    [880.00, 0.5], // A
    [783.99, 0.5], // G
    [659.25, 1],   // E
    [783.99, 1],   // G
    [880.00, 2],   // A (hold)
    [0, 0.5],      // Rest
    
    // Building up
    [659.25, 0.5], // E
    [783.99, 0.5], // G
    [880.00, 0.5], // A
    [1046.50, 0.5],// C (high)
    [1174.66, 1],  // D (high)
    [1046.50, 1],  // C (high)
    [880.00, 1],   // A
    [783.99, 1],   // G
    [659.25, 2],   // E (long hold)
    [0, 1],        // Rest
    
    // OUTRO - Settling with hope
    [523.25, 1],   // C
    [587.33, 1],   // D
    [659.25, 1.5], // E
    [587.33, 0.5], // D
    [523.25, 3],   // C (peaceful end)
    [0, 2],        // Long rest before loop
  ];

  // Tempo for each level
  private tempos = [120, 90, 110]; // Level 0: 120 BPM, Level 1: 90 BPM, Level 2: 110 BPM

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3; // Master volume
    this.masterGain.connect(this.ctx.destination);
  }

  // --- 1. SFX: BUBBLE BEAM (Updated to preferred sound) ---
  // Replaces the "Hissing" noise with a bubbly water stream
  startScrubSound() {
    if (!this.ctx || this.isScrubbingPlaying) return;
    this.isScrubbingPlaying = true;
    const now = this.ctx.currentTime;

    // 1. The "Bubble" Tone (Sine wave)
    this.scrubOsc = this.ctx.createOscillator();
    this.scrubOsc.type = "sine";
    this.scrubOsc.frequency.setValueAtTime(400, now);
    
    // 2. The "Wobble" LFO (Makes it sound like glug-glug-glug)
    this.scrubLfo = this.ctx.createOscillator();
    this.scrubLfo.type = "sine";
    this.scrubLfo.frequency.value = 15; // Fast wobble

    // 3. Connect LFO to Frequency (Vibrato)
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 100; // How deep the wobble is
    this.scrubLfo.connect(lfoGain);
    lfoGain.connect(this.scrubOsc.frequency);

    // 4. Volume Envelope
    this.scrubGain = this.ctx.createGain();
    this.scrubGain.gain.setValueAtTime(0, now);
    this.scrubGain.gain.linearRampToValueAtTime(0.15, now + 0.1);

    // Connect chain
    this.scrubOsc.connect(this.scrubGain);
    this.scrubGain.connect(this.masterGain!);

    this.scrubOsc.start(now);
    this.scrubLfo.start(now);
  }

  stopScrubSound() {
    if (!this.scrubOsc || !this.isScrubbingPlaying) return;
    const now = this.ctx!.currentTime;
    
    // Smooth fade out
    this.scrubGain?.gain.linearRampToValueAtTime(0, now + 0.15);
    this.scrubOsc.stop(now + 0.15);
    this.scrubLfo?.stop(now + 0.15);
    
    this.isScrubbingPlaying = false;
    this.scrubOsc = null;
  }

  // --- 2. BGM: LEVEL-SPECIFIC MUSIC ---
  startAmbience(levelIndex: number = 0) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    // If already playing the same level's music, don't restart
    if (this.isMusicPlaying && this.currentLevelMelody === levelIndex) return;
    
    // Stop current music if playing different level
    if (this.isMusicPlaying && this.currentLevelMelody !== levelIndex) {
      this.stopAmbience();
    }

    this.currentLevelMelody = levelIndex;
    this.isMusicPlaying = true;
    this.noteIndex = 0; // Reset to start of melody
    
    // Start slighty in the future to avoid glitches
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.scheduler();
  }

  stopAmbience() {
      this.isMusicPlaying = false;
      if (this.melodyTimeout) window.clearTimeout(this.melodyTimeout);
  }

  private scheduler() {
    if (!this.ctx || !this.isMusicPlaying) return;

    // Schedule ahead: Look 0.1 seconds into the future
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.playStep();
    }

    // Check again in 25ms
    this.melodyTimeout = window.setTimeout(() => this.scheduler(), 25);
  }

  private playStep() {
    if (!this.ctx) return;

    // Get the current level's melody
    const currentMelody = this.getCurrentMelody();
    if (!currentMelody || currentMelody.length === 0) {
      // No melody for this level, stop playing
      this.stopAmbience();
      return;
    }

    const [freq, beats] = currentMelody[this.noteIndex];
    const tempo = this.tempos[this.currentLevelMelody] || 100;
    const duration = (60 / tempo) * beats;
    
    // --- VOICE 1: THE FLUTE (Melody) ---
    if (freq > 0) { 
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Triangle wave sounds like a flute/ocarina
        osc.type = "triangle"; 
        osc.frequency.value = freq;

        // Soft Attack, Full Sustain, Soft Release
        gain.gain.setValueAtTime(0, this.nextNoteTime);
        gain.gain.linearRampToValueAtTime(0.15, this.nextNoteTime + 0.05);
        gain.gain.setValueAtTime(0.15, this.nextNoteTime + duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, this.nextNoteTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(this.nextNoteTime);
        osc.stop(this.nextNoteTime + duration);
    }

    // --- VOICE 2: THE "OOM-PAH" BASS (Rhythm) ---
    // Every beat, play a short bass pluck to simulate the town march feel
    // We alternate bass notes: Root (C) then Fifth (G)
    if (this.noteIndex % 2 === 0) { // Play on every note event for now
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        
        bassOsc.type = "triangle";
        // Alternate bass note based on index: Low C (130Hz) vs Low G (98Hz)
        bassOsc.frequency.value = (this.noteIndex % 4 === 0) ? 130.81 : 98.00; 

        // Short, plucky envelope (Pizzicato string / Tuba)
        bassGain.gain.setValueAtTime(0.1, this.nextNoteTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, this.nextNoteTime + 0.2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain!);
        bassOsc.start(this.nextNoteTime);
        bassOsc.stop(this.nextNoteTime + 0.2);
    }
    
    // Advance loop
    const melody = this.getCurrentMelody();
    if (melody) {
      this.noteIndex = (this.noteIndex + 1) % melody.length;
    }
    this.nextNoteTime += duration;
  }

  // Helper to get the current level's melody
  private getCurrentMelody(): [number, number][] | null {
    switch (this.currentLevelMelody) {
      case 0: return this.melodyLevel0;
      case 1: return this.melodyLevel1;
      case 2: return this.melodyLevel2;
      default: return this.melodyLevel0;
    }
  }

  // --- 3. SFX: VICTORY CHIME ---
  playWinSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Fast arpeggio up
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 1);
    });
  }
}

export const audioManager = new SoundManager();