import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import geoData from "../data/galicia.json";

const GaliciaMap = ({ currentLocation, guesses }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 400;
    const height = 300;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Set up the projection with adjusted scale and center
    const projection = d3
      .geoMercator()
      .center([-7.85, 42.7]) // Adjust center slightly
      .scale(5500) // Reduce scale more
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Add the base map
    const g = svg.append("g");

    g.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Add guesses
    // Add guesses as X marks
    if (guesses?.length > 0) {
      const xSize = 6; // Size of the X mark

      guesses.forEach((d) => {
        const [x, y] = projection([d.lng, d.lat]);
        g.append("line")
          .attr("x1", x - xSize / 2)
          .attr("y1", y - xSize / 2)
          .attr("x2", x + xSize / 2)
          .attr("y2", y + xSize / 2)
          .attr("stroke", "crimson")
          .attr("stroke-width", 2);

        g.append("line")
          .attr("x1", x - xSize / 2)
          .attr("y1", y + xSize / 2)
          .attr("x2", x + xSize / 2)
          .attr("y2", y - xSize / 2)
          .attr("stroke", "crimson")
          .attr("stroke-width", 2);
      });
    }

    // Add current location as a blue dot
    if (currentLocation?.lat && currentLocation?.lng) {
      const [x, y] = projection([currentLocation.lng, currentLocation.lat]);

      // Create drop shadow
      const defs = svg.append("defs");
      const filter = defs
        .append("filter")
        .attr("id", "dot-shadow")
        .attr("height", "130%");

      filter
        .append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 1);

      filter.append("feOffset").attr("dx", 0).attr("dy", 1);

      filter
        .append("feComposite")
        .attr("operator", "out")
        .attr("in2", "SourceAlpha");

      filter
        .append("feColorMatrix")
        .attr("values", "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // Draw the dot
      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 5)
        .attr("fill", "#1e40af")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("filter", "url(#dot-shadow)");
    }
  }, [currentLocation, guesses]);

  return (
    <div className="w-full h-[300px]">
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

GaliciaMap.propTypes = {
  currentLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  guesses: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ),
};

GaliciaMap.defaultProps = {
  currentLocation: null,
  guesses: [],
};

export default GaliciaMap;
