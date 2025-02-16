import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import ProjectList from '../components/ProjectList';
import HeroCard from '../components/HeroCard';
import SkillsSection from '../components/SkillsSection';

const Home = () => {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div><HeroCard /></div>

      {/* Skills Section */}
      <SkillsSection />

      {/* Featured Projects Preview */}
      <ProjectList/>

      {/* Contact Section */}
      <ContactForm />
    </div>
  );
};

export default Home;