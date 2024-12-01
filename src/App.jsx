import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Button } from "antd";
import Signup from "./Signup";
import Login from "./Login";
import Map from "./Map";
import create from "zustand";
import Cookies from "js-cookie";

// Zustand store
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Map />} />
      </Routes>
    </Router>
  );
};
