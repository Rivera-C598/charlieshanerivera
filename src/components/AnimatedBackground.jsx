import styled from '@emotion/styled';

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
    animation: backgroundFlow 30s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 80% 40%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 60%, rgba(0, 212, 255, 0.08) 0%, transparent 50%);
    animation: backgroundFlow 35s cubic-bezier(0.4, 0, 0.6, 1) infinite reverse;
  }

  @keyframes backgroundFlow {
    0% { 
      background: 
        radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
    }
    12.5% { 
      background: 
        radial-gradient(circle at 45% 25%, rgba(0, 212, 255, 0.11) 0%, transparent 50%),
        radial-gradient(circle at 55% 75%, rgba(124, 58, 237, 0.11) 0%, transparent 50%);
    }
    25% { 
      background: 
        radial-gradient(circle at 60% 30%, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 40% 70%, rgba(124, 58, 237, 0.12) 0%, transparent 50%);
    }
    37.5% { 
      background: 
        radial-gradient(circle at 70% 40%, rgba(0, 212, 255, 0.13) 0%, transparent 50%),
        radial-gradient(circle at 30% 60%, rgba(124, 58, 237, 0.13) 0%, transparent 50%);
    }
    50% { 
      background: 
        radial-gradient(circle at 75% 50%, rgba(0, 212, 255, 0.14) 0%, transparent 50%),
        radial-gradient(circle at 25% 50%, rgba(124, 58, 237, 0.14) 0%, transparent 50%);
    }
    62.5% { 
      background: 
        radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.13) 0%, transparent 50%),
        radial-gradient(circle at 30% 40%, rgba(124, 58, 237, 0.13) 0%, transparent 50%);
    }
    75% { 
      background: 
        radial-gradient(circle at 60% 70%, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 40% 30%, rgba(124, 58, 237, 0.12) 0%, transparent 50%);
    }
    87.5% { 
      background: 
        radial-gradient(circle at 45% 75%, rgba(0, 212, 255, 0.11) 0%, transparent 50%),
        radial-gradient(circle at 55% 25%, rgba(124, 58, 237, 0.11) 0%, transparent 50%);
    }
    100% { 
      background: 
        radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
    }
  }
`;

export default AnimatedBackground;