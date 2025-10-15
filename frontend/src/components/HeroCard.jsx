import React, { useState, useEffect } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { motion, AnimatePresence } from "framer-motion";

// Custom SVG Icons
const CodeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 3C6.9 3 6 3.9 6 5V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V5C18 3.9 17.1 3 16 3H8M8 5H16V19H8V5M10 7V9H12V7H10M10 11V13H14V11H10M10 15V17H12V15H10Z"/>
  </svg>
);

const EmailIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="currentColor">
    <rect height="22" rx="3" ry="3" width="30" x="1" y="5" fill="currentColor"/>
    <path d="M18.12,12.71a3,3,0,0,0-4.24,0L1.3,25.29A3,3,0,0,0,4,27H28a3,3,0,0,0,2.7-1.71Z" fill="currentColor"/>
    <path d="M28,5H4A3,3,0,0,0,1.3,6.71L13.88,19.29a3,3,0,0,0,4.24,0L30.7,6.71A3,3,0,0,0,28,5Z" fill="currentColor"/>
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="currentColor">
    <ellipse cx="16" cy="26.5" rx="15" ry="4.5" fill="currentColor"/>
    <path d="M22.83,14.45A1,1,0,0,0,22,14H10a1,1,0,0,0-.83.45,1,1,0,0,0-.09.93l4.61,11.08a2.5,2.5,0,0,0,4.62,0l4.61-11.08A1,1,0,0,0,22.83,14.45Z" fill="currentColor"/>
    <circle cx="16" cy="12" r="11" fill="currentColor"/>
    <circle cx="16" cy="12" r="6" fill="white"/>
  </svg>
);

const ExperienceIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 13C17.06 13 16.19 13.33 15.5 13.88C14.58 14.61 14 15.74 14 17C14 17.75 14.21 18.46 14.58 19.06C15.27 20.22 16.54 21 18 21C19.01 21 19.93 20.63 20.63 20C20.94 19.74 21.21 19.42 21.42 19.06C21.79 18.46 22 17.75 22 17C22 14.79 20.21 13 18 13ZM20.07 16.57L17.94 18.54C17.8 18.67 17.61 18.74 17.43 18.74C17.24 18.74 17.05 18.67 16.9 18.52L15.91 17.53C15.62 17.24 15.62 16.76 15.91 16.47C16.2 16.18 16.68 16.18 16.97 16.47L17.45 16.95L19.05 15.47C19.35 15.19 19.83 15.21 20.11 15.51C20.39 15.81 20.37 16.28 20.07 16.57Z" fill="currentColor"/>
    <path opacity="0.4" d="M21.0901 21.5C21.0901 21.78 20.8701 22 20.5901 22H3.41016C3.13016 22 2.91016 21.78 2.91016 21.5C2.91016 17.36 6.99015 14 12.0002 14C13.0302 14 14.0302 14.14 14.9502 14.41C14.3602 15.11 14.0002 16.02 14.0002 17C14.0002 17.75 14.2101 18.46 14.5801 19.06C14.7801 19.4 15.0401 19.71 15.3401 19.97C16.0401 20.61 16.9702 21 18.0002 21C19.1202 21 20.1302 20.54 20.8502 19.8C21.0102 20.34 21.0901 20.91 21.0901 21.5Z" fill="currentColor"/>
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path opacity="0.4" d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z" fill="currentColor"/>
    <path d="M15.7997 2.20999C15.3897 1.79999 14.6797 2.07999 14.6797 2.64999V6.13999C14.6797 7.59999 15.9197 8.80999 17.4297 8.80999C18.3797 8.81999 19.6997 8.81999 20.8297 8.81999C21.3997 8.81999 21.6997 8.14999 21.2997 7.74999C19.8597 6.29999 17.2797 3.68999 15.7997 2.20999Z" fill="currentColor"/>
    <path d="M13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z" fill="currentColor"/>
    <path d="M11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75Z" fill="currentColor"/>
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

const BriefcaseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

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
            <CodeIcon className="w-5 h-5 text-blue-400" />
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
                    <EmailIcon className="w-5 h-5 text-blue-400" />
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
                    <LocationIcon className="w-5 h-5 text-green-400" />
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
                <ExperienceIcon className="w-5 h-5 text-yellow-400" />
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
                <DocumentIcon className="w-5 h-5" />
                <span>Resume</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            )}
            
            <motion.button
              className="group inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <BriefcaseIcon className="w-5 h-5" />
              <span>Portfolio</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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