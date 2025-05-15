import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAdminProfile } from "../../hooks/useAdminProfile";

import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import BottomNav from './BottomNav';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem('token');
  const { formData: userData } = useAdminProfile();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleUserDropdown = useCallback(() => {
    setUserDropdownOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if (userData?.profilePic) {
      setUserImage(userData.profilePic);
    }
  }, [userData]);

  return (
    <>
      <div className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-base-200/80 backdrop-blur-xl shadow-lg py-1' : 'bg-base-200/95 backdrop-blur-md py-3'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Logo className="ml-2 lg:ml-0" />
            <DesktopNav 
              token={token}
              userImage={userImage}
              userData={userData}
              isActive={isActive}
              userDropdownOpen={userDropdownOpen}
              dropdownRef={dropdownRef}
              onToggleDropdown={toggleUserDropdown}
              onLogout={handleLogout}
            />
            <button 
              className="lg:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <MobileNav 
        isOpen={mobileMenuOpen}
        token={token}
        userImage={userImage}
        userData={userData}
        isActive={isActive}
        onClose={toggleMobileMenu}
        onLogout={handleLogout}
      />

      <BottomNav 
        token={token}
        userImage={userImage}
        isActive={isActive}
        isMobileMenuOpen={mobileMenuOpen}
      />
    </>
  );
};

export default memo(Navbar);
