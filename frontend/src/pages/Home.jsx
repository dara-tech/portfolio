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
    <div className="min-h-screen bg-transparent">
      {/* Hero Section - Full presentation layout */}
      <section className="relative min-h-screen flex items-center justify-center">
        <HeroCard />
      </section>

      {/* Skills Section - Clean presentation style */}
      <section className=" bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
         
          <SkillsSection />
        </div>
      </section>

      {/* Featured Projects Preview - Clean presentation style */}
      <section className=" py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Featured </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Explore some of my recent work and creative projects
            </p>
          </div>
          <ProjectList />
        </div>
      </section>

      {/* Featured Videos Preview - Clean presentation style */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Featured Videos</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Watch my latest video content and tutorials
            </p>
          </div>
          <VideoPage />
        </div>
      </section>

      {/* Contact Section - Clean presentation style */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Get In Touch</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Ready to work together? Let's discuss your next project
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Home;