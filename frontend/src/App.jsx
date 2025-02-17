import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Home from './pages/Home';
import Projects from './pages/Projects';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/AdminProjects';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/lib/projectdRoute';
import ProjectDetail from './components/ProjectDetail';
import Profile from './pages/Profile'; // Assuming you have a Profile page
import SettingPage from './pages/SettingPage';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const {theme} = useThemeStore();
  return ( 
      <div data-theme={theme}>

         
 
        <Router>
          <Navbar />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />

            {/* Admin Auth routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/settings" element={<SettingPage />} />
            {/* <Route path="/admin/profile" element={<Profile />} /> */}
            {/* <Route path="/admin/register" element={<AdminRegister />} /> */}

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <AdminProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>   
      </div>
   
  );
}

export default App;
