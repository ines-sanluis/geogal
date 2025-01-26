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
  const map = adjacencyMap as AdjacencyMap;

  // Convert inputs to title case for consistency
  startPoint = toTitleCase(startPoint);
  endPoint = toTitleCase(endPoint);
  route = route.map(toTitleCase);

  if (!route.includes(startPoint) || !route.includes(endPoint))
    return { valid: false, path: undefined };

  // Create a graph of connections using only the selected route
  const routeGraph: Record<string, string[]> = {};
  for (const municipality of route) {
    routeGraph[municipality] = (map[municipality] || []).filter((adjacent) =>
      route.includes(toTitleCase(adjacent))
    );
  }

  function findPath(
    current: string,
    target: string,
    visited: Set<string>,
    path: string[]
  ): { valid: boolean; path: string[] | undefined } {
    visited.add(current);
    path.push(current);

    if (current === target) {
      return { valid: true, path: path };
    }

    for (const neighbor of routeGraph[current] || []) {
      if (!visited.has(neighbor)) {
        const result = findPath(neighbor, target, new Set(visited), [...path]);
        if (result.valid) return result;
      }
    }

    return { valid: false, path: undefined };
  }

  return findPath(startPoint, endPoint, new Set(), []);
}

function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default validatePath;
