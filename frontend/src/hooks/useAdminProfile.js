import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002"
    : "https://darachoel-hm0a.onrender.com";

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
    setSuccess("");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
      } else if (Array.isArray(value)) {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/update`, {
        method: "PUT",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      setFormData(updatedProfile);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message);
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
