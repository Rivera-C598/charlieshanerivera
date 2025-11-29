import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.lightText};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const Message = styled.p`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ItemCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
  font-weight: 600;
`;

const ItemDescription = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.gradients.primary};
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: ${props.theme.colors.text};
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FeaturedLimitModal = ({ isOpen, onClose, featuredItems, onUnfeature, type = 'project' }) => {
  const handleUnfeature = (itemId) => {
    onUnfeature(itemId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <Title>Featured Limit Reached</Title>
              <CloseButton onClick={onClose}>
                <FiX size={24} />
              </CloseButton>
            </Header>

            <Message>
              You can only have 2 featured {type}s at a time. Please select one to unfeature:
            </Message>

            <ItemsList>
              {featuredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  onClick={() => handleUnfeature(item.id)}
                >
                  <ItemImage 
                    src={item.imageUrl || 'https://via.placeholder.com/80x60/1a1a2e/00d4ff?text=No+Image'} 
                    alt={item.title} 
                  />
                  <ItemInfo>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDescription>
                      {item.description?.substring(0, 60)}
                      {item.description?.length > 60 ? '...' : ''}
                    </ItemDescription>
                  </ItemInfo>
                  <FiStar size={20} style={{ color: '#00d4ff' }} />
                </ItemCard>
              ))}
            </ItemsList>

            <ButtonGroup>
              <Button onClick={onClose}>
                Cancel
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default FeaturedLimitModal;
