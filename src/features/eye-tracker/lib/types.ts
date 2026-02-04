export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface HandResult {
  indexTip: Point2D;
  isPointing: boolean;
  confidence: number;
}

export interface TrackingResult {
  pointer: Point2D;
  isActive: boolean;
  gesture: string;
  confidence: number;
}

export type TrackingStatus = 'idle' | 'loading' | 'active' | 'error';

export type GestureType = 'none' | 'point' | 'pinch' | 'fist' | 'open' | 'peace' | 'thumbsUp' | 'threeFingers';

export interface GestureState {
  type: GestureType;
  pinchDistance: number;
  isPinching: boolean;
  isClicking: boolean;
  isDoubleClick: boolean;
  isDragging: boolean;
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface HandsResults {
  multiHandLandmarks: NormalizedLandmark[][];
  multiHandedness: { label: string; score: number }[];
}
