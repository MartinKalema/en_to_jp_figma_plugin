import { BaseError, Errors } from '../utils/errors';

export class TranslationService {
  constructor(private apiKey: string) {
    if (!apiKey) {
      throw Errors.validation('API key is required');
    }
  }

  async translate(text: string): Promise<{ success: boolean; text: string }> {
    try {
      if (!text.trim()) {
        throw Errors.validation('Text to translate cannot be empty');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4-0125-preview",
          messages: [
            {
              "role": "system",
              "content": "You are a professional English to Japanese translator."
            },
            {
              "role": "user",
              "content": text
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw Errors.api(
          errorData.error?.message || 'Translation API request failed',
          response.status
        );
      }

      const data = await response.json();
      return {
        success: true,
        text: data.choices[0].message.content.trim()
      };

    } catch (error: unknown) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw Errors.translation('Translation failed', error);
    }
  }
}
