import React, { useEffect, useState } from "react";
import axios from "axios";
import WorkshopIcon from "../assets/Images/Workshop.svg";
import { Button } from "antd";
import { getCookie } from "../utils/cookies";
import useServicesStore from "../store/ServicesStore";

export default function Services({locatService}) {
    const [isOpen, setIsOpen] = useState(false);
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

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                className={`fixed bg-[#4840A3] text-white p-2 rounded-full shadow-lg hover:bg-[#EAB95C] transition-all flex justify-center items-center h-12 aspect-square ${isOpen ? 'bottom-6 right-6' : 'bottom-5 right-5'}`}
                onClick={toggleSidebar}
            >
                <img src={WorkshopIcon} alt="Workshop Icon" />
            </button>

            <div
                className={`fixed top-5 ${
                    isOpen ? "right-5" : "-right-full"
                } h-[calc(100%-40px)] w-full md:w-1/3 max-w-[500px] rounded-2xl p-4 bg-white shadow-lg transition-all duration-300 z-50`}
            >
                <div className="p-4 h-full flex flex-col px-2 py-4">
                    <h2 className="text-2xl font-bold text-[#4840A3]">
                        Nearby Services
                    </h2>

                    <div className="mt-4 overflow-x-hidden overflow-y-auto h-full flex flex-col gap-4">
                        {services
                            ?.filter(({ role }) => role !== "user")
                            .map(({ id, username, role, location }) => (
                                <div
                                    key={id}
                                    className="border border-gray-300 p-4 rounded-lg shadow-sm"
                                >
                                    <h3 className="text-lg font-bold text-[#4840A3]">
                                        {role}
                                    </h3>
                                    <p className="text-gray-600">{username}</p>

                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            onClick={() => locatService(location.lng, location.lat, role)}
                                            type="primary"
                                            className="w-full font-bold"
                                        >
                                            Locate
                                        </Button>
                                        <Button
                                            type="default"
                                            color="default"
                                            variant="solid"
                                            className="w-full font-bold">
                                            Request
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <button
                    className="absolute top-4 right-4 text-[#4840A3] font-bold"
                    onClick={toggleSidebar}
                >
                    Close
                </button>
            </div>
        </>
    );
}
