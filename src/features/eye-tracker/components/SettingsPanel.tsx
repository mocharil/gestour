'use client';

import { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { useThemeStore } from '../store/useThemeStore';
import { setVoiceEnabled, stopSpeaking } from '../lib/voiceService';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';

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
    keyboardShortcutsEnabled,
    performanceMode,
    shortcuts,
    setVoiceEnabled: setStoreVoiceEnabled,
    setDwellClickEnabled,
    setDwellClickDelay,
    setPointerSensitivity,
    setPointerSmoothing,
    setKeyboardShortcutsEnabled,
    setPerformanceMode,
  } = useTrackerStore();

  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'general' | 'accessibility' | 'pointer' | 'shortcuts'>('general');

  if (!isOpen) return null;

  const handleVoiceToggle = (checked: boolean) => {
    setStoreVoiceEnabled(checked);
    setVoiceEnabled(checked);
    if (!checked) {
      stopSpeaking();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'accessibility', label: 'Access', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    )},
    { id: 'pointer', label: 'Pointer', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
      </svg>
    )},
    { id: 'shortcuts', label: 'Keys', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    )},
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-card-static overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-tertiary)]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Settings</h2>
                <p className="text-xs text-[var(--text-tertiary)]">Customize your experience</p>
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

          {/* Tabs */}
          <div className="flex gap-1 p-2 mx-4 mt-4 rounded-xl bg-[var(--bg-secondary)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--glass-bg)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            {activeTab === 'general' && (
              <>
                {/* Theme Toggle */}
                <div className="glass-card-static p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-tertiary)]/20 flex items-center justify-center flex-shrink-0">
                        {resolvedTheme === 'dark' ? (
                          <svg className="w-5 h-5 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--text-primary)]">Theme</h3>
                        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                          {resolvedTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={resolvedTheme === 'light'}
                      onChange={toggleTheme}
                      size="md"
                    />
                  </div>
                </div>

                {/* Performance Mode */}
                <div className="glass-card-static p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-success)]/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--text-primary)]">Performance Mode</h3>
                        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                          Reduce animations for better performance
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={performanceMode}
                      onChange={setPerformanceMode}
                      size="md"
                    />
                  </div>
                </div>

                {/* AI Info */}
                <div className="glass-card-static p-5 bg-gradient-to-br from-[var(--accent-primary)]/5 to-[var(--accent-tertiary)]/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Powered by Gemini</h3>
                      <p className="text-sm text-[var(--text-tertiary)]">Google&apos;s most advanced AI model</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Object detection & identification',
                      'Detailed descriptions with facts',
                      'Full image analysis',
                      'Interactive conversations',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <svg className="w-4 h-4 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'accessibility' && (
              <>
                {/* Dwell Click */}
                <div className="glass-card-static p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[var(--accent-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--text-primary)]">Dwell Click</h3>
                        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                          Hold pointer position to auto-click
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={dwellClickEnabled}
                      onChange={setDwellClickEnabled}
                      size="md"
                    />
                  </div>

                  {dwellClickEnabled && (
                    <div className="pt-4 border-t border-[var(--glass-border)]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[var(--text-secondary)]">Delay</span>
                        <span className="text-sm font-medium text-[var(--accent-secondary)]">{dwellClickDelay}ms</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="3000"
                        step="100"
                        value={dwellClickDelay}
                        onChange={(e) => setDwellClickDelay(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
                        <span>Fast</span>
                        <span>Slow</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Voice */}
                <div className="glass-card-static p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-success)]/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--text-primary)]">Voice Narration</h3>
                        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                          AI reads object descriptions aloud
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={voiceEnabled}
                      onChange={handleVoiceToggle}
                      size="md"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'pointer' && (
              <>
                {/* Sensitivity */}
                <div className="glass-card-static p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Pointer Sensitivity</h3>
                      <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                        How responsive the pointer is to movement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[var(--text-secondary)]">Level</span>
                    <span className="text-sm font-medium text-[var(--accent-primary)]">{Math.round(pointerSensitivity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pointerSensitivity}
                    onChange={(e) => setPointerSensitivity(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Smoothing */}
                <div className="glass-card-static p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-tertiary)]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">Smoothing</h3>
                      <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                        Reduces pointer jitter (good for tremor)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[var(--text-secondary)]">Level</span>
                    <span className="text-sm font-medium text-[var(--accent-tertiary)]">{Math.round(pointerSmoothing * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={pointerSmoothing}
                    onChange={(e) => setPointerSmoothing(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
                    <span>None</span>
                    <span>Maximum</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'shortcuts' && (
              <>
                {/* Enable Shortcuts */}
                <div className="glass-card-static p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--text-primary)]">Keyboard Shortcuts</h3>
                        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
                          Use keyboard for quick actions
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={keyboardShortcutsEnabled}
                      onChange={setKeyboardShortcutsEnabled}
                      size="md"
                    />
                  </div>
                </div>

                {/* Shortcuts List */}
                {keyboardShortcutsEnabled && (
                  <div className="glass-card-static p-5">
                    <h3 className="font-medium text-[var(--text-primary)] mb-4">Available Shortcuts</h3>
                    <div className="space-y-3">
                      {shortcuts.map((shortcut, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.ctrl && <span className="kbd">Ctrl</span>}
                            {shortcut.shift && <span className="kbd">Shift</span>}
                            {shortcut.alt && <span className="kbd">Alt</span>}
                            <span className="kbd">{shortcut.key.toUpperCase()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--glass-border)] flex justify-end">
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
