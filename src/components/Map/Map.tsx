"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { centerPosition, mapBounds } from "@/lib/constants";
import { lostObjects, foundObjects } from "@/lib/fakeData";
import { mapObjectsToDisplayObjects, Object, isLostObject } from "@/lib/types";
import ObjectMarkers from "./Markers";
import { useMapContext } from "../ContextProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User } from "lucide-react";

// https://github.com/allartk/leaflet.offline Caching the map tiles would be quite nice as well!

function MapController() {
  const map = useMap();
  const { selectedLocation } = useMapContext();
  const bounds = mapBounds;
  const transparentColor = { color: "#000", opacity: 0, fillOpacity: 0 };

  const outerHandlers = useMemo(
    () => ({
      click() {
        map.fitBounds(bounds);
      },
    }),
    [bounds, map]
  );

  useEffect(() => {
    if (map) {
      map.setMaxBounds(bounds);
      if (selectedLocation) {
        map.flyTo(selectedLocation, 18);
      } else {
        map.fitBounds(bounds);
      }
    }
  }, [map, selectedLocation, bounds]);

  return (
    <Rectangle
      bounds={bounds}
      eventHandlers={outerHandlers}
      pathOptions={transparentColor}
    />
  );
}

function Map() {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  const [selectedObjectId, setSelectedObjectId] = useState<string>();
  if (!accessToken) {
    throw new Error("Mapbox access token is required");
  }

  // Replace this with useQuery call or taking it from context provider if I implemented it
  const objects = useMemo(() => {
    const objects: Object[] = (lostObjects as Object[]).concat(foundObjects);
    return objects;
  }, []);

  const objectLocations = useMemo(() => {
    return mapObjectsToDisplayObjects(objects);
  }, [objects]);

  const selectedObject = useMemo(() => {
    if (!selectedObjectId) return null;
    return objects.find((obj) => obj.itemId === selectedObjectId) || null;
  }, [selectedObjectId, objects]);

  return (
    <MapContainer
      className="rounded-4xl z-0 h-full"
      center={centerPosition as [number, number]}
      zoom={17}
      minZoom={16}
      maxBounds={mapBounds}
      zoomControl={false}
      attributionControl={false}
      maxBoundsViscosity={1.0}
    >
      <TileLayer url={accessToken} />
      <MapController />
      <ObjectMarkers
        objectLocations={objectLocations}
        setSelectedObjectId={setSelectedObjectId}
      />
      <Dialog
        // !! makes undefined to a boolean
        open={!!selectedObjectId && !!selectedObject}
        onOpenChange={(open) => !open && setSelectedObjectId(undefined)}
      >
        {selectedObject && <ItemDetailDialog item={selectedObject} />}
      </Dialog>
    </MapContainer>
  );
}

function ItemDetailDialog({ item }: { item: Object }) {
  const islostObject = isLostObject(item);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{item.itemName}</DialogTitle>
        <DialogDescription>
          {islostObject ? "Lost" : "Found"} item details
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Person</p>
            <p className="text-sm text-gray-500">{item.personName}</p>
            <p className="text-sm text-gray-500">
              {"No contact info provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-sm text-gray-500">{item.date}</p>
            <p className="text-sm text-gray-500">
              Status: {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">
              {item.location
                ? `${item.location[0]}, ${item.location[1]}`
                : "No location provided"}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="font-medium">Description</p>
          <p className="text-sm text-gray-600 mt-1">{item.itemDescription}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Contact</Button>
      </div>
    </DialogContent>
  );
}

export { Map as default };
