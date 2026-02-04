import { create } from 'zustand';
import type { TrackingStatus, Point2D, GestureType } from '../lib/types';
import type { DetectionResult, FullAnalysisResult, ChatMessage } from '../lib/geminiService';

interface TrackerState {
  // Tracking
  status: TrackingStatus;
  pointer: Point2D | null;
  handDetected: boolean;
  fps: number;
  errorMessage: string | null;

  // Image
  uploadedImage: string | null;

  // Gesture
  gesture: GestureType;
  isPinching: boolean;
  pinchDistance: number;
  clickCount: number;
  lastClickTime: number;

  // Transform
  zoom: number;
  pan: Point2D;
  isDragging: boolean;
  dragStart: Point2D | null;

  // Detection
  detection: DetectionResult | null;
  isDetecting: boolean;

  // Full Analysis
  fullAnalysis: FullAnalysisResult | null;
  isAnalyzing: boolean;

  // Chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isChatLoading: boolean;

  // Voice
  voiceEnabled: boolean;

  // Accessibility Settings
  dwellClickEnabled: boolean;
  dwellClickDelay: number;
  pointerSensitivity: number;
  pointerSmoothing: number;

  // Actions
  setStatus: (status: TrackingStatus) => void;
  setPointer: (pointer: Point2D | null) => void;
  setHandDetected: (detected: boolean) => void;
  setFps: (fps: number) => void;
  setErrorMessage: (message: string | null) => void;
  setUploadedImage: (image: string | null) => void;

  // Gesture actions
  setGesture: (gesture: GestureType) => void;
  setPinching: (isPinching: boolean, distance?: number) => void;
  registerClick: () => 'single' | 'double' | null;

  // Transform actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setPan: (pan: Point2D) => void;
  startDrag: (point: Point2D) => void;
  updateDrag: (point: Point2D) => void;
  endDrag: () => void;
  resetTransform: () => void;

  // Detection actions
  setDetection: (detection: DetectionResult | null) => void;
  setIsDetecting: (isDetecting: boolean) => void;
  clearDetection: () => void;

  // Full Analysis actions
  setFullAnalysis: (analysis: FullAnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  clearFullAnalysis: () => void;

  // Chat actions
  addChatMessage: (message: ChatMessage) => void;
  setChatOpen: (isOpen: boolean) => void;
  setChatLoading: (isLoading: boolean) => void;
  clearChat: () => void;

  // Voice actions
  setVoiceEnabled: (enabled: boolean) => void;

  // Accessibility actions
  setDwellClickEnabled: (enabled: boolean) => void;
  setDwellClickDelay: (delay: number) => void;
  setPointerSensitivity: (sensitivity: number) => void;
  setPointerSmoothing: (smoothing: number) => void;

  reset: () => void;
}

const initialState = {
  status: 'idle' as TrackingStatus,
  pointer: null as Point2D | null,
  handDetected: false,
  fps: 0,
  errorMessage: null as string | null,
  uploadedImage: null as string | null,
  gesture: 'none' as GestureType,
  isPinching: false,
  pinchDistance: 0,
  clickCount: 0,
  lastClickTime: 0,
  zoom: 1,
  pan: { x: 0, y: 0 },
  isDragging: false,
  dragStart: null as Point2D | null,
  detection: null as DetectionResult | null,
  isDetecting: false,
  fullAnalysis: null as FullAnalysisResult | null,
  isAnalyzing: false,
  chatMessages: [] as ChatMessage[],
  isChatOpen: false,
  isChatLoading: false,
  voiceEnabled: true,
  dwellClickEnabled: false,
  dwellClickDelay: 1500,
  pointerSensitivity: 1,
  pointerSmoothing: 0.3,
};

export const useTrackerStore = create<TrackerState>((set, get) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  setPointer: (pointer) => set({ pointer }),
  setHandDetected: (detected) => set({ handDetected: detected }),
  setFps: (fps) => set({ fps }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setUploadedImage: (image) => set({
    uploadedImage: image,
    zoom: 1,
    pan: { x: 0, y: 0 },
    chatMessages: [],
    fullAnalysis: null,
    detection: null,
  }),

  setGesture: (gesture) => set({ gesture }),

  setPinching: (isPinching, distance = 0) => set({ isPinching, pinchDistance: distance }),

  registerClick: () => {
    const now = Date.now();
    const { lastClickTime } = get();
    const timeDiff = now - lastClickTime;

    if (timeDiff < 400 && timeDiff > 50) {
      // Double click
      set({ clickCount: 0, lastClickTime: 0 });
      return 'double';
    } else {
      // Single click
      set({ clickCount: 1, lastClickTime: now });
      return 'single';
    }
  },

  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(5, zoom)) }),

  zoomIn: () => {
    const { zoom } = get();
    set({ zoom: Math.min(5, zoom * 1.3) });
  },

  zoomOut: () => {
    const { zoom } = get();
    set({ zoom: Math.max(0.5, zoom / 1.3) });
  },

  setPan: (pan) => set({ pan }),

  startDrag: (point) => set({ isDragging: true, dragStart: point }),

  updateDrag: (point) => {
    const { dragStart, pan, zoom } = get();
    if (!dragStart) return;

    const dx = (point.x - dragStart.x) * 500 / zoom;
    const dy = (point.y - dragStart.y) * 500 / zoom;

    set({
      pan: { x: pan.x + dx, y: pan.y + dy },
      dragStart: point,
    });
  },

  endDrag: () => set({ isDragging: false, dragStart: null }),

  resetTransform: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),

  setDetection: (detection) => set({ detection }),
  setIsDetecting: (isDetecting) => set({ isDetecting }),
  clearDetection: () => set({ detection: null }),

  setFullAnalysis: (fullAnalysis) => set({ fullAnalysis }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  clearFullAnalysis: () => set({ fullAnalysis: null }),

  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  setChatOpen: (isChatOpen) => set({ isChatOpen }),
  setChatLoading: (isChatLoading) => set({ isChatLoading }),
  clearChat: () => set({ chatMessages: [] }),

  setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),

  setDwellClickEnabled: (dwellClickEnabled) => set({ dwellClickEnabled }),
  setDwellClickDelay: (dwellClickDelay) => set({ dwellClickDelay }),
  setPointerSensitivity: (pointerSensitivity) => set({ pointerSensitivity }),
  setPointerSmoothing: (pointerSmoothing) => set({ pointerSmoothing }),

  reset: () => set(initialState),
}));
