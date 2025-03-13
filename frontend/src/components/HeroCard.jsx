import React, { useState, useEffect } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Facebook, Instagram, Twitter, Linkedin, Github, Download, Code2 } from "lucide-react";

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

      // Rotate through skills
      const interval = setInterval(() => {
        setActiveSkillIndex(prev => (prev + 1) % (userData?.skills?.length || 1));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading, userData?.username, userData?.describe]);

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github': return Github;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      default: return null;
    }
  };

  const SocialLink = ({ href, platform }) => {
    const Icon = getSocialIcon(platform);
    if (!Icon) return null;
    
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:text-primary transition-colors duration-300"
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    );
  };

  return (
    <div className="w-full min-h-screen flex items-center py-8 md:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Mobile Profile Image */}
          <div className="block lg:hidden mx-auto w-48 sm:w-56 md:w-64  py-10">
            <div className="aspect-square relative z-10 overflow-hidden rounded-full border-4 border-primary/20">
              {loading ? (
                <div className="w-full h-full bg-base-200 animate-pulse" />
              ) : userData?.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt={userData.username}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
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

          {/* Content Section */}
          <div className="space-y-4 text-center lg:text-left">
            <div>
              <h2 className="text-base sm:text-lg text-primary/80 mb-2 font-mono">&lt;hello world/&gt;</h2>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light">
                I'm{" "}
                <span className="font-bold relative">
                  {loading ? "Loading..." : displayName}
                  {isTypingName && (
                    <span className="absolute bottom-0 right-0 w-0.5 h-full bg-primary animate-blink" />
                  )}
                </span>
              </h1>
            </div>

            <div className="relative h-20 sm:h-24 overflow-hidden">
              <p className="text-lg sm:text-xl md:text-2xl text-base-content/80 absolute transition-all duration-300">
                {loading ? "Loading..." : displayDescription}
                {isTypingDescription && (
                  <span className="inline-block w-0.5 h-4 bg-primary animate-blink ml-1" />
                )}
              </p>
            </div>

            <div className="relative h-12 overflow-hidden">
              {userData?.skills && (
                <div 
                  className="transition-all duration-500 absolute w-full"
                  style={{ transform: `translateY(-${activeSkillIndex * 3}rem)` }}
                >
                  {userData.skills.map((skill, index) => (
                    <div 
                      key={skill}
                      className={`h-12 flex items-center justify-center lg:justify-start text-xl sm:text-2xl font-light transition-opacity duration-300 ${
                        index === activeSkillIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 sm:gap-6 pt-4">
              <div className="h-px flex-1 bg-base-content/10" />
              <div className="flex justify-center gap-1 sm:gap-2">
                {userData?.socialLinks?.map((link) => (
                  <SocialLink key={link._id} href={link.url} platform={link.platform} />
                ))}
              </div>
              <div className="h-px flex-1 bg-base-content/10" />
            </div>

            {userData?.cv && (
              <div className="flex justify-center lg:justify-start">
                <a
                  href={userData.cv}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-full"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </div>
            )}

            {/* Show about section - Dream Cloud Style */}
            <div className="pt-8 relative">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">💭</span> About Me
                </h2>
                <div className="h-px flex-1 bg-base-content/10"></div>
              </div>
              
              <div className="relative">
                {/* Cloud shape with multiple bubbles */}
                <div className="absolute -top-6 right-8 lg:right-16 w-8 h-8 bg-white/80 dark:bg-slate-700/80 rounded-full blur-sm"></div>
                <div className="absolute -top-8 right-12 lg:right-24 w-6 h-6 bg-white/80 dark:bg-slate-700/80 rounded-full blur-sm"></div>
                <div className="absolute -top-10 right-16 lg:right-32 w-4 h-4 bg-white/80 dark:bg-slate-700/80 rounded-full blur-sm"></div>
                
                {/* Main cloud */}
                <div className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm p-5 rounded-2xl rounded-br-3xl shadow-lg border border-primary/20">
                  <p className="text-base-content/90 whitespace-pre-line text-sm sm:text-base leading-relaxed italic">
                    {userData?.about || "This user hasn't provided any information about themselves yet."}
                  </p>
                  
                  <div className="flex justify-end mt-2 gap-1">
                    <span className="inline-block w-1 h-1 bg-primary/60 rounded-full"></span>
                    <span className="inline-block w-1 h-1 bg-primary/60 rounded-full"></span>
                    <span className="inline-block w-1 h-1 bg-primary/60 rounded-full"></span>
                  </div>
                </div>
                
                {/* Additional cloud decorations */}
                <div className="absolute -bottom-4 left-8 w-16 h-8 bg-white/80 dark:bg-slate-700/80 rounded-full blur-sm -z-10"></div>
                <div className="absolute -bottom-2 left-12 w-12 h-6 bg-white/80 dark:bg-slate-700/80 rounded-full blur-sm -z-10"></div>
              </div>
            </div>
          </div>

          {/* Desktop Profile Image */}
          <div className="hidden lg:block relative">
            <div className="aspect-square relative z-10 overflow-hidden rounded-lg shadow-xl">
              {loading ? (
                <div className="w-full h-full bg-base-200 animate-pulse" />
              ) : userData?.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt={userData.username}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
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

            {/* <div className="absolute -left-4 bottom-8 py-3 px-6 bg-base-100 border border-base-content/10 shadow-lg backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-primary" />
                <span className="font-mono text-base-content/60">available for work</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;