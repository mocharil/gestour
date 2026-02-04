'use client';

import { useEffect, useRef, useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { stopSpeaking, setVoiceEnabled } from '../lib/voiceService';
import { Button } from '@/components/ui/Button';

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
  const [showGestureGuide, setShowGestureGuide] = useState(false);
  const lastGestureRef = useRef(gesture);

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

  const getPointerStyle = () => {
    const baseClasses = 'transition-all duration-150 ease-out';
    switch (gesture) {
      case 'pinch':
        return {
          ring: `${baseClasses} w-12 h-12 border-[3px] border-[var(--accent-primary)] bg-[var(--accent-primary)]/20 shadow-[0_0_20px_var(--accent-primary)]`,
          dot: 'w-3 h-3 bg-[var(--accent-primary)]',
          showCrosshair: false,
          color: 'var(--accent-primary)',
        };
      case 'peace':
        return {
          ring: `${baseClasses} w-16 h-16 border-[3px] border-[var(--accent-tertiary)] bg-[var(--accent-tertiary)]/10`,
          dot: 'w-4 h-4 bg-[var(--accent-tertiary)]',
          showCrosshair: true,
          color: 'var(--accent-tertiary)',
        };
      case 'fist':
        return {
          ring: `${baseClasses} w-20 h-20 border-[3px] border-[var(--accent-secondary)] animate-pulse-ring`,
          dot: 'w-5 h-5 bg-[var(--accent-secondary)]',
          showCrosshair: false,
          color: 'var(--accent-secondary)',
        };
      case 'open':
        return {
          ring: `${baseClasses} w-20 h-20 border-[3px] border-[var(--accent-warning)] animate-pulse-ring`,
          dot: 'w-5 h-5 bg-[var(--accent-warning)]',
          showCrosshair: false,
          color: 'var(--accent-warning)',
        };
      case 'thumbsUp':
        return {
          ring: `${baseClasses} w-16 h-16 border-[3px] border-[var(--accent-success)] bg-[var(--accent-success)]/10 animate-pulse-ring`,
          dot: 'w-4 h-4 bg-[var(--accent-success)]',
          showCrosshair: true,
          color: 'var(--accent-success)',
        };
      case 'threeFingers':
        return {
          ring: `${baseClasses} w-20 h-20 border-[3px] border-pink-500 bg-pink-500/10 animate-pulse-ring`,
          dot: 'w-5 h-5 bg-pink-500',
          showCrosshair: false,
          color: '#ec4899',
        };
      default:
        return {
          ring: `${baseClasses} w-14 h-14 border-2 border-[var(--text-secondary)]/50`,
          dot: 'w-3 h-3 bg-[var(--text-primary)]',
          showCrosshair: true,
          color: 'var(--text-secondary)',
        };
    }
  };

  const pointerStyle = getPointerStyle();

  const gestures = [
    { icon: '☝️', name: 'Telunjuk', action: 'Pointer', color: 'text-[var(--text-primary)]' },
    { icon: '👍', name: 'Jempol', action: 'Deteksi AI', color: 'text-[var(--accent-success)]' },
    { icon: '🤟', name: '3 Jari', action: 'Analisis Full', color: 'text-pink-400' },
    { icon: '🤏', name: 'Pinch', action: 'Klik', color: 'text-[var(--accent-primary)]' },
    { icon: '✊', name: 'Kepalan', action: 'Zoom+', color: 'text-[var(--accent-secondary)]' },
    { icon: '🖐️', name: 'Telapak', action: 'Zoom-', color: 'text-[var(--accent-warning)]' },
    { icon: '✌️', name: 'Peace', action: 'Drag', color: 'text-[var(--accent-tertiary)]' },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden">
      {/* Image container */}
      <div
        className="relative transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        <img
          src={uploadedImage}
          alt="Uploaded"
          className="max-w-[90vw] max-h-[85vh] object-contain select-none rounded-lg"
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
              <div
                className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 opacity-30"
                style={{ background: `linear-gradient(90deg, transparent, ${pointerStyle.color}, transparent)` }}
              />
              <div
                className="absolute top-0 left-1/2 w-[1px] h-full -translate-x-1/2 opacity-30"
                style={{ background: `linear-gradient(180deg, transparent, ${pointerStyle.color}, transparent)` }}
              />
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
          <div className="w-20 h-20 rounded-full border-2 border-[var(--accent-primary)] animate-ping opacity-75" />
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-[var(--accent-primary)]/20 animate-ping" style={{ animationDelay: '0.1s' }} />
        </div>
      )}

      {/* Detection loading indicator */}
      {isDetecting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-fade-in-scale">
          <div className="glass-card-static px-6 py-4 flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--accent-success)]/30" />
              <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-[var(--accent-success)] border-t-transparent animate-spin" />
            </div>
            <div>
              <p className="text-[var(--text-primary)] font-medium">Menganalisis objek...</p>
              <p className="text-[var(--text-tertiary)] text-sm">AI sedang memproses</p>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-fade-in-scale">
          <div className="glass-card-static px-6 py-4 flex items-center gap-4 border-pink-500/30">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-pink-500/30" />
              <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
            </div>
            <div>
              <p className="text-[var(--text-primary)] font-medium">Menganalisis gambar...</p>
              <p className="text-[var(--text-tertiary)] text-sm">Mendeteksi semua objek</p>
            </div>
          </div>
        </div>
      )}

      {/* Detection result popup */}
      {detection && !isDetecting && (
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 w-[420px] max-w-[90vw] z-30 animate-fade-in-down cursor-pointer"
          onClick={() => clearDetection()}
        >
          <div className="glass-card-static overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 bg-gradient-to-r from-[var(--accent-success)]/10 to-[var(--accent-secondary)]/10 border-b border-[var(--glass-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-success)]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">Objek Terdeteksi</span>
              </div>
              <button className="w-6 h-6 rounded-md hover:bg-[var(--glass-bg)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold gradient-text">{detection.object}</h3>
                  {detection.category && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-[var(--glass-bg)] rounded-full text-[var(--text-tertiary)] uppercase tracking-wider">
                      {detection.category}
                    </span>
                  )}
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{detection.description}</p>
              </div>

              {detection.funFact && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--accent-warning)]/10 to-orange-500/10 border border-[var(--accent-warning)]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-warning)]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--accent-warning)] mb-1">Fakta Menarik</p>
                      <p className="text-sm text-[var(--text-secondary)]">{detection.funFact}</p>
                    </div>
                  </div>
                </div>
              )}

              {detection.relatedInfo && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--accent-secondary)]/10 to-[var(--accent-primary)]/10 border border-[var(--accent-secondary)]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-secondary)]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--accent-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--accent-secondary)] mb-1">Info Tambahan</p>
                      <p className="text-sm text-[var(--text-secondary)]">{detection.relatedInfo}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[var(--glass-border)]">
                <span className="text-xs text-[var(--text-tertiary)]">Confidence</span>
                <span className={`badge ${
                  detection.confidence === 'high' ? 'badge-success' :
                  detection.confidence === 'medium' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {detection.confidence === 'high' ? 'Tinggi' :
                   detection.confidence === 'medium' ? 'Sedang' : 'Rendah'}
                </span>
              </div>
            </div>

            <div className="px-5 py-2 bg-[var(--bg-secondary)]/50 text-center">
              <p className="text-xs text-[var(--text-muted)]">Klik untuk menutup</p>
            </div>
          </div>
        </div>
      )}

      {/* No hand message */}
      {isActive && !handDetected && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="glass-card-static px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">👋</span>
            <p className="text-[var(--text-secondary)] text-sm">Tunjukkan tangan ke kamera</p>
          </div>
        </div>
      )}

      {/* Zoom indicator */}
      {zoom !== 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="badge badge-info">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            {Math.round(zoom * 100)}%
          </div>
        </div>
      )}

      {/* Voice toggle button */}
      <button
        onClick={toggleVoice}
        className={`absolute top-4 left-4 z-20 glass-card-static px-4 py-2 flex items-center gap-2 hover:bg-[var(--glass-bg-hover)] transition-all ${
          voiceEnabled ? 'border-[var(--accent-success)]/30' : ''
        }`}
      >
        {voiceEnabled ? (
          <svg className="w-5 h-5 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
        <span className={`text-xs font-medium ${voiceEnabled ? 'text-[var(--accent-success)]' : 'text-[var(--text-tertiary)]'}`}>
          {voiceEnabled ? 'Suara ON' : 'Suara OFF'}
        </span>
      </button>

      {/* Gesture guide toggle */}
      <button
        onClick={() => setShowGestureGuide(!showGestureGuide)}
        className="absolute bottom-4 left-4 z-20 glass-card-static p-2 hover:bg-[var(--glass-bg-hover)] transition-all"
      >
        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Gesture guide panel */}
      {showGestureGuide && (
        <div className="absolute bottom-16 left-4 z-20 animate-fade-in-up">
          <div className="glass-card-static p-4 w-56">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Gesture Controls</h4>
              <button
                onClick={() => setShowGestureGuide(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {gestures.map((g, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--glass-border)] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{g.icon}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">{g.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${g.color}`}>{g.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current gesture indicator */}
      {isActive && gesture !== 'none' && gesture !== 'point' && (
        <div className="absolute top-4 right-4 z-20 animate-fade-in">
          <div className="glass-card-static px-4 py-2 flex items-center gap-2">
            <span className="text-lg">
              {gesture === 'pinch' && '🤏'}
              {gesture === 'fist' && '✊'}
              {gesture === 'open' && '🖐️'}
              {gesture === 'peace' && '✌️'}
              {gesture === 'thumbsUp' && '👍'}
              {gesture === 'threeFingers' && '🔍'}
            </span>
            <span className="text-sm font-medium" style={{
              color: gesture === 'pinch' ? 'var(--accent-primary)' :
                     gesture === 'fist' ? 'var(--accent-secondary)' :
                     gesture === 'open' ? 'var(--accent-warning)' :
                     gesture === 'peace' ? 'var(--accent-tertiary)' :
                     gesture === 'thumbsUp' ? 'var(--accent-success)' :
                     gesture === 'threeFingers' ? '#ec4899' : 'var(--text-primary)'
            }}>
              {gesture === 'pinch' && 'Klik!'}
              {gesture === 'fist' && 'Zoom In'}
              {gesture === 'open' && 'Zoom Out'}
              {gesture === 'peace' && 'Dragging...'}
              {gesture === 'thumbsUp' && 'Deteksi AI...'}
              {gesture === 'threeFingers' && 'Menganalisis...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
