import proj4 from "proj4";
import fs from "fs";
import { municipalitiesData } from "./data.js/index.js";

// Define the coordinate systems
const utm29n = "+proj=utm +zone=29 +ellps=GRS80 +units=m +no_defs +type=crs";
const wgs84 = "+proj=longlat +datum=WGS84 +no_defs +type=crs";

function transformCoordinates(coords) {
  return coords.map((point) => {
    const [x, y] = proj4(utm29n, wgs84, point);
    // Reduce precision to 5 decimal places
    return [Number(x.toFixed(5)), Number(y.toFixed(5))];
  });
}

function transformMultiPolygon(multiPolygon) {
  return multiPolygon.map((polygon) =>
    polygon.map((ring) => transformCoordinates(ring))
  );
}

function transformGeoJSON(input) {
  const transformedFeatures = input.features.map((feature) => {
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: transformMultiPolygon(feature.geometry.coordinates),
      },
    };
  });

  return {
    type: "FeatureCollection",
    features: transformedFeatures,
  };
}

// Define input and output paths
const outputPath =
  "/Users/san0005i/Documents/projects/galicia-game/src/data/municipalities-wgs84.js";

// Parse the GeoJSON
const originalData = municipalitiesData;

// Transform the data
const transformedData = transformGeoJSON(originalData);

// Create the output JavaScript content
const outputContent = `// Transformed from EPSG:25829 to WGS84 (EPSG:4326)
export const municipalities = ${JSON.stringify(transformedData, null, 2)};
`;

// Write to file
fs.writeFileSync(outputPath, outputContent, "utf-8");

console.log(`Transformed data saved to ${outputPath}`);
