import { latLngBounds, LatLngExpression } from "leaflet";

const allowedBounds = [
  [33.656487295651, -117.85412222020983],
  [33.65580858123096, -117.82236486775658],
  [33.63290776411016, -117.85403639000239],
  [33.630120665484185, -117.82240778293699],
];

const mapBoundsCoordinates: LatLngExpression[] = [
  [33.658056, -117.856104], // Expanded northwest corner
  [33.658056, -117.828671], // Expanded northeast corner
  [33.632902, -117.828657], // Expanded southeast corner
  [33.632902, -117.856104], // Added southwest corner for complete rectangle
];
const centerPosition = [33.64363144392915, -117.84895805659363];

const mapBounds = latLngBounds(mapBoundsCoordinates);

export { allowedBounds, centerPosition, mapBounds };
