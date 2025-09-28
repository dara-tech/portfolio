import React, { useState, useEffect, useRef } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Github, Linkedin, Twitter, Facebook, Instagram, Download, Terminal, Zap, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HeroCard = () => {
  const { formData: userData, loading } = useAdminProfile();
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const skillRef = useRef(null);

  // Skill rotation effect
  useEffect(() => {
    if (!loading && userData?.skills && userData.skills.length > 0) {
      const skillInterval = setInterval(() => {
        setActiveSkillIndex(prev => (prev + 1) % userData.skills.length);
      }, 3000); // Change skill every 3 seconds

      return () => clearInterval(skillInterval);
    }
  }, [loading, userData]);

  // Component for social links
  const SocialLink = ({ href, platform }) => {
    const Icon = { github: Github, linkedin: Linkedin, twitter: Twitter, facebook: Facebook, instagram: Instagram }[platform.toLowerCase()];
    return Icon ? (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base-content/70 hover:text-primary transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
        }}
      >
        <Icon className="w-6 h-6 md:w-7 md:h-7" />
      </motion.a>
    ) : null;
  };

  // Framer Motion Variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full bg-base-200 rounded-lg shadow-lg p-8 space-y-6 animate-pulse border border-base-300">
          <div className="h-6 bg-base-300 rounded w-1/4"></div>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-40 h-40 rounded-full bg-base-300 animate-pulse-slow"></div>
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-base-300 rounded w-3/4"></div>
              <div className="h-6 bg-base-300 rounded w-full"></div>
              <div className="h-4 bg-base-300 rounded w-1/2"></div>
              <div className="h-4 bg-base-300 rounded w-1/3"></div>
            </div>
          </div>
          <div className="h-12 bg-base-300 rounded"></div>
          <div className="flex justify-center space-x-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-base-300 rounded-full"></div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="h-12 bg-base-300 rounded-lg w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-base-content py-20">
      <motion.div
        className="max-w-6xl w-full bg-base-200 rounded-lg shadow-lg p-8 space-y-8 border border-base-300 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center space-x-3 text-primary mb-6">
          <Terminal className="w-6 h-6" />
          <span className="font-mono text-lg">&lt;hello_world /&gt;</span>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12 flex-grow">
          {userData?.profilePic && (
            <motion.div
              className="flex-shrink-0 relative group"
              variants={itemVariants}
            >
              <img
                src={userData.profilePic}
                alt="Profile"
                className="w-44 h-44 rounded-full object-cover border-4 border-primary shadow-lg group-hover:scale-105 transition-transform duration-300 ease-out"
              />
            </motion.div>
          )}

          <div className="flex-1 text-center md:text-left space-y-3">
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold leading-tight">
              Hi, I'm <span className="text-primary inline-block"> {userData?.username}</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-base-content/80 leading-relaxed">
              {userData?.describe}
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-4 text-base-content/70">
              {userData?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{userData.email}</span>
                </div>
              )}
              {userData?.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{userData.location}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-base-100 p-4 rounded-lg flex items-center space-x-3 shadow-sm border border-base-300"
        >
          <Zap className="text-primary flex-shrink-0 w-6 h-6" />
          <div className="relative w-full h-8 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeSkillIndex}
                className="text-lg md:text-xl font-medium text-base-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {userData?.skills?.[activeSkillIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center space-x-6 pt-4">
          {userData?.socialLinks?.map(link => (
            <SocialLink key={link._id} href={link.url} platform={link.platform} />
          ))}
        </motion.div>

        {userData?.cv && (
          <motion.div variants={itemVariants} className="flex justify-center pt-6">
            <motion.a
              href={userData.cv}
              download
              className="inline-flex items-center space-x-3 bg-primary text-primary-content px-8 py-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out font-semibold text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-6 h-6" />
              <span>Download Resume</span>
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HeroCard;