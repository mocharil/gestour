// Voice Service using Web Speech API

let currentUtterance: SpeechSynthesisUtterance | null = null;
let isEnabled = true;

export function setVoiceEnabled(enabled: boolean) {
  isEnabled = enabled;
  if (!enabled) {
    stopSpeaking();
  }
}

export function isVoiceEnabled() {
  return isEnabled;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function speak(text: string, options?: {
  rate?: number;
  pitch?: number;
  lang?: string;
}) {
  if (!isEnabled) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate ?? 1;
  utterance.pitch = options?.pitch ?? 1;
  utterance.lang = options?.lang ?? 'id-ID'; // Indonesian by default

  // Try to find Indonesian voice, fallback to default
  const voices = window.speechSynthesis.getVoices();
  const indonesianVoice = voices.find(v => v.lang.startsWith('id'));
  if (indonesianVoice) {
    utterance.voice = indonesianVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function speakDetectionResult(object: string, description: string) {
  const text = `${object}. ${description}`;
  speak(text);
}

export function speakAnalysisResult(objects: string[]) {
  if (objects.length === 0) {
    speak('Tidak ada objek yang terdeteksi di gambar ini.');
    return;
  }

  const text = `Ditemukan ${objects.length} objek: ${objects.join(', ')}.`;
  speak(text);
}
