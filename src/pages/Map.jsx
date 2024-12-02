import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import UserIconAnimated from "../assets/Images/icons8-street-view.gif";
import UserIconStatic from "../assets/Images/Person.svg";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { createRoot } from "react-dom/client";
import Services from "../components/Services";
import { getCookie } from "../utils/cookies";
import useServicesStore from "../store/ServicesStore";
import { GiTowTruck } from "react-icons/gi";
import WorkshopIcon from "../assets/Images/Workshop.svg";

const Map = () => {
    const mapElement = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [mapLongitude, setMapLongitude] = useState(31.2357);
    const [mapLatitude, setMapLatitude] = useState(30.0444);
    const [mapZoom, setMapZoom] = useState(15);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const services = useServicesStore((state) => state.services);
    const setServices = useServicesStore((state) => state.setServices);

    const fetchServices = async () => {
        try {
            const token = getCookie("session_token");
            const response = await axios.get(
                "https://wincheck-production.up.railway.app/api/user/nearby",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    useEffect(() => {
        if (services.length === 0) {
            fetchServices();
        }
    }, [services]);

    // Marker element component
    const UserMarkerElement = () => {
        const [isAnimated, setIsAnimated] = useState(false);
        useEffect(() => {
            // small setInterval to toggle the animation
            const interval = setInterval(() => {
                setIsAnimated((prev) => !prev);
            }, 1240);

            return () => {
                clearInterval(interval);
            };
        }, []);

        return (
            <div className="h-14 overflow-hidden flex justify-center bg-white items-center aspect-square rounded-full p-2 text-red-500 text-2xl">
                <img
                    src={isAnimated ? UserIconAnimated : UserIconStatic}
                    alt="User Icon"
                />
            </div>
        );
    };

    // Marker element component
    const MarkerElement = ({type}) => {
        return (
            <div className="h-14 overflow-hidden flex justify-center bg-[#F9CD6A] items-center aspect-square rounded-full p-2 text-red-500 text-2xl">
                {type == 'winch'? <GiTowTruck /> : <img src={WorkshopIcon} className="w-full h-full" alt="Workshop Icon" />}
            </div>
        );
    };

    // Function to update or create the marker
    const updateMarker = (longitude, latitude) => {
        if (!map) return;

        if (marker) {
            marker.setLngLat([longitude, latitude]);
        } else {
            const markerContainer = document.createElement("div");
            const root = createRoot(markerContainer);
            root.render(<UserMarkerElement />);

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

    const locatService = (longitude, latitude, role) => {
      if (!map) return;
      if (isNaN(latitude) || isNaN(longitude)) return;
  
      const markerContainer = document.createElement("div");
      const root = createRoot(markerContainer);
      root.render(<MarkerElement type={role} />);
  
      new tt.Marker({ element: markerContainer })
          .setLngLat([longitude, latitude])
          .addTo(map);
  
      map.setCenter([longitude, latitude]); // Set map center to the service location
  };

    return (
        <div className="relative">
            <div
                ref={mapElement}
                className="absolute inset-0 h-dvh w-full"
            ></div>
            <div className="absolute top-4 left-4 z-10">
                <Button onClick={handleGetLocation} loading={isGettingLocation}>
                    Get Current Location
                </Button>
            </div>
            <Services locatService={locatService}/>
        </div>
    );
};

export default Map;
