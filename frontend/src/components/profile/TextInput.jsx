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
        <span className="label-text text-lg">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="input input-bordered w-full focus:outline-none input-primary"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;
