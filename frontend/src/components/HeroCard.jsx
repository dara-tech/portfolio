import React, { useState, useEffect } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Download, Code, Sparkles, Mail, MapPin, ArrowRight, Award, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Social Media Icons
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98zm-7.83 1.297c-2.026 0-3.323 1.297-3.323 3.323s1.297 3.323 3.323 3.323 3.323-1.297 3.323-3.323-1.297-3.323-3.323-3.323z"/>
  </svg>
);

const HeroCard = () => {
  const { formData: userData } = useAdminProfile();
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);

  // Skill rotation effect
  useEffect(() => {
    if (userData?.skills && userData.skills.length > 0) {
      const skillInterval = setInterval(() => {
        setActiveSkillIndex(prev => (prev + 1) % userData.skills.length);
      }, 2500);

      return () => clearInterval(skillInterval);
    }
  }, [userData]);

  // Component for social links
  const SocialLink = ({ href, platform, index }) => {
    const Icon = { 
      github: GithubIcon, 
      linkedin: LinkedinIcon, 
      twitter: TwitterIcon, 
      facebook: FacebookIcon, 
      instagram: InstagramIcon 
    }[platform.toLowerCase()];
    
    return Icon ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
        style={{
          animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
        }}
      >
        <Icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </a>
    ) : null;
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        duration: 0.8
      } 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white py-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 mb-8">
            <Code className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-white/80">Senior Developer</span>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <span className="text-sm text-white/60">Available for work</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {userData?.username || "Developer"}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
            {userData?.describe || "Building exceptional digital experiences with modern technologies"}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Profile Section */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1 flex justify-center lg:justify-start"
          >
            {userData?.profilePic && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  className="relative w-64 h-64 rounded-3xl object-cover border-2 border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {userData?.email && (
                <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="text-white font-medium">{userData.email}</p>
                  </div>
                </div>
              )}
              
              {userData?.location && (
                <div className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Location</p>
                    <p className="text-white font-medium">{userData.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Skills Showcase */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Expertise</h3>
              </div>
              <div className="relative h-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSkillIndex}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    <span className="text-xl font-medium text-white">
                      {userData?.skills?.[activeSkillIndex]}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        </motion.div>

        {/* Action Section - Outside of main animation container */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16">
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {userData?.socialLinks?.map((link) => (
              <SocialLink 
                key={link._id} 
                href={link.url} 
                platform={link.platform} 
              
              />
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-4"
          >
            {userData?.cv && (
              <motion.a
                href={userData.cv}
                download
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                <span>Resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            )}
            
            <motion.button
              className="group inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Briefcase className="w-5 h-5" />
              <span>Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCard;