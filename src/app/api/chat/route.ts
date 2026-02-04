import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY tidak ditemukan di environment variables' },
        { status: 500 }
      );
    }

    const { image, question, history = [] } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image diperlukan' },
        { status: 400 }
      );
    }

    if (!question) {
      return NextResponse.json(
        { error: 'Pertanyaan diperlukan' },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Build conversation context
    let conversationContext = '';
    if (history.length > 0) {
      conversationContext = 'Riwayat percakapan sebelumnya:\n';
      history.forEach((msg: ChatMessage) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}\n`;
      });
      conversationContext += '\n';
    }

    const prompt = `Kamu adalah asisten AI yang membantu menjawab pertanyaan tentang gambar ini.

${conversationContext}
Pertanyaan terbaru dari user: ${question}

Berikan jawaban yang informatif, ramah, dan dalam Bahasa Indonesia.
Jika pertanyaan tidak berhubungan dengan gambar, tetap jawab dengan sopan dan arahkan kembali ke gambar jika relevan.
Jawab secara natural tanpa format JSON, langsung berikan jawabannya saja.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Gagal memanggil Gemini API' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ answer: text.trim() });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
