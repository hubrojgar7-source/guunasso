const API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', err);
      if (response.status === 401 || response.status === 403) {
        return 'API कुञ्जी मान्य छैन। कृपया VITE_GROQ_API_KEY जाँच गर्नुहोस्।';
      }
      return 'जवाफ प्राप्त गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।';
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'जवाफ प्राप्त गर्न असफल भयो।';
  } catch (error: any) {
    console.error('Groq Chat Error:', error);
    return 'जवाफ प्राप्त गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।';
  }
}
