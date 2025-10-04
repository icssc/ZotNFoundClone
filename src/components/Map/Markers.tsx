import { Marker } from "react-leaflet";
import { stringArrayToLatLng } from "@/lib/types";
import { createClusterCustomIcon, iconsMap } from "@/lib/icons";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster-4-next";
import { Item } from "@/db/schema";
import { filterItems } from "@/lib/utils";

function ObjectMarkers({
  objects,
  setSelectedObjectId,
  filter,
}: {
  objects: Item[];
  setSelectedObjectId: (object: number) => void;
  filter: string;
}) {
  const filteredObjects = filterItems(objects, filter);
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
    >
      {filteredObjects
        .filter((object: Item) => object.location)
        .map((object: Item) => (
          <Marker
            key={object.id}
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
