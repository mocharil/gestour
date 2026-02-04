'use client';

import { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { setVoiceEnabled, stopSpeaking } from '../lib/voiceService';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    voiceEnabled,
    dwellClickEnabled,
    dwellClickDelay,
    pointerSensitivity,
    pointerSmoothing,
    setVoiceEnabled: setStoreVoiceEnabled,
    setDwellClickEnabled,
    setDwellClickDelay,
    setPointerSensitivity,
    setPointerSmoothing,
  } = useTrackerStore();

  const [activeTab, setActiveTab] = useState<'accessibility' | 'pointer' | 'ai'>('accessibility');

  if (!isOpen) return null;

  const handleVoiceToggle = () => {
    const newValue = !voiceEnabled;
    setStoreVoiceEnabled(newValue);
    setVoiceEnabled(newValue);
    if (!newValue) {
      stopSpeaking();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-bold text-[var(--text)]">Pengaturan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--border)] rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          {[
            { id: 'accessibility', label: '♿ Aksesibilitas' },
            { id: 'pointer', label: '👆 Pointer' },
            { id: 'ai', label: '🤖 AI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[var(--accent)]/5'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'accessibility' && (
            <>
              {/* Dwell Click */}
              <div className="p-4 bg-[var(--bg)] rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-[var(--text)]">⏱️ Dwell Click</h3>
                    <p className="text-sm text-[var(--text-dim)]">
                      Tahan posisi pointer untuk klik otomatis
                    </p>
                  </div>
                  <button
                    onClick={() => setDwellClickEnabled(!dwellClickEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      dwellClickEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        dwellClickEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {dwellClickEnabled && (
                  <div className="mt-4">
                    <label className="text-sm text-[var(--text-dim)]">
                      Delay: {dwellClickDelay}ms
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="3000"
                      step="100"
                      value={dwellClickDelay}
                      onChange={(e) => setDwellClickDelay(Number(e.target.value))}
                      className="w-full mt-2 accent-[var(--accent)]"
                    />
                    <div className="flex justify-between text-xs text-[var(--text-dim)] mt-1">
                      <span>Cepat (500ms)</span>
                      <span>Lambat (3000ms)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice */}
              <div className="p-4 bg-[var(--bg)] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--text)]">🔊 Narasi Suara</h3>
                    <p className="text-sm text-[var(--text-dim)]">
                      AI membacakan deskripsi objek
                    </p>
                  </div>
                  <button
                    onClick={handleVoiceToggle}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      voiceEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'pointer' && (
            <>
              {/* Sensitivity */}
              <div className="p-4 bg-[var(--bg)] rounded-xl">
                <h3 className="font-medium text-[var(--text)] mb-2">🎯 Sensitivitas Pointer</h3>
                <p className="text-sm text-[var(--text-dim)] mb-4">
                  Seberapa responsif pointer terhadap gerakan
                </p>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pointerSensitivity}
                  onChange={(e) => setPointerSensitivity(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between text-xs text-[var(--text-dim)] mt-1">
                  <span>Pelan</span>
                  <span>{Math.round(pointerSensitivity * 100)}%</span>
                  <span>Cepat</span>
                </div>
              </div>

              {/* Smoothing */}
              <div className="p-4 bg-[var(--bg)] rounded-xl">
                <h3 className="font-medium text-[var(--text)] mb-2">✨ Smoothing</h3>
                <p className="text-sm text-[var(--text-dim)] mb-4">
                  Mengurangi getaran pointer (bagus untuk tremor)
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={pointerSmoothing}
                  onChange={(e) => setPointerSmoothing(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
                <div className="flex justify-between text-xs text-[var(--text-dim)] mt-1">
                  <span>Tidak ada</span>
                  <span>{Math.round(pointerSmoothing * 100)}%</span>
                  <span>Maksimal</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <>
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="font-medium text-[var(--text)]">Powered by Gemini 3</h3>
                </div>
                <p className="text-sm text-[var(--text-dim)]">
                  Aplikasi ini menggunakan Google Gemini 3 untuk:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Deteksi dan identifikasi objek
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Deskripsi detail dengan fakta menarik
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Analisis gambar lengkap
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Percakapan interaktif tentang gambar
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[var(--bg)] rounded-xl">
                <h3 className="font-medium text-[var(--text)] mb-2">🌐 Bahasa Respons</h3>
                <p className="text-sm text-[var(--text-dim)] mb-3">
                  AI akan merespons dalam bahasa Indonesia
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm">
                    🇮🇩 Indonesia
                  </button>
                  <button className="px-4 py-2 bg-[var(--border)] text-[var(--text-dim)] rounded-lg text-sm opacity-50 cursor-not-allowed">
                    🇬🇧 English (Soon)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
