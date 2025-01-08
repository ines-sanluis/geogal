import { ExtendedFeature } from "d3";
import { municipalitiesData } from "../data/municipalities";
import { getTodayString } from "./date";

const featureToObj = (feature: ExtendedFeature) => {
  // Remove every comma and every space from the municipality name
  const length = feature.properties?.CONCELLO.replace(/,| /g, "").length;
  return {
    name: feature.properties?.CONCELLO,
    feature: feature, // Including the full feature for reference
    hints: [
      "🌍 Provincia de " + feature.properties?.PROVINCIA,
      "🔠 Comeza por " + feature.properties?.CONCELLO[0],
      "📏 Ten " + length + " letras",
    ],
  };
};

// Helper function to find a municipality from the GeoJSON features
const findMunicipalityFeature = (municipalityName: string) => {
  const { features } = municipalitiesData;
  const feature = features.find(
    (f) =>
      f.properties?.CONCELLO.toLowerCase() === municipalityName.toLowerCase()
  );

  if (!feature) {
    return null;
  }

  return featureToObj(feature);
};

// Get daily municipality using date as seed
const getDailyMunicipality = () => {
  const { features } = municipalitiesData;
  const dateString = getTodayString();
  // Create a hash from the date string
  const dateHash = Array.from(dateString).reduce(
    (hash, char) => (hash << 5) - hash + char.charCodeAt(0),
    0
  );
  const index = Math.abs(dateHash) % features.length;
  return featureToObj(features[index]);
};

export { findMunicipalityFeature, getDailyMunicipality };
