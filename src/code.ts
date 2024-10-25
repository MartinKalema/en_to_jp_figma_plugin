import { StorageService } from './services/storage.service';
import { TranslationService } from './services/translation.service';
import { NodeUtil } from './utils/node.util';
import { BATCH_SIZE } from './constants';

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
        return clone;
      }
      
      const translation = await translationService.translate(clone.characters);
      
      if (translation.success) {
        await figma.loadFontAsync(clone.fontName as FontName);
        clone.characters = translation.text;
        
        if (clone.textAutoResize !== "NONE") {
          clone.textAutoResize = "WIDTH_AND_HEIGHT";
        }
      } else {
        figma.notify(`Failed to translate text: ${translation.error}`, { error: true });
      }
    } catch (error) {
      console.error(`Error translating node: ${error}`);
      figma.notify(`Error translating text: ${error.message}`, { error: true });
    }
  }
  else if ('children' in clone) {
    const translatedChildren = await NodeUtil.processNodeBatch(
      Array.from(clone.children),
      async (child) => await translateNode(child, translationService)
    );
    
    clone.children.forEach((child, index) => {
      if (translatedChildren[index]) {
        child.remove();
      }
    });
    
    translatedChildren.forEach((child) => {
      clone.appendChild(child);
    });
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
  } catch (error) {
    console.error('Translation error:', error);
    figma.notify(`Translation failed: ${error.message}`, { error: true });
    figma.ui.postMessage({ type: 'translation-complete' });
    throw error;
  }
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'save-settings') {
    await StorageService.saveSettings({ apiKey: msg.apiKey });
    figma.notify('API key saved! ✨');
  }

  if (msg.type === 'translate-selected') {
    const settings = await StorageService.getSettings();
    
    if (!settings?.apiKey) {
      figma.notify('Please enter your OpenAI API key first', { error: true });
      figma.ui.postMessage({ type: 'translation-complete' });
      return;
    }

    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select elements to translate');
      figma.ui.postMessage({ type: 'translation-complete' });
      return;
    }
    
    try {
      const translationService = new TranslationService(settings.apiKey);
      await duplicateAndTranslate(selection, translationService);
    } catch (error) {
      console.error('Plugin error:', error);
      figma.notify('Error: ' + error.message, { error: true });
      figma.ui.postMessage({ type: 'translation-complete' });
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};