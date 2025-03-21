"use client";
import dynamic from "next/dynamic";
import { Marker } from "react-leaflet";
import { DisplayObjects } from "@/lib/types";
import { createClusterCustomIcon, iconsMap } from "@/lib/icons";
import "leaflet/dist/leaflet.css";
const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-cluster-4-next"),
  {
    ssr: false,
  }
);

function ObjectMarkers({
  objectLocations,
}: {
  objectLocations: DisplayObjects[];
}) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
    >
      {objectLocations.map((address, index) => (
        <Marker
          key={index}
          position={address.location}
          title={address.object_id}
          icon={
            address.type === "lost"
              ? iconsMap.others.true
              : iconsMap.others.false
          }
        />
      ))}
    </MarkerClusterGroup>
  );
}

export default ObjectMarkers;
