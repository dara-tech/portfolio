import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Home from './pages/Home';
import Projects from './pages/Projects';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminProjects from './pages/AdminProjects';
import MacOSLayout from './components/layout/MacOSLayout';
import ProtectedRoute from './components/lib/projectdRoute';
import ProjectDetail from './components/projects/ProjectDetail';
import Profile from './pages/Profile';
import SettingPage from './pages/SettingPage';
import { useThemeStore } from './store/useThemeStore';
import Roadmap from './pages/RoadMap';
import RoadmapDetail from './pages/RoadMapDetail';
import RoadMapManage from './pages/RoadMapManage';
import RoadMapCreate from './pages/RoadMapCreate';
import Chat from './components/chat/Chat';
import Writer from './pages/WriterPage';
import VideoManage from './components/video/VideoManage';
import VideoForm from './components/video/VideoForm';
import VideoPage from './pages/VideoPage';
import VideoDetailPage from './pages/VideoDetailPage';
import LessonPage from './pages/LessonPage';
import LessonDetail from './components/lesson/LessonDetail';
import LessonManage from './components/lesson/LessonManage';
import LessonForm from './components/lesson/LessonForm';


function App() {
  const {theme} = useThemeStore();

  useEffect(() => {
    const trackVisit = async (position) => {
      const visitKey = 'visit_tracked';
      if (sessionStorage.getItem(visitKey)) {
        return; // Already tracked this session
      }

      try {
        const payload = {};
        if (position) {
          payload.latitude = position.coords.latitude;
          payload.longitude = position.coords.longitude;
        }

        // Use the VITE_API_BASE_URL from .env or fallback to a relative path
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        await fetch(`${apiBaseUrl}/api/visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        sessionStorage.setItem(visitKey, 'true');
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    // Request high-accuracy location
    navigator.geolocation.getCurrentPosition(
      trackVisit, // Success callback
      () => trackVisit(null), // Error callback (user denied or error)
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return (
    <div data-theme={theme}>
      <Router>
        <MacOSLayout>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/:id" element={<RoadmapDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/videos" element={<VideoPage />} />
          <Route path="/videos/:id" element={<VideoDetailPage />} />
          <Route path="/lessons" element={<LessonPage />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          {/* Admin Auth routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/settings" element={<SettingPage />} />

          {/* Protected admin routes */}
          <Route path="/admin/videos" element={<ProtectedRoute><VideoManage /></ProtectedRoute>} />
          <Route path="/admin/videos/new" element={<ProtectedRoute><VideoForm /></ProtectedRoute>} />
          <Route path="/admin/videos/edit/:id" element={<ProtectedRoute><VideoForm /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin/roadmap" element={<ProtectedRoute><RoadMapManage /></ProtectedRoute>} />
          <Route path="/admin/roadmap/create-roadmap" element={<ProtectedRoute><RoadMapCreate /></ProtectedRoute>} />
          <Route path="/admin/write" element={<ProtectedRoute><Writer /></ProtectedRoute>} />
          <Route path="/admin/lessons" element={<ProtectedRoute><LessonManage /></ProtectedRoute>} />
          <Route path="/admin/lessons/new" element={<ProtectedRoute><LessonForm /></ProtectedRoute>} />
          <Route path="/admin/lessons/edit/:id" element={<ProtectedRoute><LessonForm /></ProtectedRoute>} />
          </Routes>
        </MacOSLayout>
      </Router>
    </div>
  );
}

export default App;
