/**
 * Square vs. Sine Wave Explorer
 *
 * An interactive p5.js sketch for the Physical Computing textbook
 * (https://makeabilitylab.github.io/physcomp/) that lets students
 * hear and visualize the difference between square and sine waves
 * at different frequencies.
 *
 * Uses p5.sound's oscillator for audio generation and p5's drawing
 * API to render a real-time waveform visualization.
 *
 * The waveform is displayed as a unipolar signal (0V to +V), matching
 * the Arduino's actual digital output. The number of visible cycles
 * increases subtly with frequency (2 at 20 Hz, 6 at 2000 Hz) so
 * students can see the relationship between frequency and wave
 * compression without losing waveform shape readability.
 *
 * Made by Jon Froehlich, Gemini Pro 3.1, and Claude Code Opus 4.6
 *
 */

// --- Audio ---
let osc;
let isPlaying = false;

// --- Controls (p5 DOM elements) ---
let freqSlider;
let waveToggle; // 0 = sine, 1 = square
let playButton;
let freqReadout; // displays current Hz and note name

// --- Frequency range ---
const MIN_FREQ = 20;
const MAX_FREQ = 2000;
const DEFAULT_FREQ = 440; // Concert A

// --- Waveform drawing ---
const MIN_CYCLES = 2;   // visible cycles at MIN_FREQ
const MAX_CYCLES = 6;   // visible cycles at MAX_FREQ
const SINE_SAMPLES = 300;

// --- Layout ---
const PADDING = 20;
const CANVAS_HEIGHT = 340;

// --- Colors (accessible, textbook-friendly) ---
const COLOR_SINE = [41, 121, 255];     // blue
const COLOR_SQUARE = [220, 60, 60];    // red
const COLOR_BG = [250, 250, 250];
const COLOR_AXIS = [180, 180, 180];
const COLOR_TEXT = [40, 40, 40];
const COLOR_TEXT_SECONDARY = [100, 100, 100];

/**
 * Shared inline styles for control rows.
 * Using explicit inline styles ensures visibility in any p5 editor theme
 * or iframe context, since we can't rely on external CSS.
 */
const STYLE_ROW = 'display:flex; align-items:center; gap:10px; ' +
                  'margin-bottom:6px; font-family:monospace; font-size:13px;';
const STYLE_LABEL = 'width:90px; text-align:right; flex-shrink:0; ' +
                    'color:#333; font-size:13px; font-family:monospace;';
const STYLE_READOUT = 'min-width:110px; font-size:12px; color:#555; ' +
                      'flex-shrink:0; font-family:monospace;';
const STYLE_TOGGLE_LABEL = 'font-size:12px; flex-shrink:0; font-family:monospace;';
const STYLE_BTN = 'margin-left:auto; font-size:14px; font-family:monospace; ' +
                  'padding:6px 16px; cursor:pointer; border:1px solid #999; ' +
                  'border-radius:4px; background:#fff; color:#333;';

function setup() {
  let cnv = createCanvas(min(windowWidth, 800), CANVAS_HEIGHT);

  textFont('monospace');

  // --- Oscillator (starts stopped) ---
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.freq(DEFAULT_FREQ);
  osc.start();

  // --- Build controls container beneath the canvas ---
  // Everything is created via p5 DOM and parented to a wrapper div
  // so it flows naturally below the canvas in the p5 editor.
  let controlsWrapper = createDiv();
  controlsWrapper.style('padding', '10px 4px 4px');
  controlsWrapper.style('max-width', '800px');

  // --- Row 1: Frequency ---
  let freqRow = createDiv();
  freqRow.style(STYLE_ROW);
  freqRow.parent(controlsWrapper);

  let freqLabel = createSpan('Frequency:');
  freqLabel.style(STYLE_LABEL);
  freqLabel.parent(freqRow);

  freqSlider = createSlider(MIN_FREQ, MAX_FREQ, DEFAULT_FREQ, 1);
  freqSlider.style('flex', '1');
  freqSlider.style('min-width', '100px');
  freqSlider.parent(freqRow);
  freqSlider.attribute('aria-label', 'Frequency in Hertz');

  freqReadout = createSpan('440 Hz ≈ A4');
  freqReadout.style(STYLE_READOUT);
  freqReadout.parent(freqRow);

  // --- Row 2: Wave type + Play ---
  let waveRow = createDiv();
  waveRow.style(STYLE_ROW);
  waveRow.parent(controlsWrapper);

  let waveLabel = createSpan('Wave type:');
  waveLabel.style(STYLE_LABEL);
  waveLabel.parent(waveRow);

  let sineLabel = createSpan('Sine');
  sineLabel.style(STYLE_TOGGLE_LABEL);
  sineLabel.style('color', '#2979ff');
  sineLabel.parent(waveRow);

  waveToggle = createSlider(0, 1, 0, 1);
  waveToggle.style('width', '50px');
  waveToggle.style('flex-shrink', '0');
  waveToggle.parent(waveRow);
  waveToggle.attribute('aria-label', 'Wave type: sine or square');

  let squareLabel = createSpan('Square');
  squareLabel.style(STYLE_TOGGLE_LABEL);
  squareLabel.style('color', '#dc3c3c');
  squareLabel.parent(waveRow);

  playButton = createButton('▶ Play');
  playButton.style(STYLE_BTN);
  playButton.parent(waveRow);
  playButton.mousePressed(togglePlay);
  playButton.attribute('aria-label', 'Play or stop the tone');
}

function windowResized() {
  resizeCanvas(min(windowWidth, 800), CANVAS_HEIGHT);
}

