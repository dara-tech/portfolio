import React, { useState, useEffect, useRef } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Github, Linkedin, Twitter, Facebook, Instagram, Download, Terminal, Zap, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HeroCard = () => {
  const { formData: userData, loading } = useAdminProfile();
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const skillRef = useRef(null);

  useEffect(() => {
    if (!loading && userData?.skills) {
      const skillInterval = setInterval(() => {
        setActiveSkillIndex(prev => (prev + 1) % userData.skills.length);
      }, 3000);

      return () => clearInterval(skillInterval);
    }
  }, [loading, userData]);

  const SocialLink = ({ href, platform }) => {
    const Icon = { github: Github, linkedin: Linkedin, twitter: Twitter, facebook: Facebook, instagram: Instagram }[platform.toLowerCase()];
    return Icon ? (
      <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="p-2 hover:text-primary transition-colors"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Icon className="w-6 h-6" />
      </motion.a>
    ) : null;
  };

  const animate = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-300 p-4">
        <div className="max-w-4xl w-full bg-base-100 rounded-xl shadow-2xl p-8 space-y-6 animate-pulse">
          <div className="h-6 bg-base-300 rounded w-1/4"></div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="w-40 h-40 rounded-full bg-base-300"></div>
            <div className="flex-1">
              <div className="h-10 bg-base-300 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-base-300 rounded w-full mb-4"></div>
              <div className="h-4 bg-base-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-1/3"></div>
            </div>
          </div>
          <div className="h-12 bg-base-300 rounded"></div>
          <div className="flex justify-center space-x-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-base-300 rounded-full"></div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="h-12 bg-base-300 rounded-full w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-300 p-4">
      <motion.div 
        {...animate}
        className="max-w-4xl w-full bg-base-100 rounded-xl shadow-2xl p-8 space-y-6"
      >
        <motion.div {...animate} className="flex items-center space-x-2 text-primary">
          <Terminal className="w-5 h-5" />
          <span className="font-mono">&lt;hello_world /&gt;</span>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          {userData?.profilePic && (
            <motion.div 
              className="flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
              <img 
                src={userData.profilePic} 
                alt="Profile" 
                className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg"
              />
            </motion.div>
          )}
          <div className="flex-1 text-center md:text-left">
            <motion.h1 {...animate} className="text-4xl md:text-5xl font-bold mb-2">
              I am <span className="text-primary">{userData?.username}</span>
            </motion.h1>
            <motion.p {...animate} className="text-lg md:text-xl text-base-content/80">
              {userData?.describe}
            </motion.p>
            <motion.div {...animate} className="flex items-center justify-center md:justify-start space-x-2 mt-4">
              <Mail className="w-5 h-5 text-primary" />
              <span>{userData?.email}</span>
            </motion.div>
            <motion.div {...animate} className="flex items-center justify-center md:justify-start space-x-2 mt-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{userData?.location || "Phnom Penh"}</span>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          {...animate}
          className="bg-base-200 p-4 rounded-lg flex items-center space-x-2 overflow-hidden"
        >
          <Zap className="text-primary flex-shrink-0" />
          <div className="relative w-full h-8">
            <AnimatePresence>
              <motion.span
                key={activeSkillIndex}
                className="text-lg absolute left-0 right-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                ref={skillRef}
              >
                {userData?.skills?.[activeSkillIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.div {...animate} className="flex justify-center space-x-4">
          {userData?.socialLinks?.map(link => (
            <SocialLink key={link._id} href={link.url} platform={link.platform} />
          ))}
        </motion.div>
        
        {userData?.cv && (
          <motion.div {...animate} className="flex justify-center">
            <a 
              href={userData.cv} 
              download 
              className="inline-flex items-center space-x-2 bg-primary text-primary-content px-6 py-3 rounded-full hover:bg-primary-focus transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Download Resume</span>
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HeroCard;