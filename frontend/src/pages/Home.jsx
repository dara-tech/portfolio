import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import ProjectList from '../components/projects/ProjectList';
import HeroCard from '../components/HeroCard';
import SkillsSection from '../components/SkillsSection';
import VideoPage from '../pages/VideoPage';
import { MessageCircle } from 'lucide-react';


const Home = () => {

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
      <div className="-py-60">
      {/* Contact Section */}
      <ContactForm />
      </div>
    </div>
  );
};

export default Home;