import { Marker } from "react-leaflet";
import { stringArrayToLatLng } from "@/lib/types";
import { createClusterCustomIcon, iconsMap } from "@/lib/icons";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster-4-next";
import { Item } from "@/db/schema";
import { filterItems } from "@/lib/utils";

function ObjectMarkers({
  objects,
  filter,
}: {
  objects: Item[];
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
              click: () => {
                // Update URL with item parameter
                const url = new URL(window.location.href);
                url.searchParams.set("item", object.id.toString());
                window.history.pushState({}, "", url.toString());
              },
            }}
          />
        ))}
    </MarkerClusterGroup>
  );
}

export default ObjectMarkers;
