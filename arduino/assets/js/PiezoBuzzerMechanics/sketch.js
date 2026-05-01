/**
 * Piezoelectric Buzzer Mechanics
 *
 * An interactive p5.js visualization for the Physical Computing textbook
 * (https://makeabilitylab.github.io/physcomp/tone) that shows how a piezo
 * buzzer works: a ceramic disk bonded to a metal plate flexes when
 * voltage is applied, pushing air to create sound waves.
 *
 * Two modes:
 *   - Manual: drag a voltage slider (0-5V) to see the disk bend
 *   - Pulse (Tone): automatic square wave at adjustable frequency,
 *     showing continuous flexing with sound wave arcs
 *
 * Usage: Paste into the p5.js web editor and embed via iframe.
 *
 * Made by Jon Froehlich, Gemini Pro 3.1, and Claude Code Opus 4.6
 */

// --- Mode ---
let mode = 'pulse'; // 'manual' or 'pulse'

// --- Manual mode state ---
let manualVoltage = 0; // 0..5

// --- Pulse mode state ---
let toneFreqSlider;
let toneFreq = 1; // Hz (visual range for animation)
let pulsePhase = 0;

// --- Voltage trace ---
const TRACE_LENGTH = 200;
let voltageTrace = [];

// --- Controls ---
let manualBtn, pulseBtn;
let voltageSlider;
let freqSlider;
let freqReadout, voltageReadout;

// --- Layout ---
const CANVAS_HEIGHT = 480;
const PADDING = 20;

// --- Disk geometry ---
const DISK_WIDTH_FRAC = 0.55;  // fraction of canvas width
const DISK_Y_FRAC = 0.38;     // vertical center of disk area
const MAX_BEND = 25;          // max pixel deflection at 5V

// --- Sound wave arcs ---
let soundWaves = []; // {x, y, radius, alpha}

// --- Colors (light theme, textbook-friendly) ---
const COL_BG = '#fafafa';
const COL_METAL = '#9e9e9e';
const COL_METAL_EDGE = '#757575';
const COL_CERAMIC = '#5c7cba';
const COL_CERAMIC_EDGE = '#3d5a99';
const COL_MOUNT_LEFT = '#666';
const COL_MOUNT_RIGHT = '#666';
const COL_DASHED = '#bbb';
const COL_TRACE_LINE = '#2979ff';
const COL_TRACE_GRID = '#e0e0e0';
const COL_TRACE_AXIS = '#999';
const COL_TEXT = '#333';
const COL_TEXT_SEC = '#777';
const COL_SOUND_WAVE = [41, 121, 255]; // blue arcs
const COL_BOLT = [76, 175, 80]; // green for voltage bolts
const COL_ACTIVE_BTN = '#2979ff';
const COL_INACTIVE_BTN = '#ddd';

// --- Inline styles ---
const STYLE_ROW = 'display:flex; align-items:center; gap:10px; ' +
  'margin-bottom:6px; font-family:monospace; font-size:13px; color:#333;';
const STYLE_LABEL = 'width:105px; text-align:right; flex-shrink:0; ' +
  'color:#333; font-size:13px; font-family:monospace;';
const STYLE_READOUT = 'min-width:45px; font-size:13px; color:#555; ' +
  'flex-shrink:0; font-family:monospace; font-weight:bold;';
const STYLE_BTN = 'font-size:13px; font-family:monospace; padding:5px 14px; ' +
  'cursor:pointer; border:1px solid #999; border-radius:4px; color:#333;';

