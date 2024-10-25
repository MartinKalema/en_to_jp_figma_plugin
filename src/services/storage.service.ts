import { TranslationSettings } from '@/types';

export class StorageService {
  private static readonly SETTINGS_KEY = 'translation-settings';

  static async saveSettings(settings: TranslationSettings): Promise<void> {
    await figma.clientStorage.setAsync(this.SETTINGS_KEY, settings);
  }

  static async getSettings(): Promise<TranslationSettings | null> {
    return await figma.clientStorage.getAsync(this.SETTINGS_KEY);
  }

  static async clearSettings(): Promise<void> {
    await figma.clientStorage.deleteAsync(this.SETTINGS_KEY);
  }
}
