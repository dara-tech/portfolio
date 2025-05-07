import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Home from './pages/Home';
import Projects from './pages/Projects';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminProjects from './pages/AdminProjects';
import Navbar from './components/Navbar';
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
import { testSEO } from './utils/testSEO';

function App() {
  const {theme} = useThemeStore();
  testSEO();
  return (
    <div data-theme={theme}>
      <Router>
        <Navbar />
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
      </Router>
    </div>
  );
}

export default App;
