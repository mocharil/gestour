'use client';

import { useTrackerStore } from '../store/useTrackerStore';
import { speakAnalysisResult } from '../lib/voiceService';
import { useEffect } from 'react';

export function FullAnalysisPanel() {
  const {
    fullAnalysis,
    isAnalyzing,
    voiceEnabled,
    clearFullAnalysis,
  } = useTrackerStore();

  // Speak analysis when it's ready
  useEffect(() => {
    if (fullAnalysis && voiceEnabled) {
      const objectNames = fullAnalysis.objects.map(o => o.name);
      speakAnalysisResult(objectNames);
    }
  }, [fullAnalysis, voiceEnabled]);

  if (!fullAnalysis && !isAnalyzing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] mx-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <h3 className="text-xl font-bold text-[var(--text)]">Analisis Gambar Lengkap</h3>
          </div>
          {!isAnalyzing && (
            <button
              onClick={clearFullAnalysis}
              className="p-2 text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--border)] rounded-lg transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[var(--text)] text-lg">Menganalisis gambar...</p>
              <p className="text-[var(--text-dim)] text-sm mt-2">AI sedang mengidentifikasi semua objek</p>
            </div>
          ) : fullAnalysis && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
                <h4 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                  <span>📝</span> Ringkasan
                </h4>
                <p className="text-[var(--text)]">{fullAnalysis.summary}</p>
              </div>

              {/* Mood & Colors */}
              <div className="grid grid-cols-2 gap-4">
                {fullAnalysis.mood && (
                  <div className="p-4 bg-[var(--bg)] rounded-xl">
                    <h4 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                      <span>🎭</span> Mood
                    </h4>
                    <p className="text-[var(--accent)] font-medium capitalize">{fullAnalysis.mood}</p>
                  </div>
                )}
                {fullAnalysis.colors && fullAnalysis.colors.length > 0 && (
                  <div className="p-4 bg-[var(--bg)] rounded-xl">
                    <h4 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                      <span>🎨</span> Warna Dominan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {fullAnalysis.colors.map((color, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[var(--surface)] rounded text-sm text-[var(--text)]"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Objects */}
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                  <span>📦</span> Objek Terdeteksi ({fullAnalysis.objects.length})
                </h4>
                <div className="grid gap-3">
                  {fullAnalysis.objects.map((obj, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[var(--bg)] rounded-xl flex items-start gap-3"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-[var(--accent)]/20 text-[var(--accent)] rounded-lg font-bold text-sm">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-[var(--text)]">{obj.name}</h5>
                          <span className="px-2 py-0.5 bg-[var(--surface)] rounded text-xs text-[var(--text-dim)]">
                            {obj.position}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-dim)] mt-1">{obj.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {fullAnalysis.suggestions && fullAnalysis.suggestions.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl">
                  <h4 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                    <span>💡</span> Insight & Saran
                  </h4>
                  <ul className="space-y-2">
                    {fullAnalysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text)]">
                        <span className="text-blue-400">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isAnalyzing && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end">
            <button
              onClick={clearFullAnalysis}
              className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
