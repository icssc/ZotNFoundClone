import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Label } from "@/components/ui/label";
import { LocationFormData } from "@/lib/types";
import { centerPosition, mapBounds } from "@/lib/constants";
import { iconsMap } from "@/lib/icons";
import "leaflet/dist/leaflet.css";

interface Step6Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

function LocationMarker({ formData, updateField }: Step6Props) {
  const map = useMapEvents({
    click(e) {
      updateField("location", [e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    map.fitBounds(mapBounds);
  }, [map]);

  return formData.location ? (
    <Marker
      position={formData.location}
      icon={formData.isLost ? iconsMap.others.true : iconsMap.others.false}
    />
  ) : null;
}

export function Step6LocationSelection({ formData, updateField }: Step6Props) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;

  return (
    <div className="space-y-2">
      <Label className="text-white">📍 Select the location on the map:</Label>
      <div className="md:h-[400px] h-[300px] md:w-[600px] w-full rounded-md overflow-hidden">
        <MapContainer
          center={centerPosition as [number, number]}
          zoom={17}
          minZoom={12}
          maxBounds={mapBounds}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          attributionControl={false}
          maxBoundsViscosity={1.0}
        >
          <TileLayer url={accessToken} />
          <LocationMarker formData={formData} updateField={updateField} />
        </MapContainer>
      </div>
      <p className="text-sm text-gray-400">
        Click on the map to place a marker where the item was{" "}
        {formData.isLost ? "lost" : "found"}.
      </p>
    </div>
  );
}
