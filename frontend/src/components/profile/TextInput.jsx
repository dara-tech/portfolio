import React from 'react';

const TextInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  disabled = false 
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-lg text-white/90 font-medium">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white/10  text-white placeholder-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;
