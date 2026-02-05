'use client';

import { useState } from 'react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '👋',
      title: 'Welcome to Gestour',
      subtitle: 'Hands-Free Navigation',
      description: 'Control your screen and explore images using just hand gestures. Powered by Google Gemini AI for intelligent object detection.',
      features: [
        '✓ No mouse or touch needed',
        '✓ AI describes objects with voice',
        '✓ Built for all abilities',
      ],
    },
    {
      icon: '👆',
      title: 'Basic Gestures',
      subtitle: 'Easy to Learn',
      description: 'Use intuitive hand gestures to control the pointer and interact with content.',
      gestures: [
        { emoji: '☝️', name: 'Point', action: 'Move cursor' },
        { emoji: '👍', name: 'Thumbs Up', action: 'AI Detection + Voice' },
        { emoji: '🤏', name: 'Pinch', action: 'Click action' },
        { emoji: '✌️', name: 'Peace', action: 'Drag / Pan' },
      ],
    },
    {
      icon: '🔍',
      title: 'Zoom & Navigation',
      subtitle: 'Explore Freely',
      description: 'Zoom in/out and navigate images with natural hand movements.',
      gestures: [
        { emoji: '✊', name: 'Fist', action: 'Zoom In' },
        { emoji: '🖐️', name: 'Open Hand', action: 'Zoom Out' },
        { emoji: '🤟', name: 'Three Fingers', action: 'Full AI Analysis' },
      ],
    },
    {
      icon: '♿',
      title: 'Accessibility Features',
      subtitle: 'Designed for Everyone',
      description: 'Gestour is specially designed for users with various accessibility needs.',
      features: [
        '🔊 Automatic voice narration',
        '⏱️ Dwell click for tremor support',
        '🎯 Adjustable sensitivity',
        '💬 Ask AI anything about the image',
      ],
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]" />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-tertiary)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-success)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Progress bar */}
        <div className="flex gap-2 mb-8 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)]'
                  : i < step
                  ? 'w-4 bg-[var(--accent-primary)]/50'
                  : 'w-4 bg-[var(--glass-border)]'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="glass-card-static p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <span className="text-7xl">{currentStep.icon}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-2">
            {currentStep.title}
          </h1>
          <p className="text-lg text-[var(--accent-primary)] text-center mb-4">
            {currentStep.subtitle}
          </p>
          <p className="text-[var(--text-secondary)] text-center mb-8">
            {currentStep.description}
          </p>

          {/* Content based on step type */}
          {currentStep.features && (
            <div className="space-y-3 mb-8">
              {currentStep.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-[var(--glass-bg)] rounded-xl"
                >
                  <span className="text-lg">{feature.split(' ')[0]}</span>
                  <span className="text-[var(--text-secondary)]">{feature.substring(feature.indexOf(' ') + 1)}</span>
                </div>
              ))}
            </div>
          )}

          {currentStep.gestures && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {currentStep.gestures.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-[var(--glass-bg)] rounded-xl"
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium">{g.name}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">{g.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className={`px-6 py-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors ${
                step === 0 ? 'invisible' : ''
              }`}
            >
              ← Back
            </button>

            <button
              onClick={() => {
                if (isLastStep) {
                  onComplete();
                } else {
                  setStep(step + 1);
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              {isLastStep ? 'Get Started →' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-sm transition-colors"
        >
          Skip Tutorial
        </button>

        {/* Gemini badge */}
        <div className="absolute -top-4 right-4 px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-tertiary)]/20 border border-[var(--accent-primary)]/30 rounded-full">
          <span className="text-sm text-[var(--accent-primary-light)]">✨ Powered by Gemini AI</span>
        </div>
      </div>
    </div>
  );
}
