import React from 'react';
import PropTypes from 'prop-types';

const ImageMessage = ({ src, alt, className }) => {
  return (
    <div className={`image-message ${className || ''}`}>
      <img 
        src={src} 
        alt={alt || 'Chat image'} 
        className="max-w-full h-auto rounded-lg shadow-md"
        loading="lazy"
      />
    </div>
  );
};

ImageMessage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string
};

export default ImageMessage;
