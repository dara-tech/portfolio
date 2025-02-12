import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import ProjectList from '../components/ProjectList';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold">Welcome to My Portfolio</h1>
            <p className="py-6 text-xl">Full-Stack Developer crafting elegant solutions to complex problems</p>
            <div className="flex gap-4 justify-center">
              <Link to="/projects" className="btn btn-primary">View Projects</Link>
              <a href="#contact" className="btn btn-ghost">Contact Me</a>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="py-16 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-300 ">
              <div className="card-body">
                <h3 className="card-title">Frontend Development</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="badge badge-primary">React</div>
                  <div className="badge badge-primary">TypeScript</div>
                  <div className="badge badge-primary">Tailwind CSS</div>
                  <div className="badge badge-primary">Next.js</div>
                </div>
              </div>
            </div>

            <div className="card bg-base-300">
              <div className="card-body">
                <h3 className="card-title">Backend Development</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="badge badge-secondary">Node.js</div>
                  <div className="badge badge-secondary">Express</div>
                  <div className="badge badge-secondary">MongoDB</div>
                  <div className="badge badge-secondary">PostgreSQL</div>
                </div>
              </div>
            </div>

            <div className="card bg-base-300">
              <div className="card-body">
                <h3 className="card-title">DevOps & Tools</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="badge badge-accent">Docker</div>
                  <div className="badge badge-accent">AWS</div>
                  <div className="badge badge-accent">Git</div>
                  <div className="badge badge-accent">CI/CD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Preview */}
      <ProjectList/>

      {/* Contact Section */}
      <ContactForm />
    </div>
  );
};

export default Home;