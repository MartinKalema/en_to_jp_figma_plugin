import { BATCH_SIZE } from '@/constants';

export class NodeUtil {
  static async processNodeBatch(
    nodes: SceneNode[],
    processor: (node: SceneNode) => Promise<SceneNode>
  ): Promise<SceneNode[]> {
    const results: SceneNode[] = [];
    
    for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
      const batch = nodes.slice(i, i + BATCH_SIZE);
      const processedBatch = await Promise.all(
        batch.map(node => processor(node))
      );
      results.push(...processedBatch);
    }
    
    return results;
  }

  static getNodeBounds(nodes: readonly SceneNode[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    });

    return { minX, minY, maxX, maxY };
  }
}