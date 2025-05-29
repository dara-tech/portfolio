import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://daracheol-6adc.onrender.com";

const useLesson = () => {
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from local storage for authenticated requests
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

  // Headers for public endpoints
  const getPublicHeaders = () => ({
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch all lessons (public)
  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/lessons`, getPublicHeaders());
      setLessons(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching lessons");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single lesson by ID
// Fetch a single lesson by ID
const fetchLessonById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/lessons/${id}`, getPublicHeaders());
      setLesson(response.data);
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching lesson");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new lesson (admin only)
  const createLesson = useCallback(async (lessonData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Current form data before submission:', lessonData);
      
      // Create a clean data object for submission
      const cleanData = {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        category: lessonData.category,
        difficulty: lessonData.difficulty,
        duration: lessonData.duration,
        stepIndex: parseInt(lessonData.stepIndex, 10),
        resources: lessonData.resources
      };

      const response = await axios.post(
        `${API_URL}/api/admin/lessons`,
        cleanData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response from backend:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error in createLesson:', err);
      setError(err.response?.data?.message || "Error creating lesson");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing lesson (admin only)
// Update the updateLesson function
const updateLesson = useCallback(async (id, lessonData) => {
  setLoading(true);
  setError(null);
  try {
    console.log('Current form data before submission:', lessonData);
    
    // Create a clean data object for submission
    const cleanData = {
      title: lessonData.title,
      description: lessonData.description,
      content: lessonData.content,
      category: lessonData.category,
      difficulty: lessonData.difficulty,
      duration: lessonData.duration,
      stepIndex: parseInt(lessonData.stepIndex, 10),
      resources: lessonData.resources
    };

    const response = await axios.put(
      `${API_URL}/api/admin/lessons/${id}`,
      cleanData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Response from backend:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error in updateLesson:', err);
    setError(err.response?.data?.message || "Error updating lesson");
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  // Delete a lesson (admin only)
  const deleteLesson = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/admin/lessons/${id}`, getAuthHeaders());
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting lesson");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    lessons,
    lesson,
    loading,
    error,
    fetchLessons,
    fetchLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};

export default useLesson;
