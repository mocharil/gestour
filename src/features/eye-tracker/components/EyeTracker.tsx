'use client';

import { useCallback, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTrackerStore } from '../store/useTrackerStore';
import { ImageUploader } from './ImageUploader';
import { ImageDisplay } from './ImageDisplay';
import { CameraPreview } from './CameraPreview';
import { ChatPanel } from './ChatPanel';
import { FullAnalysisPanel } from './FullAnalysisPanel';
import { SettingsPanel } from './SettingsPanel';
import { OnboardingScreen } from './OnboardingScreen';

export function EyeTracker() {
  const {
    status,
    handDetected,
    fps,
    uploadedImage,
    gesture,
    zoom,
    setUploadedImage,
    resetTransform,
    reset,
  } = useTrackerStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if first time user
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('handsfree-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('handsfree-onboarding-seen', 'true');
    setShowOnboarding(false);
  };

  const handleChangeImage = useCallback(() => {
    setUploadedImage(null);
  }, [setUploadedImage]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const handleResetZoom = useCallback(() => {
    resetTransform();
  }, [resetTransform]);

  const isActive = status === 'active';
  const hasImage = !!uploadedImage;

  return (
    <div className="fixed inset-0 bg-[var(--bg)] flex flex-col">
      {/* Onboarding */}
      {showOnboarding && <OnboardingScreen onComplete={handleOnboardingComplete} />}

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text)]">HandsFree AI</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full">
                Gemini 3
              </span>
              <span className="text-xs text-[var(--text-dim)]">Accessibility Tool</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats */}
          {isActive && (
            <div className="hidden md:flex items-center gap-3 text-sm text-[var(--text-dim)]">
              <span className="px-2 py-1 bg-[var(--bg)] rounded">
                FPS: <span className="text-[var(--text)] font-mono">{fps}</span>
              </span>
              <span className={`px-2 py-1 rounded ${handDetected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {handDetected ? '✓ Tangan Terdeteksi' : '✗ Tidak ada tangan'}
              </span>
              {gesture !== 'none' && gesture !== 'point' && (
                <span className="px-2 py-1 bg-[var(--accent)]/20 text-[var(--accent)] rounded font-medium">
                  {gesture === 'pinch' && '🤏 Klik'}
                  {gesture === 'fist' && '✊ Zoom+'}
                  {gesture === 'open' && '🖐️ Zoom-'}
                  {gesture === 'peace' && '✌️ Drag'}
                  {gesture === 'thumbsUp' && '👍 AI'}
                  {gesture === 'threeFingers' && '🔍 Analisis'}
                </span>
              )}
              {zoom !== 1 && (
                <span className="px-2 py-1 bg-[var(--bg)] rounded">
                  Zoom: <span className="font-mono text-[var(--text)]">{Math.round(zoom * 100)}%</span>
                </span>
              )}
            </div>
          )}

          <Badge status={status} />

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--border)] rounded-lg transition-colors"
            title="Pengaturan"
          >
            ⚙️
          </button>

          {hasImage && zoom !== 1 && (
            <Button variant="secondary" size="sm" onClick={handleResetZoom}>
              Reset Zoom
            </Button>
          )}

          {hasImage && (
            <Button variant="secondary" size="sm" onClick={handleChangeImage}>
              Ganti Gambar
            </Button>
          )}

          {isActive && (
            <Button variant="danger" size="sm" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 relative">
        {!hasImage ? (
          <ImageUploader />
        ) : (
          <>
            <ImageDisplay />
            <CameraPreview />
            <ChatPanel />
            <FullAnalysisPanel />
          </>
        )}
      </div>
    </div>
  );
}
