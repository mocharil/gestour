'use client';

import { useState } from 'react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '🤖',
      title: 'Selamat Datang di HandsFree AI',
      subtitle: 'Aksesibilitas Tanpa Batas',
      description: 'Kontrol komputer dan eksplorasi gambar hanya dengan gerakan tangan. Ditenagai oleh Google Gemini 3 AI.',
      features: [
        '✓ Tanpa sentuh layar atau mouse',
        '✓ AI menjelaskan objek dengan suara',
        '✓ Ramah untuk semua kemampuan',
      ],
    },
    {
      icon: '👆',
      title: 'Gerakan Dasar',
      subtitle: 'Mudah dipelajari',
      description: 'Gunakan gerakan tangan intuitif untuk mengontrol pointer dan berinteraksi.',
      gestures: [
        { emoji: '☝️', name: 'Telunjuk', action: 'Gerakkan pointer' },
        { emoji: '👍', name: 'Jempol', action: 'Deteksi AI + Suara' },
        { emoji: '🤏', name: 'Pinch', action: 'Klik' },
        { emoji: '✌️', name: 'Peace', action: 'Drag/Geser' },
      ],
    },
    {
      icon: '🔍',
      title: 'Zoom & Navigasi',
      subtitle: 'Jelajahi dengan mudah',
      description: 'Perbesar gambar dan navigasi dengan gerakan natural.',
      gestures: [
        { emoji: '✊', name: 'Kepalan', action: 'Zoom In' },
        { emoji: '🖐️', name: 'Telapak', action: 'Zoom Out' },
        { emoji: '🤟', name: '3 Jari', action: 'Analisis Full AI' },
      ],
    },
    {
      icon: '♿',
      title: 'Fitur Aksesibilitas',
      subtitle: 'Dirancang untuk semua orang',
      description: 'HandsFree AI dirancang khusus untuk pengguna dengan berbagai kebutuhan aksesibilitas.',
      features: [
        '🔊 Narasi suara otomatis',
        '⏱️ Dwell Click untuk tremor',
        '🎯 Sensitivitas dapat disesuaikan',
        '💬 Tanya AI tentang apapun',
      ],
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Progress bar */}
        <div className="flex gap-2 mb-8 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-gradient-to-r from-blue-400 to-purple-400'
                  : i < step
                  ? 'w-4 bg-blue-400/50'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="text-center mb-6">
            <span className="text-7xl">{currentStep.icon}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            {currentStep.title}
          </h1>
          <p className="text-lg text-blue-400 text-center mb-4">
            {currentStep.subtitle}
          </p>
          <p className="text-gray-400 text-center mb-8">
            {currentStep.description}
          </p>

          {/* Content based on step type */}
          {currentStep.features && (
            <div className="space-y-3 mb-8">
              {currentStep.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                >
                  <span className="text-lg">{feature.split(' ')[0]}</span>
                  <span className="text-gray-300">{feature.substring(feature.indexOf(' ') + 1)}</span>
                </div>
              ))}
            </div>
          )}

          {currentStep.gestures && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {currentStep.gestures.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div>
                    <p className="text-white font-medium">{g.name}</p>
                    <p className="text-sm text-gray-400">{g.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className={`px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors ${
                step === 0 ? 'invisible' : ''
              }`}
            >
              ← Kembali
            </button>

            <button
              onClick={() => {
                if (isLastStep) {
                  onComplete();
                } else {
                  setStep(step + 1);
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
            >
              {isLastStep ? 'Mulai Sekarang →' : 'Lanjut →'}
            </button>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Lewati Tutorial
        </button>

        {/* Gemini badge */}
        <div className="absolute -top-4 right-4 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
          <span className="text-sm text-blue-300">✨ Powered by Gemini 3</span>
        </div>
      </div>
    </div>
  );
}
