import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiGithub, FiCode, FiSmartphone, FiDatabase, FiGlobe } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import SmartImage from '../components/SmartImage';

const ProjectsContainer = styled.section`
  padding: 8rem 2rem 4rem;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.active ? 
    props.theme.gradients.primary : 
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 
    props.theme.colors.background : 
    props.theme.colors.text};
  border: 2px solid ${props => props.active ? 
    'transparent' : 
    props.theme.colors.primary};
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.active ? 
      props.theme.gradients.primary : 
      props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    transform: translateY(-2px);
  }
`;

const ProjectGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProjectCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const ProjectImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 250px;
`;

const ProjectImage = styled(SmartImage)`
  width: 100%;
  height: 100%;

  img {
    transition: transform 0.3s ease;
  }

  ${ProjectCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.8) 0%,
    rgba(124, 58, 237, 0.8) 100%
  );
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: opacity 0.3s ease;

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const OverlayButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ProjectContent = styled.div`
  padding: 2rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ProjectCategory = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 1.5rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
  background: rgba(124, 58, 237, 0.1);
  color: ${props => props.theme.colors.accent};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.accent};
    transform: translateX(3px);
  }
`;

const projectsData = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce application with user authentication, product management, shopping cart, and payment integration.',
    category: 'Web',
    categoryIcon: FiGlobe,
    // Use local asset for your actual project screenshot
    imageUrl: '/assets/projects/ecommerce-screenshot.webp',
    // Fallback to placeholder if local image doesn't exist
    fallbackUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveLink: 'https://your-project.com',
    sourceLink: 'https://github.com/yourusername/project',
  },
  {
    id: 2,
    title: 'Real-time Chat App',
    description: 'A modern chat application with real-time messaging, file sharing, and video calls using WebRTC and Socket.io.',
    category: 'Web',
    categoryIcon: FiGlobe,
    imageUrl: '/assets/projects/chat-app-screenshot.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2339&auto=format&fit=crop',
    technologies: ['React', 'Socket.io', 'WebRTC', 'Express'],
    liveLink: 'https://your-chat-app.com',
    sourceLink: 'https://github.com/yourusername/chat-app',
    // Optional: Add video demo
    videoUrl: '/assets/projects/chat-app-demo.mp4',
  },
  {
    id: 3,
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for visualizing complex datasets with real-time updates and customizable charts.',
    category: 'Data',
    categoryIcon: FiDatabase,
    imageUrl: '/assets/projects/dashboard-screenshot.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop',
    technologies: ['D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    liveLink: 'https://your-dashboard.com',
    sourceLink: 'https://github.com/yourusername/dashboard',
  },
  {
    id: 4,
    title: 'Mobile Fitness Tracker',
    description: 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics with social features.',
    category: 'Mobile',
    categoryIcon: FiSmartphone,
    imageUrl: '/assets/projects/fitness-app-screenshot.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2340&auto=format&fit=crop',
    technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
    liveLink: 'https://play.google.com/store/apps/details?id=your.app',
    sourceLink: 'https://github.com/yourusername/fitness-app',
  },
  {
    id: 5,
    title: 'AI Code Assistant',
    description: 'VS Code extension that provides intelligent code suggestions and automated refactoring using machine learning.',
    category: 'AI',
    categoryIcon: FiCode,
    imageUrl: '/assets/projects/ai-assistant-screenshot.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2340&auto=format&fit=crop',
    technologies: ['TypeScript', 'Python', 'TensorFlow', 'VS Code API'],
    liveLink: 'https://marketplace.visualstudio.com/items?itemName=your.extension',
    sourceLink: 'https://github.com/yourusername/ai-assistant',
  },
  {
    id: 6,
    title: 'Blockchain Voting System',
    description: 'Secure and transparent voting platform built on Ethereum with smart contracts and decentralized storage.',
    category: 'Web3',
    categoryIcon: FiGlobe,
    imageUrl: '/assets/projects/voting-system-screenshot.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2340&auto=format&fit=crop',
    technologies: ['Solidity', 'Web3.js', 'IPFS', 'MetaMask'],
    liveLink: 'https://your-voting-app.com',
    sourceLink: 'https://github.com/yourusername/voting-system',
  },
];

const filterCategories = [
  { key: 'All', label: 'All Projects', icon: FiCode },
  { key: 'Web', label: 'Web Apps', icon: FiGlobe },
  { key: 'Mobile', label: 'Mobile', icon: FiSmartphone },
  { key: 'Data', label: 'Data Science', icon: FiDatabase },
  { key: 'AI', label: 'AI/ML', icon: FiCode },
  { key: 'Web3', label: 'Web3', icon: FiGlobe },
];

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredProjects = projectsData.filter((project) =>
    filter === 'All' ? true : project.category === filter
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <ProjectsContainer ref={ref}>
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Featured Projects
        </SectionTitle>

        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A showcase of my latest work spanning web development, mobile apps, 
          data science, and creative coding projects.
        </SectionSubtitle>

        <FilterContainer
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filterCategories.map(({ key, label, icon: Icon }) => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => setFilter(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={16} />
              {label}
            </FilterButton>
          ))}
        </FilterContainer>

        <AnimatePresence mode="wait">
          <ProjectGrid
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project, index) => {
              const CategoryIcon = project.categoryIcon;
              return (
                <ProjectCard
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  layout
                >
                  <ProjectImageContainer>
                    <ProjectImage 
                      src={project.imageUrl} 
                      fallbackSrc={project.fallbackUrl}
                      alt={project.title} 
                    />
                    <ProjectOverlay>
                      <OverlayButton
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiExternalLink size={20} />
                      </OverlayButton>
                      <OverlayButton
                        href={project.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiGithub size={20} />
                      </OverlayButton>
                    </ProjectOverlay>
                  </ProjectImageContainer>

                  <ProjectContent>
                    <ProjectHeader>
                      <div>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        <ProjectCategory>
                          <CategoryIcon size={12} />
                          {project.category}
                        </ProjectCategory>
                      </div>
                    </ProjectHeader>

                    <ProjectDescription>{project.description}</ProjectDescription>

                    <TechStack>
                      {project.technologies.map((tech) => (
                        <TechTag key={tech}>{tech}</TechTag>
                      ))}
                    </TechStack>

                    <ProjectLinks>
                      <ProjectLink
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiExternalLink size={16} />
                        Live Demo
                      </ProjectLink>
                      <ProjectLink
                        href={project.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiGithub size={16} />
                        Source Code
                      </ProjectLink>
                    </ProjectLinks>
                  </ProjectContent>
                </ProjectCard>
              );
            })}
          </ProjectGrid>
        </AnimatePresence>
      </Container>
    </ProjectsContainer>
  );
};

export default Projects;