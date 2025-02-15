import React, { useState } from 'react';
import { useAdminProfile } from '../hooks/useAdminProfile';
import { motion } from 'framer-motion';

const skillCategories = {
  "Frontend Development": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 18.178l-4.62-1.256-.328-3.544h2.27l.158 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.217l-.624 6.778L12 18.178zM3 2h18l-1.623 18L12 22l-7.377-2L3 2zm2.188 2L6.49 18.434 12 19.928l5.51-1.494L18.812 4H5.188z"/>
      </svg>
    ),
    skills: ["React", "Vue.js", "Angular", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
    color: "primary"
  },
  "Backend Development": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 13.2C20 17.3 16.7 20 12 20S4 17.3 4 13.2V10h16v3.2zM20 8H4V4h16v4zM12 2C8.3 2 5.1 3.5 3.2 6L2 7.6V14c0 5.5 4.5 10 10 10s10-4.5 10-10V7.6L20.8 6C18.9 3.5 15.7 2 12 2zm8 12c0 4.4-3.6 8-8 8s-8-3.6-8-8V8.4l.8-1.2C6.3 5.1 9 4 12 4s5.7 1.1 7.2 3.2l.8 1.2V14z"/>
      </svg>
    ),
    skills: ["Node.js", "Express.js", "Python", "Django", "Java", "Spring Boot", "GraphQL"],
    color: "secondary"
  },
  "Database & Cloud": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 3.79 5 6v12c0 2.21 3.13 4 7 4s7-1.79 7-4V6c0-2.21-3.13-4-7-4zm5 16c0 .56-2.33 2-5 2s-5-1.44-5-2v-2.42c1.23.85 3.07 1.42 5 1.42s3.77-.57 5-1.42V18zm0-4c0 .56-2.33 2-5 2s-5-1.44-5-2v-2.42c1.23.85 3.07 1.42 5 1.42s3.77-.57 5-1.42V14zm0-4c0 .56-2.33 2-5 2s-5-1.44-5-2V7.58c1.23.85 3.07 1.42 5 1.42s3.77-.57 5-1.42V10zm-5-6c2.67 0 5 1.44 5 2s-2.33 2-5 2-5-1.44-5-2 2.33-2 5-2z"/>
      </svg>
    ),
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Docker", "Kubernetes"],
    color: "accent"
  },
  "Tools & Others": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.71 20.29l-3.68-3.68A8.963 8.963 0 0020 11c0-4.96-4.04-9-9-9s-9 4.04-9 9 4.04 9 9 9c2.12 0 4.07-.74 5.61-1.97l3.68 3.68c.2.19.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.03 0-1.42zM4 11c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z"/>
      </svg>
    ),
    skills: ["Git", "JIRA", "Agile", "Scrum", "CI/CD", "Testing", "Documentation"],
    color: "info"
  }
};

const SkillsSection = () => {
  const { formData } = useAdminProfile();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const userSkills = formData?.skills || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const skillVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const getSkillLevel = (skill) => {
    // This is a placeholder function - you might want to store skill levels in your backend
    return userSkills.includes(skill) ? "Expert" : "Familiar";
  };

  return (
    <div className="py-16 px-4 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and areas of expertise
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(skillCategories).map(([category, { icon, skills, color }]) => (
            <motion.div
              key={category}
              variants={cardVariants}
              className={`card bg-base-200 hover:bg-base-300 transition-colors duration-300 cursor-pointer
                ${selectedCategory === category ? 'ring-2 ring-' + color : ''}
              `}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`text-${color}`}>{icon}</div>
                  <h3 className="card-title text-lg">{category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const isUserSkill = userSkills.includes(skill);
                    return (
                      <motion.div
                        key={skill}
                        variants={skillVariants}
                        className={`badge badge-${color} ${isUserSkill ? 'badge-lg' : 'badge-sm opacity-50'} 
                          hover:opacity-100 transition-all duration-300 cursor-help`}
                        title={`Level: ${getSkillLevel(skill)}`}
                      >
                        {skill}
                      </motion.div>
                    );
                  })}
                </div>

                {selectedCategory === category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-sm text-base-content/70"
                  >
                    <p>Click on skills to see more details</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skill Details Section */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 card bg-base-200"
          >
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">{selectedCategory} Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">My Expertise</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {skillCategories[selectedCategory].skills
                      .filter(skill => userSkills.includes(skill))
                      .map(skill => (
                        <li key={skill} className="text-base-content/80">{skill}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Learning & Improving</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {skillCategories[selectedCategory].skills
                      .filter(skill => !userSkills.includes(skill))
                      .map(skill => (
                        <li key={skill} className="text-base-content/50">{skill}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
