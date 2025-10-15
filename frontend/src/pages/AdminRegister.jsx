import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/admin/register', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Register</h1>
            <p className="text-white/70">Create your admin account</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-6 py-4 rounded-xl border border-red-500/30 mb-6">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="block">
                <span className="text-lg font-semibold text-white">Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block">
                <span className="text-lg font-semibold text-white">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 font-semibold"
              >
                Register
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