function setup() {
  let cnv = createCanvas(min(windowWidth, 800), CANVAS_HEIGHT);
  textFont('monospace');

  // Initialize voltage trace
  for (let i = 0; i < TRACE_LENGTH; i++) {
    voltageTrace.push(0);
  }

  // --- Build controls ---
  let controlsWrapper = createDiv();
  controlsWrapper.style('padding', '10px 4px 4px');
  controlsWrapper.style('max-width', '800px');

  // Row 1: Mode toggle
  let modeRow = createDiv();
  modeRow.style(STYLE_ROW);
  modeRow.parent(controlsWrapper);

  let modeLabel = createSpan('Mode:');
  modeLabel.style(STYLE_LABEL);
  modeLabel.parent(modeRow);

  manualBtn = createButton('Manual');
  manualBtn.style(STYLE_BTN);
  manualBtn.style('background', COL_INACTIVE_BTN);
  manualBtn.parent(modeRow);
  manualBtn.mousePressed(() => setMode('manual'));
  manualBtn.attribute('aria-label', 'Switch to manual DC voltage mode');

  pulseBtn = createButton('Pulse (Tone)');
  pulseBtn.style(STYLE_BTN);
  pulseBtn.style('background', COL_ACTIVE_BTN);
  pulseBtn.style('color', '#fff');
  pulseBtn.parent(modeRow);
  pulseBtn.mousePressed(() => setMode('pulse'));
  pulseBtn.attribute('aria-label', 'Switch to pulse tone mode');

  // Spacer
  let spacer1 = createSpan('');
  spacer1.style('flex', '1');
  spacer1.parent(modeRow);

  // State readout in mode row
  let stateLabel = createSpan('');
  stateLabel.attribute('id', 'state-readout');
  stateLabel.style('font-size:12px; color:#555; font-family:monospace; flex-shrink:0;');
  stateLabel.parent(modeRow);

  // Row 2: DC Voltage (Manual mode) / Tone Freq (Pulse mode)
  let paramRow = createDiv();
  paramRow.style(STYLE_ROW);
  paramRow.parent(controlsWrapper);

  let paramLabel = createSpan('DC Voltage:');
  paramLabel.attribute('id', 'param-label');
  paramLabel.style(STYLE_LABEL);
  paramLabel.parent(paramRow);

  voltageSlider = createSlider(0, 50, 0, 1); // 0..50 maps to 0.0..5.0V
  voltageSlider.style('flex', '1');
  voltageSlider.style('min-width', '100px');
  voltageSlider.parent(paramRow);
  voltageSlider.attribute('aria-label', 'DC Voltage 0 to 5 volts');

  freqSlider = createSlider(1, 20, 1, 1);
  freqSlider.style('flex', '1');
  freqSlider.style('min-width', '100px');
  freqSlider.parent(paramRow);
  freqSlider.attribute('aria-label', 'Tone frequency in Hertz');

  let paramReadout = createSpan('0.0V');
  paramReadout.attribute('id', 'param-readout');
  paramReadout.style(STYLE_READOUT);
  paramReadout.parent(paramRow);

  updateControlVisibility();
}

function setMode(m) {
  mode = m;
  // Reset trace
  for (let i = 0; i < TRACE_LENGTH; i++) {
    voltageTrace[i] = 0;
  }
  pulsePhase = 0;
  soundWaves = [];
  if (mode === 'manual') {
    manualVoltage = 0;
    voltageSlider.value(0);
  }
  updateControlVisibility();
}

function updateControlVisibility() {
  if (mode === 'manual') {
    manualBtn.style('background', COL_ACTIVE_BTN);
    manualBtn.style('color', '#fff');
    pulseBtn.style('background', COL_INACTIVE_BTN);
    pulseBtn.style('color', '#333');
    voltageSlider.show();
    freqSlider.hide();
    select('#param-label').html('DC Voltage:');
  } else {
    pulseBtn.style('background', COL_ACTIVE_BTN);
    pulseBtn.style('color', '#fff');
    manualBtn.style('background', COL_INACTIVE_BTN);
    manualBtn.style('color', '#333');
    voltageSlider.hide();
    freqSlider.show();
    select('#param-label').html('Tone Freq (Hz):');
  }
}

function windowResized() {
  resizeCanvas(min(windowWidth, 800), CANVAS_HEIGHT);
}

