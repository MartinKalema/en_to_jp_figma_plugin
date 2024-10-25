import { StorageService } from './services/storage.service';
import { TranslationService } from './services/translation.service';
import { NodeUtil } from './utils/node.util';
import { handleError, Errors, isValidationError } from './utils/errors';

figma.showUI(__html__, { 
  width: 300, 
  height: 400,
  themeColors: true
});

async function translateNode(
  node: SceneNode,
  translationService: TranslationService
): Promise<SceneNode> {
  const clone = node.clone();

  if (clone.type === 'TEXT') {
    try {
      if (!clone.characters.trim()) {
        throw Errors.validation('Empty text node found');
      }

      const translation = await translationService.translate(clone.characters);
      await figma.loadFontAsync(clone.fontName as FontName);
      clone.characters = translation.text;

      if (clone.textAutoResize !== "NONE") {
        clone.textAutoResize = "WIDTH_AND_HEIGHT";
      }
    } catch (error: unknown) {
      handleError(error);
    }
  }

  return clone;
}

async function duplicateAndTranslate(
  selection: readonly SceneNode[], 
  translationService: TranslationService
) {
  const parentFrame = figma.createFrame();
  parentFrame.name = "Japanese Translation (GPT-4)";
  
  const bounds = NodeUtil.getNodeBounds(selection);
  
  parentFrame.x = bounds.maxX + 100;
  parentFrame.y = selection[0].y;
  parentFrame.resize(
    bounds.maxX - bounds.minX,
    bounds.maxY - bounds.minY
  );
  
  const totalNodes = selection.length;
  let processedNodes = 0;
  
  figma.notify(`Translation in progress (0/${totalNodes})...`, { timeout: Infinity });
  
  try {
    const translatedNodes = await NodeUtil.processNodeBatch(
      Array.from(selection),
      async (node) => {
        const translatedNode = await translateNode(node, translationService);
        translatedNode.x = node.x - bounds.minX;
        translatedNode.y = node.y - bounds.minY;
        
        processedNodes++;
        figma.notify(
          `Translation in progress (${processedNodes}/${totalNodes})...`,
          { timeout: Infinity }
        );
        
        return translatedNode;
      }
    );
    
    translatedNodes.forEach(node => parentFrame.appendChild(node));
    
    figma.currentPage.selection = [parentFrame];
    figma.viewport.scrollAndZoomIntoView([parentFrame]);
    
    figma.notify('Translation complete! ✨');
    figma.ui.postMessage({ type: 'translation-complete' });
    
    return parentFrame;
  } catch (error: unknown) {
    handleError(error);
    figma.ui.postMessage({ type: 'translation-complete' });
    throw error; // Re-throw to be handled by the caller
  }
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'save-settings') {
    try {
      await StorageService.saveSettings({ apiKey: msg.apiKey });
      figma.notify('API key saved! ✨');
    } catch (error: unknown) {
      handleError(error);
    }
  }

  if (msg.type === 'translate-selected') {
    try {
      const settings = await StorageService.getSettings();
      
      if (!settings?.apiKey) {
        throw Errors.validation('Please enter your OpenAI API key first');
      }

      const selection = figma.currentPage.selection;
      
      if (selection.length === 0) {
        throw Errors.validation('Please select elements to translate');
      }
      
      const translationService = new TranslationService(settings.apiKey);
      await duplicateAndTranslate(selection, translationService);

    } catch (error: unknown) {
      handleError(error);
      // Only send translation-complete if it's not a validation error
      if (!isValidationError(error)) {
        figma.ui.postMessage({ type: 'translation-complete' });
      }
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};