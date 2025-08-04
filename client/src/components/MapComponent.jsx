import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🚌 Custom Bus Icon
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
  iconSize: [40, 40],
});

// 📍 Stop Icon
const stopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
  iconSize: [30, 30],
});

// 📍 Animate camera between points
const AnimateMap = ({ source, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (source && destination) {
      const bounds = [source, [destination.lat, destination.lng]];
      map.fitBounds(bounds, {
        animate: true,
        duration: 2,
        easeLinearity: 0.25,
        padding: [100, 100],
      });
    } else if (source) {
      map.flyTo(source, 13, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [source, destination, map]);

  return null;
};

// ✅ Helper to validate coordinates
const isValidLatLng = (coord) => {
  return (
    coord &&
    Array.isArray(coord) &&
    coord.length === 2 &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1])
  );
};

// 🚏 Dummy stops (between Bangalore and Electronic City)
const busStops = [
  { name: "BTM Layout", lat: 12.9157, lng: 77.6101 },
  { name: "Silk Board", lat: 12.9172, lng: 77.6238 },
  { name: "Electronic City", lat: 12.8398, lng: 77.677 },
];

const MapComponent = ({ source, destination }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [busPosition, setBusPosition] = useState(null);
  const animationRef = useRef(null);

  const actualSource = source || currentLocation;

  // 📍 Get current location if source not passed
  useEffect(() => {
    if (!source) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation([12.9716, 77.5946]); // fallback to Bangalore
        }
      );
    }
  }, [source]);

  // 🚍 Animate bus movement
  useEffect(() => {
    if (!actualSource || !destination) return;

    let t = 0;
    const interval = 50;
    const steps = 100;

    const latDiff = (destination.lat - actualSource[0]) / steps;
    const lngDiff = (destination.lng - actualSource[1]) / steps;

    const animate = () => {
      if (t <= steps) {
        const newLat = actualSource[0] + latDiff * t;
        const newLng = actualSource[1] + lngDiff * t;
        setBusPosition([newLat, newLng]);
        t++;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [actualSource, destination]);

  return (
    <div className="rounded-xl overflow-hidden shadow-md mt-4">
      <MapContainer
        center={actualSource || [12.9716, 77.5946]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* ✅ Source Marker */}
        {isValidLatLng(actualSource) && <Marker position={actualSource} />}

        {/* ✅ Destination Marker */}
        {destination &&
          isValidLatLng([destination.lat, destination.lng]) && (
            <Marker position={[destination.lat, destination.lng]} />
          )}

        {/* ✅ Route Line */}
        {isValidLatLng(actualSource) &&
          destination &&
          isValidLatLng([destination.lat, destination.lng]) && (
            <Polyline
              positions={[actualSource, [destination.lat, destination.lng]]}
              color="blue"
            />
          )}

        {/* ✅ Bus Moving Marker */}
        {isValidLatLng(busPosition) && (
          <Marker position={busPosition} icon={busIcon} />
        )}

        {/* ✅ Bus Stops */}
        {busStops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.lat, stop.lng]}
            icon={stopIcon}
          >
            <Popup>{stop.name}</Popup>
          </Marker>
        ))}

        <AnimateMap source={actualSource} destination={destination} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
