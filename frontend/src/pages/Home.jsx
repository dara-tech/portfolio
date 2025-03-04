import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import ProjectList from '../components/projects/ProjectList';
import HeroCard from '../components/HeroCard';
import SkillsSection from '../components/SkillsSection';

import { MessageCircle } from 'lucide-react';


const Home = () => {

  return (
    <div className="min-h-screen overflow-y-auto mb-4 py-4">
    

      {/* Hero Section */}
      <HeroCard />

      {/* Skills Section */}
      <SkillsSection />

      {/* Featured Projects Preview */}
      <ProjectList />

      {/* Contact Section */}
      <ContactForm />

    </div>
  );
};

export default Home;