import "leaflet.markercluster";
import { divIcon, icon, point } from "leaflet";
import type { MarkerCluster } from "leaflet";

const resolvedIcon = icon({
  iconUrl: "/logos/resolved.png",
  iconSize: [40, 40],
  iconAnchor: [20, 30],
});

const othersLost = icon({
  iconUrl: "/logos/others_lost.png",
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const othersFound = icon({
  iconUrl: "/logos/others_found.png",
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

export const iconsMap = {
  others: {
    true: othersLost,
    false: othersFound,
  },
  resolved: {
    true: resolvedIcon,
    false: resolvedIcon,
  },
};

export const createClusterCustomIcon = (cluster: MarkerCluster) => {
  const count = cluster.getChildCount();
  const size = count < 5 ? "small" : count < 20 ? "medium" : "large";

  const colors = {
    background: "rgba(45, 55, 72, 0.8)",
    border: "#9AE6B4",
    color: "#9AE6B4",
  };

  const sizeMap = {
    small: 40,
    medium: 50,
    large: 60,
  };

  const clusterSize = sizeMap[size];

  return divIcon({
    html: `<div style="
      background-color: ${colors.background} !important;
      border: 2px solid ${colors.border};
      color: ${colors.color};
      width: ${clusterSize}px;
      height: ${clusterSize}px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: bold;
      font-size: ${size === "small" ? "14px" : "16px"};
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${count}</div>`,
    className: "custom-cluster-icon dark-mode",
    iconSize: point(clusterSize, clusterSize, true),
  });
};
