import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrackingStatus, Point2D, GestureType } from '../lib/types';
import type { DetectionResult, FullAnalysisResult, ChatMessage } from '../lib/geminiService';

// Session history item
interface HistoryItem {
  id: string;
  image: string;
  thumbnail: string;
  timestamp: number;
  analysis?: FullAnalysisResult;
  detections: DetectionResult[];
}

// Keyboard shortcut
interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}

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

  // NEW: Session History
  history: HistoryItem[];
  maxHistoryItems: number;

  // NEW: Keyboard Shortcuts
  keyboardShortcutsEnabled: boolean;
  shortcuts: KeyboardShortcut[];

  // NEW: Voice Commands
  voiceCommandsEnabled: boolean;
  isListening: boolean;

  // NEW: Performance Mode
  performanceMode: boolean;

  // NEW: Tutorial
  showTutorial: boolean;
  tutorialStep: number;

  // NEW: Annotations
  annotations: Array<{
    id: string;
    x: number;
    y: number;
    text: string;
    color: string;
  }>;
  isAnnotating: boolean;
  annotationColor: string;

  // NEW: Export
  exportFormat: 'png' | 'jpg' | 'pdf';

  // NEW: 360° View
  is360ViewOpen: boolean;

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

  // NEW: History actions
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  loadFromHistory: (id: string) => void;

  // NEW: Keyboard shortcuts actions
  setKeyboardShortcutsEnabled: (enabled: boolean) => void;

  // NEW: Voice commands actions
  setVoiceCommandsEnabled: (enabled: boolean) => void;
  setIsListening: (listening: boolean) => void;

  // NEW: Performance mode actions
  setPerformanceMode: (enabled: boolean) => void;

  // NEW: Tutorial actions
  setShowTutorial: (show: boolean) => void;
  setTutorialStep: (step: number) => void;
  nextTutorialStep: () => void;
  completeTutorial: () => void;

  // NEW: Annotation actions
  addAnnotation: (annotation: Omit<TrackerState['annotations'][0], 'id'>) => void;
  removeAnnotation: (id: string) => void;
  clearAnnotations: () => void;
  setIsAnnotating: (annotating: boolean) => void;
  setAnnotationColor: (color: string) => void;

  // NEW: Export actions
  setExportFormat: (format: 'png' | 'jpg' | 'pdf') => void;

  // NEW: 360° View actions
  set360ViewOpen: (isOpen: boolean) => void;

  reset: () => void;
}

