'use client';

import { useState, useRef, useEffect } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { chatAboutImage } from '../lib/geminiService';
import { speak, stopSpeaking } from '../lib/voiceService';

export function ChatPanel() {
  const {
    uploadedImage,
    chatMessages,
    isChatOpen,
    isChatLoading,
    voiceEnabled,
    addChatMessage,
    setChatOpen,
    setChatLoading,
    clearChat,
  } = useTrackerStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !uploadedImage || isChatLoading) return;

    const question = input.trim();
    setInput('');

    // Add user message
    addChatMessage({ role: 'user', content: question });

    // Get AI response
    setChatLoading(true);
    try {
      const answer = await chatAboutImage(uploadedImage, question, chatMessages);
      if (answer) {
        addChatMessage({ role: 'assistant', content: answer });
        if (voiceEnabled) {
          speak(answer);
        }
      } else {
        addChatMessage({ role: 'assistant', content: 'Maaf, saya tidak bisa menjawab pertanyaan itu.' });
      }
    } catch (error) {
      addChatMessage({ role: 'assistant', content: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setChatLoading(false);
    }
  };

  const quickQuestions = [
    'Apa yang ada di gambar ini?',
    'Jelaskan lebih detail',
    'Ada berapa objek?',
    'Warna apa yang dominan?',
  ];

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 left-4 z-40 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <span className="text-xl">💬</span>
        <span className="font-medium">Tanya AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-96 max-h-[70vh] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h3 className="font-bold text-[var(--text)]">Tanya AI</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-1.5 text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--border)] rounded transition-colors"
            title="Hapus chat"
          >
            🗑️
          </button>
          <button
            onClick={() => {
              stopSpeaking();
              setChatOpen(false);
            }}
            className="p-1.5 text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--border)] rounded transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🤖</p>
            <p className="text-[var(--text-dim)] mb-4">Tanyakan apapun tentang gambar ini!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 text-xs bg-[var(--bg)] border border-[var(--border)] rounded-full text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent)] text-white rounded-br-md'
                    : 'bg-[var(--bg)] text-[var(--text)] rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg)] px-4 py-2 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[var(--text-dim)] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[var(--text-dim)] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[var(--text-dim)] rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border)]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pertanyaan..."
            className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-full text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]"
            disabled={isChatLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent)]/90 transition-colors"
          >
            ↑
          </button>
        </div>
      </form>
    </div>
  );
}
