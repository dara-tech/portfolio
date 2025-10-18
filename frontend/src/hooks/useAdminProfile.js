import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://daracheol-6adc.onrender.com";

export const useAdminProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    describe: "",
    exp: "",
    profilePic: "",
    socialLinks: [],
    cv: "",
    about: "",
    skills: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
const fetchAdminProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/admin/profile`);

        if (!response.ok) throw new Error("Failed to fetch admin profile");

        const data = await response.json();

        setFormData({
          username: data.username || "",
          email: data.email || "",
          location: data.location || "",
          describe: data.describe || "",
          exp: data.exp || "",
          profilePic: data.profilePic || "",
          socialLinks: data.socialLinks || [],
          cv: data.cv || "",
          about: data.about || "",
          skills: data.skills || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/admin/update`, {
        method: "PUT",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await response.json();
      
      // Update formData with the response data
      if (result.data) {
        setFormData({
          username: result.data.username || "",
          email: result.data.email || "",
          location: result.data.location || "",
          describe: result.data.describe || "",
          exp: result.data.exp || "",
          profilePic: result.data.profilePic || "",
          socialLinks: result.data.socialLinks || [],
          cv: result.data.cv || "",
          about: result.data.about || "",
          skills: result.data.skills || []
        });
      }
      
      setSuccess("Profile updated successfully");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
      
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    setError,
    success,
    isSubmitting,
    handleUpdateProfile,
  };
};
