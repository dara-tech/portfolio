import React from 'react';

const TextArea = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-lg">{label}</span>
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="textarea w-full textarea-bordered focus:outline-none textarea-primary h-32"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

export default TextArea;