const defaultShortcuts: KeyboardShortcut[] = [
  { key: 'z', ctrl: true, action: 'zoomIn', description: 'Zoom In' },
  { key: 'x', ctrl: true, action: 'zoomOut', description: 'Zoom Out' },
  { key: '0', ctrl: true, action: 'resetZoom', description: 'Reset Zoom' },
  { key: 'v', ctrl: true, action: 'toggleVoice', description: 'Toggle Voice' },
  { key: 'a', ctrl: true, action: 'analyze', description: 'Full Analysis' },
  { key: 'c', ctrl: true, action: 'toggleChat', description: 'Toggle Chat' },
  { key: 'n', ctrl: true, action: 'newImage', description: 'New Image' },
  { key: 't', ctrl: true, action: 'toggleTheme', description: 'Toggle Theme' },
  { key: 'Escape', action: 'close', description: 'Close Panels' },
  { key: '?', shift: true, action: 'showShortcuts', description: 'Show Shortcuts' },
];

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
  // NEW states
  history: [] as HistoryItem[],
  maxHistoryItems: 10,
  keyboardShortcutsEnabled: true,
  shortcuts: defaultShortcuts,
  voiceCommandsEnabled: false,
  isListening: false,
  performanceMode: false,
  showTutorial: false,
  tutorialStep: 0,
  annotations: [] as TrackerState['annotations'],
  isAnnotating: false,
  annotationColor: '#6366f1',
  exportFormat: 'png' as const,
  is360ViewOpen: false,
};

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStatus: (status) => set({ status }),
      setPointer: (pointer) => set({ pointer }),
      setHandDetected: (detected) => set({ handDetected: detected }),
      setFps: (fps) => set({ fps }),
      setErrorMessage: (message) => set({ errorMessage: message }),
      setUploadedImage: (image) => {
        const { uploadedImage, fullAnalysis, detection, history, maxHistoryItems } = get();

        // Save current image to history before changing
        if (uploadedImage && (fullAnalysis || detection)) {
          const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            image: uploadedImage,
            thumbnail: uploadedImage,
            timestamp: Date.now(),
            analysis: fullAnalysis || undefined,
            detections: detection ? [detection] : [],
          };

          const newHistory = [newHistoryItem, ...history].slice(0, maxHistoryItems);
          set({ history: newHistory });
        }

        set({
          uploadedImage: image,
          zoom: 1,
          pan: { x: 0, y: 0 },
          chatMessages: [],
          fullAnalysis: null,
          detection: null,
          annotations: [],
        });
      },

      setGesture: (gesture) => set({ gesture }),

      setPinching: (isPinching, distance = 0) => set({ isPinching, pinchDistance: distance }),

      registerClick: () => {
        const now = Date.now();
        const { lastClickTime } = get();
        const timeDiff = now - lastClickTime;

        if (timeDiff < 400 && timeDiff > 50) {
          set({ clickCount: 0, lastClickTime: 0 });
          return 'double';
        } else {
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

      // NEW: History actions
      addToHistory: (item) => {
        const { history, maxHistoryItems } = get();
        const newItem: HistoryItem = {
          ...item,
          id: Date.now().toString(),
          timestamp: Date.now(),
        };
        const newHistory = [newItem, ...history].slice(0, maxHistoryItems);
        set({ history: newHistory });
      },

      removeFromHistory: (id) => {
        const { history } = get();
        set({ history: history.filter(item => item.id !== id) });
      },

      clearHistory: () => set({ history: [] }),

      loadFromHistory: (id) => {
        const { history } = get();
        const item = history.find(h => h.id === id);
        if (item) {
          set({
            uploadedImage: item.image,
            fullAnalysis: item.analysis || null,
            detection: item.detections[0] || null,
            zoom: 1,
            pan: { x: 0, y: 0 },
            chatMessages: [],
            annotations: [],
          });
        }
      },

      // NEW: Keyboard shortcuts
      setKeyboardShortcutsEnabled: (enabled) => set({ keyboardShortcutsEnabled: enabled }),

      // NEW: Voice commands
      setVoiceCommandsEnabled: (enabled) => set({ voiceCommandsEnabled: enabled }),
      setIsListening: (listening) => set({ isListening: listening }),

      // NEW: Performance mode
      setPerformanceMode: (enabled) => set({ performanceMode: enabled }),

      // NEW: Tutorial
      setShowTutorial: (show) => set({ showTutorial: show }),
      setTutorialStep: (step) => set({ tutorialStep: step }),
      nextTutorialStep: () => {
        const { tutorialStep } = get();
        set({ tutorialStep: tutorialStep + 1 });
      },
      completeTutorial: () => {
        set({ showTutorial: false, tutorialStep: 0 });
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('gestour-onboarding-seen', 'true');
        }
      },

      // NEW: Annotations
      addAnnotation: (annotation) => {
        const { annotations } = get();
        const newAnnotation = {
          ...annotation,
          id: Date.now().toString(),
        };
        set({ annotations: [...annotations, newAnnotation] });
      },

      removeAnnotation: (id) => {
        const { annotations } = get();
        set({ annotations: annotations.filter(a => a.id !== id) });
      },

      clearAnnotations: () => set({ annotations: [] }),
      setIsAnnotating: (annotating) => set({ isAnnotating: annotating }),
      setAnnotationColor: (color) => set({ annotationColor: color }),

      // NEW: Export
      setExportFormat: (format) => set({ exportFormat: format }),

      // NEW: 360° View
      set360ViewOpen: (isOpen) => set({ is360ViewOpen: isOpen }),

      reset: () => set({
        ...initialState,
        history: get().history, // Preserve history
        shortcuts: get().shortcuts,
      }),
    }),
    {
      name: 'gestour-storage',
      partialize: (state) => ({
        voiceEnabled: state.voiceEnabled,
        dwellClickEnabled: state.dwellClickEnabled,
        dwellClickDelay: state.dwellClickDelay,
        pointerSensitivity: state.pointerSensitivity,
        pointerSmoothing: state.pointerSmoothing,
        history: state.history,
        keyboardShortcutsEnabled: state.keyboardShortcutsEnabled,
        voiceCommandsEnabled: state.voiceCommandsEnabled,
        performanceMode: state.performanceMode,
        annotationColor: state.annotationColor,
        exportFormat: state.exportFormat,
      }),
    }
  )
);
