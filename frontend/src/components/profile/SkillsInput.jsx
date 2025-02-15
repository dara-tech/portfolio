import React, { useState, useEffect } from 'react';

const skillCategories = {
  "Frontend Development": [
    "React", "Vue.js", "Angular", "Next.js", "Tailwind CSS", "Material-UI",
    "CSS3", "HTML5", "JavaScript", "TypeScript", "Redux", "Webpack"
  ],
  "Backend Development": [
    "Node.js", "Express.js", "Python", "Django", "Java", "Spring Boot",
    "PHP", "Laravel", "Ruby on Rails", "GraphQL", "REST API"
  ],
  "Database": [
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase",
    "Oracle", "Microsoft SQL Server", "Elasticsearch"
  ],
  "DevOps & Cloud": [
    "AWS", "Docker", "Kubernetes", "CI/CD", "Jenkins",
    "Azure", "Google Cloud", "Linux", "Nginx"
  ],
  "Mobile Development": [
    "React Native", "Flutter", "iOS", "Android", "Swift",
    "Kotlin", "Xamarin", "Mobile App Development"
  ],
  "Tools & Others": [
    "Git", "JIRA", "Figma", "Adobe XD", "Postman",
    "VS Code", "Agile", "Scrum", "Unit Testing"
  ]
};

const SkillsInput = ({ skills, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allSkills = Object.values(skillCategories).flat();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = allSkills.filter(
        skill => skill.toLowerCase().includes(value.toLowerCase()) &&
        !skills.includes(skill)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      const newSkills = [...skills, skill];
      onChange(newSkills);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    onChange(newSkills);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm && suggestions.length > 0) {
      e.preventDefault();
      addSkill(suggestions[0]);
    }
  };

  // Group skills by category
  const groupedSkills = {};
  skills.forEach(skill => {
    const category = Object.entries(skillCategories).find(([_, skills]) => 
      skills.includes(skill)
    )?.[0] || 'Other';
    
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }
    groupedSkills[category].push(skill);
  });

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-lg">Skills</span>
      </label>
      
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="input input-bordered w-full focus:outline-none input-primary"
          placeholder="Type to search and add skills..."
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((skill, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() => addSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Skills */}
      <div className="mt-4">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold text-base-content/70 mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill, index) => (
                <div
                  key={index}
                  className="badge badge-primary badge-lg gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Categories */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-base-content/70 mb-2">Suggested Skills</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(skillCategories).map(([category, _]) => (
            <div
              key={category}
              className="badge badge-outline badge-sm cursor-pointer hover:badge-primary"
              onClick={() => setSearchTerm(category + ': ')}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsInput;
