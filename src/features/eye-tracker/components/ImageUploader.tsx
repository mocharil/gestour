'use client';

import { useCallback, useRef, useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Button } from '@/components/ui/Button';

export function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUploadedImage } = useTrackerStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [setUploadedImage]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  }, [setUploadedImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
      title: 'Kontrol Gestur',
      desc: 'Gunakan gerakan tangan sebagai pointer',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      title: 'AI Gemini',
      desc: 'Deteksi & jelaskan objek dengan AI',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
      title: 'Narasi Suara',
      desc: 'AI membacakan deskripsi otomatis',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      title: 'Aksesibilitas',
      desc: 'Dirancang untuk semua kemampuan',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const steps = [
    { num: '01', title: 'Upload', desc: 'Pilih gambar yang ingin dijelajahi', icon: '📤' },
    { num: '02', title: 'Arahkan', desc: 'Gunakan tangan untuk menunjuk objek', icon: '👆' },
    { num: '03', title: 'Jelajahi', desc: 'AI akan menjelaskan setiap objek', icon: '✨' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-full p-6 md:p-8 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[var(--accent-primary)]/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[var(--accent-tertiary)]/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-secondary)]/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Hero section */}
        <div className="text-center mb-10 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card-static rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-success)]" />
            </span>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Powered by Google Gemini
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Gestour</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-2 font-medium">
            Kontrol Gestur Berbasis AI
          </p>

          <p className="text-[var(--text-tertiary)] max-w-lg mx-auto text-sm md:text-base">
            Jelajahi dan berinteraksi dengan gambar menggunakan gerakan tangan.
            AI akan menjelaskan setiap objek yang Anda tunjuk.
          </p>
        </div>

        {/* Upload area */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="animate-fade-in-up stagger-1"
        >
          <div
            className={`
              relative w-full aspect-video max-w-2xl mx-auto
              flex flex-col items-center justify-center
              rounded-3xl cursor-pointer
              transition-all duration-300 ease-out
              overflow-hidden group
              ${isDragging
                ? 'scale-[1.02]'
                : 'hover:scale-[1.01]'
              }
            `}
          >
            {/* Glass background */}
            <div className={`
              absolute inset-0 glass-card-static
              transition-all duration-300
              ${isDragging
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                : 'group-hover:border-[var(--glass-border-hover)]'
              }
            `} />

            {/* Gradient border on hover */}
            <div className={`
              absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300
              ${isDragging ? 'opacity-100' : 'group-hover:opacity-50'}
            `}>
              <div className="absolute inset-[-1px] rounded-3xl bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-tertiary)] to-[var(--accent-secondary)] opacity-50" />
              <div className="absolute inset-[1px] rounded-3xl bg-[var(--bg-primary)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center p-8">
              {/* Icon */}
              <div className={`
                w-20 h-20 rounded-2xl mb-6
                flex items-center justify-center
                bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-tertiary)]/20
                border border-[var(--glass-border)]
                transition-all duration-300
                ${isDragging ? 'scale-110 rotate-3' : 'group-hover:scale-105'}
              `}>
                {isDragging ? (
                  <svg className="w-10 h-10 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-2">
                {isDragging ? 'Lepaskan untuk upload' : 'Upload Gambar'}
              </h2>

              <p className="text-[var(--text-tertiary)] mb-6 text-sm">
                Drag & drop atau klik untuk memilih file
              </p>

              <Button variant="primary" size="lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Pilih Gambar
              </Button>

              <p className="text-[var(--text-muted)] text-xs mt-4">
                Mendukung JPG, PNG, WebP hingga 10MB
              </p>
            </div>

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-primary)]/30 rounded-tl-xl transition-colors group-hover:border-[var(--accent-primary)]/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--accent-tertiary)]/30 rounded-tr-xl transition-colors group-hover:border-[var(--accent-tertiary)]/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--accent-tertiary)]/30 rounded-bl-xl transition-colors group-hover:border-[var(--accent-tertiary)]/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-primary)]/30 rounded-br-xl transition-colors group-hover:border-[var(--accent-primary)]/50" />
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10 animate-fade-in-up stagger-2">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card p-4 md:p-5 group cursor-default"
            >
              <div className={`
                w-12 h-12 rounded-xl mb-4
                flex items-center justify-center
                bg-gradient-to-br ${feature.gradient}
                text-white shadow-lg
                transition-transform duration-300
                group-hover:scale-110 group-hover:rotate-3
              `}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1 text-sm md:text-base">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-[var(--text-tertiary)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-12 animate-fade-in-up stagger-3">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] text-center mb-8">
            Cara Kerja
          </h2>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex items-center gap-4">
                <div className="glass-card-static p-5 flex-1 flex items-center gap-4 group hover:bg-[var(--glass-bg-hover)] transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-tertiary)]/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--accent-primary)] mb-1">
                      STEP {step.num}
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-8 text-[var(--text-muted)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility note */}
        <div className="mt-10 animate-fade-in-up stagger-4">
          <div className="glass-card-static p-6 relative overflow-hidden">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--accent-success)] to-[var(--accent-secondary)]" />

            <div className="flex items-start gap-4 pl-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-success)]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                  Dirancang untuk Aksesibilitas
                </h3>
                <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                  Gestour membantu pengguna dengan keterbatasan motorik untuk mengeksplorasi
                  dan berinteraksi dengan konten visual tanpa memerlukan mouse atau keyboard.
                  Fitur narasi suara membantu pengguna dengan keterbatasan penglihatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
