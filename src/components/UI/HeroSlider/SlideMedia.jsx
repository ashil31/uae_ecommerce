// components/UI/HeroSlider/SlideMedia.jsx
import React, { forwardRef } from 'react';
import OptimizedImage from '../OptimizedImage';

const SlideMedia = forwardRef(({ type = 'image', url, altText = '', onEnded, onError }, ref) => {
  if (type === 'video') {
    return (
      <video
        ref={ref}
        src={url}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={onEnded}
        onError={onError}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <OptimizedImage
      src={url}
      alt={altText}
      className="w-full h-full object-cover"
    />
  );
});

export default SlideMedia;
