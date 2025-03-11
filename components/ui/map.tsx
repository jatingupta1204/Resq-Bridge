"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Incident {
  _id: string;
  location: { lat: number; lng: number };
  type: string;
}

interface MapProps {
  incidents: Incident[];
}

export default function Map({ incidents }: MapProps) {
  // Set default center point
  const defaultCenter: LatLngExpression = [37.7749, -122.4194]; // San Francisco as an example

  return (
    <MapContainer center={defaultCenter} zoom={13} className="h-96 w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents.map((incident) => (
        <Marker key={incident._id} position={[incident.location.lat, incident.location.lng]}>
          <Popup>{incident.type}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
