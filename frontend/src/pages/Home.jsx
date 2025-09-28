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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <HeroCard />
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <SkillsSection />
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-base-content mb-4">Featured Projects</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Explore some of my recent work and creative projects
            </p>
          </div>
          <ProjectList />
        </div>
      </section>

      {/* Featured Videos Preview */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-base-content mb-4">Latest Videos</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Watch my latest tutorials and project walkthroughs
            </p>
          </div>
          <VideoPage />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-base-content mb-4">Get In Touch</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
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