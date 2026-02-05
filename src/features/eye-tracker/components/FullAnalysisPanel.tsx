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
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-2xl mx-4">
        <div className="glass-card-static overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--accent-tertiary)]/10 to-[var(--accent-primary)]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-tertiary)] to-[var(--accent-primary)] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Full Image Analysis</h3>
            </div>
            {!isAnalyzing && (
              <button
                onClick={clearFullAnalysis}
                className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[var(--accent-primary)]/30" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
                </div>
                <p className="text-[var(--text-primary)] text-lg">Analyzing image...</p>
                <p className="text-[var(--text-tertiary)] text-sm mt-2">AI is identifying all objects</p>
              </div>
            ) : fullAnalysis && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="p-4 bg-gradient-to-r from-[var(--accent-tertiary)]/10 to-[var(--accent-primary)]/10 rounded-xl">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Summary
                  </h4>
                  <p className="text-[var(--text-secondary)]">{fullAnalysis.summary}</p>
                </div>

                {/* Mood & Colors */}
                <div className="grid grid-cols-2 gap-4">
                  {fullAnalysis.mood && (
                    <div className="glass-card-static p-4">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <span>🎭</span> Mood
                      </h4>
                      <p className="text-[var(--accent-primary)] font-medium capitalize">{fullAnalysis.mood}</p>
                    </div>
                  )}
                  {fullAnalysis.colors && fullAnalysis.colors.length > 0 && (
                    <div className="glass-card-static p-4">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <span>🎨</span> Dominant Colors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {fullAnalysis.colors.map((color, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-[var(--bg-secondary)] rounded text-sm text-[var(--text-secondary)]"
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
                  <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Detected Objects ({fullAnalysis.objects.length})
                  </h4>
                  <div className="grid gap-3">
                    {fullAnalysis.objects.map((obj, i) => (
                      <div
                        key={i}
                        className="glass-card-static p-3 flex items-start gap-3"
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] text-white rounded-lg font-bold text-sm">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-[var(--text-primary)]">{obj.name}</h5>
                            <span className="px-2 py-0.5 bg-[var(--bg-secondary)] rounded text-xs text-[var(--text-tertiary)]">
                              {obj.position}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-tertiary)] mt-1">{obj.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {fullAnalysis.suggestions && fullAnalysis.suggestions.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-[var(--accent-secondary)]/10 to-[var(--accent-success)]/10 rounded-xl">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[var(--accent-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Insights & Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {fullAnalysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                          <span className="text-[var(--accent-secondary)]">•</span>
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
            <div className="px-6 py-4 border-t border-[var(--glass-border)] flex justify-end">
              <button
                onClick={clearFullAnalysis}
                className="px-6 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
