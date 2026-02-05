'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { useMediaPipe } from '../hooks/useMediaPipe';
import { useFpsCounter } from '../hooks/useFpsCounter';
import { drawHandLandmarks } from '../lib/drawing';
import { detectGesture, detectPinch, getPointerPosition, getPeaceCenter } from '../lib/gestures';
import type { HandsResults, GestureType } from '../lib/types';

export function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [minimized, setMinimized] = useState(false);

  const lastGestureRef = useRef<GestureType>('none');
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const dwellStartTimeRef = useRef<number>(0);
  const dwellPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);

  const {
    status,
    gesture,
    fps,
    dwellClickEnabled,
    dwellClickDelay,
    setStatus,
    setPointer,
    setHandDetected,
    setFps,
    setErrorMessage,
    setGesture,
    setPinching,
    registerClick,
    startDrag,
    updateDrag,
    endDrag,
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

      let position = getPointerPosition(landmarks);

      if (currentGesture === 'peace') {
        position = getPeaceCenter(landmarks);
      }

      setPointer(position);

      if (dwellClickEnabled && currentGesture === 'point') {
        const dwellThreshold = 0.02;
        const now = Date.now();

        if (dwellPositionRef.current) {
          const dx = Math.abs(position.x - dwellPositionRef.current.x);
          const dy = Math.abs(position.y - dwellPositionRef.current.y);
          const moved = dx > dwellThreshold || dy > dwellThreshold;

          if (moved) {
            dwellStartTimeRef.current = now;
            dwellPositionRef.current = position;
            setDwellProgress(0);
          } else {
            const elapsed = now - dwellStartTimeRef.current;
            const progress = Math.min(elapsed / dwellClickDelay, 1);
            setDwellProgress(progress);

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

      const gestureChanged = currentGesture !== lastGestureRef.current;

      if (gestureChanged) {
        if (currentGesture === 'pinch') {
          registerClick();
        }

        // Peace gesture for 360° rotation drag
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

    const fpsValue = tickFps();
    setFps(fpsValue);
  }, [
    setPointer,
    setHandDetected,
    setFps,
    tickFps,
    setGesture,
    setPinching,
    registerClick,
    startDrag,
    updateDrag,
    endDrag,
    dwellClickEnabled,
    dwellClickDelay,
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

  const gestureInfo: Record<GestureType, { label: string; color: string; icon: string }> = {
    none: { label: 'Show hand', color: 'text-[var(--text-tertiary)]', icon: '👋' },
    point: { label: 'Point', color: 'text-[var(--text-primary)]', icon: '☝️' },
    pinch: { label: 'Select', color: 'text-[var(--accent-primary)]', icon: '🤏' },
    fist: { label: 'Fist', color: 'text-[var(--accent-secondary)]', icon: '✊' },
    open: { label: 'Open', color: 'text-[var(--accent-warning)]', icon: '🖐️' },
    peace: { label: 'Rotate 360°', color: 'text-purple-400', icon: '✌️' },
    thumbsUp: { label: 'Thumbs Up', color: 'text-[var(--accent-success)]', icon: '👍' },
    threeFingers: { label: '3 Fingers', color: 'text-pink-400', icon: '🤟' },
  };

  const currentGestureInfo = gestureInfo[gesture] || gestureInfo.none;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out ${
        minimized
          ? 'bottom-4 right-4 w-16 h-16'
          : 'bottom-4 right-4 w-72 h-52'
      }`}
    >
      {/* Main container */}
      <div className={`
        relative w-full h-full overflow-hidden
        glass-card-static
        transition-all duration-300
        ${status === 'active' ? 'border-[var(--accent-success)]/30' : ''}
      `}>
        {/* Video feed */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover video-mirror"
          playsInline
          muted
        />

        {/* Canvas overlay for landmarks */}
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="absolute inset-0 w-full h-full video-mirror"
        />

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)]/90 backdrop-blur-sm">
            <div className="relative mb-3">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)]/30" />
              <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Loading camera...</p>
          </div>
        )}

        {/* Minimized state overlay */}
        {minimized && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/60 backdrop-blur-sm">
            <span className="text-2xl">{currentGestureInfo.icon}</span>
          </div>
        )}

        {/* Top bar - gesture info */}
        {!minimized && (
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <div className={`
              px-2.5 py-1 rounded-lg text-xs font-medium
              bg-[var(--bg-primary)]/80 backdrop-blur-sm
              ${currentGestureInfo.color}
            `}>
              <span className="mr-1.5">{currentGestureInfo.icon}</span>
              {currentGestureInfo.label}
            </div>

            {/* FPS indicator */}
            <div className="px-2 py-1 rounded-lg text-[10px] font-medium bg-[var(--bg-primary)]/80 backdrop-blur-sm text-[var(--text-tertiary)]">
              {fps} FPS
            </div>
          </div>
        )}

        {/* Dwell progress indicator */}
        {!minimized && dwellClickEnabled && dwellProgress > 0 && (
          <div className="absolute top-12 right-2">
            <div className="relative w-10 h-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="var(--glass-border)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="3"
                  strokeDasharray={`${dwellProgress * 88} 88`}
                  strokeLinecap="round"
                  className="transition-all duration-100"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--accent-primary)]">
                {Math.round(dwellProgress * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Bottom bar - status */}
        {!minimized && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-primary)]/80 backdrop-blur-sm">
              <span className={`relative flex h-2 w-2 ${status === 'active' ? '' : 'opacity-50'}`}>
                {status === 'active' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-success)] opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  status === 'active' ? 'bg-[var(--accent-success)]' :
                  status === 'loading' ? 'bg-[var(--accent-warning)]' :
                  'bg-[var(--text-tertiary)]'
                }`} />
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]">
                {status === 'active' ? 'Camera active' :
                 status === 'loading' ? 'Loading...' : 'Inactive'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setMinimized(!minimized)}
        className={`
          absolute -top-2 -left-2 w-7 h-7
          flex items-center justify-center
          glass-card-static rounded-full
          text-[var(--text-secondary)] hover:text-[var(--text-primary)]
          hover:bg-[var(--glass-bg-hover)]
          transition-all duration-200
          z-10
        `}
      >
        {minimized ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        )}
      </button>
    </div>
  );
}
