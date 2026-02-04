export interface DetectionResult {
  object: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  funFact?: string;
  category?: string;
  relatedInfo?: string;
}

export interface FullAnalysisResult {
  summary: string;
  objects: Array<{
    name: string;
    position: string;
    description: string;
  }>;
  mood?: string;
  colors?: string[];
  suggestions?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function detectObject(
  imageDataUrl: string,
  pointerX: number,
  pointerY: number
): Promise<DetectionResult | null> {
  try {
    const response = await fetch('/api/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
        pointerX,
        pointerY,
      }),
    });

    if (!response.ok) {
      console.error('Detection API error:', response.status);
      return null;
    }

    const result = await response.json();

    if (result.error) {
      console.error('Detection error:', result.error);
      return null;
    }

    return result as DetectionResult;
  } catch (error) {
    console.error('Failed to detect object:', error);
    return null;
  }
}

export async function analyzeFullImage(
  imageDataUrl: string
): Promise<FullAnalysisResult | null> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
      }),
    });

    if (!response.ok) {
      console.error('Analysis API error:', response.status);
      return null;
    }

    const result = await response.json();

    if (result.error) {
      console.error('Analysis error:', result.error);
      return null;
    }

    return result as FullAnalysisResult;
  } catch (error) {
    console.error('Failed to analyze image:', error);
    return null;
  }
}

export async function chatAboutImage(
  imageDataUrl: string,
  question: string,
  history: ChatMessage[] = []
): Promise<string | null> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
        question,
        history,
      }),
    });

    if (!response.ok) {
      console.error('Chat API error:', response.status);
      return null;
    }

    const result = await response.json();

    if (result.error) {
      console.error('Chat error:', result.error);
      return null;
    }

    return result.answer;
  } catch (error) {
    console.error('Failed to chat:', error);
    return null;
  }
}
