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

    const width = 600;
    const height = 400;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid");

    // Transform the GeoJSON data
    const transformedData = transformGeoJSON(geoData);

    // Calculate the center of Galicia
    const center = [-8.5, 42.7]; // Approximate center of Galicia

    // Set up the projection with explicit center and scale
    const projection = d3
      .geoMercator()
      .center(center)
      .scale(width * 15) // Increased scale to make the map larger
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Add the base map with conditional coloring
    const g = svg.append("g");

    // Add paths
    g.selectAll("path")
      .data(transformedData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", (feature) => {
        if (currentLocation === feature.properties.CONCELLO) {
          return "#1e40af";
        }
        if (guesses?.some((guess) => guess === feature.properties.CONCELLO)) {
          return "transparent";
        }
        return "#e5e7eb";
      })
      .attr("stroke", "black")
      .attr("stroke-width", 0.5);

    // Calculate bounds of the paths
    const bounds = pathGenerator.bounds(transformedData);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = 0.9 / Math.max(dx / width, dy / height);

    // Apply transform to the group to ensure it fills the height
    g.attr(
      "transform",
      `translate(${width / 2},${
        height / 2
      })scale(${scale})translate(${-x},${-y})`
    );
  }, [currentLocation, guesses]);

  if (!geoData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return <svg ref={svgRef} className="h-[500px]" />;
};

GaliciaMap.propTypes = {
  currentLocation: PropTypes.string,
  guesses: PropTypes.array,
};

export default GaliciaMap;
