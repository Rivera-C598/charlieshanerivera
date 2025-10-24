import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiDownload, FiArrowDown, FiCode, FiImage } from 'react-icons/fi';

const HeroContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%);
    pointer-events: none;
    animation: backgroundShift 20s ease-in-out infinite;
  }

  @keyframes backgroundShift {
    0% { 
      background: 
        radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%);
    }
    25% { 
      background: 
        radial-gradient(circle at 60% 30%, rgba(0, 212, 255, 0.18) 0%, transparent 50%),
        radial-gradient(circle at 40% 70%, rgba(124, 58, 237, 0.18) 0%, transparent 50%);
    }
    50% { 
      background: 
        radial-gradient(circle at 70% 30%, rgba(0, 212, 255, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 30% 70%, rgba(124, 58, 237, 0.2) 0%, transparent 50%);
    }
    75% { 
      background: 
        radial-gradient(circle at 40% 25%, rgba(0, 212, 255, 0.18) 0%, transparent 50%),
        radial-gradient(circle at 60% 75%, rgba(124, 58, 237, 0.18) 0%, transparent 50%);
    }
    100% { 
      background: 
        radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%);
    }
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
`;

const HeroSubtitle = styled(motion.div)`
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
  font-weight: 300;
`;

const TypewriterText = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: '|';
    animation: blink 1s infinite;
    margin-left: 2px;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const RoleIcon = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  color: ${props => props.theme.colors.secondary};
`;

const HeroDescription = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.8;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.theme.gradients.primary};
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.glow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glowHover};
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 280px;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const SecondaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 280px;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 3rem;
  }
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    transform: translateY(-3px);
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.lightText};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ScrollText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const roles = [
  { text: 'Full-Stack Developer', icon: FiCode },
  { text: 'Digital Artist', icon: FiImage },
  { text: 'Problem Solver', icon: FiCode }
];

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const currentFullText = roles[currentRole].text;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRole]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hi, I'm Charlie Shane Rivera
        </HeroTitle>

        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          I'm a{' '}
          <TypewriterText>
            <AnimatePresence mode="wait">
              <RoleIcon
                key={currentRole}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(roles[currentRole].icon, { size: 24 })}
              </RoleIcon>
            </AnimatePresence>
            {displayText}
          </TypewriterText>
        </HeroSubtitle>

        <HeroDescription
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Crafting digital experiences that blend innovative technology with artistic vision.
          I build interactive applications, create stunning visuals, and solve problems
        </HeroDescription>

        <ButtonGroup
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <PrimaryButton
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Works
          </PrimaryButton>

          <SecondaryButton
            href="/resume.pdf"
            target="_blank"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload size={18} />
            Download Resume
          </SecondaryButton>
        </ButtonGroup>

        <SocialLinks
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SocialLink
            href="https://github.com/Rivera/C598"
            target="_blank"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiGithub size={20} />
          </SocialLink>

          <SocialLink
            href="https://ph.linkedin.com/in/charlie-shane-rivera-5071081bb"
            target="_blank"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiLinkedin size={20} />
          </SocialLink>

          <SocialLink
            href="https://www.artstation.com/rvrcharles"
            target="_blank"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiImage size={20} />
          </SocialLink>
        </SocialLinks>
      </HeroContent>

      <ScrollIndicator
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <ScrollText>Scroll to explore</ScrollText>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiArrowDown size={20} />
        </motion.div>
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default Hero;