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

    const { image, pointerX, pointerY } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image diperlukan' },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analisis gambar ini. Ada pointer/kursor di posisi ${Math.round(pointerX * 100)}% dari kiri dan ${Math.round(pointerY * 100)}% dari atas.

Identifikasi objek yang ada di posisi pointer tersebut dan berikan informasi menarik.

Jawab dalam format JSON seperti ini (tanpa markdown code block):
{
  "object": "nama objek yang ditunjuk",
  "description": "deskripsi singkat objek (1-2 kalimat)",
  "confidence": "high/medium/low",
  "funFact": "fakta menarik atau unik tentang objek ini (1 kalimat)",
  "category": "kategori objek (misal: elektronik, makanan, hewan, tanaman, furniture, dll)",
  "relatedInfo": "informasi tambahan yang berguna (harga estimasi, tips, atau info Wikipedia singkat)"
}

Jika tidak ada objek spesifik di posisi tersebut, jawab dengan object: "background" atau "area kosong".
Berikan respons dalam Bahasa Indonesia.`;

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
          temperature: 0.3,
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
      // If JSON parsing fails, return raw text
      return NextResponse.json({
        object: 'Unknown',
        description: text,
        confidence: 'low',
      });
    }
  } catch (error) {
    console.error('Error in detect API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
