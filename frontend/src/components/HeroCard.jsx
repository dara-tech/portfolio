import React, { useState, useEffect } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Github, Linkedin, Twitter, Facebook, Instagram, Download, Terminal, Zap } from "lucide-react";

const HeroCard = () => {
  const { formData: userData, loading } = useAdminProfile();
  const [displayText, setDisplayText] = useState({ username: "", description: "" });
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);

  useEffect(() => {
    if (!loading && userData?.username && userData?.describe) {
      const typeText = async (text, key) => {
        for (let i = 0; i <= text.length; i++) {
          setDisplayText(prev => ({ ...prev, [key]: text.slice(0, i) }));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      };

      typeText(userData.username, 'username');
      setTimeout(() => typeText(userData.describe, 'description'), 1000);

      const skillInterval = setInterval(() => {
        setActiveSkillIndex(prev => (prev + 1) % (userData?.skills?.length || 1));
      }, 2000);

      return () => clearInterval(skillInterval);
    }
  }, [loading, userData]);

  const SocialLink = ({ href, platform }) => {
    const Icon = { github: Github, linkedin: Linkedin, twitter: Twitter, facebook: Facebook, instagram: Instagram }[platform.toLowerCase()];
    return Icon ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-primary transition-colors">
        <Icon className="w-6 h-6" />
      </a>
    ) : null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-300 p-4">
      <div className="max-w-4xl w-full bg-base-100 rounded-xl shadow-xl p-8 space-y-6">
        <div className="flex items-center space-x-2 text-primary">
          <Terminal className="w-5 h-5" />
          <span className="font-mono">&lt;hello_world /&gt;</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              I am <span className="text-primary">{displayText.username}</span>
            </h1>
            <p className="text-md ">{displayText.description}</p>
          </div>
          {userData?.profilePic && (
            <div className="flex-shrink-0">
              <img 
                src={userData.profilePic} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
            </div>
          )}
        </div>
        
        
        <div className="bg-base-200 p-4 rounded-lg flex items-center space-x-2">
          <Zap className="text-primary" />
          <span className="text-lg">{userData?.skills?.[activeSkillIndex]}</span>
        </div>
        
        <div className="flex space-x-4">
          {userData?.socialLinks?.map(link => (
            <SocialLink key={link._id} href={link.url} platform={link.platform} />
          ))}
        </div>
        
        {userData?.cv && (
          <a href={userData.cv} download className="inline-flex items-center space-x-2 bg-primary text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors">
            <Download className="w-5 h-5" />
            <span>Download Resume</span>
          </a>
        )}
        
       
      </div>
    </div>
  );
};

export default HeroCard;