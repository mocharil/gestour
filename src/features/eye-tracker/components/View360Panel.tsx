'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { generate360Views, View360 } from '../lib/geminiService';

interface View360PanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function View360Panel({ isOpen, onClose }: View360PanelProps) {
  const { uploadedImage, pointer, gesture } = useTrackerStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [views, setViews] = useState<View360[]>([]);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  const lastPointerXRef = useRef<number>(0.5);
  const isDraggingRef = useRef(false);

  // Handle gesture-based rotation
  useEffect(() => {
    if (!isOpen || views.length === 0) return;

    if (gesture === 'peace' && pointer) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
        lastPointerXRef.current = pointer.x;
      } else {
        const deltaX = pointer.x - lastPointerXRef.current;
        if (Math.abs(deltaX) > 0.05) {
          const direction = deltaX > 0 ? 1 : -1;
          setCurrentViewIndex(prev => {
            const newIndex = prev + direction;
            if (newIndex < 0) return views.length - 1;
            if (newIndex >= views.length) return 0;
            return newIndex;
          });
          lastPointerXRef.current = pointer.x;
        }
      }
    } else {
      isDraggingRef.current = false;
    }
  }, [gesture, pointer, isOpen, views.length]);

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate || views.length === 0) return;

    const interval = setInterval(() => {
      setCurrentViewIndex(prev => (prev + 1) % views.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRotate, views.length]);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setViews([]);

    // Simulate progress while generating
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 5, 90));
    }, 500);

    try {
      const result = await generate360Views(uploadedImage, 8);

      if (result && result.success) {
        setViews(result.views);
        setDescription(result.description);
        setCurrentViewIndex(0);
        setGenerationProgress(100);
      } else {
        setError('Failed to generate 360° views. Please try again.');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('An error occurred during generation.');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  }, [uploadedImage]);

  const handlePrevView = () => {
    setCurrentViewIndex(prev => (prev - 1 + views.length) % views.length);
  };

  const handleNextView = () => {
    setCurrentViewIndex(prev => (prev + 1) % views.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] m-4 glass-card-static overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">360° View Generator</h3>
              <p className="text-xs text-[var(--text-tertiary)]">Powered by Gemini 3 Pro Image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {views.length === 0 && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005 0" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Generate 360° Views
              </h4>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                AI will analyze your image and generate views from 8 different angles,
                allowing you to see the subject from all sides.
              </p>
              <button
                onClick={handleGenerate}
                disabled={!uploadedImage}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate 360° Views
                </span>
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--glass-border)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${generationProgress * 2.83} 283`}
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold gradient-text">{generationProgress}%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Generating 360° Views...
              </h4>
              <p className="text-[var(--text-secondary)] text-sm">
                AI is analyzing and generating views from different angles
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={handleGenerate}
                className="px-6 py-2 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] rounded-lg text-[var(--text-primary)] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {views.length > 0 && !isGenerating && (
            <div className="space-y-6">
              {/* Main View */}
              <div className="relative aspect-square max-h-[50vh] mx-auto rounded-2xl overflow-hidden bg-black/50">
                <img
                  src={views[currentViewIndex]?.image}
                  alt={views[currentViewIndex]?.label}
                  className="w-full h-full object-contain"
                />

                {/* Navigation arrows */}
                <button
                  onClick={handlePrevView}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card-static flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextView}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card-static flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* View label */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 glass-card-static rounded-full">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {views[currentViewIndex]?.label} ({views[currentViewIndex]?.angle}°)
                  </span>
                </div>
              </div>

              {/* Angle indicator */}
              <div className="flex items-center justify-center gap-2">
                {views.map((view, index) => (
                  <button
                    key={view.angle}
                    onClick={() => setCurrentViewIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentViewIndex
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                        : 'bg-[var(--glass-border)] hover:bg-[var(--text-tertiary)]'
                    }`}
                  />
                ))}
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {views.map((view, index) => (
                  <button
                    key={view.angle}
                    onClick={() => setCurrentViewIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentViewIndex
                        ? 'border-purple-500 ring-2 ring-purple-500/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={view.image}
                      alt={view.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    autoRotate
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'glass-card-static text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <svg className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {autoRotate ? 'Stop' : 'Auto Rotate'}
                </button>

                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 glass-card-static rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              </div>

              {/* Gesture hint */}
              <div className="text-center text-sm text-[var(--text-tertiary)]">
                <span className="inline-flex items-center gap-2">
                  <span className="text-lg">✌️</span>
                  Use Peace gesture + drag to rotate
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
