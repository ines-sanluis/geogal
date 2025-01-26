import adjacencyMap from "../data/adjacencyMap.json";

type AdjacencyMap = Record<string, string[]>;

function findShortestRoute(
  startFeature: string,
  endFeature: string
): string[] | null {
  // Ensure adjacencyMap is of the correct type
  const map = adjacencyMap as AdjacencyMap;

  // Queue to track paths
  const queue: string[][] = [[startFeature]];

  // Track visited features to prevent cycles
  const visited = new Set<string>([startFeature]);

  while (queue.length > 0) {
    // Safely handle potential undefined
    const currentPath = queue.shift();
    if (!currentPath) break;

    const lastFeature = currentPath[currentPath.length - 1];

    // Check if we've reached the destination
    if (lastFeature === endFeature) {
      return currentPath;
    }

    // Explore adjacent features
    const adjacentFeatures = map[lastFeature] || [];
    for (const adjacentFeature of adjacentFeatures) {
      if (!visited.has(adjacentFeature)) {
        visited.add(adjacentFeature);
        queue.push([...currentPath, adjacentFeature]);
      }
    }
  }

  // No route found
  return null;
}

export function getSuggestions(start: string, end: string) {
  return Object.keys(adjacencyMap).filter((s) => s !== start && s !== end);
}

export default findShortestRoute;
