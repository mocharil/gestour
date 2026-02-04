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

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('gestour-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('gestour-onboarding-seen', 'true');
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
    <div className="fixed inset-0 bg-[var(--bg-primary)] flex flex-col">
      {/* Onboarding */}
      {showOnboarding && <OnboardingScreen onComplete={handleOnboardingComplete} />}

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Header */}
      <header className="relative z-30 border-b border-[var(--glass-border)]">
        <div className="glass-card-static rounded-none border-0 border-b border-[var(--glass-border)]">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] shadow-lg shadow-[var(--accent-primary)]/25">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">Gestour</h1>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-tertiary)]/20 text-[var(--accent-primary-light)] font-medium">
                    Gemini AI
                  </span>
                </div>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Stats - Hidden on mobile when no image */}
              {isActive && (
                <div className="hidden lg:flex items-center gap-2">
                  <div className="badge badge-info">
                    <span className="font-mono">{fps}</span> FPS
                  </div>
                  <div className={`badge ${handDetected ? 'badge-success' : 'badge-danger'}`}>
                    {handDetected ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Tangan Terdeteksi
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Tidak ada tangan
                      </>
                    )}
                  </div>
                  {gesture !== 'none' && gesture !== 'point' && (
                    <div className="badge badge-info">
                      {gesture === 'pinch' && '🤏 Klik'}
                      {gesture === 'fist' && '✊ Zoom+'}
                      {gesture === 'open' && '🖐️ Zoom-'}
                      {gesture === 'peace' && '✌️ Drag'}
                      {gesture === 'thumbsUp' && '👍 AI'}
                      {gesture === 'threeFingers' && '🔍 Analisis'}
                    </div>
                  )}
                  {zoom !== 1 && (
                    <div className="badge">
                      Zoom: <span className="font-mono">{Math.round(zoom * 100)}%</span>
                    </div>
                  )}
                </div>
              )}

              <Badge status={status} />

              {/* Settings button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] rounded-xl transition-all"
                title="Pengaturan"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {hasImage && zoom !== 1 && (
                <Button variant="ghost" size="sm" onClick={handleResetZoom}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Reset Zoom</span>
                </Button>
              )}

              {hasImage && (
                <Button variant="secondary" size="sm" onClick={handleChangeImage}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Ganti Gambar</span>
                </Button>
              )}

              {isActive && (
                <Button variant="danger" size="sm" onClick={handleReset}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
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
