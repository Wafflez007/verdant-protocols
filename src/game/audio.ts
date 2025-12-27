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
  
  // TEMPO: Harvest Moon is usually around 120 BPM (Marching tempo)
  private tempo: number = 120; 

  // --- MELODY: "The Village Restored" ---
  // A cheerful C-Major tune inspired by Back to Nature
  // Format: [Frequency, Duration (beats)]
  // 0 frequency = Rest
  private townMelody = [
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

  constructor() {
    // Lazy init
  }

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

  // --- 2. BGM: "BACK TO NATURE" STYLE ---
  startAmbience() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    
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

    const [freq, beats] = this.townMelody[this.noteIndex];
    const duration = (60 / this.tempo) * beats;
    
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
    this.noteIndex = (this.noteIndex + 1) % this.townMelody.length;
    this.nextNoteTime += duration;
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