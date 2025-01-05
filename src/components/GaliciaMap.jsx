import { useEffect, useRef } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import { municipalitiesData as geoData } from "../data/municipalities";

function utmToLatLon(easting, northing) {
  const centerLon = -8.5;
  const centerLat = 42.7;
  const lonScale = 0.000011;
  const latScale = 0.000009;
  const lon = centerLon + (easting - 600000) * lonScale;
  const lat = centerLat + (northing - 4700000) * latScale;
  return [lon, lat];
}

function transformGeoJSON(geojson) {
  const transformed = JSON.parse(JSON.stringify(geojson));
  transformed.features.forEach((feature) => {
    if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates = feature.geometry.coordinates.map((poly) =>
        poly.map((ring) => ring.map((coord) => utmToLatLon(coord[0], coord[1])))
      );
    }
  });
  return transformed;
}

const GaliciaMap = ({ currentLocation, guesses }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!geoData) return;

    const width = 600 * 3;
    const height = 400 * 3;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Transform the GeoJSON data
    const transformedData = transformGeoJSON(geoData);

    // Set up the projection
    const projection = d3
      .geoMercator()
      .fitSize([width, height], transformedData);

    const pathGenerator = d3.geoPath().projection(projection);

    // Add the base map with conditional coloring
    const g = svg.append("g");
    g.selectAll("path")
      .data(transformedData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", (feature) => {
        // If it's the current location
        if (currentLocation === feature.properties.CONCELLO) {
          return "#1e40af";
        }
        // If it's among the guesses
        if (guesses?.some((guess) => guess === feature.properties.CONCELLO)) {
          return "transparent";
        }
        // Default state
        return "#e5e7eb"; // gray-200
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1);
  }, [currentLocation, guesses]);

  if (!geoData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

GaliciaMap.propTypes = {
  currentLocation: PropTypes.string,
  guesses: PropTypes.array,
};

export default GaliciaMap;
