import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { useLang } from "../context/LanguageContext";

function ClickMarker({ position, onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) });
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function MapPicker({ value, onChange }) {
  const { t } = useLang();
  const [pos, setPos] = useState(value || { lat: 16.3067, lng: 80.4365 });
  const pick = (p) => {
    setPos(p);
    onChange(p);
  };
  return (
    <div className="map-wrap">
      <MapContainer center={[pos.lat, pos.lng]} zoom={12} scrollWheelZoom className="picker-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickMarker position={pos} onPick={pick} />
      </MapContainer>
      <small>{t("mapPick")} {pos.lat}, {pos.lng}</small>
    </div>
  );
}
