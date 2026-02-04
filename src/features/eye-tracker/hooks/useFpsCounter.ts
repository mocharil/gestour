'use client';

import { useRef, useCallback } from 'react';

export function useFpsCounter() {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsRef = useRef(0);

  const tick = useCallback(() => {
    frameCountRef.current++;
    const now = performance.now();
    const elapsed = now - lastTimeRef.current;

    if (elapsed >= 1000) {
      fpsRef.current = Math.round((frameCountRef.current * 1000) / elapsed);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    return fpsRef.current;
  }, []);

  const reset = useCallback(() => {
    frameCountRef.current = 0;
    lastTimeRef.current = performance.now();
    fpsRef.current = 0;
  }, []);

  return { tick, reset, getFps: () => fpsRef.current };
}
