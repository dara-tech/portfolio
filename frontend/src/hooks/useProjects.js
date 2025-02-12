import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/api";

const useProjects = () => {
  const [projects, setProjects] = useState([]); // Store fetched projects
  const [project, setProject] = useState(null); // Store a single project fetched by ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from local storage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Or from Zustand if stored there
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // 🔄 Fetch All Projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/projects`, getAuthHeaders());
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching projects");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🆕 Create Project
  const createProject = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(projectData).forEach((key) => {
        if (key === "imageFile" && projectData[key]) {
          formData.append("image", projectData[key]);
        } else if (key !== "imagePreview") {
          formData.append(key, projectData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/api/projects`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProjects(); // Refresh list after creation
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // ✏️ Update Project
  const updateProject = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach((key) => {
        if (key === "imageFile" && updatedData[key]) {
          formData.append("image", updatedData[key]);
        } else if (key !== "imagePreview") {
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`${API_URL}/api/projects/${id}`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchProjects(); // Refresh list after update
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error updating project");
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // 🗑️ Delete Project
  const deleteProject = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, getAuthHeaders());
      fetchProjects(); // Refresh list after deletion
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting project");
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // 🔍 Fetch Single Project by ID
  const fetchProjectById = useCallback(async (id) => {
    if (!id || id === ":id") {
      setError(new Error("Invalid project id"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/projects/${id}`, getAuthHeaders());
      setProject(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching project");
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically fetch projects when component mounts
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
    createProject,
    updateProject,
    deleteProject,
  };
};

export default useProjects;
