import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gemini 3 models
const GEMINI_3_PRO = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent';
const GEMINI_3_IMAGE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent';

interface ViewAngle {
  angle: number;
  label: string;
  prompt: string;
}

const VIEW_ANGLES: ViewAngle[] = [
  { angle: 0, label: 'Front', prompt: 'front view, facing the camera directly' },
  { angle: 45, label: 'Front-Right', prompt: 'front-right view, 45 degrees to the right' },
  { angle: 90, label: 'Right', prompt: 'right side view, profile from the right' },
  { angle: 135, label: 'Back-Right', prompt: 'back-right view, 135 degrees, showing mostly the back' },
  { angle: 180, label: 'Back', prompt: 'back view, facing away from camera' },
  { angle: 225, label: 'Back-Left', prompt: 'back-left view, 225 degrees, showing mostly the back' },
  { angle: 270, label: 'Left', prompt: 'left side view, profile from the left' },
  { angle: 315, label: 'Front-Left', prompt: 'front-left view, 45 degrees to the left' },
];

async function analyzeImageWithGemini3(base64Image: string): Promise<string> {
  const response = await fetch(`${GEMINI_3_PRO}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: `Analyze this image in extreme detail. Describe:
1. The main subject (person/object) - their appearance, clothing, colors, textures
2. The pose/position of the subject
3. The background and environment
4. Lighting conditions
5. Any distinctive features

Be very specific about colors, patterns, and details. This description will be used to recreate the subject from different angles.

Respond in a single detailed paragraph.`
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function generateViewWithGemini3Image(
  description: string,
  viewAngle: ViewAngle
): Promise<string | null> {
  const prompt = `Generate a photorealistic image of: ${description}

View angle: ${viewAngle.prompt}

Requirements:
- Maintain exact same appearance, clothing, colors, and details
- Same lighting and environment
- Photorealistic quality
- Consistent with the original subject
- Show the subject from ${viewAngle.label} perspective (${viewAngle.angle} degrees)`;

  try {
    const response = await fetch(`${GEMINI_3_IMAGE}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseModalities: ['image', 'text'],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini 3 Image API error for ${viewAngle.label}:`, errorText);
      return null;
    }

    const data = await response.json();

    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inline_data?.mime_type?.startsWith('image/')) {
        return `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error generating ${viewAngle.label} view:`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not found' },
        { status: 500 }
      );
    }

    const { image, angles = 8 } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Step 1: Analyze the original image
    console.log('Analyzing image with Gemini 3 Pro...');
    const description = await analyzeImageWithGemini3(base64Image);
    console.log('Image analysis complete:', description.substring(0, 100) + '...');

    // Step 2: Generate views from different angles
    const selectedAngles = VIEW_ANGLES.slice(0, Math.min(angles, 8));
    const views: Array<{ angle: number; label: string; image: string | null }> = [];

    // Include original image as front view
    views.push({
      angle: 0,
      label: 'Front (Original)',
      image: image,
    });

    console.log(`Generating ${selectedAngles.length - 1} additional views...`);

    // Generate other views (skip first one as we use original)
    for (const viewAngle of selectedAngles.slice(1)) {
      console.log(`Generating ${viewAngle.label} view...`);
      const generatedImage = await generateViewWithGemini3Image(description, viewAngle);
      views.push({
        angle: viewAngle.angle,
        label: viewAngle.label,
        image: generatedImage,
      });
    }

    // Filter out failed generations
    const successfulViews = views.filter(v => v.image !== null);

    return NextResponse.json({
      success: true,
      description,
      views: successfulViews,
      totalGenerated: successfulViews.length,
    });

  } catch (error) {
    console.error('Error in generate-360 API:', error);
    return NextResponse.json(
      { error: 'Failed to generate 360° views' },
      { status: 500 }
    );
  }
}
