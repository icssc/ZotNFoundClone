import "leaflet.markercluster";
import L from "leaflet";

const resolvedIcon = L.icon({
  iconUrl: "/logos/resolved.png",
  iconSize: [40, 40],
  iconAnchor: [20, 30],
});

const othersLost = L.icon({
  iconUrl: "/logos/others_lost.png",
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const othersFound = L.icon({
  iconUrl: "/logos/others_found.png",
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

export const othersDragBlack = L.icon({
  iconUrl: "/logos/others_black.svg",
  iconSize: [40, 40],
  iconAnchor: [25, 25],
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
// L.MarkerCluster doesn't seem to work, even though we are importing leaflet.markercluster
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size;

  if (count < 5) size = "small";
  else if (count < 20) size = "medium";
  else size = "large";

  // Define color schemes for different count ranges
  const options = {
    light: {
      small: {
        background: "rgba(255, 255, 255, 0.8)", // white with opacity
        border: "#4299E1", // blue.400
        color: "#4299E1",
      },
      medium: {
        background: "rgba(255, 255, 255, 0.8)",
        border: "#48BB78", // green.400
        color: "#48BB78",
      },
      large: {
        background: "rgba(255, 255, 255, 0.8)",
        border: "#F56565", // red.400
        color: "#F56565",
      },
    },
    dark: {
      small: {
        background: "rgba(45, 55, 72, 0.8)", // gray.800 with opacity
        border: "#90CDF4", // blue.200
        color: "#90CDF4",
      },
      medium: {
        background: "rgba(45, 55, 72, 0.8)",
        border: "#9AE6B4", // green.200
        color: "#9AE6B4",
      },
      large: {
        background: "rgba(45, 55, 72, 0.8)",
        border: "#FEB2B2", // red.200
        color: "#FEB2B2",
      },
    },
  };
  const colors = options.dark.medium;

  const sizeMap = {
    small: 40,
    medium: 50,
    large: 60,
  };

  return L.divIcon({
    html: `<div style="
      background-color: ${colors.background} !important;
      border: 2px solid ${colors.border};
      color: ${colors.color};
      width: ${sizeMap.medium}px;
      height: ${sizeMap.medium}px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: bold;
      font-size: ${size === "small" ? "14px" : "16px"};
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${count}</div>`,
    className: `custom-cluster-icon dark-mode`,
    iconSize: L.point(sizeMap.medium, sizeMap.medium, true),
  });
};
