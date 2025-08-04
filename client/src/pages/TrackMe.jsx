// src/pages/TrackMe.jsx

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const TrackMe = () => {
  const [position, setPosition] = useState(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        // update marker position if already rendered
        if (markerRef.current) {
          markerRef.current.setLatLng([pos.coords.latitude, pos.coords.longitude]);
        }
      },
      (err) => {
        console.error("GPS error:", err);
        alert("⚠️ Failed to access your location.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 z-[999] bg-white text-green-700 px-4 py-2 rounded-lg shadow-md font-semibold hover:bg-gray-100"
      >
        ⬅ Back
      </button>

      {position ? (
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[position.lat, position.lng]}
            ref={markerRef}
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })}
          />
        </MapContainer>
      ) : (
        <p className="text-center mt-20 text-gray-600">📡 Fetching your location...</p>
      )}
    </div>
  );
};

export default TrackMe;
