import React, { useEffect } from 'react';
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  overflow: hidden;
`;

const ModalImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 1002;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
  pointer-events: none;
`;

const NavButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  pointer-events: all;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const MobileToggleButton = styled.button`
  display: none;
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: ${props => props.theme.colors.primary};
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
  z-index: 1002;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(0, 212, 255, 0.5);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  imageAlt, 
  children,
  onNext,
  onPrev,
  hasNext = true,
  hasPrev = true,
  sidebarOpen,
  onToggleSidebar
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev?.();
      if (e.key === 'ArrowRight' && hasNext) onNext?.();
      if (e.key === 'i' || e.key === 'I') onToggleSidebar?.();
    };

    const handleBodyScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('keydown', handleKeyPress);
    handleBodyScroll();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev, onToggleSidebar]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalImageSection onClick={(e) => e.stopPropagation()}>
        <ModalImage src={imageUrl} alt={imageAlt} />
        
        {(onNext || onPrev) && (
          <NavigationButtons>
            <NavButton 
              onClick={onPrev}
              disabled={!hasPrev}
            >
              ‹
            </NavButton>
            <NavButton 
              onClick={onNext}
              disabled={!hasNext}
            >
              ›
            </NavButton>
          </NavigationButtons>
        )}

        {onToggleSidebar && (
          <MobileToggleButton onClick={onToggleSidebar}>
            ℹ️
          </MobileToggleButton>
        )}
      </ModalImageSection>

      {children}

      <CloseButton onClick={onClose}>&times;</CloseButton>
    </ModalOverlay>
  );
};

export default Modal;