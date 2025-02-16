import React, { useState, useEffect } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Facebook, Instagram, Twitter, Linkedin, Github, Download, Youtube } from "lucide-react";

const HeroCard = () => {
  const { formData: userData, loading } = useAdminProfile();
  const [displayName, setDisplayName] = useState("");
  const [displayDescription, setDisplayDescription] = useState("");
  const [isTypingName, setIsTypingName] = useState(true);
  const [isTypingDescription, setIsTypingDescription] = useState(false);

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
        await new Promise(resolve => setTimeout(resolve, 500)); // Pause between name and description
        await typingEffect(userData.describe, setDisplayDescription, setIsTypingDescription, 50);
      };

      animateText();
    }
  }, [loading, userData?.username, userData?.describe]);

  const SocialLink = ({ href, icon: Icon }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-orange-200 transition-colors duration-300"
    >
      <Icon className="w-5 h-5 text-base-300" />
    </a>
  );

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'github': return Github;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'youtube': return Youtube;
      default: return null;
    }
  };

  return (
    <div className="w-full container mx-auto px-4 py-30">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-primary mb-2">Hi! I Am</h2>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent relative">
              {loading ? "Loading..." : displayName}
              {isTypingName && (
                <span className="animate-pulse ml-1 inline-block w-1 h-12 bg-gradient-to-r from-primary to-accent" />
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="">
              <span className="text-4xl font-bold text-primary">
                {loading ? "Loading..." : userData?.exp || "8"}
              </span>
              <div className="text-sm">
                YEARS
                <br />
                EXPERIENCE
              </div>
            </div>
          </div>

          <p className="text-xl h-20">
            {loading ? "Loading..." : displayDescription}
            {isTypingDescription && (
              <span className="animate-pulse ml-1 inline-block w-1 h-6 bg-gradient-to-r from-primary to-accent" />
            )}
          </p>

          <div className="flex items-center gap-4">
            {userData?.socialLinks?.map((link) => {
              const Icon = getSocialIcon(link.platform);
              return Icon && <SocialLink key={link._id} href={link.url} icon={Icon} />;
            })}
          </div>

          {userData?.cv && (
            <a
              href={userData.cv}
              download
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-primary rounded-lg hover:bg-orange-200 transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              Download CV
            </a>
          )}
        </div>

        <div className="relative">
          <div className="relative">
            <div className="rounded-full overflow-hidden border-8 border-primary bg-gradient-to-r from-primary via-info to-accent shadow-xl">
              {loading ? (
                <div className="w-full h-full bg-slate-200 animate-pulse" />
              ) : userData?.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt={userData.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/500/500";
                  }}
                />
              ) : (
                <img src="/api/placeholder/500/500" alt="placeholder" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="absolute -right-4 bottom-16 bg-white rounded-xl shadow-lg p-4">
              <div className="text-2xl font-bold text-slate-700">Full Stack</div>
              <div className="text-xl text-primary flex items-center gap-1">
                <h2>Developer</h2>
                <span className="bg-black p-1 rounded-full">
                  <Github size={20} />
                </span>
              </div>
            </div>

            <svg
              className="absolute -left-16 top-1/4 w-24 h-24 text-slate-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 2 12 C 2 6.5 6.5 2 12 2 C 17.5 2 22 6.5 22 12" />
              <polyline points="22 12 22 18 16 18" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
