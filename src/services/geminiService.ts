import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

function requireKey() {
  if (!API_KEY) throw new Error('Gemini API key not set. Add VITE_GEMINI_API_KEY to .env or use Groq for the chatbot.');
}

export interface SummarizationResult {
  summary: string;
}
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[];
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function buildContents(messages: ChatMessage[]): {
  systemInstruction?: { parts: { text: string }[] };
  contents: GeminiContent[];
} {
  let systemInstruction: { parts: { text: string }[] } | undefined;
  const contents: GeminiContent[] = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemInstruction = { parts: [{ text: msg.content }] };
    } else if (msg.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.content }] });
    } else {
      contents.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  }

  return { systemInstruction, contents };
}

async function callGemini(
  model: string,
  contents: GeminiContent[],
  systemInstruction: { parts: { text: string }[] } | undefined,
  temperature: number,
  maxOutputTokens: number
): Promise<string> {
  const body: any = {
    contents,
    generationConfig: { temperature, maxOutputTokens },
  };
  if (systemInstruction) body.systemInstruction = systemInstruction;

  const response = await axios.post(
    `${BASE_URL}/${model}:generateContent?key=${API_KEY}`,
    body,
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  );

  const candidate = response.data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Invalid response from Gemini API');
  return text;
}

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    const { systemInstruction, contents } = buildContents(messages);
    return await callGemini('gemini-1.5-flash', contents, systemInstruction, 0.7, 1000);
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    if (error.response?.status === 400) {
      const msg = error.response?.data?.error?.message || '';
      if (msg.includes('image')) return 'यो मोडेलले छवि हेर्न सक्दैन। कृपया पाठ मात्र पठाउनुहोस्।';
    }
    if (error.response?.status === 403 || error.response?.status === 401) {
      return 'API कुञ्जी मान्य छैन। कृपया VITE_GEMINI_API_KEY जाँच गर्नुहोस्।';
    }
    return 'जवाफ प्राप्त गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।';
  }
}

export async function summarizeContent(
  text: string = '',
  imageBase64: string | null = null
): Promise<SummarizationResult> {
  try {
    const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [];

    if (text) {
      parts.push({ text: `Please summarize the following document content in bullet points:\n\n${text}` });
    }

    if (imageBase64) {
      const mimeType = imageBase64.includes('image/png') ? 'image/png' : 'image/jpeg';
      const data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      parts.push({ text: 'Please extract the text or meaning from this image and summarize it in bullet points.' });
      parts.push({ inlineData: { mimeType, data } });
    }

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts,
      },
    ];

    const systemInstruction = {
      parts: [
        {
          text: `You are Dr Summarizer, an expert AI assistant that extracts key insights from documents and images.
CRITICAL RULES:
1. Always format your output entirely in BULLET POINTS.
2. Do not write introductory or concluding paragraphs, just the bullet points.
3. You must respond in the same language as the provided document or image text.`,
        },
      ],
    };

    const summary = await callGemini('gemini-1.5-flash', contents, systemInstruction, 0.3, 2000);
    return { summary };
  } catch (error: any) {
    console.error('Summarization Error:', error);
    if (error.response?.status === 400) {
      const msg = error.response?.data?.error?.message || '';
      if (msg.includes('image')) throw new Error('Cannot read image file - this model does not support this image format.');
    }
    throw new Error('Failed to generate summary. The file might be too large or the text is unreadable.');
  }
}

interface TreatmentRecommendation {
  immediate: string[];
  preventive: string[];
  organic: string[];
  timeframe: string;
}

export async function generateTreatmentRecommendations(
  diseaseName: string,
  plantType: string = 'crop',
  symptoms: string[] = []
): Promise<TreatmentRecommendation> {
  try {
    const symptomsText = symptoms.length > 0 ? `with the following symptoms: ${symptoms.join(', ')}` : '';

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts: [
          {
            text: `Generate treatment recommendations for ${diseaseName} affecting ${plantType} plants ${symptomsText}.
Return ONLY a JSON object with these keys:
{
  "immediate": ["step 1", "step 2", ...],
  "preventive": ["measure 1", "measure 2", ...],
  "organic": ["option 1", "option 2", ...],
  "timeframe": "Expected recovery timeframe"
}`,
          },
        ],
      },
    ];

    const systemInstruction = {
      parts: [
        {
          text: 'You are an agricultural expert specializing in plant diseases and treatments. Provide detailed, practical treatment recommendations for farmers in Nepal. Always respond with valid JSON only.',
        },
      ],
    };

    const result = await callGemini('gemini-1.5-flash', contents, systemInstruction, 0.3, 1000);

    const parsed = JSON.parse(result.replace(/```json|```/g, '').trim());

    return {
      immediate: parsed.immediate || [],
      preventive: parsed.preventive || [],
      organic: parsed.organic || [],
      timeframe: parsed.timeframe || '2-3 weeks',
    };
  } catch (error: any) {
    console.error('Treatment recommendation error:', error);
    return {
      immediate: ['Remove and isolate affected plants', 'Prune away visibly infected parts', 'Ensure proper watering'],
      preventive: ['Implement crop rotation', 'Maintain adequate plant spacing', 'Use disease-resistant varieties'],
      organic: ['Apply neem oil solution', 'Use garlic or chili spray', 'Apply compost tea'],
      timeframe: 'Recovery typically takes 2-3 weeks with proper treatment and care',
    };
  }
}
