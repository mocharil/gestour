import type { NormalizedLandmark } from './types';
import { HAND_CONNECTIONS, HAND_LANDMARKS } from './landmarks';

const ACCENT_COLOR = '#00e5a0';
const HAND_COLOR = '#00b4ff';
const INDEX_COLOR = '#ff6b00';

export function drawHandLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number
): void {
  if (!landmarks || landmarks.length < 21) return;

  // Draw connections
  ctx.strokeStyle = HAND_COLOR;
  ctx.lineWidth = 2;

  for (const [start, end] of HAND_CONNECTIONS) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    ctx.beginPath();
    ctx.moveTo(startPoint.x * canvasWidth, startPoint.y * canvasHeight);
    ctx.lineTo(endPoint.x * canvasWidth, endPoint.y * canvasHeight);
    ctx.stroke();
  }

  // Draw landmark points
  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    const x = landmark.x * canvasWidth;
    const y = landmark.y * canvasHeight;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);

    // Highlight index finger tip
    if (i === HAND_LANDMARKS.INDEX_TIP) {
      ctx.fillStyle = INDEX_COLOR;
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
    } else {
      ctx.fillStyle = HAND_COLOR;
    }

    ctx.fill();
  }

  // Draw large circle around index finger tip
  const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
  const tipX = indexTip.x * canvasWidth;
  const tipY = indexTip.y * canvasHeight;

  ctx.beginPath();
  ctx.arc(tipX, tipY, 15, 0, 2 * Math.PI);
  ctx.strokeStyle = INDEX_COLOR;
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function drawPointer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  const posX = x * canvasWidth;
  const posY = y * canvasHeight;

  // Outer glow
  const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, 30);
  gradient.addColorStop(0, 'rgba(0, 229, 160, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 229, 160, 0)');

  ctx.beginPath();
  ctx.arc(posX, posY, 30, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Inner circle
  ctx.beginPath();
  ctx.arc(posX, posY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = ACCENT_COLOR;
  ctx.fill();

  // Center dot
  ctx.beginPath();
  ctx.arc(posX, posY, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}