function draw() {
  background(COL_BG);

  // --- Compute current voltage ---
  let currentVoltage = 0;
  if (mode === 'manual') {
    manualVoltage = voltageSlider.value() / 10.0; // 0..5.0
    currentVoltage = manualVoltage;
  } else {
    toneFreq = freqSlider.value();
    pulsePhase += (toneFreq / 60.0); // advance phase each frame at 60fps
    if (pulsePhase >= 1.0) pulsePhase -= 1.0;
    currentVoltage = pulsePhase < 0.5 ? 5 : 0;
  }

  // Push to trace
  voltageTrace.push(currentVoltage);
  if (voltageTrace.length > TRACE_LENGTH) {
    voltageTrace.shift();
  }

  // --- Update readouts ---
  let paramReadout = select('#param-readout');
  let stateReadout = select('#state-readout');
  if (mode === 'manual') {
    paramReadout.html(manualVoltage.toFixed(1) + 'V');
    let deformState = manualVoltage < 0.1 ? 'Neutral' : 'Bending';
    stateReadout.html('State: Manual · ' + manualVoltage.toFixed(1) +
                       'V · ' + deformState);
  } else {
    paramReadout.html(toneFreq + ' Hz');
    let deformState = currentVoltage > 2.5 ? 'Bending' : 'Neutral';
    stateReadout.html('State: Pulse · ' + (currentVoltage > 2.5 ? '5' : '0') +
                       'V · ' + deformState);
  }

  // --- Compute bend amount ---
  let bendFrac = currentVoltage / 5.0; // 0..1
  let bendPx = bendFrac * MAX_BEND;

  // --- Disk geometry ---
  let diskCX = width / 2;
  let diskCY = height * DISK_Y_FRAC;
  let diskW = width * DISK_WIDTH_FRAC;
  let diskHalfW = diskW / 2;
  let metalThick = 6;
  let ceramicThick = 8;
  let mountW = 14;
  let mountH = 30;

  // --- Draw title ---
  noStroke();
  fill(COL_TEXT);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Piezoelectric Buzzer Mechanics', PADDING, 10);
  textStyle(NORMAL);

  // --- Draw mounting brackets ---
  fill(COL_MOUNT_LEFT);
  noStroke();
  // Left mount
  let mountLX = diskCX - diskHalfW - mountW / 2;
  rect(mountLX, diskCY - mountH / 2, mountW, mountH, 2);
  // Right mount
  let mountRX = diskCX + diskHalfW - mountW / 2;
  rect(mountRX, diskCY - mountH / 2, mountW, mountH, 2);

  // --- Draw dashed rest position outline ---
  stroke(COL_DASHED);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  // Metal plate rest (flat line)
  line(diskCX - diskHalfW, diskCY, diskCX + diskHalfW, diskCY);
  // Ceramic rest (flat line above)
  line(diskCX - diskHalfW * 0.75, diskCY - metalThick / 2 - ceramicThick / 2,
       diskCX + diskHalfW * 0.75, diskCY - metalThick / 2 - ceramicThick / 2);
  drawingContext.setLineDash([]);

  // --- Draw bent metal plate ---
  noFill();
  stroke(COL_METAL_EDGE);
  strokeWeight(2);
  // Metal plate as a bent curve (quadratic bezier)
  // Endpoints are at the mounts (fixed), control point moves up
  let metalY = diskCY;
  let metalBendY = diskCY - bendPx;

  // Draw filled metal plate shape
  fill(COL_METAL);
  stroke(COL_METAL_EDGE);
  strokeWeight(1.5);
  beginShape();
  // Top edge (bent)
  vertex(diskCX - diskHalfW, metalY - metalThick / 2);
  quadraticVertex(diskCX, metalBendY - metalThick / 2 - bendPx * 0.3,
                  diskCX + diskHalfW, metalY - metalThick / 2);
  // Bottom edge (bent, offset by thickness)
  vertex(diskCX + diskHalfW, metalY + metalThick / 2);
  quadraticVertex(diskCX, metalBendY + metalThick / 2 - bendPx * 0.3,
                  diskCX - diskHalfW, metalY + metalThick / 2);
  endShape(CLOSE);

  // --- Draw bent ceramic layer ---
  let ceramicW = diskHalfW * 0.75;
  let ceramicTopY = metalY - metalThick / 2;
  let ceramicBendTopY = metalBendY - metalThick / 2 - bendPx * 0.3;

  fill(COL_CERAMIC);
  stroke(COL_CERAMIC_EDGE);
  strokeWeight(1.5);
  beginShape();
  // Bottom edge follows metal plate top curve
  vertex(diskCX - ceramicW, ceramicTopY);
  quadraticVertex(diskCX, ceramicBendTopY,
                  diskCX + ceramicW, ceramicTopY);
  // Top edge offset by ceramic thickness, also bent
  vertex(diskCX + ceramicW, ceramicTopY - ceramicThick);
  quadraticVertex(diskCX, ceramicBendTopY - ceramicThick,
                  diskCX - ceramicW, ceramicTopY - ceramicThick);
  endShape(CLOSE);

  // --- Labels ---
  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);

  // Ceramic label
  let ceramicLabelY = ceramicBendTopY - ceramicThick - 14;
  text('CERAMIC LAYER', diskCX, ceramicLabelY);
  // Small line from label to ceramic
  stroke(COL_TEXT_SEC);
  strokeWeight(0.8);
  line(diskCX, ceramicLabelY + 2, diskCX, ceramicBendTopY - ceramicThick - 2);

  // Metal label
  noStroke();
  fill(COL_TEXT);
  textAlign(CENTER, TOP);
  let metalLabelY = metalY + metalThick / 2 + 8 +
                    (bendPx < 3 ? 0 : -bendPx * 0.15);
  text('METAL PLATE', diskCX, metalLabelY);
  stroke(COL_TEXT_SEC);
  strokeWeight(0.8);
  line(diskCX, metalLabelY - 2, diskCX, metalY + metalThick / 2 + 2);

  // --- Voltage bolt icons ---
  noStroke();
  let boltAlpha = map(currentVoltage, 0, 5, 40, 255);
  fill(COL_BOLT[0], COL_BOLT[1], COL_BOLT[2], boltAlpha);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('⚡', diskCX - diskHalfW * 0.45, metalY + mountH * 0.55);
  text('⚡', diskCX + diskHalfW * 0.45, metalY + mountH * 0.55);

  // --- Sound wave arcs (pulse mode only) ---
  if (mode === 'pulse') {
    // Spawn new wave on voltage rising edge
    let prevV = voltageTrace.length >= 2 ?
                voltageTrace[voltageTrace.length - 2] : 0;
    if (currentVoltage > 2.5 && prevV <= 2.5) {
      soundWaves.push({
        x: diskCX,
        y: ceramicBendTopY - ceramicThick - 8,
        radius: 5,
        alpha: 180
      });
    }

    // Draw and update waves
    noFill();
    for (let i = soundWaves.length - 1; i >= 0; i--) {
      let w = soundWaves[i];
      stroke(COL_SOUND_WAVE[0], COL_SOUND_WAVE[1], COL_SOUND_WAVE[2], w.alpha);
      strokeWeight(1.5);
      // Draw arc (upward semicircle)
      arc(w.x, w.y, w.radius * 2, w.radius * 1.2, PI + 0.3, TWO_PI - 0.3);
      w.radius += 1.8;
      w.alpha -= 3;
      if (w.alpha <= 0) {
        soundWaves.splice(i, 1);
      }
    }
  }

  // --- Voltage trace ---
  let traceTop = height * 0.65;
  let traceBottom = height * 0.88;
  let traceH = traceBottom - traceTop;
  let traceLeft = PADDING + 30;
  let traceRight = width - PADDING;
  let traceW = traceRight - traceLeft;

  // Trace background and grid
  noStroke();
  fill(255, 255, 255);
  rect(traceLeft, traceTop, traceW, traceH, 3);

  stroke(COL_TRACE_GRID);
  strokeWeight(0.5);
  // Horizontal gridlines at 0V and 5V
  let y5V = traceTop + 6;
  let y0V = traceBottom - 6;
  drawingContext.setLineDash([3, 3]);
  line(traceLeft, y5V, traceRight, y5V);
  line(traceLeft, y0V, traceRight, y0V);
  drawingContext.setLineDash([]);

  // Axis labels
  noStroke();
  fill(COL_TRACE_AXIS);
  textSize(10);
  textStyle(NORMAL);
  textAlign(RIGHT, CENTER);
  text('5V', traceLeft - 4, y5V);
  text('0V', traceLeft - 4, y0V);

  // Y-axis label
  push();
  translate(PADDING + 6, traceTop + traceH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(10);
  fill(COL_TEXT_SEC);
  text('Voltage (V)', 0, 0);
  pop();

  // Draw trace line (staircase step pattern for crisp square waves)
  stroke(COL_TRACE_LINE);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < voltageTrace.length; i++) {
    let x = traceLeft + (i / (TRACE_LENGTH - 1)) * traceW;
    let v = voltageTrace[i];
    let y = map(v, 0, 5, y0V, y5V);
    if (i === 0) {
      vertex(x, y);
    } else {
      // Horizontal to current x at previous value, then vertical step
      let prevY = map(voltageTrace[i - 1], 0, 5, y0V, y5V);
      vertex(x, prevY);
      vertex(x, y);
    }
  }
  endShape();

  // Trace border
  noFill();
  stroke('#ccc');
  strokeWeight(1);
  rect(traceLeft, traceTop, traceW, traceH, 3);
}

/**
 * Maps a frequency to the nearest musical note name.
 * Returns null if outside range or not close to a named note.
 *
 * @param {number} freq - frequency in Hz
 * @returns {string|null} note name like "A4" or null
 */
function frequencyToNoteName(freq) {
  if (freq < 32.7 || freq > 7902) return null;
  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F',
                       'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let semitones = 12 * Math.log2(freq / 440);
  let rounded = Math.round(semitones);
  if (Math.abs(semitones - rounded) > 0.3) return null;
  let noteIndex = ((rounded % 12) + 12 + 9) % 12;
  let octave = 4 + Math.floor((rounded + 9) / 12);
  return NOTE_NAMES[noteIndex] + octave;
}