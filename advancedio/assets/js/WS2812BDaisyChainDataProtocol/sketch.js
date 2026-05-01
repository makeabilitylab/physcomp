/**
 * WS2812B Addressable LED Data Protocol
 *
 * An interactive p5.js visualization for the Physical Computing textbook
 * (https://makeabilitylab.github.io/physcomp/) that shows how the WS2812B
 * single-wire daisy-chain protocol works: the Arduino sends a stream of
 * 24-bit color packets (GRB order) down one data wire. Each LED reads its
 * own 24 bits, latches them, and forwards the remaining data downstream.
 *
 * Features:
 *   - Animated bitstream flowing from Arduino → LED 0 → LED 1 → ... → LED N
 *   - Each LED "consumes" its 24-bit packet and lights up
 *   - Color preset selector to set target colors
 *   - Speed control for the animation
 *   - Bit-level detail: shows GRB byte breakdown per LED
 *
 * Usage: Paste into the p5.js web editor and embed via iframe.
 *
 * Made by Jon Froehlich and Claude Opus 4.6
 */

// --- Configuration ---
const NUM_LEDS = 5;
const BITS_PER_LED = 24; // 8G + 8R + 8B
const CANVAS_HEIGHT = 300;
const PADDING = 20;

// --- Animation state ---
let animPhase = 'idle'; // 'idle', 'sending', 'done'
let bitsSent = 0;       // how many bits have been "sent" so far (fractional)
let sendSpeed = 1;      // bits per frame (can be fractional)
let totalBits = NUM_LEDS * BITS_PER_LED;

// --- LED target colors (RGB order for display, converted to GRB for bitstream) ---
let ledColors = [
  [255, 30, 0],    // Red-orange
  [0, 200, 60],    // Green
  [30, 80, 220],   // Blue
  [255, 200, 0],   // Warm yellow
  [180, 0, 255],   // Purple
];

// --- Color presets ---
const PRESETS = {
  'Mixed':   [[255, 30, 0], [0, 200, 60], [30, 80, 220], [255, 200, 0], [180, 0, 255]],
  'Warm':    [[255, 60, 0], [255, 140, 0], [255, 200, 20], [255, 80, 40], [200, 50, 10]],
  'Cool':    [[0, 100, 255], [0, 200, 180], [80, 0, 255], [0, 150, 136], [60, 60, 220]],
  'Pastel':  [[255, 150, 150], [150, 255, 150], [150, 150, 255], [255, 255, 150], [255, 180, 220]],
  'All Red': [[255, 0, 0], [255, 0, 0], [255, 0, 0], [255, 0, 0], [255, 0, 0]],
};

// --- Computed bitstream (GRB order, as WS2812B expects) ---
let bitstream = [];

// --- Controls ---
let presetSelect, speedSlider, sendBtn, resetBtn;

// --- Colors (matching textbook style) ---
const COL_BG = '#fafafa';
const COL_TEXT = '#333';
const COL_TEXT_SEC = '#777';
const COL_WIRE = '#555';
const COL_LED_OFF = '#e0e0e0';
const COL_LED_BORDER = '#999';
const COL_ARDUINO = '#00796b';
const COL_ARDUINO_LABEL = '#ffffff';
const COL_BIT_ONE = '#2979ff';
const COL_BIT_ZERO = '#aaa';
const COL_GRN_BYTE = [76, 175, 80];
const COL_RED_BYTE = [229, 57, 53];
const COL_BLU_BYTE = [41, 121, 255];

// --- Inline styles ---
const STYLE_ROW = 'display:flex; align-items:center; gap:10px; ' +
  'margin-bottom:6px; font-family:monospace; font-size:13px; color:#333;';
const STYLE_LABEL = 'width:105px; text-align:right; flex-shrink:0; ' +
  'color:#333; font-size:13px; font-family:monospace;';
const STYLE_BTN = 'font-size:13px; font-family:monospace; padding:5px 14px; ' +
  'cursor:pointer; border:1px solid #999; border-radius:4px; background:#fff; color:#333;';
const STYLE_BTN_PRIMARY = 'font-size:13px; font-family:monospace; padding:5px 14px; ' +
  'cursor:pointer; border:1px solid #1565c0; border-radius:4px; ' +
  'background:#2979ff; color:#fff;';

