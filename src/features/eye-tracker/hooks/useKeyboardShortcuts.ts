'use client';

import { useEffect, useCallback } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { useThemeStore } from '../store/useThemeStore';

export function useKeyboardShortcuts() {
  const {
    keyboardShortcutsEnabled,
    shortcuts,
    uploadedImage,
    voiceEnabled,
    zoomIn,
    zoomOut,
    resetTransform,
    setVoiceEnabled,
    setUploadedImage,
    setChatOpen,
    isChatOpen,
  } = useTrackerStore();

  const { toggleTheme } = useThemeStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!keyboardShortcutsEnabled) return;

    // Don't trigger shortcuts when typing in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const pressedKey = [];
    if (e.ctrlKey || e.metaKey) pressedKey.push('Ctrl');
    if (e.shiftKey) pressedKey.push('Shift');
    if (e.altKey) pressedKey.push('Alt');

    // Handle special keys
    let key = e.key;
    if (key === ' ') key = 'Space';
    if (key === '+' || key === '=') key = '+';
    if (key === '-' || key === '_') key = '-';

    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      pressedKey.push(key.toUpperCase());
    }

    const combo = pressedKey.join('+');

    // Find matching shortcut
    for (const shortcut of shortcuts) {
      if (shortcut.key.toUpperCase() === combo) {
        e.preventDefault();

        switch (shortcut.action) {
          case 'zoomIn':
            if (uploadedImage) zoomIn();
            break;
          case 'zoomOut':
            if (uploadedImage) zoomOut();
            break;
          case 'resetZoom':
            if (uploadedImage) resetTransform();
            break;
          case 'toggleVoice':
            setVoiceEnabled(!voiceEnabled);
            break;
          case 'toggleChat':
            setChatOpen(!isChatOpen);
            break;
          case 'newImage':
            setUploadedImage(null);
            break;
          case 'toggleTheme':
            toggleTheme();
            break;
        }
        break;
      }
    }
  }, [
    keyboardShortcutsEnabled,
    shortcuts,
    uploadedImage,
    voiceEnabled,
    zoomIn,
    zoomOut,
    resetTransform,
    setVoiceEnabled,
    setChatOpen,
    isChatOpen,
    setUploadedImage,
    toggleTheme,
  ]);

  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardShortcutsEnabled, handleKeyDown]);

  return { keyboardShortcutsEnabled };
}
