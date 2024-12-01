import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import Cookies from "js-cookie";
import useUser from "../store/useUser";
import welcome from "/Images/welcome.png";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);

  const handleSignup = () => {
    if (!username || !password) {
      message.error("Please fill in both fields");
      return;
    }

    setLoading(true);

    // Simulate signup and token generation
    setTimeout(() => {
      const token = "dummy-token";
      Cookies.set("session_token", token);
      setUser({ username });
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-[#D8EFF7]">
        <div className="flex flex-col md:flex-row md:rounded-2xl shadow-md overflow-hidden w-full max-md:h-full md:w-auto">
          <div className="bg-white flex flex-col justify-center items-center p-8 max-md:h-screen  w-full md:max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">
              Welcome to Wincheck
            </h2>
            <div className="flex flex-col gap-4 w-full">
              <div>
                <label htmlFor="username" className="text-[#4840A3] font-bold">
                  Username
                </label>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-[#4840A3] font-bold">
                  Password
                </label>
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                color="default"
                variant="solid"
                onClick={handleSignup}
                loading={loading}
              >
                Signup
              </Button>
            </div>
          </div>
          <div className="max-md:hidden w-full max-w-md">
            <img src={welcome} alt="Welcome to Wincheck" />
          </div>
        </div>
      </div>
    </div>
  );
}
