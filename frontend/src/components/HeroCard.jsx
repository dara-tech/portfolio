import React, { useState, useEffect } from "react";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { Facebook, Instagram, Twitter, Linkedin, Github, Download } from "lucide-react";

const HeroCard = () => {
  const { formData: userData, loading } = useAdminProfile();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!loading && userData?.username) {
      const text = userData.username;
      let currentIndex = 0;
      setIsTyping(true);

      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [loading, userData?.username]);

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

  return (
    <div className="w-full max-w-6xl mx-auto p-4 py-30">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-primary mb-2">Hi! I Am</h2>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent relative">
              {loading ? "Loading..." : displayText}
              {isTyping && (
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

          <p className="text-xl">{loading ? "Loading..." : userData?.describe || "John Doe"}</p>

          <div className="flex items-center gap-4">
            <SocialLink href="#" icon={Facebook} />
            <SocialLink href="#" icon={Instagram} />
            <SocialLink href="#" icon={Twitter} />
            <SocialLink href="#" icon={Linkedin} />
          </div>

          {/* Download CV Button */}
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
            <div className="w-[500px] h-[500px] rounded-full overflow-hidden border-8 border-primary bg-gradient-to-r from-primary via-info to-accent shadow-xl">
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
