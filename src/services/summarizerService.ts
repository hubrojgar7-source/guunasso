import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface SummarizationResult {
  summary: string;
}

export async function summarizeContent(
  text: string = '',
  imageBase64: string | null = null,
  languageHint: string = 'the original language'
): Promise<SummarizationResult> {
  try {
    const messages: any[] = [
      {
        role: 'system',
        content: `You are Dr Summarizer, an expert AI assistant that extracts key insights from documents and images. 
        Your task is to summarize the content provided. 
        CRITICAL RULES:
        1. Always format your output entirely in BULLET POINTS.
        2. Do not write introductory or concluding paragraphs, just the bullet points.
        3. You must respond in the same language as the provided document or image text (e.g., if the document is in Nepali, write the summary in Nepali).`
      }
    ];

    const userMessage: any = { role: 'user', content: [] };

    if (text) {
      userMessage.content.push({
        type: 'text',
        text: `Please summarize the following document content in bullet points:\n\n${text}`
      });
    }

    if (imageBase64) {
      userMessage.content.push({
        type: 'image_url',
        image_url: {
          url: imageBase64
        }
      });
      userMessage.content.push({
        type: 'text',
        text: "Please extract the text or meaning from this image and summarize it in bullet points."
      });
    }

    messages.push(userMessage);

    // Using gemini-1.5-flash as it supports multimodality (images) and long context windows (documents) extremely well
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'google/gemini-1.5-flash',
        messages,
        temperature: 0.3,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://गुनासो.com',
          'X-Title': 'गुनासो.com Dr Summarizer',
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 seconds for longer documents
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return { summary: response.data.choices[0].message.content };
    } else {
      throw new Error('Invalid response from AI service');
    }
  } catch (error: any) {
    console.error('Summarization Error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication error with AI service.');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    throw new Error('Failed to generate summary. The file might be too large or the text is unreadable.');
  }
}
