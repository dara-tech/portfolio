import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5002' : 'https://daracheol.onrender.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const useRoadMap = (id) => {
  const [roadMap, setRoadMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchRoadMap = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/roadmaps/${id}`, getAuthHeaders());
        setRoadMap(response.data);
        setViews(response.data.views);
        setLoading(false);
      } catch (err) {
        setError('Failed to load roadmap. Please try again later.');
        setLoading(false);
      }
    };

    fetchRoadMap();
  }, [id]);

  return { roadMap, loading, error, views };
};

export const useRoadMapByID = () => {
  const [roadMaps, setRoadMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadMaps = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/roadmaps`, getAuthHeaders());
        setRoadMaps(response.data);
      } catch (err) {
        setError('Failed to load roadmaps. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadMaps();
  }, []);

  return { roadMaps, loading, error };
};

export const useCreateRoadMap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRoadMap = async (roadMapData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/roadmaps`, roadMapData, getAuthHeaders());
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Bad Request: Please check your input data.');
      } else {
        setError('Failed to create roadmap. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createRoadMap, loading, error };
};

export const useUpdateRoadMap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRoadMap = async (id, roadMapData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/api/roadmaps/${id}`, roadMapData, getAuthHeaders());
      setLoading(false);
      return response.data;
    } catch (err) {
      setError('Failed to update roadmap. Please try again.');
      setLoading(false);
      throw err;
    }
  };

  return { updateRoadMap, loading, error };
};

export const useDeleteRoadMap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRoadMap = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/roadmaps/${id}`, getAuthHeaders());
      setLoading(false);
    } catch (err) {
      setError('Failed to delete roadmap. Please try again.');
      setLoading(false);
      throw err;
    }
  };

  return { deleteRoadMap, loading, error };
};

export default useRoadMap;