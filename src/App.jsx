import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Map from "./Map";
import Cookies from "js-cookie";

const App = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get("session_token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Map />} />
        </Routes>
    );
};

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
