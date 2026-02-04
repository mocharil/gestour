'use client';

import { useEffect, useRef, useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { stopSpeaking, setVoiceEnabled } from '../lib/voiceService';

export function ImageDisplay() {
  const {
    uploadedImage,
    pointer,
    handDetected,
    status,
    gesture,
    zoom,
    pan,
    detection,
    isDetecting,
    isAnalyzing,
    voiceEnabled,
    clearDetection,
    setVoiceEnabled: setStoreVoiceEnabled,
  } = useTrackerStore();

  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);
  const lastGestureRef = useRef(gesture);

  // Show click effect when pinch detected
  useEffect(() => {
    if (gesture === 'pinch' && lastGestureRef.current !== 'pinch' && pointer) {
      setClickEffect({ x: pointer.x * 100, y: pointer.y * 100 });
      setTimeout(() => setClickEffect(null), 300);
    }
    lastGestureRef.current = gesture;
  }, [gesture, pointer]);

  const toggleVoice = () => {
    const newValue = !voiceEnabled;
    setStoreVoiceEnabled(newValue);
    setVoiceEnabled(newValue);
    if (!newValue) {
      stopSpeaking();
    }
  };

  if (!uploadedImage) return null;

  const isActive = status === 'active';
  const pointerX = pointer ? pointer.x * 100 : 50;
  const pointerY = pointer ? pointer.y * 100 : 50;

  // Pointer styles based on gesture
  const getPointerStyle = () => {
    switch (gesture) {
      case 'pinch':
        return {
          ring: 'w-10 h-10 border-4 border-[var(--accent)] bg-[var(--accent)]/30',
          dot: 'w-4 h-4 bg-[var(--accent)]',
          showCrosshair: false,
        };
      case 'peace':
        return {
          ring: 'w-16 h-16 border-4 border-purple-400 bg-purple-400/20',
          dot: 'w-5 h-5 bg-purple-400',
          showCrosshair: true,
        };
      case 'fist':
        return {
          ring: 'w-20 h-20 border-4 border-blue-400 animate-pulse',
          dot: 'w-6 h-6 bg-blue-400',
          showCrosshair: false,
        };
      case 'open':
        return {
          ring: 'w-20 h-20 border-4 border-yellow-400 animate-pulse',
          dot: 'w-6 h-6 bg-yellow-400',
          showCrosshair: false,
        };
      case 'thumbsUp':
        return {
          ring: 'w-16 h-16 border-4 border-green-400 bg-green-400/20 animate-pulse',
          dot: 'w-5 h-5 bg-green-400',
          showCrosshair: true,
        };
      case 'threeFingers':
        return {
          ring: 'w-20 h-20 border-4 border-pink-400 bg-pink-400/20 animate-pulse',
          dot: 'w-6 h-6 bg-pink-400',
          showCrosshair: false,
        };
      default:
        return {
          ring: 'w-14 h-14 border-2 border-[var(--accent)] opacity-60',
          dot: 'w-4 h-4 bg-[var(--accent)]',
          showCrosshair: true,
        };
    }
  };

  const pointerStyle = getPointerStyle();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)] overflow-hidden">
      {/* Image container with zoom and pan */}
      <div
        className="relative transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        <img
          src={uploadedImage}
          alt="Uploaded"
          className="max-w-[90vw] max-h-[85vh] object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Pointer overlay */}
      {isActive && pointer && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${pointerX}%`,
            top: `${pointerY}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.05s ease-out, top 0.05s ease-out',
          }}
        >
          <div className={`rounded-full ${pointerStyle.ring}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg ${pointerStyle.dot}`} />
          {pointerStyle.showCrosshair && (
            <>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-current -translate-y-1/2 opacity-40" style={{ color: gesture === 'peace' ? '#a78bfa' : gesture === 'thumbsUp' ? '#4ade80' : 'var(--accent)' }} />
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-current -translate-x-1/2 opacity-40" style={{ color: gesture === 'peace' ? '#a78bfa' : gesture === 'thumbsUp' ? '#4ade80' : 'var(--accent)' }} />
            </>
          )}
        </div>
      )}

      {/* Click effect ripple */}
      {clickEffect && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${clickEffect.x}%`,
            top: `${clickEffect.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-[var(--accent)] animate-ping" />
        </div>
      )}

      {/* Detection loading indicator */}
      {isDetecting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-4 bg-[var(--surface)]/95 border border-[var(--border)] rounded-xl z-30 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text)]">AI sedang menganalisis objek...</p>
        </div>
      )}

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-4 bg-[var(--surface)]/95 border border-pink-400 rounded-xl z-30 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text)]">AI sedang menganalisis seluruh gambar...</p>
        </div>
      )}

      {/* Enhanced Detection result popup */}
      {detection && !isDetecting && (
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[420px] max-w-[90vw] bg-[var(--surface)]/95 border border-[var(--accent)] rounded-2xl z-30 shadow-2xl overflow-hidden cursor-pointer"
          onClick={() => clearDetection()}
        >
          {/* Header */}
          <div className="px-5 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-medium text-[var(--text-dim)]">Objek Terdeteksi</span>
            </div>
            <button className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Object name and category */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-[var(--accent)]">{detection.object}</h3>
                {detection.category && (
                  <span className="px-2 py-0.5 bg-[var(--bg)] rounded text-xs text-[var(--text-dim)]">
                    {detection.category}
                  </span>
                )}
              </div>
              <p className="text-[var(--text)]">{detection.description}</p>
            </div>

            {/* Fun fact */}
            {detection.funFact && (
              <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <p className="text-xs font-medium text-yellow-400 mb-1">Fakta Menarik</p>
                    <p className="text-sm text-[var(--text)]">{detection.funFact}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Related info */}
            {detection.relatedInfo && (
              <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-lg">📚</span>
                  <div>
                    <p className="text-xs font-medium text-blue-400 mb-1">Info Tambahan</p>
                    <p className="text-sm text-[var(--text)]">{detection.relatedInfo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Confidence */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--text-dim)]">Confidence Level</span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                detection.confidence === 'high'
                  ? 'bg-green-500/20 text-green-400'
                  : detection.confidence === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {detection.confidence === 'high' ? '✓ Tinggi' : detection.confidence === 'medium' ? '~ Sedang' : '? Rendah'}
              </span>
            </div>
          </div>

          <div className="px-5 py-2 bg-[var(--bg)]/50 text-center">
            <p className="text-xs text-[var(--text-dim)]">Klik untuk menutup</p>
          </div>
        </div>
      )}

      {/* No hand message */}
      {isActive && !handDetected && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[var(--surface)]/95 border border-[var(--border)] rounded-full z-20">
          <p className="text-[var(--text-dim)]">Tunjukkan tangan ke kamera</p>
        </div>
      )}

      {/* Zoom indicator */}
      {zoom !== 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--surface)]/90 border border-[var(--border)] rounded-full z-20">
          <p className="text-sm text-[var(--text)]">
            Zoom: {Math.round(zoom * 100)}%
          </p>
        </div>
      )}

      {/* Voice toggle button */}
      <button
        onClick={toggleVoice}
        className={`absolute top-4 left-4 px-3 py-2 rounded-lg z-20 flex items-center gap-2 transition-colors ${
          voiceEnabled
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-[var(--surface)]/90 text-[var(--text-dim)] border border-[var(--border)]'
        }`}
      >
        <span>{voiceEnabled ? '🔊' : '🔇'}</span>
        <span className="text-xs font-medium">{voiceEnabled ? 'Suara ON' : 'Suara OFF'}</span>
      </button>

      {/* Gesture hint */}
      <div className="absolute bottom-4 left-4 p-3 bg-[var(--surface)]/90 border border-[var(--border)] rounded-lg z-20 text-xs">
        <p className="text-[var(--text)] font-medium mb-2">Gesture Controls</p>
        <div className="space-y-1.5">
          <p className="text-[var(--text-dim)]">
            <span className="text-[var(--text)]">☝️</span> Telunjuk = Pointer
          </p>
          <p className="text-[var(--text-dim)]">
            <span className="text-green-400">👍</span> Jempol = Deteksi AI + Suara
          </p>
          <p className="text-[var(--text-dim)]">
            <span className="text-pink-400">🤟</span> 3 Jari = Analisis Full
          </p>
          <p className="text-[var(--text-dim)]">
            <span className="text-[var(--accent)]">🤏</span> Pinch = Klik
          </p>
          <p className="text-[var(--text-dim)]">
            <span className="text-blue-400">✊</span> Kepalan = Zoom+
          </p>
          <p className="text-[var(--text-dim)]">
            <span className="text-yellow-400">🖐️</span> Telapak = Zoom-
          </p>
          <p className="text-[var(--text-dim)]">
            <span className="text-purple-400">✌️</span> Peace = Drag
          </p>
        </div>
      </div>

      {/* Current gesture indicator */}
      {isActive && gesture !== 'none' && gesture !== 'point' && (
        <div className="absolute top-4 right-4 px-4 py-2 bg-[var(--surface)]/90 border border-[var(--border)] rounded-full z-20">
          <p className="text-sm font-medium" style={{
            color: gesture === 'pinch' ? 'var(--accent)' :
                   gesture === 'fist' ? '#60a5fa' :
                   gesture === 'open' ? '#facc15' :
                   gesture === 'peace' ? '#a78bfa' :
                   gesture === 'thumbsUp' ? '#4ade80' :
                   gesture === 'threeFingers' ? '#f472b6' : 'var(--text)'
          }}>
            {gesture === 'pinch' && '🤏 Klik!'}
            {gesture === 'fist' && '✊ Zoom In'}
            {gesture === 'open' && '🖐️ Zoom Out'}
            {gesture === 'peace' && '✌️ Dragging...'}
            {gesture === 'thumbsUp' && '👍 Deteksi AI...'}
            {gesture === 'threeFingers' && '🔍 Menganalisis...'}
          </p>
        </div>
      )}
    </div>
  );
}
