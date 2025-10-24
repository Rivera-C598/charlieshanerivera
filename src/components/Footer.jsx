import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiHeart, FiGithub, FiLinkedin, FiImage } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: ${props => props.theme.gradients.dark};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem 2rem;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const LikeSection = styled.div`
  margin-bottom: 2rem;
`;

const LikeButton = styled(motion.button)`
  background: ${props => props.liked ? 
    'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)' : 
    'rgba(255, 107, 107, 0.1)'};
  border: 2px solid ${props => props.liked ? '#ff6b6b' : 'rgba(255, 107, 107, 0.3)'};
  color: ${props => props.liked ? 'white' : '#ff6b6b'};
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    background: ${props => props.liked ? 
      'linear-gradient(135deg, #ff5252 0%, #ff7979 100%)' : 
      'rgba(255, 107, 107, 0.2)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const LikeCount = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
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

const Copyright = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: 0.9rem;
  margin: 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Footer = () => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // Load likes from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('portfolio-likes');
    const userLiked = localStorage.getItem('user-liked-portfolio');
    
    if (savedLikes) {
      setLikes(parseInt(savedLikes, 10));
    } else {
      // Set initial likes count
      setLikes(0);
      localStorage.setItem('portfolio-likes', '0');
    }
    
    if (userLiked === 'true') {
      setLiked(true);
    }
  }, []);

  const handleLike = () => {
    if (!liked) {
      // User is liking for the first time
      const newLikes = likes + 1;
      setLikes(newLikes);
      setLiked(true);
      localStorage.setItem('portfolio-likes', newLikes.toString());
      localStorage.setItem('user-liked-portfolio', 'true');
    } else {
      // User is unliking
      const newLikes = likes - 1;
      setLikes(newLikes);
      setLiked(false);
      localStorage.setItem('portfolio-likes', newLikes.toString());
      localStorage.setItem('user-liked-portfolio', 'false');
    }
  };

  return (
    <FooterContainer>
      <Container>
        <LikeSection>
          <LikeButton
            liked={liked}
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHeart 
              size={20} 
              fill={liked ? 'currentColor' : 'none'}
            />
            {liked ? 'Thanks for the love!' : 'Like this portfolio'}
          </LikeButton>
          <LikeCount>
            {likes} {likes === 1 ? 'person likes' : 'people like'} this portfolio
          </LikeCount>
        </LikeSection>

        <SocialLinks>
          <SocialLink
            href="https://github.com/Rivera/C598"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiGithub size={20} />
          </SocialLink>
          <SocialLink
            href="https://ph.linkedin.com/in/charlie-shane-rivera-5071081bb"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiLinkedin size={20} />
          </SocialLink>
          <SocialLink
            href="https://www.artstation.com/rvrcharles"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiImage size={20} />
          </SocialLink>
        </SocialLinks>

        <Copyright>
          © 2025 Charlie Shane Rivera
        </Copyright>
      </Container>
    </FooterContainer>
  );
};

export default Footer;