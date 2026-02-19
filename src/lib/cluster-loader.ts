import L, { MarkerClusterGroupOptions } from "leaflet";
require("leaflet.markercluster"); // side-effect import to register markercluster with Leaflet
// since leaflet.markerCluster patches Leaflet's L namespace directly
export function createClusterGroup(
  options: MarkerClusterGroupOptions
): L.MarkerClusterGroup {
  return L.markerClusterGroup(options);
}

export function addMarkerToGroup(
  group: L.MarkerClusterGroup,
  marker: L.Marker
): void {
  group.addLayer(marker);
}
