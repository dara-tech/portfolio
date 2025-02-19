import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "https://portfolio-l5nx.onrender.com";

const API = axios.create({ baseURL: API_URL });

// ✅ Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found in localStorage!");
  }
  return config;
}, (error) => Promise.reject(error));


const useAuth = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAdminProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token); // ✅ Debugging
  
    if (!token) {
      console.error("🚨 No token found in localStorage! Redirecting to login.");
      navigate("/admin/login");
      return;
    }
  
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(data);
    } catch (error) {
      console.error("❌ API Request Failed:", error.response);
      if (error.response?.status === 401) {
        console.error("🚨 Unauthorized! Redirecting to login.");
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
      setError(error.response?.data?.message || "Error fetching profile");
    }
  };
  

  // Login Handler
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/api/admin/login", credentials);
      localStorage.setItem("token", data.token);
      setProfile(data.admin);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update Admin Profile
  const updateAdminProfile = async (adminData) => {
    try {
      const { data } = await API.put("/api/admin/update", adminData);
      setProfile(data);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || "Error updating profile");
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    navigate("/admin/login");
  };

  // Auto-fetch profile on mount
  useEffect(() => {
    if (localStorage.getItem("token")) getAdminProfile();
  }, []);

  return { profile, error, loading, handleLogin, getAdminProfile, updateAdminProfile, handleLogout };
};

export default useAuth;
