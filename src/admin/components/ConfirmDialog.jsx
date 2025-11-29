import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

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

const Dialog = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: ${props => props.theme.colors.lightText};
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${props => props.theme.colors.text};
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.variant === 'danger' ? 
    'rgba(255, 107, 107, 0.1)' : 
    'rgba(0, 212, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: ${props => props.variant === 'danger' ? 
    props.theme.colors.secondary : 
    props.theme.colors.primary};
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.gradients.primary};
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
    }
  ` : props.variant === 'danger' ? `
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
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

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // 'primary' or 'danger'
  loading = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Dialog
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FiX size={18} />
            </CloseButton>

            <IconWrapper variant={variant}>
              <FiAlertTriangle size={28} />
            </IconWrapper>

            <Title>{title}</Title>
            <Message>{message}</Message>

            <Actions>
              <Button onClick={onClose} disabled={loading}>
                {cancelText}
              </Button>
              <Button 
                variant={variant} 
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? 'Processing...' : confirmText}
              </Button>
            </Actions>
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
