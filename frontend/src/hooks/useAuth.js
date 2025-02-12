import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "https://daracheol.onrender.com";


const useAuth = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, credentials);
      localStorage.setItem("token", response.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      // Enhanced error handling
      const errorMessage = err?.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, handleLogin };
};

export default useAuth;
