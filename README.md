# GeoGal

A geographical game where players must find the shortest path between two municipalities in Galicia, challenging their geographic knowledge and routing skills.

# Game Mechanics

The game challenges players to find the shortest path between two Galician municipalities using the adjacency map created with Turf.js. Each player guess is evaluated against two key criteria:

1. Solution validation: checking if the proposed route exactly matches the pre-calculated shortest path
2. Path legitimacy: verifying that the suggested route follows valid municipal connections.

As players submit municipalities, the system provides immediate feedback:

- Correct routes reveal the full solution.
- Hints may be provided to guide players toward the optimal path.

# Data Acquisition

The game's geographic data was obtained from the [Xunta de Galicia Map Center](https://mapas.xunta.gal/es/mapas/informacion-geografica/centro-de-descargas) and was provided in the [GeoJSON](https://geojson.org) format. This format represents geographic features using `JSON`, making it easy to work with and share spatial data.

It allows encoding various geographic data structures like points, lines, polygons, and their associated properties in a lightweight, human-readable text format. In this game, GeoJSON provides a standardized way to describe Galician municipal boundaries, enabling easy data isualization and computational processing across different tools.

The GeoJSON data can also be structured using different map projections, which are like "lenses" that transform the curved surface of the Earth into a flat map. Depending on the projection used, the same location might be represented with slightly different coordinates. This allows the representation of geographic features in various coordinate systems depending on the specific use case or region, such as focusing on a small region with high accuracy or visualizing the entire world with a broader perspective.

The downloaded data was initially structured using the ESPG:25829 coordinate reference system, which is specific to the Galician region's ETRS89 / UTM zone 29N projection. This specialized geographic encoding presents a technical challenge for web-based spatial analysis and interactive mapping.

To enable integration with Turf.js and facilitate the game's geospatial analysis, the municipal boundary datasets underwent a coordinate transformation process. This implied using `proj4` to convert the original UTM-based coordinates to the standard WGS84 longitude/latitude format, to ensure universal compatibility with geospatial processing libraries.

> The data could have also been obtained from tools such as https://geojson.io.

# Algorithm

Turf.js provides powerful spatial analysis capabilities, transforming these GeoJSON representations into an adjacency map. By utilizing the `booleanIntersects` function, the system identifies which municipalities share borders or touch, creating a network of interconnected regions. This adjacency mapping becomes the foundation for the game's route-finding mechanics.

The Breadth-First Search (BFS) algorithm then traverses this municipal network, allowing players to explore potential routes between different administrative regions. Starting from an initial municipality, the algorithm systematically explores neighboring areas, tracking visited locations and calculating the most efficient pathways across Galicia's landscape.

This approach not only enables an engaging gameplay experience but also provides a robust framework for understanding spatial relationships between Galician municipalities. Players can discover geographic connections, challenge their regional knowledge, and gain insights into the administrative topology of Galicia.

# Tools

- https://geojson.org
- https://d3js.org: JavaScript library to create dynamic visualizations.
- http://proj4js.org: JavaScript library to transform coordinates from one coordinate system to another, including datum transformations.
- https://turfjs.org: Advanced geospatial analysis for browsers and Node.js.
