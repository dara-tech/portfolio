import React, { useState, useEffect } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Facebook, Instagram, Twitter, Linkedin, Github, Download, Code2, ExternalLink, NotebookPen } from "lucide-react";

const HeroCard = () => {
  const { formData: userData, loading } = useAdminProfile();
  const [displayName, setDisplayName] = useState("");
  const [displayDescription, setDisplayDescription] = useState("");
  const [isTypingName, setIsTypingName] = useState(true);
  const [isTypingDescription, setIsTypingDescription] = useState(false);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);

  useEffect(() => {
    if (!loading && userData?.username && userData?.describe) {
      const typingEffect = async (text, setDisplay, setIsTyping, delay = 100) => {
        setIsTyping(true);
        for (let i = 0; i <= text.length; i++) {
          setDisplay(text.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        setIsTyping(false);
      };

      const animateText = async () => {
        await typingEffect(userData.username, setDisplayName, setIsTypingName);
        await new Promise(resolve => setTimeout(resolve, 500));
        await typingEffect(userData.describe, setDisplayDescription, setIsTypingDescription, 50);
      };

      animateText();

      const interval = setInterval(() => {
        setActiveSkillIndex(prev => (prev + 1) % (userData?.skills?.length || 1));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading, userData?.username, userData?.describe]);

  const getSocialIcon = (platform) => {
    const icons = {
      github: Github,
      linkedin: Linkedin, 
      twitter: Twitter,
      facebook: Facebook,
      instagram: Instagram
    };
    return icons[platform.toLowerCase()] || null;
  };

  const SocialLink = ({ href, platform }) => {
    const Icon = getSocialIcon(platform);
    if (!Icon) return null;
    
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative p-3 hover:text-primary transition-colors duration-200 rounded-lg"
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-200 text-base-content text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {platform}
        </span>
      </a>
    );
  };

  const ProfileImage = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'block lg:hidden mx-auto w-48 sm:w-56 md:w-64 py-10 -mb-20' : 'hidden lg:block relative'}`}>
      <div className="relative group">
        <div className="flex items-center  gap-2 absolute -top-4 -left-4 z-20 bg-base-100 p-2 rounded-full shadow-sm">

          <p className="text-base-content/80 text-xs leading-relaxed">
            {userData?.about || "This user hasn't provided any information about themselves yet."}
          </p>
        </div>
       
        <div className="aspect-square relative z-10 overflow-hidden rounded-lg">
          {loading ? (
            <div className="w-full h-full bg-base-200 animate-pulse" />
          ) : userData?.profilePic ? (
            <img
              src={userData.profilePic}
              alt={userData.username}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/500/500";
              }}
            />
          ) : (
            <img 
              src="/api/placeholder/500/500" 
              alt="placeholder" 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex items-center py-20 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <ProfileImage isMobile={true} />

          <div className="space-y-6 text-center lg:text-left bg-base-100 p-8 rounded-lg">
            <div className="relative">
              <h2 className="text-base text-primary mb-2 font-mono">
                &lt;hello world/&gt;
              </h2>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-base-content">
                I am{" "}
                <span className="font-bold relative">
                  {loading ? "Loading..." : displayName}
                  {isTypingName && (
                    <span className="absolute bottom-0 right-0 w-0.5 h-full bg-primary animate-blink" />
                  )}
                </span>
              </h1>
            </div>

            <div className="relative h-20 sm:h-28 overflow-hidden">
              <p className="text-lg sm:text-xl text-base-content/70 absolute">
                {loading ? "Loading..." : displayDescription}
                {isTypingDescription && (
                  <span className="inline-block w-0.5 h-4 bg-primary animate-blink ml-1" />
                )}
              </p>
            </div>

            <div className="relative h-12 overflow-hidden rounded-lg bg-base-100 ">
              {userData?.skills && (
                <div 
                  className="transition-transform duration-300 absolute w-full"
                  style={{ transform: `translateY(-${activeSkillIndex * 3}rem)` }}
                >
                  {userData.skills.map((skill, index) => (
                    <div 
                      key={skill}
                      className={`h-12 flex items-center justify-center lg:justify-start text-xl font-light transition-opacity duration-200 ${
                        index === activeSkillIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="text-primary">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="h-px flex-1 bg-base-200" />
              <div className="flex justify-center gap-2">
                {userData?.socialLinks?.map((link) => (
                  <SocialLink key={link._id} href={link.url} platform={link.platform} />
                ))}
              </div>
              <div className="h-px flex-1 bg-base-200" />
            </div>

            {userData?.cv && (
              <div className="flex justify-center lg:justify-start">
                <a
                  href={userData.cv}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-content transition-colors duration-200"
                >
                  <Download className="w-4 h-4 " />
                  Download Resume
                </a>
              </div>
            )}
          </div>

          <ProfileImage />
        </div>
      </div>
    </div>
  );
};

export default HeroCard;