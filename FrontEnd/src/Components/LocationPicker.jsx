import { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

const defaultCenter = [7.8731, 80.7718];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ setMarkerPosition, onLocationChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onLocationChange(lat, lng);
    },
  });

  return null;
}

function RecenterMap({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function LocationPicker({ value, onChange }) {
  const [markerPosition, setMarkerPosition] = useState(
    value?.lat && value?.lng ? [value.lat, value.lng] : defaultCenter
  );

  const center = useMemo(() => markerPosition, [markerPosition]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      const addr = data.address || {};

      onChange({
        lat,
        lng,
        formattedAddress: data.display_name || "",
        street:
          [addr.house_number, addr.road].filter(Boolean).join(" ") ||
          addr.suburb ||
          "",
        city: addr.city || addr.town || addr.village || "",
        district: addr.state_district || addr.county || "",
        postalCode: addr.postcode || "",
      });
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      onChange({
        lat,
        lng,
        formattedAddress: "",
        street: "",
        city: "",
        district: "",
        postalCode: "",
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMarkerPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
      () => {
        alert("Unable to get your current location. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        style={{
          marginBottom: 12,
          border: "none",
          borderRadius: 12,
          padding: "12px 18px",
          background: "linear-gradient(135deg, #d9b85f, #b8922f)",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Use Current Location
      </button>

  <p style={{
      fontSize: 17,
      color: "#6B7280",
      marginTop: 8,
      marginBottom: 8
      }}>
      📍 Please make sure to drag and drop the location pin to the exact location.
  </p>

      <MapContainer
        center={center}
        zoom={15}
        style={{ width: "100%", height: "350px", borderRadius: "16px" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        <MapClickHandler
          setMarkerPosition={setMarkerPosition}
          onLocationChange={reverseGeocode}
        />

        <Marker
          position={markerPosition}
          icon={markerIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const { lat, lng } = marker.getLatLng();
              setMarkerPosition([lat, lng]);
              reverseGeocode(lat, lng);
            },
          }}
        />
      </MapContainer>
    </div>
  );
}