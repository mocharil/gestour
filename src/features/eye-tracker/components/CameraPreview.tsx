'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { useMediaPipe } from '../hooks/useMediaPipe';
import { useFpsCounter } from '../hooks/useFpsCounter';
import { drawHandLandmarks } from '../lib/drawing';
import { detectGesture, detectPinch, getPointerPosition, getPeaceCenter } from '../lib/gestures';
import { detectObject, analyzeFullImage } from '../lib/geminiService';
import { speakDetectionResult } from '../lib/voiceService';
import type { HandsResults, GestureType } from '../lib/types';

export function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [minimized, setMinimized] = useState(false);

  const lastGestureRef = useRef<GestureType>('none');
  const gestureStartTimeRef = useRef<number>(0);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Dwell click refs
  const dwellStartTimeRef = useRef<number>(0);
  const dwellPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);

  const {
    status,
    gesture,
    uploadedImage,
    isDetecting,
    isAnalyzing,
    voiceEnabled,
    dwellClickEnabled,
    dwellClickDelay,
    pointerSmoothing,
    setStatus,
    setPointer,
    setHandDetected,
    setFps,
    setErrorMessage,
    setGesture,
    setPinching,
    registerClick,
    zoomIn,
    zoomOut,
    startDrag,
    updateDrag,
    endDrag,
    setDetection,
    setIsDetecting,
    setFullAnalysis,
    setIsAnalyzing,
  } = useTrackerStore();

  const { tick: tickFps } = useFpsCounter();

  const handleResults = useCallback((results: HandsResults) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height);

      const currentGesture = detectGesture(landmarks);
      const pinchResult = detectPinch(landmarks);

      setGesture(currentGesture);
      setPinching(currentGesture === 'pinch', pinchResult.distance);
      setHandDetected(true);

      // Get position based on gesture
      let position = getPointerPosition(landmarks);

      if (currentGesture === 'peace') {
        position = getPeaceCenter(landmarks);
      }

      // Store pointer position for point gesture (to use for AI detection)
      if (currentGesture === 'point') {
        lastPointerPosRef.current = position;
      }

      setPointer(position);

      // DWELL CLICK - Track position stability for tremor-friendly clicking
      if (dwellClickEnabled && currentGesture === 'point') {
        const dwellThreshold = 0.02; // 2% movement threshold
        const now = Date.now();

        if (dwellPositionRef.current) {
          const dx = Math.abs(position.x - dwellPositionRef.current.x);
          const dy = Math.abs(position.y - dwellPositionRef.current.y);
          const moved = dx > dwellThreshold || dy > dwellThreshold;

          if (moved) {
            // Reset dwell if moved too much
            dwellStartTimeRef.current = now;
            dwellPositionRef.current = position;
            setDwellProgress(0);
          } else {
            // Calculate progress
            const elapsed = now - dwellStartTimeRef.current;
            const progress = Math.min(elapsed / dwellClickDelay, 1);
            setDwellProgress(progress);

            // Trigger click when dwell complete
            if (elapsed >= dwellClickDelay) {
              registerClick();
              dwellStartTimeRef.current = now;
              setDwellProgress(0);
            }
          }
        } else {
          dwellPositionRef.current = position;
          dwellStartTimeRef.current = now;
        }
      } else {
        setDwellProgress(0);
        dwellPositionRef.current = null;
      }

      // Handle gesture changes
      const gestureChanged = currentGesture !== lastGestureRef.current;

      if (gestureChanged) {
        const now = Date.now();

        // PINCH - Click detection (visual only, no AI)
        if (currentGesture === 'pinch') {
          const clickType = registerClick();
          if (clickType === 'double') {
            zoomIn();
          }
        }

        // THUMBS UP - Trigger AI detection
        if (currentGesture === 'thumbsUp' && uploadedImage && !isDetecting) {
          setIsDetecting(true);
          detectObject(uploadedImage, lastPointerPosRef.current.x, lastPointerPosRef.current.y)
            .then((result) => {
              setDetection(result);
              // Voice narration
              if (result && voiceEnabled) {
                speakDetectionResult(result.object, result.description);
              }
            })
            .finally(() => {
              setIsDetecting(false);
            });
        }

        // THREE FINGERS - Trigger full image analysis
        if (currentGesture === 'threeFingers' && uploadedImage && !isAnalyzing) {
          setIsAnalyzing(true);
          analyzeFullImage(uploadedImage)
            .then((result) => {
              setFullAnalysis(result);
            })
            .finally(() => {
              setIsAnalyzing(false);
            });
        }

        // FIST - Zoom In
        if (currentGesture === 'fist') {
          gestureStartTimeRef.current = now;
        }
        if (lastGestureRef.current === 'fist' && now - gestureStartTimeRef.current > 200) {
          zoomIn();
        }

        // OPEN - Zoom Out
        if (currentGesture === 'open') {
          gestureStartTimeRef.current = now;
        }
        if (lastGestureRef.current === 'open' && now - gestureStartTimeRef.current > 200) {
          zoomOut();
        }

        // PEACE - Start/End Drag
        if (currentGesture === 'peace') {
          dragStartPosRef.current = position;
          startDrag(position);
        }
        if (lastGestureRef.current === 'peace' && currentGesture !== 'peace') {
          endDrag();
          dragStartPosRef.current = null;
        }

        lastGestureRef.current = currentGesture;
      }

      // Continue drag if peace gesture
      if (currentGesture === 'peace' && dragStartPosRef.current) {
        updateDrag(position);
      }

    } else {
      setPointer(null);
      setHandDetected(false);
      setGesture('none');
      setPinching(false);

      if (lastGestureRef.current === 'peace') {
        endDrag();
      }
      lastGestureRef.current = 'none';
      dragStartPosRef.current = null;
    }

    const fps = tickFps();
    setFps(fps);
  }, [
    setPointer,
    setHandDetected,
    setFps,
    tickFps,
    setGesture,
    setPinching,
    registerClick,
    zoomIn,
    zoomOut,
    startDrag,
    updateDrag,
    endDrag,
    dwellClickEnabled,
    dwellClickDelay,
    uploadedImage,
    isDetecting,
    isAnalyzing,
    voiceEnabled,
    setDetection,
    setIsDetecting,
    setFullAnalysis,
    setIsAnalyzing,
  ]);

  const handleStatusChange = useCallback((newStatus: typeof status) => {
    setStatus(newStatus);
  }, [setStatus]);

  const handleError = useCallback((error: string) => {
    setErrorMessage(error);
  }, [setErrorMessage]);

  const { start } = useMediaPipe({
    onResults: handleResults,
    onStatusChange: handleStatusChange,
    onError: handleError,
  });

  useEffect(() => {
    if (status === 'idle' && videoRef.current) {
      setStatus('loading');
    }
  }, [status, setStatus]);

  useEffect(() => {
    if (status === 'loading' && videoRef.current) {
      start(videoRef.current);
    }
  }, [status, start]);

  const isLoading = status === 'loading';

  // Gesture display info
  const gestureInfo: Record<GestureType, { label: string; color: string }> = {
    none: { label: 'Tidak dikenali', color: 'text-[var(--text-dim)]' },
    point: { label: '☝️ Point', color: 'text-[var(--text)]' },
    pinch: { label: '🤏 Klik!', color: 'text-[var(--accent)]' },
    fist: { label: '✊ Zoom In', color: 'text-blue-400' },
    open: { label: '🖐️ Zoom Out', color: 'text-yellow-400' },
    peace: { label: '✌️ Drag', color: 'text-purple-400' },
    thumbsUp: { label: '👍 Deteksi AI', color: 'text-green-400' },
    threeFingers: { label: '🔍 Analisis Full', color: 'text-pink-400' },
  };

  const currentGestureInfo = gestureInfo[gesture] || gestureInfo.none;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        minimized ? 'w-16 h-16' : 'w-80 h-60'
      }`}
    >
      <button
        onClick={() => setMinimized(!minimized)}
        className="absolute -top-2 -left-2 w-8 h-8 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors z-10"
      >
        {minimized ? '↗' : '↙'}
      </button>

      <div className={`relative w-full h-full bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl overflow-hidden shadow-2xl transition-colors`}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover video-mirror"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="absolute inset-0 w-full h-full video-mirror"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/90">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!minimized && (
          <div className={`absolute top-2 left-2 px-2 py-1 bg-[var(--bg)]/80 rounded text-sm font-medium ${currentGestureInfo.color}`}>
            {currentGestureInfo.label}
          </div>
        )}

        {/* Dwell progress indicator */}
        {!minimized && dwellClickEnabled && dwellProgress > 0 && (
          <div className="absolute top-2 right-2 w-8 h-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="var(--border)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeDasharray={`${dwellProgress * 100} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs text-[var(--accent)]">
              {Math.round(dwellProgress * 100)}%
            </span>
          </div>
        )}

        {!minimized && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-[var(--bg)]/80 rounded text-xs text-[var(--text-dim)]">
            Kamera
          </div>
        )}
      </div>
    </div>
  );
}