function setup() {
  let cnv = createCanvas(min(windowWidth, 800), CANVAS_HEIGHT);
  textFont('monospace');

  buildBitstream();

  // --- Controls ---
  let controlsWrapper = createDiv();
  controlsWrapper.style('padding', '10px 4px 4px');
  controlsWrapper.style('max-width', '800px');

  // Row 1: Preset + Send/Reset
  let row1 = createDiv();
  row1.style(STYLE_ROW);
  row1.parent(controlsWrapper);

  let presetLabel = createSpan('Color Preset:');
  presetLabel.style(STYLE_LABEL);
  presetLabel.parent(row1);

  presetSelect = createSelect();
  presetSelect.style('font-family', 'monospace');
  presetSelect.style('font-size', '13px');
  presetSelect.style('padding', '4px 8px');
  presetSelect.parent(row1);
  for (let name of Object.keys(PRESETS)) {
    presetSelect.option(name);
  }
  presetSelect.changed(onPresetChange);
  presetSelect.attribute('aria-label', 'Color preset selector');

  // Spacer
  let spacer = createSpan('');
  spacer.style('flex', '1');
  spacer.parent(row1);

  sendBtn = createButton('▶ Send Data');
  sendBtn.style(STYLE_BTN_PRIMARY);
  sendBtn.parent(row1);
  sendBtn.mousePressed(onSend);
  sendBtn.attribute('aria-label', 'Send color data to LEDs');

  resetBtn = createButton('↺ Reset');
  resetBtn.style(STYLE_BTN);
  resetBtn.parent(row1);
  resetBtn.mousePressed(onReset);
  resetBtn.attribute('aria-label', 'Reset the animation');

  // Row 2: Speed
  let row2 = createDiv();
  row2.style(STYLE_ROW);
  row2.parent(controlsWrapper);

  let speedLabel = createSpan('Anim Speed:');
  speedLabel.style(STYLE_LABEL);
  speedLabel.parent(row2);

  // Slider range: 1..16, mapped to 0.25..4.0 bits/frame
  speedSlider = createSlider(1, 16, 2, 1);
  speedSlider.style('flex', '1');
  speedSlider.style('min-width', '100px');
  speedSlider.parent(row2);
  speedSlider.attribute('aria-label', 'Animation speed');

  let speedReadout = createSpan('');
  speedReadout.attribute('id', 'speed-readout');
  speedReadout.style('min-width:80px; font-size:13px; color:#555; ' +
    'flex-shrink:0; font-family:monospace;');
  speedReadout.parent(row2);
}

/**
 * Converts RGB colors to GRB bitstream (WS2812B byte order).
 */
function buildBitstream() {
  bitstream = [];
  for (let i = 0; i < NUM_LEDS; i++) {
    let [r, g, b] = ledColors[i];
    // WS2812B sends Green, Red, Blue (GRB order)
    let bytes = [g, r, b];
    for (let byteVal of bytes) {
      for (let bit = 7; bit >= 0; bit--) {
        bitstream.push((byteVal >> bit) & 1);
      }
    }
  }
}

function onPresetChange() {
  let name = presetSelect.value();
  if (PRESETS[name]) {
    ledColors = PRESETS[name].map(c => [...c]);
    buildBitstream();
    onReset();
  }
}

function onSend() {
  if (animPhase === 'idle' || animPhase === 'done') {
    bitsSent = 0;
    animPhase = 'sending';
  }
}

function onReset() {
  animPhase = 'idle';
  bitsSent = 0;
}

function windowResized() {
  resizeCanvas(min(windowWidth, 800), CANVAS_HEIGHT);
}

