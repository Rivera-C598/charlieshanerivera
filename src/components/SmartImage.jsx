import React, { useState } from 'react';
import styled from '@emotion/styled';

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const SmartImage = ({ 
  src, 
  fallbackSrc, 
  alt, 
  className, 
  onLoad, 
  onError,
  ...props 
}) => {
  const [imageState, setImageState] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = (e) => {
    setImageState('loaded');
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    if (currentSrc === src && fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc);
      setImageState('loading');
    } else {
      setImageState('error');
    }
    if (onError) onError(e);
  };

  return (
    <ImageContainer className={className}>
      {imageState === 'loading' && (
        <LoadingPlaceholder>
          Loading...
        </LoadingPlaceholder>
      )}
      
      {imageState === 'error' && (
        <LoadingPlaceholder>
          Image not found
        </LoadingPlaceholder>
      )}
      
      <Image
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: imageState === 'loaded' ? 1 : 0,
          position: imageState === 'loaded' ? 'static' : 'absolute',
        }}
        {...props}
      />
    </ImageContainer>
  );
};

export default SmartImage;