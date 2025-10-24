import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileContainer = styled.div`
  position: relative;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none; /* Prevent text selection on touch */

  &:hover {
    transform: scale(1.05);
  }

  /* Visual feedback for touch */
  &:active {
    transform: scale(0.95);
  }

  /* Subtle pulse animation on mobile to hint at interactivity */
  @media (hover: none) and (pointer: coarse) {
    animation: subtlePulse 3s ease-in-out infinite;
  }

  @keyframes subtlePulse {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.3);
    }
    50% { 
      box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
    }
  }
`;

const ProfileImageContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
`;

const ProfileImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const PlaceholderProfile = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => {
    const gradients = [
      'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)'
    ];
    return gradients[props.imageIndex] || gradients[0];
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => props.size === '120px' ? '2rem' : '1rem'};
  transition: all 0.2s ease;
`;

const profileImages = [
  '/assets/profile/profile-1.png',
  '/assets/profile/profile-2.jpg'
];

const RotatingProfilePicture = ({ size = '40px', className }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const touchTimeoutRef = useRef(null);

  const startImageCycling = () => {
    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Start cycling through images
    intervalRef.current = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % profileImages.length);
    }, 800); // Change image every 800ms (slower)

    // Stop after 3 seconds (longer duration)
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 3000);
  };

  const stopImageCycling = () => {
    // Clear intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    
    // Return to main image
    setCurrentImage(0);
  };

  const handleMouseEnter = () => {
    startImageCycling();
  };

  const handleMouseLeave = () => {
    stopImageCycling();
  };

  // Touch and hold functionality for mobile
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    touchTimeoutRef.current = setTimeout(() => {
      startImageCycling();
    }, 500); // Start cycling after 500ms hold
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    // Only stop if we actually started cycling
    if (intervalRef.current) {
      stopImageCycling();
    }
  };

  // Check if images exist by trying to load the first one
  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const handleImageError = () => {
    setImagesLoaded(false);
  };

  return (
    <ProfileContainer 
      size={size} 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <ProfileImageContainer>
        {imagesLoaded ? (
          <AnimatePresence mode="wait">
            <ProfileImage
              key={currentImage}
              src={profileImages[currentImage]}
              alt="Charlie Shane Rivera"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </AnimatePresence>
        ) : (
          <>
            {/* Hidden image to test if files exist */}
            <img 
              src={profileImages[0]} 
              alt="" 
              style={{ display: 'none' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {/* Placeholder with initials - shows different colors when cycling */}
            <PlaceholderProfile size={size} imageIndex={currentImage}>
              CSR
            </PlaceholderProfile>
          </>
        )}
      </ProfileImageContainer>
    </ProfileContainer>
  );
};

export default RotatingProfilePicture;