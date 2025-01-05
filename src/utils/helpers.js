import { municipalitiesData } from "./../data/municipalities";
import { getTodayString } from "./date";

const featureToObj = (feature) => ({
  name: feature.properties.CONCELLO,
  feature: feature, // Including the full feature for reference
});

// Helper function to find a municipality from the GeoJSON features
const findMunicipalityFeature = (municipalityName) => {
  const { features } = municipalitiesData;
  const feature = features.find(
    (f) =>
      f.properties.CONCELLO.toLowerCase() === municipalityName.toLowerCase()
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
