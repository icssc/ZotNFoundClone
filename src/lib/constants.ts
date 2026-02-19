import { latLngBounds, type LatLngExpression } from "leaflet";

const mapBoundsCoordinates: LatLngExpression[] = [
  [33.6595, -117.8595], // northwest
  [33.6595, -117.8215], // northeast (expanded east side)
  [33.6295, -117.8215], // southeast
  [33.6295, -117.8595], // southwest
];
const centerPosition = [33.64363144392915, -117.84895805659363];

const mapBounds = latLngBounds(mapBoundsCoordinates);

export { centerPosition, mapBounds };
