import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, message } from "antd";
import useUser from "../store/useUser";
import welcome from "/Images/welcome.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://wincheck-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      if (data.status === "success" && data.token) {
        // Save token to localStorage
        localStorage.setItem("auth_token", `Bearer ${data.token}`);

        // Save user details in state
        setUser({ email });

        message.success("Login successful!");
        navigate("/");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      message.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#D8EFF7]">
      <div className="flex flex-col md:flex-row md:rounded-2xl shadow-md overflow-hidden w-full max-md:h-full md:w-auto">
        {/* Form Section */}
        <div className="bg-white flex flex-col justify-center items-center p-8 w-full md:max-w-md max-md:h-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#4840A3] max-md:text-start">
            Welcome Back!
          </h2>
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label htmlFor="email" className="text-[#4840A3] font-bold">
                Email
              </label>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              onClick={handleLogin}
              loading={loading}
            >
              Login
            </Button>
          </div>
          <div className="py-6">
            <span>Don't have an Account? </span>
            <a href="/signup" className="text-[#4840A3] hover:text-[#EAB95C]">
              Register here
            </a>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block w-full md:max-w-md">
          <img
            src={welcome}
            alt="Welcome to Wincheck"
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
