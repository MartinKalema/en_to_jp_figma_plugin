import { TranslationResponse } from '@/types';
import { withRetry } from '@/utils/retry.util';
import { 
  OPENAI_API_URL, 
  DEFAULT_MODEL, 
  SYSTEM_PROMPT 
} from '@/constants';

export class TranslationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(text: string): Promise<TranslationResponse> {
    try {
      const response = await withRetry(() => this.callGPT4API(text));
      return {
        success: true,
        text: response,
      };
    } catch (error) {
      return {
        success: false,
        text: '',
        error: error.message,
      };
    }
  }

  private async callGPT4API(text: string): Promise<string> {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            "role": "system",
            "content": SYSTEM_PROMPT
          },
          {
            "role": "user",
            "content": text
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Translation failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}