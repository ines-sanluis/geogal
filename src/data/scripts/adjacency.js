/**
 * Builds an adjacency map from GeoJSON data.
 */
import fs from "fs";
import { municipalitiesData } from "./data.js";
import { booleanIntersects } from "@turf/turf";
const buildAdjacencyMap = (data) => {
  const adjacencyMap = new Map();
  const features = data.features;
  const MAX_FEATURES = features.length;
  // Initialize adjacency map
  features.forEach((feature) => {
    const countryName = feature.properties?.NAMEUNIT;
    adjacencyMap.set(countryName, new Set());
  });

  // Detect adjacent countries
  for (let i = 0; i < MAX_FEATURES; i++) {
    const feature1 = features[i];
    console.log("Processing feature", i + 1, "of", MAX_FEATURES);
    for (let j = i + 1; j < MAX_FEATURES; j++) {
      const feature2 = features[j];
      if (booleanIntersects(feature1, feature2)) {
        const name1 = feature1.properties?.NAMEUNIT;
        const name2 = feature2.properties?.NAMEUNIT;
        adjacencyMap.get(name1)?.add(name2);
        adjacencyMap.get(name2)?.add(name1);
      }
    }
  }

  return adjacencyMap;
};

// Define input and output paths
const outputPath = "../newAdjacencyMap.json";

// Parse the GeoJSON
const originalData = municipalitiesData;

// Transform the data
const transformedData = buildAdjacencyMap(originalData);

// Write to file
const outputData = Object.fromEntries(
  Array.from(transformedData.entries()).map(([key, value]) => [
    key,
    Array.from(value),
  ])
);

fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log(`Transformed data saved to ${outputPath}`);
