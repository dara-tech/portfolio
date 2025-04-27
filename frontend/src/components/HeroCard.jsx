import React, { useState, useEffect, useRef } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Facebook, Instagram, Twitter, Linkedin, Github, Download, Code2, ExternalLink, NotebookPen, Sparkles, Terminal, Zap, Star, Cpu } from "lucide-react";

const HeroCard = () => {
  const { formData: userData, loading } = useAdminProfile();
  const [displayName, setDisplayName] = useState("");
  const [displayDescription, setDisplayDescription] = useState("");
  const [isTypingName, setIsTypingName] = useState(true);
  const [isTypingDescription, setIsTypingDescription] = useState(false);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(window.scrollY - rect.top);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setMousePosition({ x, y });
  };

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
        className="group relative p-4 hover:text-primary transition-all duration-500 rounded-xl hover:bg-base-200/50 hover:scale-110 hover:-translate-y-2"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-content text-xs py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
          Connect on {platform}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-solid border-t-primary border-t-8 border-x-transparent border-x-8 border-b-0" />
        </span>
      </a>
    );
  };

  const ProfileImage = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'block lg:hidden mx-auto mb-20' : 'hidden lg:block'}`}>
      <div className="relative group perspective-1000">
        <div className="absolute -top-8 -left-8 z-20 bg-base-100/95 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-xs transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">About Me</span>
          </div>
          <p className="text-base-content/90 text-sm leading-relaxed">
            {userData?.about || "This user hasn't provided any information about themselves yet."}
          </p>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary/10 rounded-full animate-pulse" />
        </div>
       
        <div className="overflow-hidden rounded-3xl ">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 mix-blend-overlay" />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-base-200 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-12 h-12 text-primary/30 animate-spin" />
              </div>
            </div>
          )}
          {userData?.profilePic ? (
            <img
              src={userData.profilePic}
              alt={userData.username}
              className={`transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/500/500";
                setImageLoaded(true);
              }}
            />
          ) : (
            <img 
              src="/api/placeholder/500/500" 
              alt="placeholder" 
              className="w-full h-full object-cover object-center" 
              onLoad={() => setImageLoaded(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-base-100/100 via-transparent to-transparent" />
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/5 rounded-full blur-xl animate-pulse delay-700" />
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen flex items-center py-24 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-base-100 via-base-200 to-base-300 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, var(--primary) 0%, transparent 70%)`,
          transition: 'background 0.4s ease-out'
        }}
      />
      
      {/* Advanced particle system */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
              opacity: 0.2,
              animation: `floatingStar ${7 + Math.random() * 7}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${1 + Math.random()})`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <ProfileImage isMobile={true} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-10 text-center lg:text-left">
            <div className="relative p-10 bg-base-100/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-base-200/30 hover:border-primary/30 transition-all duration-700 hover:shadow-primary/10 transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="flex items-center mb-14 gap-3 ">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  <h2 className="text-base text-primary font-mono">
                    &lt;hello_world /&gt;
                  </h2>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-base-content mb-8">
                  I am{" "}
                  <span className="font-bold relative inline-block group">
                    {loading ? "Loading..." : displayName}
                    {isTypingName && (
                      <span className="absolute bottom-0 right-0 w-1 h-full bg-primary animate-blink" />
                    )}
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-secondary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  </span>
                </h1>

                <div className="relative h-28 overflow-hidden mb-8">
                  <p className="text-lg sm:text-xl text-base-content/80 absolute">
                    {loading ? "Loading..." : displayDescription}
                    {isTypingDescription && (
                      <span className="inline-block w-1 h-5 bg-primary animate-blink ml-1" />
                    )}
                  </p>
                </div>

                <div className="relative h-20 overflow-hidden rounded-2xl bg-base-200/50 backdrop-blur-sm border border-base-300/30 group hover:border-primary/30 transition-all duration-500">
                  {userData?.skills && (
                    <div 
                      className="transition-transform duration-700 absolute w-full"
                      style={{ transform: `translateY(-${activeSkillIndex * 5}rem)` }}
                    >
                      {userData.skills.map((skill, index) => (
                        <div 
                          key={skill}
                          className={`h-20 flex items-center justify-center lg:justify-start text-2xl font-light px-8 transition-all duration-500 ${
                            index === activeSkillIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <Zap className="w-6 h-6 text-primary mr-4 animate-pulse" />
                          <span className="text-primary">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8 pt-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
                <div className="flex justify-center gap-4">
                  {userData?.socialLinks?.map((link) => (
                    <SocialLink key={link._id} href={link.url} platform={link.platform} />
                  ))}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
              </div>

              {userData?.cv && (
                <div className="flex justify-center lg:justify-start mt-10">
                  <a
                    href={userData.cv}
                    download
                    className="group inline-flex items-center gap-3 px-8 py-4 text-base font-medium text-primary border-2 border-primary rounded-2xl hover:bg-primary hover:text-primary-content transition-all duration-500 hover:scale-105 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    <Download className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Download Resume</span>
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <ProfileImage />
        </div>
      </div>

      <style>
        {`
          @keyframes floatingStar {
            0%, 100% {
              transform: translateY(0) translateX(0) scale(1) rotate(0deg);
              opacity: 0.2;
            }
            25% {
              transform: translateY(-40px) translateX(20px) scale(2) rotate(90deg);
              opacity: 0.7;
            }
            50% {
              transform: translateY(0) translateX(40px) scale(1) rotate(180deg);
              opacity: 0.2;
            }
            75% {
              transform: translateY(40px) translateX(20px) scale(2) rotate(270deg);
              opacity: 0.7;
            }
          }
          
          .perspective-1000 {
            perspective: 1000px;
          }
          
          .rotate-y-12 {
            transform: rotateY(12deg);
          }

          @keyframes glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
          }
        `}
      </style>
    </div>
  );
};

export default HeroCard;