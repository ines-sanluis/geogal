import adjacencyMap from "../data/adjacencyMap.json";
type AdjacencyMap = Record<string, string[]>;

function validatePath(
  startPoint: string,
  endPoint: string,
  route: string[]
): boolean {
  // Early validation checks
  const map = adjacencyMap as AdjacencyMap;

  if (!route.includes(startPoint) || !route.includes(endPoint)) return false;

  // Create a graph of connections using only the selected route
  const routeGraph: Record<string, string[]> = {};
  for (const municipality of route) {
    routeGraph[municipality] = (map[municipality] || []).filter((adjacent) =>
      route.includes(adjacent)
    );
  }

  // Depth-first search with path tracking
  function findPath(
    current: string,
    target: string,
    visited: Set<string>
  ): boolean {
    if (current === target) return true;

    visited.add(current);

    for (const neighbor of routeGraph[current] || []) {
      if (!visited.has(neighbor)) {
        if (findPath(neighbor, target, visited)) return true;
      }
    }

    return false;
  }

  // Try finding a path using depth-first search
  return findPath(startPoint, endPoint, new Set());
}

export default validatePath;
