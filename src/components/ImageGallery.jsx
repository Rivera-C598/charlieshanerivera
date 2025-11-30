import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MainImageContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  min-height: 400px;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const MainImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
`;

const NavButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.8);
    border-color: rgba(0, 212, 255, 1);
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.7);
    }
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    ${props => props.direction === 'left' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  }
`;

const Counter = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 10;

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const Caption = styled(motion.div)`
  text-align: center;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.95rem;
  padding: 1rem;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.75rem;
  }
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.75rem 0;
  }
`;

const Thumbnail = styled(motion.div)`
  min-width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    min-width: 60px;
    height: 60px;
  }
`;

const ImageGallery = ({ images = [], initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle single image or array of images
  const imageArray = Array.isArray(images) ? images : [{ url: images, caption: '' }];
  const currentImage = imageArray[currentIndex] || imageArray[0];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageArray.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < imageArray.length - 1 ? prev + 1 : 0));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  // Single image - simple display
  if (imageArray.length === 1) {
    return (
      <GalleryContainer>
        <MainImageContainer>
          <MainImage
            src={currentImage.url}
            alt={currentImage.caption || 'Image'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </MainImageContainer>
        {currentImage.caption && (
          <Caption
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentImage.caption}
          </Caption>
        )}
      </GalleryContainer>
    );
  }

  // Multiple images - gallery with navigation
  return (
    <GalleryContainer onKeyDown={handleKeyPress} tabIndex={0}>
      <MainImageContainer>
        <AnimatePresence mode="wait">
          <MainImage
            key={currentIndex}
            src={currentImage.url}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        <Counter>
          {currentIndex + 1} / {imageArray.length}
        </Counter>

        <NavButton
          direction="left"
          onClick={handlePrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiChevronLeft size={24} />
        </NavButton>

        <NavButton
          direction="right"
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiChevronRight size={24} />
        </NavButton>
      </MainImageContainer>

      {currentImage.caption && (
        <Caption
          key={`caption-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentImage.caption}
        </Caption>
      )}

      {imageArray.length > 1 && (
        <ThumbnailStrip>
          {imageArray.map((image, index) => (
            <Thumbnail
              key={index}
              active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={image.url} alt={image.caption || `Thumbnail ${index + 1}`} />
            </Thumbnail>
          ))}
        </ThumbnailStrip>
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;
