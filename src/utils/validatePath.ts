import adjacencyMap from "../data/adjacencyMap.json";
type AdjacencyMap = Record<string, string[]>;

function validatePath(
  startPoint: string,
  endPoint: string,
  route: string[]
): {
  valid: boolean;
  path: string[] | undefined;
} {
  // Early validation checks
  const map = adjacencyMap as AdjacencyMap;

  if (!route.includes(startPoint) || !route.includes(endPoint))
    return {
      valid: false,
      path: undefined,
    };

  // Create a graph of connections using only the selected route
  const routeGraph: Record<string, string[]> = {};
  for (const municipality of route) {
    const m = municipality.charAt(0).toUpperCase() + municipality.slice(1);
    routeGraph[municipality] = (map[m] || []).filter((adjacent) =>
      route.includes(adjacent)
    );
  }
  // Depth-first search with path tracking
  function findPath(
    current: string,
    target: string,
    visited: Set<string>,
    path: string[]
  ): {
    valid: boolean;
    path: string[] | undefined;
  } {
    visited.add(current);
    path.push(current);

    if (current === target) {
      return {
        valid: true,
        path: path,
      };
    }

    for (const neighbor of routeGraph[current] || []) {
      if (!visited.has(neighbor)) {
        const result = findPath(neighbor, target, visited, path);
        if (result.valid) return result;
      }
    }

    path.pop(); // Backtrack
    return {
      valid: false,
      path: undefined,
    };
  }

  // Try finding a path using depth-first search
  return findPath(startPoint, endPoint, new Set(), []);
}

export default validatePath;
