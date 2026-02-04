'use client';

import { useCallback, useRef, useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';

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
    { icon: '👆', title: 'Kontrol Tanpa Sentuh', desc: 'Gunakan gerakan tangan sebagai pointer' },
    { icon: '🤖', title: 'AI Gemini 3', desc: 'Deteksi & jelaskan objek dengan AI' },
    { icon: '🔊', title: 'Narasi Suara', desc: 'AI membacakan deskripsi otomatis' },
    { icon: '♿', title: 'Aksesibilitas', desc: 'Dirancang untuk semua kemampuan' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-full p-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[#0f172a] to-[var(--bg)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-6">
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powered by Google Gemini 3
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              HandsFree AI
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-2">
            Aksesibilitas Tanpa Batas
          </p>

          <p className="text-gray-500 max-w-xl mx-auto">
            Kontrol dan eksplorasi gambar hanya dengan gerakan tangan.
            AI menjelaskan setiap objek yang Anda tunjuk.
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
          className={`relative w-full aspect-[16/9] max-w-2xl mx-auto flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-blue-400 bg-blue-500/10 scale-105'
              : 'border-gray-700 hover:border-blue-500/50 hover:bg-white/5'
          }`}
        >
          <div className={`text-7xl mb-6 transition-transform duration-300 ${isDragging ? 'scale-125' : ''}`}>
            {isDragging ? '📥' : '🖼️'}
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2">
            {isDragging ? 'Lepaskan untuk upload' : 'Upload Gambar'}
          </h2>

          <p className="text-gray-400 mb-6">
            Drag & drop atau klik untuk memilih
          </p>

          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25">
            Pilih Gambar
          </button>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-500/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-500/50 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg" />
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-colors"
            >
              <span className="text-3xl mb-3 block">{feature.icon}</span>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Accessibility note */}
        <div className="mt-12 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <span className="text-4xl">♿</span>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Dirancang untuk Aksesibilitas
              </h3>
              <p className="text-gray-400">
                HandsFree AI membantu pengguna dengan keterbatasan motorik untuk mengeksplorasi
                dan berinteraksi dengan konten visual tanpa memerlukan mouse atau keyboard.
                Fitur narasi suara membantu pengguna dengan keterbatasan penglihatan.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Cara Kerja</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-full font-bold">1</span>
              <span className="text-gray-300">Upload gambar</span>
            </div>
            <span className="text-gray-600 hidden md:block">→</span>
            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 flex items-center justify-center bg-purple-500/20 text-purple-400 rounded-full font-bold">2</span>
              <span className="text-gray-300">Tunjuk dengan tangan</span>
            </div>
            <span className="text-gray-600 hidden md:block">→</span>
            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 flex items-center justify-center bg-green-500/20 text-green-400 rounded-full font-bold">3</span>
              <span className="text-gray-300">AI menjelaskan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