function togglePlay() {
  if (isPlaying) {
    osc.amp(0, 0.05);
    isPlaying = false;
    playButton.html('▶ Play');
  } else {
    // p5.sound requires a user gesture to start the AudioContext
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
    osc.amp(0.3, 0.05);
    isPlaying = true;
    playButton.html('⏹ Stop');
  }
}

function draw() {
  background(COLOR_BG);

  // --- Update oscillator from controls ---
  let freq = freqSlider.value();
  let isSquare = waveToggle.value() === 1;
  let waveType = isSquare ? 'square' : 'sine';

  // Crossfade when switching wave type to avoid pop/overlap
  if (osc.getType() !== waveType) {
    if (isPlaying) {
      osc.amp(0, 0.02);
      setTimeout(() => {
        osc.setType(waveType);
        osc.amp(0.3, 0.02);
      }, 30);
    } else {
      osc.setType(waveType);
    }
  }
  osc.freq(freq);

  // --- Update frequency readout ---
  let noteName = frequencyToNoteName(freq);
  let readoutText = freq + ' Hz';
  if (noteName) {
    readoutText += ' ≈ ' + noteName;
  }
  freqReadout.html(readoutText);

  let waveColor = isSquare ? COLOR_SQUARE : COLOR_SINE;

  // --- Waveform area (unipolar: 0V at bottom, +V at top) ---
  let topMargin = 30;
  let bottomMargin = 20;
  let waveTop = topMargin;
  let waveBottom = height - bottomMargin;
  let waveHeight = waveBottom - waveTop;
  let drawWidth = width - PADDING * 2;

  // Dynamic cycles: subtle visual compression as frequency increases.
  // Bounded to MIN_CYCLES..MAX_CYCLES so shape stays readable.
  let cyclesToShow = map(freq, MIN_FREQ, MAX_FREQ, MIN_CYCLES, MAX_CYCLES);

  // --- 0V baseline (solid) ---
  stroke(COLOR_AXIS);
  strokeWeight(1);
  line(PADDING, waveBottom, width - PADDING, waveBottom);

  // --- +V gridline (dashed) ---
  stroke(COLOR_AXIS[0], COLOR_AXIS[1], COLOR_AXIS[2], 80);
  strokeWeight(0.5);
  drawingContext.setLineDash([4, 4]);
  line(PADDING, waveTop, width - PADDING, waveTop);
  drawingContext.setLineDash([]);

  // --- Axis labels ---
  noStroke();
  fill(COLOR_TEXT_SECONDARY);
  textSize(11);
  textStyle(NORMAL);
  textAlign(RIGHT, CENTER);
  text('+V', PADDING - 4, waveTop);
  text('0V', PADDING - 4, waveBottom);

  // --- Draw the waveform ---
  stroke(waveColor);
  strokeWeight(2.5);
  noFill();

  if (isSquare) {
    // Corner-based drawing for perfectly crisp vertical edges.
    // Each cycle: two vertices at +V (HIGH), two at 0V (LOW).
    let periodWidth = drawWidth / cyclesToShow;
    beginShape();
    for (let i = 0; i < Math.ceil(cyclesToShow); i++) {
      let startX = PADDING + i * periodWidth;
      let midX = min(startX + periodWidth / 2, width - PADDING);
      let endX = min(startX + periodWidth, width - PADDING);

      // HIGH state (+V)
      if (i === 0) {
        vertex(startX, waveTop);
      } else {
        vertex(startX, waveTop);
      }
      vertex(midX, waveTop);

      // LOW state (instant drop to 0V)
      vertex(midX, waveBottom);
      vertex(endX, waveBottom);
    }
    endShape();
  } else {
    // Sine wave (unipolar: 0.5 + 0.5*sin, range 0..1)
    beginShape();
    for (let i = 0; i <= SINE_SAMPLES; i++) {
      let t = i / SINE_SAMPLES;
      let val = 0.5 + 0.5 * sin(t * cyclesToShow * TWO_PI);
      let x = PADDING + t * drawWidth;
      let y = waveBottom - val * waveHeight;
      vertex(x, y);
    }
    endShape();
  }

  // --- Wave type label (top-left of canvas) ---
  noStroke();
  fill(waveColor);
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT, TOP);
  let waveLabel = isSquare ? '■ Square Wave' : '∿ Sine Wave';
  text(waveLabel, PADDING, 8);

  // --- Playing indicator (top-right of canvas) ---
  if (isPlaying) {
    fill(60, 180, 75);
    textSize(12);
    textStyle(NORMAL);
    textAlign(RIGHT, TOP);
    text('🔊 Playing', width - PADDING, 8);
  }
}

/**
 * Maps a frequency to the nearest musical note name.
 * Returns null if the frequency is below C1 or above B8,
 * or if the frequency is not close enough to a named note
 * (within ~30 cents).
 *
 * @param {number} freq - frequency in Hz
 * @returns {string|null} note name like "A4" or "C#5", or null
 */
function frequencyToNoteName(freq) {
  if (freq < 32.7 || freq > 7902) return null;

  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F',
                       'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Semitones from A4 (440 Hz)
  let semitones = 12 * Math.log2(freq / 440);
  let rounded = Math.round(semitones);

  // Check if close enough to a named note (within ~30 cents)
  if (Math.abs(semitones - rounded) > 0.3) return null;

  // A4 is index 9 in octave 4
  let noteIndex = ((rounded % 12) + 12 + 9) % 12;
  let octave = 4 + Math.floor((rounded + 9) / 12);

  return NOTE_NAMES[noteIndex] + octave;
}