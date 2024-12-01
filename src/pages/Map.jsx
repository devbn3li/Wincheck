import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { createRoot } from "react-dom/client";

const Map = () => {
    const mapElement = useRef(null);
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState(null);

    const [mapLongitude, setMapLongitude] = useState(31.2357); // Default longitude (Cairo, Egypt)
    const [mapLatitude, setMapLatitude] = useState(30.0444); // Default latitude (Cairo, Egypt)
    const [mapZoom, setMapZoom] = useState(20); // Default zoom level
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    // Marker element component
    const MarkerElement = () => (
        <div className="h-10 flex justify-center items-center aspect-square rounded-full p-2 text-red-500 text-2xl">
            <FaMapMarkerAlt />
        </div>
    );

    // Function to update or create the user marker
    const updateMarker = (longitude, latitude) => {
        if (!map) return;

        if (userMarker) {
            setUserMarker((prevMarker) => {
                prevMarker.setLngLat([longitude, latitude]);
                return prevMarker;
            });
        } else {
            const markerContainer = document.createElement("div");
            const root = createRoot(markerContainer);
            root.render(<MarkerElement />);

            const newMarker = new tt.Marker({ element: markerContainer })
                .setLngLat([longitude, latitude])
                .addTo(map);

            setUserMarker(newMarker);
        }
    };

    // Get the user's current location
    const getCurrentLocation = (check = true) => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                const lat = latitude || 30.0444; // Fallback to Cairo
                const lng = longitude || 31.2357; // Fallback to Cairo

                if (check && (lat != mapLatitude || lng != mapLongitude)) {
                    setMapLatitude(lat);
                    setMapLongitude(lng);
                    setMapZoom(20);
                    updateMarker(lng, lat);
                }
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

        return () => mapInstance.remove();
    }, [mapLongitude, mapLatitude, mapZoom]);

    // Update the marker when the map is initialized
    useEffect(() => {
        if (map) getCurrentLocation();
    }, [map]);

    // Sync the map's center and marker when state changes
    useEffect(() => {
        if (!map) return;

        setMap((prevMap) => {
            prevMap.setCenter([mapLongitude, mapLatitude]);
            return prevMap;
        });
        setMap((prevMap) => {
            prevMap.setCenter([mapLongitude, mapLatitude]);
            return prevMap;
        });
        updateMarker(mapLongitude, mapLatitude);
    }, [mapLongitude, mapLatitude, mapZoom]);

    // Handle "Get Current Location" button click
    const handleGetLocation = () => {
        if (!isGettingLocation) {
            setIsGettingLocation(true);
            getCurrentLocation(false);
            setTimeout(() => setIsGettingLocation(false), 2000);
        }
    };

    return (
        <div className="relative">
            <div
                ref={mapElement}
                className="absolute inset-0 h-dvh w-full"
            ></div>
            <div className="absolute top-4 left-4 z-10">
                <Button onClick={handleGetLocation}>
                    Get Current Location
                </Button>
            </div>
        </div>
    );
};

export default Map;
