import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import ProjectList from '../components/projects/ProjectList';
import HeroCard from '../components/HeroCard';
import SkillsSection from '../components/SkillsSection';
import VideoPage from '../pages/VideoPage';
import { MessageCircle } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const Home = () => {
  // Use SEO hook for the home page
  useSEO({
    title: 'Cheol Sovandara - Portfolio',
    description: 'Welcome to my portfolio website. I am a full-stack developer specializing in web development, with expertise in React, Node.js, and modern web technologies.',
    url: '/',
    type: 'website',
    keywords: ['portfolio', 'web development', 'full-stack developer', 'React', 'Node.js', 'JavaScript']
  });

  return (
    <div className="min-h-screen  mb-4 py-4">
    

      {/* Hero Section */}
      <HeroCard />

      {/* Skills Section */}
      <SkillsSection />

      {/* Featured Projects Preview */}
      <div className="-my-30">
      <ProjectList />
      </div>
      {/* Featured Videos Preview */}
      <div className="-my-40">
        <VideoPage />
      </div>
      <div className="my-20">
      {/* Contact Section */}
      <ContactForm />
      </div>
    </div>
  );
};

export default Home;