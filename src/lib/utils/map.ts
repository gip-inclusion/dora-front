import type { Map } from "maplibre-gl";
import type { Point } from "geojson";
import { LngLatBounds } from "maplibre-gl";

export function zoomToResults(map: Map, features: Point[]) {
  if (!map) {
    return;
  }
  console.log(features[0]);
  if (features.length) {
    const pt0 = features[0].coordinates;
    const bounds = features.reduce(
      function (acc, feature) {
        return acc.extend([feature.coordinates[0], feature.coordinates[1]]);
      },
      new LngLatBounds([pt0[0], pt0[1], pt0[0], pt0[1]])
    );

    if (bounds) {
      map.fitBounds(bounds, {
        padding: 60,
      });
    }
  }
}
