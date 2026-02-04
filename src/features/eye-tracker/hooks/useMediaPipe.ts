'use client';

import { useRef, useCallback, useEffect } from 'react';
import type { TrackingStatus, HandsResults } from '../lib/types';

interface UseMediaPipeOptions {
  onResults: (results: HandsResults) => void;
  onStatusChange: (status: TrackingStatus) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Hands: new (config: { locateFile: (file: string) => string }) => HandsInstance;
    Camera: new (
      video: HTMLVideoElement,
      config: { onFrame: () => Promise<void>; width: number; height: number }
    ) => CameraInstance;
  }
}

interface HandsInstance {
  setOptions: (options: HandsOptions) => void;
  onResults: (callback: (results: HandsResults) => void) => void;
  send: (config: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
}

interface CameraInstance {
  start: () => Promise<void>;
  stop: () => void;
}

interface HandsOptions {
  maxNumHands: number;
  modelComplexity: number;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

const HANDS_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/';
const CAMERA_UTILS_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1632432234/';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export function useMediaPipe({ onResults, onStatusChange, onError }: UseMediaPipeOptions) {
  const handsRef = useRef<HandsInstance | null>(null);
  const cameraRef = useRef<CameraInstance | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const start = useCallback(async (video: HTMLVideoElement) => {
    try {
      onStatusChange('loading');
      videoRef.current = video;

      // Load MediaPipe scripts
      await loadScript(`${HANDS_CDN}hands.js`);
      await loadScript(`${CAMERA_UTILS_CDN}camera_utils.js`);

      // Initialize Hands
      const hands = new window.Hands({
        locateFile: (file: string) => `${HANDS_CDN}${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      // Initialize Camera
      const camera = new window.Camera(video, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720,
      });

      cameraRef.current = camera;
      await camera.start();
      onStatusChange('active');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize MediaPipe';
      onError(message);
      onStatusChange('error');
    }
  }, [onResults, onStatusChange, onError]);

  const stop = useCallback(() => {
    try {
      // Stop video tracks
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      // Try to stop camera if method exists
      if (cameraRef.current && typeof cameraRef.current.stop === 'function') {
        cameraRef.current.stop();
      }
      cameraRef.current = null;
      // Close hands model
      if (handsRef.current && typeof handsRef.current.close === 'function') {
        handsRef.current.close();
      }
      handsRef.current = null;
      videoRef.current = null;
    } catch (e) {
      console.warn('Error stopping camera:', e);
    }
    onStatusChange('idle');
  }, [onStatusChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        if (cameraRef.current && typeof cameraRef.current.stop === 'function') {
          cameraRef.current.stop();
        }
        if (handsRef.current && typeof handsRef.current.close === 'function') {
          handsRef.current.close();
        }
      } catch (e) {
        console.warn('Error in cleanup:', e);
      }
    };
  }, []);

  return { start, stop };
}
