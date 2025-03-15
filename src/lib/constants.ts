import { latLngBounds, LatLngExpression } from "leaflet";

const allowedBounds = [
  [33.656487295651, -117.85412222020983],
  [33.65580858123096, -117.82236486775658],
  [33.63290776411016, -117.85403639000239],
  [33.630120665484185, -117.82240778293699],
];

const mapBoundsCoordinates: LatLngExpression[] = [
  [33.65580858123096, -117.82236486775658],
  [33.63290776411016, -117.85403639000239],
];
const centerPosition = [33.6461, -117.8427];

const mapBounds = latLngBounds(mapBoundsCoordinates);

export { allowedBounds, centerPosition, mapBounds };
