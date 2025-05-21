import { Marker } from "react-leaflet";
import { stringArrayToLatLng } from "@/lib/types";
import { createClusterCustomIcon, iconsMap } from "@/lib/icons";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster-4-next";
import { Item } from "@/db/schema";

function ObjectMarkers({
  objects,
  setSelectedObjectId,
  filter,
}: {
  objects: Item[];
  setSelectedObjectId: (object: number) => void;
  filter: string;
}) {
  console.log("filter", filter);
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
    >
      {objects
        .filter((object: Item) => object.location)
        .map((object: Item, index) => (
          <Marker
            key={index}
            position={stringArrayToLatLng(object.location!)}
            title={object.name!}
            icon={object.isLost ? iconsMap.others.true : iconsMap.others.false}
            eventHandlers={{
              click: () => setSelectedObjectId(object.id),
            }}
          />
        ))}
    </MarkerClusterGroup>
  );
}

export default ObjectMarkers;
