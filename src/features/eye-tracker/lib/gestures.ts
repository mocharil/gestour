import type { NormalizedLandmark, GestureType } from './types';
import { HAND_LANDMARKS } from './landmarks';

// Calculate 2D distance
function distance2D(a: NormalizedLandmark, b: NormalizedLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Check if finger is extended by comparing tip to pip distance from wrist
function isFingerExtended(
  landmarks: NormalizedLandmark[],
  tipIdx: number,
  pipIdx: number
): boolean {
  const tip = landmarks[tipIdx];
  const pip = landmarks[pipIdx];
  const wrist = landmarks[HAND_LANDMARKS.WRIST];

  const tipDist = distance2D(tip, wrist);
  const pipDist = distance2D(pip, wrist);

  return tipDist > pipDist * 1.1;
}

// Check if thumb is extended (different logic - horizontal check)
function isThumbExtended(landmarks: NormalizedLandmark[]): boolean {
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
  const thumbMcp = landmarks[HAND_LANDMARKS.THUMB_MCP];
  const indexMcp = landmarks[HAND_LANDMARKS.INDEX_MCP];

  // Thumb is extended if tip is far from index mcp
  const dist = distance2D(thumbTip, indexMcp);
  return dist > 0.1;
}

// Get finger states
export function getFingerStates(landmarks: NormalizedLandmark[]) {
  return {
    thumb: isThumbExtended(landmarks),
    index: isFingerExtended(landmarks, HAND_LANDMARKS.INDEX_TIP, HAND_LANDMARKS.INDEX_PIP),
    middle: isFingerExtended(landmarks, HAND_LANDMARKS.MIDDLE_TIP, HAND_LANDMARKS.MIDDLE_PIP),
    ring: isFingerExtended(landmarks, HAND_LANDMARKS.RING_TIP, HAND_LANDMARKS.RING_PIP),
    pinky: isFingerExtended(landmarks, HAND_LANDMARKS.PINKY_TIP, HAND_LANDMARKS.PINKY_PIP),
  };
}

// Detect pinch (thumb tip close to index tip)
export function detectPinch(landmarks: NormalizedLandmark[]): {
  isPinching: boolean;
  distance: number;
} {
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
  const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];

  const dist = distance2D(thumbTip, indexTip);
  const isPinching = dist < 0.055;

  return { isPinching, distance: dist };
}

// Detect gesture type with clear distinctions
export function detectGesture(landmarks: NormalizedLandmark[]): GestureType {
  if (!landmarks || landmarks.length < 21) return 'none';

  const fingers = getFingerStates(landmarks);
  const { isPinching } = detectPinch(landmarks);

  // Count extended fingers (excluding thumb)
  const extendedCount = [fingers.index, fingers.middle, fingers.ring, fingers.pinky]
    .filter(Boolean).length;

  // PINCH - thumb and index touching (for click)
  if (isPinching) {
    return 'pinch';
  }

  // THUMBS UP - only thumb extended, all other fingers closed (for AI detection)
  if (fingers.thumb && extendedCount === 0) {
    return 'thumbsUp';
  }

  // FIST - no fingers extended including thumb (for zoom in)
  if (extendedCount === 0 && !fingers.thumb) {
    return 'fist';
  }

  // OPEN - all 4 fingers extended + thumb (for zoom out)
  if (extendedCount === 4 && fingers.thumb) {
    return 'open';
  }

  // THREE FINGERS - index, middle, ring extended (for full analysis)
  if (fingers.index && fingers.middle && fingers.ring && !fingers.pinky) {
    return 'threeFingers';
  }

  // PEACE - only index and middle extended (for drag)
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    return 'peace';
  }

  // POINT - only index extended (for pointer movement)
  if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    return 'point';
  }

  return 'none';
}

// Get pointer position from index finger tip
export function getPointerPosition(landmarks: NormalizedLandmark[]): { x: number; y: number } {
  const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
  return {
    x: 1 - indexTip.x, // Mirror for natural feel
    y: indexTip.y,
  };
}

// Get center position between index and middle (for peace/drag gesture)
export function getPeaceCenter(landmarks: NormalizedLandmark[]): { x: number; y: number } {
  const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
  const middleTip = landmarks[HAND_LANDMARKS.MIDDLE_TIP];
  return {
    x: 1 - (indexTip.x + middleTip.x) / 2,
    y: (indexTip.y + middleTip.y) / 2,
  };
}

// Get palm center (for fist/open gestures)
export function getPalmCenter(landmarks: NormalizedLandmark[]): { x: number; y: number } {
  const wrist = landmarks[HAND_LANDMARKS.WRIST];
  const middleMcp = landmarks[HAND_LANDMARKS.MIDDLE_MCP];
  return {
    x: 1 - (wrist.x + middleMcp.x) / 2,
    y: (wrist.y + middleMcp.y) / 2,
  };
}

// Get thumb tip position (for thumbsUp gesture)
export function getThumbPosition(landmarks: NormalizedLandmark[]): { x: number; y: number } {
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
  return {
    x: 1 - thumbTip.x,
    y: thumbTip.y,
  };
}
