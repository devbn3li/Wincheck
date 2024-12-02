import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { createRoot } from "react-dom/client";
import Notifications from "../Components/Notifications";

const Map = () => {
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapLongitude, setMapLongitude] = useState(31.2357);
  const [mapLatitude, setMapLatitude] = useState(30.0444);
  const [mapZoom, setMapZoom] = useState(15);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Marker element component
  const MarkerElement = () => (
    <div className="h-10 flex justify-center items-center aspect-square rounded-full p-2 text-red-500 text-2xl">
      <FaMapMarkerAlt />
    </div>
  );

  // Function to update or create the marker
  const updateMarker = (longitude, latitude) => {
    if (!map) return;

    if (marker) {
      marker.setLngLat([longitude, latitude]);
    } else {
      const markerContainer = document.createElement("div");
      const root = createRoot(markerContainer);
      root.render(<MarkerElement />);

      const newMarker = new tt.Marker({ element: markerContainer })
        .setLngLat([longitude, latitude])
        .addTo(map);

      setMarker(newMarker);
    }
  };

  // Get the user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setMapLatitude(latitude);
        setMapLongitude(longitude);
        setMapZoom(15);
        updateMarker(longitude, latitude);
        map.setCenter([longitude, latitude]);
      },
      (error) => console.error("Geolocation error:", error.message)
    );
  };

  // Initialize the map on component mount
  useEffect(() => {
    if (!mapElement.current) return;

    const mapInstance = tt.map({
      key: "LGRLpO9NGdpJxDLEi7Dxc8Osv5CyusEc",
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: mapZoom,
    });

    setMap(mapInstance);
    handleGetLocation();

    return () => mapInstance.remove();
  }, []);

  // Sync the marker and map center when the button is clicked
  useEffect(() => {
    if (map) {
      map.setCenter([mapLongitude, mapLatitude]);
      updateMarker(mapLongitude, mapLatitude);
    }
  }, [mapLongitude, mapLatitude]);

  // Button click handler
  const handleGetLocation = () => {
    if (!isGettingLocation) {
      setIsGettingLocation(true);
      getCurrentLocation();
      setTimeout(() => setIsGettingLocation(false), 2000);
    }
  };

  return (
    <div className="relative">
      <div ref={mapElement} className="absolute inset-0 h-dvh w-full"></div>
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={handleGetLocation} loading={isGettingLocation}>
          Get Current Location
        </Button>
      </div>
      <Notifications />
    </div>
  );
};

export default Map;
