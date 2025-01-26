import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { FeatureCollection } from "geojson";

import {
  FaPlus,
  FaMinus,
  FaArrowRotateRight,
  FaBorderAll,
} from "react-icons/fa6";
import ZoomButton from "./ZoomButton";
import { compareStrings, isStringInArray } from "../utils/compareString";

function getProjection(data: FeatureCollection, width: number, height: number) {
  const center = d3.geoCentroid(data);
  return d3
    .geoMercator()
    .center(center)
    .scale(width * 13)
    .translate([width / 2, height / 2]);
}

const Map = ({
  data,
  startPoint,
  endPoint,
  alreadyGuessed,
  isGameOver,
  solution,
}: {
  data: FeatureCollection;
  startPoint: string;
  endPoint: string;
  alreadyGuessed: string[];
  isGameOver: boolean;
  solution: string[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomState = useRef();

  if (!startPoint || !endPoint) return <div>Error</div>;

  useEffect(() => {
    if (!data || !svgRef.current) {
      return;
    }

    const width = 600;
    const height = 400;

    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid");

    const projection = getProjection(data, width, height);
    const pathGenerator: any = d3.geoPath().projection(projection);
    const g = svg.append("g");

    const paths = g
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("stroke-width", 0.5)
      .attr("class", (feature: any) => {
        let hasBeenGuessed = isStringInArray(
          alreadyGuessed,
          feature.properties.NAMEUNIT
        );
        let isSolution = isStringInArray(solution, feature.properties.NAMEUNIT);
        let classes = "transition-colors duration-200 ";
        if (compareStrings(startPoint, feature.properties.NAMEUNIT)) {
          classes += "fill-teal-500";
        } else if (compareStrings(endPoint, feature.properties.NAMEUNIT)) {
          classes += "fill-blue-500";
        } else if (hasBeenGuessed || (isGameOver && isSolution)) {
          if (isSolution) {
            classes += "fill-slate-600 ";
          } else {
            classes += "fill-slate-300 ";
          }
        } else if (showAll) {
          classes += "stroke-blue-400 fill-blue-100";
        } else {
          classes += "fill-blue-100 stroke-blue-100";
        }
        return classes;
      })
      .transition()
      .duration(300);

    const newGuess = alreadyGuessed[alreadyGuessed.length - 1];
    paths
      .filter((feature: any) =>
        compareStrings(feature.properties.NAMEUNIT, newGuess)
      )
      .transition()
      .duration(300)
      .attrTween("transform", () => {
        return (t) => {
          const wiggle = Math.sin(t * Math.PI) * 0.25;
          return `rotate(${wiggle})`;
        };
      });

    // Set zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        zoomState.current = event.transform;
        g.attr("transform", event.transform.toString());
      });
    svg.call(zoom);
    if (zoomState.current) {
      svg.call(zoom.transform, zoomState.current);
    }

    // Add listeners for zoom buttons
    d3.select("#zoom-in").on("click", () => {
      svg.transition().call(zoom.scaleBy, 1.3);
    });
    d3.select("#zoom-out").on("click", () => {
      svg.transition().call(zoom.scaleBy, 1 / 1.3);
    });
    d3.select("#zoom-reset").on("click", () => {
      svg.transition().call(zoom.transform, d3.zoomIdentity);
    });
    // Add listener for zoom key events
    d3.select("body").on("keydown", (event) => {
      if (event.key === "+") {
        svg.transition().call(zoom.scaleBy, 1.3);
      } else if (event.key === "-") {
        svg.transition().call(zoom.scaleBy, 1 / 1.3);
      } else if (event.key === "0") {
        svg.transition().call(zoom.transform, d3.zoomIdentity);
      } else if (event.key === "ArrowUp") {
        svg.transition().call(zoom.translateBy, 0, 10);
      } else if (event.key === "ArrowDown") {
        svg.transition().call(zoom.translateBy, 0, -10);
      } else if (event.key === "ArrowLeft") {
        svg.transition().call(zoom.translateBy, 10, 0);
      } else if (event.key === "ArrowRight") {
        svg.transition().call(zoom.translateBy, -10, 0);
      }
    });
  }, [alreadyGuessed, showAll, isGameOver]);

  return (
    <section className="relative w-full">
      <svg
        ref={svgRef}
        className="border-[0.5px] h-[400px] w-full border-blue-200 rounded-lg shadow-md bg-blue-50"
      />
      {/* Zoom controls */}
      <div className="absolute bottom-2 left-2">
        <ZoomButton
          type="border"
          icon={<FaBorderAll />}
          onClick={() => setShowAll((prev) => !prev)}
        />
      </div>
      <div className="absolute bottom-2 right-2 flex gap-1">
        <ZoomButton type="in" icon={<FaPlus />} active={showAll} />
        <ZoomButton type="out" icon={<FaMinus />} />
        <ZoomButton type="reset" icon={<FaArrowRotateRight />} />
      </div>
    </section>
  );
};

export default Map;