function draw() {
  background(COL_BG);

  // Map slider (1..16) to bits/frame (0.25..4.0)
  sendSpeed = speedSlider.value() * 0.25;
  select('#speed-readout').html(sendSpeed.toFixed(2) + ' bits/frame');

  // Advance animation (fractional accumulation)
  if (animPhase === 'sending') {
    bitsSent = min(bitsSent + sendSpeed, totalBits);
    if (bitsSent >= totalBits) {
      animPhase = 'done';
    }
  }

  // Use floor for display purposes
  let bitsSentInt = floor(bitsSent);

  // --- Layout calculations ---
  let chainMidY = 80;
  let chainBottom = 125;
  let ledSize = 36;
  let arduinoW = 65;
  let arduinoH = 46;

  // Horizontal positions: Arduino on left, then LEDs evenly spaced
  let leftEdge = PADDING + arduinoW + 20;
  // Position LEDs so the last LED's DOUT label right-aligns with width - PADDING.
  // Last LED center: leftEdge + (NUM_LEDS - 0.5) * ledSpacing
  // DOUT text end ≈ lastLedCX + ledSize/2 + 28
  // Solve for ledSpacing so that end = width - PADDING:
  let lastLedCX = width - PADDING - ledSize / 2 - 28;
  let ledSpacing = (lastLedCX - leftEdge) / (NUM_LEDS - 0.5);

  let arduinoX = PADDING;
  let arduinoY = chainMidY - arduinoH / 2;

  // --- Title ---
  noStroke();
  fill(COL_TEXT);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('WS2812B Daisy-Chain Data Protocol', PADDING, 10);
  textStyle(NORMAL);

  // --- Draw Arduino ---
  fill(COL_ARDUINO);
  stroke(COL_ARDUINO);
  strokeWeight(1);
  rect(arduinoX, arduinoY, arduinoW, arduinoH, 5);
  noStroke();
  fill(COL_ARDUINO_LABEL);
  textSize(10);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('Arduino', arduinoX + arduinoW / 2, arduinoY + arduinoH / 2 - 7);
  textStyle(NORMAL);
  textSize(9);
  text('Pin 6', arduinoX + arduinoW / 2, arduinoY + arduinoH / 2 + 7);

  // --- Draw data wire and LEDs ---
  let wireY = chainMidY;
  let wireStartX = arduinoX + arduinoW;
  let firstLedCX = leftEdge + ledSpacing / 2;

  // Wire from Arduino to first LED
  stroke(COL_WIRE);
  strokeWeight(2);
  line(wireStartX, wireY, firstLedCX - ledSize / 2 - 2, wireY);

  // Arrow from Arduino
  let arrowX0 = (wireStartX + firstLedCX - ledSize / 2 - 2) / 2;
  fill(COL_WIRE);
  noStroke();
  triangle(arrowX0 + 4, wireY, arrowX0 - 3, wireY - 3.5, arrowX0 - 3, wireY + 3.5);

  // Draw each LED and inter-LED wires
  for (let i = 0; i < NUM_LEDS; i++) {
    let cx = leftEdge + ledSpacing * i + ledSpacing / 2;
    let cy = wireY;

    // Wire to next LED
    if (i < NUM_LEDS - 1) {
      let nextCx = leftEdge + ledSpacing * (i + 1) + ledSpacing / 2;
      stroke(COL_WIRE);
      strokeWeight(2);
      line(cx + ledSize / 2 + 2, wireY, nextCx - ledSize / 2 - 2, wireY);

      // Arrow
      let ax = (cx + ledSize / 2 + 2 + nextCx - ledSize / 2 - 2) / 2;
      fill(COL_WIRE);
      noStroke();
      triangle(ax + 4, wireY, ax - 3, wireY - 3.5, ax - 3, wireY + 3.5);
    }

    // How many bits has this LED received?
    let ledStartBit = i * BITS_PER_LED;
    let bitsForThisLed = constrain(bitsSentInt - ledStartBit, 0, BITS_PER_LED);
    let ledComplete = bitsForThisLed >= BITS_PER_LED;

    // LED color: off, partial glow, or full color
    let ledFill;
    if (ledComplete) {
      ledFill = color(ledColors[i][0], ledColors[i][1], ledColors[i][2]);
    } else if (bitsForThisLed > 0) {
      let frac = bitsForThisLed / BITS_PER_LED;
      ledFill = color(
        lerp(210, ledColors[i][0], frac),
        lerp(210, ledColors[i][1], frac),
        lerp(210, ledColors[i][2], frac),
      );
    } else {
      ledFill = color(COL_LED_OFF);
    }

    // LED body (rounded square)
    fill(ledFill);
    stroke(COL_LED_BORDER);
    strokeWeight(1.5);
    rectMode(CENTER);
    rect(cx, cy, ledSize, ledSize, 6);
    rectMode(CORNER);

    // LED index label below
    noStroke();
    fill(COL_TEXT);
    textSize(10);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    text('LED ' + i, cx, cy + ledSize / 2 + 4);
    textStyle(NORMAL);

    // DIN / DOUT labels on left/right of LED, just below the wire line
    fill(COL_TEXT_SEC);
    textSize(7);
    let dinDoutY = wireY + 5;
    textAlign(RIGHT, TOP);
    text('DIN', cx - ledSize / 2 - 4, dinDoutY);
    textAlign(LEFT, TOP);
    text('DOUT', cx + ledSize / 2 + 4, dinDoutY);

    // --- Draw "consuming" annotation above LED ---
    if (bitsForThisLed > 0 && bitsForThisLed < BITS_PER_LED && animPhase === 'sending') {
      noStroke();
      fill(COL_BIT_ONE);
      textSize(9);
      textAlign(CENTER, BOTTOM);
      text('receiving...', cx, cy - ledSize / 2 - 8);
      // Progress bar
      let barW = ledSize;
      let barH = 4;
      let barX = cx - barW / 2;
      let barY = cy - ledSize / 2 - 6;
      fill(230);
      noStroke();
      rect(barX, barY, barW, barH, 2);
      fill(COL_BIT_ONE);
      rect(barX, barY, barW * (bitsForThisLed / BITS_PER_LED), barH, 2);
    } else if (ledComplete) {
      noStroke();
      fill(76, 175, 80);
      textSize(9);
      textAlign(CENTER, BOTTOM);
      text('✓ latched', cx, cy - ledSize / 2 - 4);
    }
  }

  // --- Bitstream visualization (bottom half) ---
  let bitsTop = chainBottom + 55;

  // Title for bitstream section — well above the GRB bars
  noStroke();
  fill(COL_TEXT);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Data on the wire (GRB order, MSB first):', PADDING, bitsTop - 26);
  textStyle(NORMAL);

  // Calculate bit cell size to fit all bits
  let availW = width - PADDING * 2;
  let cellGap = 0.5;
  let cellSize = (availW - totalBits * cellGap) / totalBits;
  cellSize = min(cellSize, 8);

  let bitsStartX = PADDING;
  let bitsY = bitsTop;
  let bitRowH = cellSize + 2;

  // Draw GRB byte color bars above bits and LED brackets below
  for (let led = 0; led < NUM_LEDS; led++) {
    let ledStartBit = led * BITS_PER_LED;
    let pktStartX = bitsStartX + ledStartBit * (cellSize + cellGap);
    let pktW = BITS_PER_LED * (cellSize + cellGap);

    // GRB byte color bars above bits
    let byteColors = [COL_GRN_BYTE, COL_RED_BYTE, COL_BLU_BYTE];
    let byteLabels = ['G', 'R', 'B'];
    for (let b = 0; b < 3; b++) {
      let byteStartBit = ledStartBit + b * 8;
      let byteStartX = bitsStartX + byteStartBit * (cellSize + cellGap);
      let byteW = 8 * (cellSize + cellGap) - cellGap;

      let bc = byteColors[b];
      fill(bc[0], bc[1], bc[2], 50);
      noStroke();
      rect(byteStartX, bitsY - 11, byteW, 9, 2);
      fill(bc[0], bc[1], bc[2]);
      textSize(7);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(byteLabels[b], byteStartX + byteW / 2, bitsY - 6.5);
      textStyle(NORMAL);
    }

    // LED packet bracket below bits
    let bracketY = bitsY + bitRowH + 2;
    stroke(COL_TEXT_SEC);
    strokeWeight(0.8);
    line(pktStartX, bracketY + 12, pktStartX + pktW - cellGap, bracketY + 12);
    line(pktStartX, bracketY + 6, pktStartX, bracketY + 12);
    line(pktStartX + pktW - cellGap, bracketY + 6,
         pktStartX + pktW - cellGap, bracketY + 12);

    noStroke();
    fill(COL_TEXT_SEC);
    textSize(9);
    textAlign(CENTER, TOP);
    text('LED ' + led, pktStartX + pktW / 2, bracketY + 14);
  }

  // Draw individual bit cells
  for (let i = 0; i < totalBits; i++) {
    let x = bitsStartX + i * (cellSize + cellGap);
    let bitVal = bitstream[i];

    let isSent = i < bitsSentInt;
    let isAtFront = (i >= bitsSentInt - ceil(sendSpeed) && i < bitsSentInt) &&
                    animPhase === 'sending';

    if (isSent) {
      fill(bitVal === 1 ? COL_BIT_ONE : COL_BIT_ZERO);
    } else {
      fill('#eee');
    }

    if (isAtFront && animPhase === 'sending') {
      stroke(COL_BIT_ONE);
      strokeWeight(1.5);
    } else {
      stroke('#ddd');
      strokeWeight(0.5);
    }

    rect(x, bitsY, cellSize, cellSize, 1);
  }

  // --- Status text ---
  let statusY = bitsY + bitRowH + 36;
  noStroke();
  fill(COL_TEXT);
  textSize(11);
  textAlign(LEFT, TOP);

  if (animPhase === 'idle') {
    fill(COL_TEXT_SEC);
    text('Press "▶ Send Data" to transmit color data to the LED chain.',
         PADDING, statusY);
  } else if (animPhase === 'sending') {
    let currentLed = min(floor(bitsSentInt / BITS_PER_LED), NUM_LEDS - 1);
    let bitInLed = bitsSentInt % BITS_PER_LED;
    let byteIndex = floor(bitInLed / 8);
    let byteNames = ['Green', 'Red', 'Blue'];
    let byteName = byteNames[min(byteIndex, 2)];
    text('Sending bit ' + bitsSentInt + ' of ' + totalBits +
         '  ·  LED ' + currentLed + ' · ' + byteName + ' byte',
         PADDING, statusY);
  } else if (animPhase === 'done') {
    fill(76, 175, 80);
    text('✓ All ' + totalBits + ' bits sent! Each LED latched its 24-bit color (GRB).',
         PADDING, statusY);
    fill(COL_TEXT_SEC);
    textSize(10);
    text('After a 50µs+ pause (reset code), the next transmission starts a new frame.',
         PADDING, statusY + 16);
  }

  // --- Legend ---
  let legendY = statusY + 42;
  textSize(10);
  textAlign(LEFT, CENTER);
  let lx = PADDING;

  // Bit = 1
  fill(COL_BIT_ONE);
  noStroke();
  rect(lx, legendY, 10, 10, 2);
  fill(COL_TEXT_SEC);
  text('= bit "1"', lx + 13, legendY + 5);
  lx += 78;

  // Bit = 0
  fill(COL_BIT_ZERO);
  rect(lx, legendY, 10, 10, 2);
  fill(COL_TEXT_SEC);
  text('= bit "0"', lx + 13, legendY + 5);
  lx += 78;

  // Unsent
  fill('#eee');
  stroke('#ddd');
  strokeWeight(0.5);
  rect(lx, legendY, 10, 10, 2);
  noStroke();
  fill(COL_TEXT_SEC);
  text('= unsent', lx + 13, legendY + 5);

  // GRB byte legend — right-aligned to the bitstream's actual right edge
  // Compute actual right edge of bitstream
  let bitsRightEdge = bitsStartX + totalBits * (cellSize + cellGap) - cellGap;

  let byteColorsLeg = [COL_GRN_BYTE, COL_RED_BYTE, COL_BLU_BYTE];
  let byteLegLabels = ['Green byte', 'Red byte', 'Blue byte'];

  // Measure each legend entry width: swatch(10) + gap(5) + text
  textSize(10);
  textStyle(BOLD);
  let entryWidths = byteLegLabels.map(l => 10 + 5 + textWidth(l));
  let totalEntriesW = entryWidths.reduce((a, b) => a + b, 0);
  let entryGap = 12; // fixed gap between entries
  let totalLegendW = totalEntriesW + entryGap * 2; // 2 gaps for 3 items
  let grbX = bitsRightEdge - totalLegendW;

  for (let b = 0; b < 3; b++) {
    let bc = byteColorsLeg[b];
    fill(bc[0], bc[1], bc[2], 80);
    noStroke();
    rect(grbX, legendY, 10, 10, 2);
    fill(bc[0], bc[1], bc[2]);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text(byteLegLabels[b], grbX + 15, legendY + 5);
    grbX += entryWidths[b] + entryGap;
  }
  textStyle(NORMAL);
}