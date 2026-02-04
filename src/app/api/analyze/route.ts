import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY tidak ditemukan di environment variables' },
        { status: 500 }
      );
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image diperlukan' },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analisis gambar ini secara menyeluruh dan detail.

Identifikasi SEMUA objek yang terlihat di gambar, posisinya, dan berikan analisis lengkap.

Jawab dalam format JSON seperti ini (tanpa markdown code block):
{
  "summary": "ringkasan singkat tentang gambar ini (2-3 kalimat)",
  "objects": [
    {
      "name": "nama objek 1",
      "position": "posisi di gambar (misal: tengah, kiri atas, kanan bawah)",
      "description": "deskripsi singkat"
    },
    {
      "name": "nama objek 2",
      "position": "posisi di gambar",
      "description": "deskripsi singkat"
    }
  ],
  "mood": "suasana/mood gambar (misal: ceria, serius, santai, profesional)",
  "colors": ["warna dominan 1", "warna dominan 2", "warna dominan 3"],
  "suggestions": ["saran atau insight menarik tentang gambar", "saran lainnya"]
}

Berikan respons dalam Bahasa Indonesia. Maksimal 10 objek utama.`;

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
          temperature: 0.4,
          maxOutputTokens: 1024,
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

    // Try to parse JSON from response
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const result = JSON.parse(cleanedText);
      return NextResponse.json(result);
    } catch {
      // If JSON parsing fails, return basic structure
      return NextResponse.json({
        summary: text,
        objects: [],
        mood: 'unknown',
        colors: [],
        suggestions: [],
      });
    }
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
