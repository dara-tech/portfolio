import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "https://daracheol.onrender.com/";

const useVideo = () => {
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from local storage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Get headers for public endpoints
  const getPublicHeaders = () => ({
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch all videos (public)
  const getAllVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/videos`, getPublicHeaders());
      setVideos(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching videos";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create video (admin only)
  const createVideo = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/videos`,
        formData,
        getAuthHeaders()
      );
      setVideos((prev) => [response.data.video, ...prev]);
      return response.data.video;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error creating video";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete video (admin only)
  const deleteVideo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/admin/videos/${id}`, getAuthHeaders());
      setVideos((prev) => prev.filter((video) => video._id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error deleting video";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single video by ID
  const getVideoById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/api/videos/${id}`,
        getPublicHeaders()
      );
      setVideo(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching video";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update video (admin only)
  const updateVideo = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/videos/${id}`,
        formData,
        getAuthHeaders()
      );
      setVideos((prev) =>
        prev.map((video) =>
          video._id === id ? response.data.video : video
        )
      );
      return response.data.video;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error updating video";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Increment video view count
  const incrementVideoView = useCallback(async (id) => {
    try {
      await axios.post(`${API_URL}/api/videos/${id}/view`, {}, getPublicHeaders());
    } catch (err) {
      console.error('Failed to increment view count:', err);
    }
  }, []);

  return {
    videos,
    video,
    loading,
    error,
    getAllVideos,
    createVideo,
    deleteVideo,
    getVideoById,
    updateVideo,
    incrementVideoView
  };
};

export default useVideo;
