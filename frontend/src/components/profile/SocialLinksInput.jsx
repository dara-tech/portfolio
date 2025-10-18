import React, { useState } from 'react';

const socialPlatforms = {
  github: {
    name: 'GitHub',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    placeholder: 'username',
    baseUrl: 'https://github.com/',
    validate: (username) => /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)
  },
  linkedin: {
    name: 'LinkedIn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    placeholder: 'username',
    baseUrl: 'https://linkedin.com/in/',
    validate: (username) => /^[a-zA-Z0-9-]{3,100}$/.test(username)
  },
  twitter: {
    name: 'Twitter',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    placeholder: 'username',
    baseUrl: 'https://twitter.com/',
    validate: (username) => /^[a-zA-Z0-9_]{1,15}$/.test(username)
  },
  youtube: {
    name: 'YouTube',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    placeholder: 'channel',
    baseUrl: 'https://youtube.com/',
    validate: (username) => /^[@a-zA-Z0-9-_]{3,}$/.test(username)
  },
  portfolio: {
    name: 'Portfolio',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    placeholder: 'website URL',
    baseUrl: '',
    validate: (url) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(url)
  }
};

const SocialLinksInput = ({ socialLinks, onChange }) => {
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');

  const handleEdit = (platform) => {
    setEditingPlatform(platform);
    const existingLink = socialLinks.find(link => link.platform === platform);
    setNewUsername(existingLink ? existingLink.username : '');
    setError('');
  };

  const handleSave = () => {
    if (!newUsername) {
      setError('Username cannot be empty');
      return;
    }

    const platform = socialPlatforms[editingPlatform];
    if (!platform.validate(newUsername)) {
      setError(`Invalid ${platform.name} ${platform.placeholder}`);
      return;
    }

    const newLinks = socialLinks.filter(link => link.platform !== editingPlatform);
    if (newUsername) {
      newLinks.push({
        platform: editingPlatform,
        username: newUsername,
        url: platform.baseUrl + newUsername
      });
    }
    onChange(newLinks);
    setEditingPlatform(null);
    setNewUsername('');
    setError('');
  };

  const handleRemove = (platform) => {
    const newLinks = socialLinks.filter(link => link.platform !== platform);
    onChange(newLinks);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-lg text-white/90 font-medium">Social Links</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(socialPlatforms).map(([platform, info]) => {
          const existingLink = socialLinks.find(link => link.platform === platform);
          const isEditing = editingPlatform === platform;

          return (
            <div key={platform} className="bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-400">{info.icon}</div>
                <h3 className="text-base font-semibold text-white">{info.name}</h3>
              </div>

                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex w-full">
                      <div className="px-3 py-2 bg-white/10 text-white/70 text-sm border border-white/20 rounded-l-lg">
                        {info.baseUrl}
                      </div>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder={info.placeholder}
                        className="flex-grow px-3 py-2 bg-white/10 text-white placeholder-white/50 border border-white/20 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
                      />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingPlatform(null)}
                        className="px-3 py-1.5 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 text-sm font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    {existingLink ? (
                      <div className="flex items-center justify-between">
                        <a
                          href={existingLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm truncate transition-colors duration-200"
                        >
                          {existingLink.url}
                        </a>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(platform)}
                            className="px-2 py-1 bg-white/10 text-white/80 border border-white/20 rounded hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemove(platform)}
                            className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-400/30 rounded hover:bg-red-500/30 hover:border-red-400/50 transition-all duration-300 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(platform)}
                        className="w-full px-3 py-2 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium"
                      >
                        Add {info.name}
                      </button>
                    )}
                  </div>
                )}
              </div>
        
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinksInput;
