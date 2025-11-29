import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const ToastContainer = styled(motion.div)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
`;

const ToastItem = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return 'rgba(34, 197, 94, 0.3)';
      case 'error': return 'rgba(239, 68, 68, 0.3)';
      case 'warning': return 'rgba(251, 191, 36, 0.3)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.text};
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'warning': return '#fbbf24';
      default: return props.theme.colors.primary;
    }
  }};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Message = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.lightText};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 'success': return <FiCheckCircle size={24} />;
    case 'error': return <FiXCircle size={24} />;
    case 'warning': return <FiAlertCircle size={24} />;
    default: return <FiAlertCircle size={24} />;
  }
};

export const Toast = ({ id, type = 'info', title, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <ToastItem
      type={type}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <IconWrapper type={type}>
        {getIcon(type)}
      </IconWrapper>
      <Content>
        {title && <Title>{title}</Title>}
        {message && <Message>{message}</Message>}
      </Content>
      <CloseButton onClick={() => onClose(id)}>
        <FiX size={18} />
      </CloseButton>
    </ToastItem>
  );
};

export const ToastProvider = ({ toasts, onClose }) => {
  return (
    <ToastContainer>
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </ToastContainer>
  );
};
