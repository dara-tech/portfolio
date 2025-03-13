import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "https://daracheol.onrender.com";

const useProjects = () => {
  const [projects, setProjects] = useState([]); // Store fetched projects
  const [project, setProject] = useState(null); // Store a single project fetched by ID
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
        "Content-Type": "multipart/form-data",
      },
    };
  };

  // Get headers for public endpoints
  const getPublicHeaders = () => ({
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch all projects (public)
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/projects`, getPublicHeaders());
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching projects");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project (admin only)
  const createProject = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/api/projects`,
        formData,
        getAuthHeaders()
      );
      
      // Update projects list with new project
      setProjects((prev) => [response.data.project, ...prev]);
      
      return response.data.project;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error creating project";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single project by ID (public)
  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/projects/${id}`, getPublicHeaders());
      setProject(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching project");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update project (admin only)
  const updateProject = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_URL}/api/projects/${id}`,
        formData,
        getAuthHeaders()
      );
      
      // Update projects list with updated project
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? response.data.project : p))
      );
      
      return response.data.project;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error updating project";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete project (admin only)
  const deleteProject = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, getAuthHeaders());
      
      // Remove project from list
      setProjects((prev) => prev.filter((p) => p._id !== id));
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error deleting project";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send view to backend and fetch updated view
  const sendView = useCallback(async (postId, viewData) => {
    setLoading(true);
    setError(null);
    try {
      // Send view data to the backend
      await axios.post(`${API_URL}/api/projects/${postId}/views`, viewData, getPublicHeaders());
      
      // Fetch the updated post data after sending the view
      const response = await axios.get(`${API_URL}/api/projects/${postId}`, getPublicHeaders());
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error sending view";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    project,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    sendView,
    createProject,
    updateProject,
    deleteProject
  };
};

export default useProjects;
