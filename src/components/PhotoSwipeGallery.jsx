import { Gallery, Item } from 'react-photoswipe-gallery';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import 'photoswipe/dist/photoswipe.css';

const GalleryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;
`;

const MainImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  min-height: 400px;
  cursor: zoom-in;
  position: relative;
  max-width: 100%;
  width: 100%;

  @media (max-width: 768px) {
    min-height: 300px;
    border-radius: 8px;
  }
`;

const MainImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ZoomHint = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 10;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  width: 100%;
  
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
    -webkit-overflow-scrolling: touch;
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
  position: relative;

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

const ImageCounter = styled.div`
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

const PhotoSwipeGallery = ({ images = [], initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [showHint, setShowHint] = React.useState(true);
  const [imageDimensions, setImageDimensions] = React.useState({});
  const [dimensionsLoaded, setDimensionsLoaded] = React.useState(false);

  // Normalize images to ensure they have required properties
  const normalizedImages = Array.isArray(images) 
    ? images.map(img => ({
        url: typeof img === 'string' ? img : img.url,
        caption: typeof img === 'string' ? '' : (img.caption || ''),
        width: img.width || 1920,
        height: img.height || 1080
      }))
    : [{ url: images, caption: '', width: 1920, height: 1080 }];

  // Reset state when images change
  React.useEffect(() => {
    setImageDimensions({});
    setDimensionsLoaded(false);
    setCurrentIndex(initialIndex);
  }, [images, initialIndex]);

  // Load actual image dimensions
  React.useEffect(() => {
    let loadedCount = 0;
    const totalImages = normalizedImages.length;
    let isMounted = true;

    normalizedImages.forEach((img, index) => {
      const image = new Image();
      image.onload = () => {
        if (!isMounted) return;
        setImageDimensions(prev => ({
          ...prev,
          [index]: { width: image.naturalWidth, height: image.naturalHeight }
        }));
        loadedCount++;
        if (loadedCount === totalImages) {
          setDimensionsLoaded(true);
        }
      };
      image.onerror = () => {
        if (!isMounted) return;
        // If image fails to load, use fallback dimensions
        setImageDimensions(prev => ({
          ...prev,
          [index]: { width: 1920, height: 1080 }
        }));
        loadedCount++;
        if (loadedCount === totalImages) {
          setDimensionsLoaded(true);
        }
      };
      image.src = img.url;
    });

    return () => {
      isMounted = false;
    };
  }, [images]);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const currentImage = normalizedImages[currentIndex] || normalizedImages[0];

  // Show loading state while dimensions are being detected
  if (!dimensionsLoaded) {
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
          <ZoomHint show={true}>
            Loading image...
          </ZoomHint>
        </MainImageContainer>
      </GalleryContainer>
    );
  }

  // Single image - simple display with zoom
  if (normalizedImages.length === 1) {
    return (
      <GalleryContainer>
        <Gallery
          options={{
            zoom: true,
            loop: false,
            showHideAnimationType: 'zoom',
            bgOpacity: 0.95,
            padding: { top: 50, bottom: 50, left: 50, right: 50 }
          }}
        >
          <Item
            original={currentImage.url}
            thumbnail={currentImage.url}
            width={imageDimensions[0]?.width || currentImage.width}
            height={imageDimensions[0]?.height || currentImage.height}
            caption={currentImage.caption}
          >
            {({ ref, open }) => (
              <MainImageContainer onClick={open}>
                <MainImage
                  ref={ref}
                  src={currentImage.url}
                  alt={currentImage.caption || 'Image'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <ZoomHint show={showHint}>
                  Click to zoom and explore
                </ZoomHint>
              </MainImageContainer>
            )}
          </Item>
        </Gallery>
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

  // Multiple images - gallery with thumbnails
  return (
    <GalleryContainer>
      <Gallery
        options={{
          zoom: true,
          loop: true,
          showHideAnimationType: 'zoom',
          bgOpacity: 0.95,
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          // Enable keyboard navigation
          arrowKeys: true,
          // Enable pinch to zoom on mobile
          pinchToClose: true,
          closeOnVerticalDrag: true,
          // Prevent stretching - maintain aspect ratio
          imageClickAction: 'zoom',
          tapAction: 'zoom',
          doubleTapAction: 'zoom',
          // Allow exploring beyond bounds
          allowPanToNext: false,
          // Better zoom behavior
          maxZoomLevel: 4,
          initialZoomLevel: 'fit'
        }}
      >
        <MainImageContainer>
          <Item
            original={currentImage.url}
            thumbnail={currentImage.url}
            width={imageDimensions[currentIndex]?.width || currentImage.width}
            height={imageDimensions[currentIndex]?.height || currentImage.height}
            caption={currentImage.caption}
          >
            {({ ref, open }) => (
              <>
                <MainImage
                  ref={ref}
                  src={currentImage.url}
                  alt={currentImage.caption || `Image ${currentIndex + 1}`}
                  onClick={open}
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <ImageCounter>
                  {currentIndex + 1} / {normalizedImages.length}
                </ImageCounter>
                <ZoomHint show={showHint}>
                  Click to zoom • Swipe to navigate
                </ZoomHint>
              </>
            )}
          </Item>
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

        <ThumbnailStrip>
          {normalizedImages.map((image, index) => (
            <Item
              key={index}
              original={image.url}
              thumbnail={image.url}
              width={imageDimensions[index]?.width || image.width}
              height={imageDimensions[index]?.height || image.height}
              caption={image.caption}
            >
              {({ ref, open }) => (
                <Thumbnail
                  ref={ref}
                  active={index === currentIndex}
                  onClick={() => {
                    setCurrentIndex(index);
                    open();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={image.url} alt={image.caption || `Thumbnail ${index + 1}`} />
                </Thumbnail>
              )}
            </Item>
          ))}
        </ThumbnailStrip>
      </Gallery>
    </GalleryContainer>
  );
};

// Add React import at the top
import React from 'react';

export default PhotoSwipeGallery;
