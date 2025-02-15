import React from 'react';
import CVUpload from './CVUpload';
import TextInput from './TextInput';
import TextArea from './TextArea';
import SkillsInput from './SkillsInput';
import SocialLinksInput from './SocialLinksInput';

const ProfileForm = ({ formData, handleChange, cvFile, handleCvChange, setFormData }) => {
  const handleSkillsChange = (newSkills) => {
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSocialLinksChange = (newLinks) => {
    setFormData({ ...formData, socialLinks: newLinks });
  };

  return (
    <div className="md:w-2/3 space-y-4">
      <CVUpload 
        cvFile={cvFile} 
        handleCvChange={handleCvChange} 
        currentCV={formData.cv}
        setFormData={setFormData}
        formData={formData}
      />

      <TextInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter your username"
      />

      <TextInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />

      <TextArea
        label="Description"
        name="describe"
        value={formData.describe}
        onChange={handleChange}
        placeholder="Tell us about yourself"
      />

      <TextArea
        label="About"
        name="about"
        value={formData.about}
        onChange={handleChange}
        placeholder="Tell us about yourself"
      />

      <TextInput
        label="Experiences"
        name="exp"
        value={formData.exp}
        onChange={handleChange}
        placeholder="Enter your experiences"
      />

      <SkillsInput 
        skills={formData.skills || []} 
        onChange={handleSkillsChange}
      />

      <SocialLinksInput 
        socialLinks={formData.socialLinks || []}
        onChange={handleSocialLinksChange}
      />

      <TextInput
        label="Updated At"
        name="updatedAt"
        value={formData.updatedAt}
        onChange={handleChange}
        placeholder="Enter updated at"
        disabled
      />
    </div>
  );
};

export default ProfileForm;
