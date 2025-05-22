import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Label } from "@/components/ui/label";
import { StepProps } from "@/lib/types";
import { centerPosition, mapBounds } from "@/lib/constants";
import { iconsMap } from "@/lib/icons";
import "leaflet/dist/leaflet.css";

function LocationMarker({ formData, setFormData }: StepProps) {
  const map = useMapEvents({
    click(e) {
      setFormData({
        ...formData,
        location: [e.latlng.lat, e.latlng.lng],
      });
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

export function Step6LocationSelection({ formData, setFormData }: StepProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;

  return (
    <div className="space-y-2">
      <Label className="text-white">📍 Select the location on the map:</Label>
      <div className="h-[400px] w-[600px] rounded-md overflow-hidden">
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
          <LocationMarker formData={formData} setFormData={setFormData} />
        </MapContainer>
      </div>
      <p className="text-sm text-gray-400">
        Click on the map to place a marker where the item was{" "}
        {formData.isLost ? "lost" : "found"}.
      </p>
    </div>
  );
}
