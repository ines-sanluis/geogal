import React from "react";
import Heading from "./Heading";
import { municipalitiesData as geojsonData } from "../data/municipalities-wgs84";

function Learn({}: {}) {
  return (
    <section className="flex flex-col gap-2 max-w-[65vh] p-2">
      <Heading title="Lista dos concellos de Galicia" />
      <div className="flex flex-col flex-wrap gap-2">
        <h2 className="text-md font-semibold">A Coruña</h2>
        <ul className="flex flex-wrap gap-2">
          {geojsonData.features
            .filter((feature) => feature.properties?.PROVINCIA === "A Coruña")
            .map((feature) => (
              <li
                key={feature.properties?.NAMEUNIT}
                className="text-blue-900 bg-sky-100 px-2 py-1 rounded-lg font-semibold"
              >
                {feature.properties?.NAMEUNIT}
              </li>
            ))}
        </ul>
        <h2 className="text-md font-semibold">Pontevedra</h2>
        <ul className="flex flex-wrap gap-2">
          {geojsonData.features
            .filter((feature) => feature.properties?.PROVINCIA === "Pontevedra")
            .map((feature) => (
              <li
                key={feature.properties?.NAMEUNIT}
                className="text-blue-900 bg-sky-100 px-2 py-1 rounded-lg font-semibold"
              >
                {feature.properties?.NAMEUNIT}
              </li>
            ))}
        </ul>
        <h2 className="text-md font-semibold">Ourense</h2>
        <ul className="flex flex-wrap gap-2">
          {geojsonData.features
            .filter((feature) => feature.properties?.PROVINCIA === "Ourense")
            .map((feature) => (
              <li
                key={feature.properties?.NAMEUNIT}
                className="bg-sky-100 px-2 py-1 rounded-lg font-semibold"
              >
                {feature.properties?.NAMEUNIT}
              </li>
            ))}
        </ul>
        <h2 className="text-md font-semibold">Lugo</h2>
        <ul className="flex flex-wrap gap-2">
          {geojsonData.features
            .filter((feature) => feature.properties?.PROVINCIA === "Lugo")
            .map((feature) => (
              <li
                key={feature.properties?.NAMEUNIT}
                className="bg-sky-100 px-2 py-1 rounded-lg font-semibold"
              >
                {feature.properties?.NAMEUNIT}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

export default Learn;
