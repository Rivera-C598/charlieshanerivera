import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiCode, FiImage, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import AnimatedBackground from './AnimatedBackground';
import { Modal, Sidebar } from './Modal';
import { Section, SectionTitle, Description, TagsContainer, Tag } from './UI/Section';
import { useModal } from '../hooks/useModal';

const ProjectsContainer = styled.section`
  padding: 8rem 2rem;
  background: ${props => props.theme.gradients.dark};
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const MainSectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
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



const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.large};
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover .project-overlay {
    opacity: 1;
  }
`;

const SpecialArtCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.1) 0%, 
    rgba(124, 58, 237, 0.1) 50%, 
    rgba(255, 107, 107, 0.1) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: visible;
  border: 2px solid rgba(0, 212, 255, 0.3);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  user-select: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.2) 0%, transparent 70%),
      radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
    animation: artGlow 4s ease-in-out infinite alternate;
    pointer-events: none;
    border-radius: 20px;
  }

  &:hover {
    transform: translateY(-25px) translateZ(50px) rotateX(5deg) scale(1.08);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 0 80px rgba(0, 212, 255, 0.4),
      0 0 120px rgba(124, 58, 237, 0.3);
    border-color: rgba(0, 212, 255, 0.8);
  }

  &[data-theme="fire"]:hover {
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 0 80px rgba(255, 68, 68, 0.5),
      0 0 120px rgba(255, 136, 0, 0.3);
    border-color: rgba(255, 68, 68, 0.8);
  }

  &[data-theme="void"]:hover {
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 0 80px rgba(139, 0, 255, 0.5),
      0 0 120px rgba(74, 14, 78, 0.4);
    border-color: rgba(139, 0, 255, 0.8);
  }

  &:hover img {
    transform: translateZ(30px) scale(1.1);
  }

  @keyframes artGlow {
    0% { opacity: 0.3; }
    100% { opacity: 0.7; }
  }
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${props => props.show ? 0.7 : 0};
  transition: opacity 0.4s ease;
  z-index: 1;
  border-radius: 20px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
    if (props.theme === 'fire') {
      return `radial-gradient(ellipse at bottom, 
          rgba(255, 68, 68, 0.2) 0%, 
          rgba(255, 102, 0, 0.15) 30%, 
          transparent 70%)`;
    } else if (props.theme === 'void') {
      return `radial-gradient(ellipse at center, 
          rgba(74, 14, 78, 0.3) 0%, 
          rgba(45, 27, 105, 0.2) 30%, 
          rgba(26, 0, 51, 0.1) 60%,
          transparent 80%)`;
    }
    return 'transparent';
  }};
    opacity: ${props => props.show ? 1 : 0};
    transition: opacity 0.4s ease;
  }
`;

const ArtTitle = styled(motion.div)`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)'};
  transition: all 0.4s ease;
  z-index: 5;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  border: ${props => {
    if (props.theme === 'fire') {
      return '1px solid rgba(255, 68, 68, 0.4)';
    } else if (props.theme === 'void') {
      return '1px solid rgba(139, 0, 255, 0.4)';
    }
    return '1px solid rgba(255, 107, 107, 0.3)';
  }};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const ArtTitleText = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  background: ${props => {
    if (props.theme === 'fire') {
      return 'linear-gradient(135deg, #ff4444 0%, #ff8800 50%, #ffaa00 100%)';
    } else if (props.theme === 'void') {
      return 'linear-gradient(135deg, #8b00ff 0%, #4a0e4e 50%, #2d1b69 100%)';
    }
    return 'linear-gradient(135deg, #ff4444 0%, #ff8800 50%, #ffaa00 100%)';
  }};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  white-space: nowrap;
`;

const SpecialArtImage = styled.img`
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.4));
  z-index: 3;
  position: relative;
  transform-style: preserve-3d;
`;



const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 4;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0, 212, 255, 0.3), rgba(124, 58, 237, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  backdrop-filter: blur(2px);
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

const ProjectType = styled.span`
  background: ${props => props.type === 'code' ?
    'rgba(0, 212, 255, 0.1)' :
    'rgba(255, 107, 107, 0.1)'};
  color: ${props => props.type === 'code' ?
    props.theme.colors.primary :
    props.theme.colors.secondary};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 1.5rem;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ProjectTag = styled.span`
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.lightText};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const CategorySection = styled(motion.div)`
  margin-bottom: 8rem;

  &:last-child {
    margin-bottom: 4rem;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CategoryTitle = styled.h3`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const ViewAllButton = styled(motion.create(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;



const featuredProjects = {
  code: [
    {
      title: "Divide & Regret",
      description: "An unnecessary class divider utility that makes it easy for teachers to group their class. It's overly engineered but fun!",
      imageUrl: "/assets/projects/divide-regret.png",
      tags: ["TypeScript", "React", "Firebase"],
      type: "code",
      liveLink: "https://divreg--divide-and-regret.asia-southeast1.hosted.app/"
    },
    {
      title: "Per Quaestio Cognitia",
      description: "AI-powered exam generator that creates customized tests and assessments using advanced AI technology.",
      imageUrl: "/assets/projects/per-quaestio-cognitia.png",
      tags: ["TypeScript", "React", "Genkit AI", "Gemini"],
      type: "code",
      liveLink: null
    }
  ],
  art: [
    {
      title: "Ashes Beneath the Orbit's Roar",
      description: "My best work so far - a powerful character piece that showcases advanced digital art techniques and storytelling.",
      imageUrl: "/assets/art/ashes-beneath-orbits-roar.png", // Transparent version for featured card
      galleryImageUrl: "/assets/art/ashes-beneath-orbits-roar-bg.png", // Background version for gallery
      tags: ["Character Design", "Digital Art", "Concept Art"],
      type: "art",
      isTransparent: true,
      featured: true
    },
    {
      title: "Celes - Remastered",
      description: "An original character design showcasing detailed illustration work and character development mastery.",
      imageUrl: "/assets/art/celes-remastered.png", // Transparent version for featured card
      galleryImageUrl: "/assets/art/celes-remastered-bg.png", // Background version for gallery
      tags: ["Original Character", "Character Design", "Digital Art"],
      type: "art",
      isTransparent: true,
      featured: true
    }
  ]
};

const FeaturedProjects = () => {
  const [hoveredArt, setHoveredArt] = useState(null);
  const [touchedArt, setTouchedArt] = useState(null);
  const touchTimeoutRef = useRef(null);

  // Combine all featured projects for modal functionality
  const allFeaturedProjects = [...featuredProjects.code, ...featuredProjects.art];
  const modal = useModal(allFeaturedProjects);

  // Touch handlers for mobile art effects
  const handleArtTouchStart = (project) => {
    touchTimeoutRef.current = setTimeout(() => {
      setTouchedArt(project);
      setHoveredArt(project); // Also set hovered for the effects
    }, 500); // 500ms hold to trigger
  };

  const handleArtTouchEnd = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    // Keep effects for a bit longer on mobile
    setTimeout(() => {
      setTouchedArt(null);
      setHoveredArt(null);
    }, 1500);
  };

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const getParticleConfig = (artworkTitle) => {
    if (artworkTitle === "Ashes Beneath the Orbit's Roar") {
      // Fire effect for Ashes
      return {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: { events: { onClick: { enable: false }, onHover: { enable: false }, resize: true } },
        particles: {
          color: { value: ["#ff4444", "#ff6600", "#ff8800", "#ffaa00"] },
          move: {
            direction: "top",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: { min: 1, max: 3 },
            straight: false,
            wobble: { distance: 8, enable: true, speed: 2 },
          },
          number: { density: { enable: true, area: 600 }, value: 35 },
          opacity: {
            value: { min: 0.3, max: 0.7 },
            animation: { enable: true, speed: 2, minimumValue: 0.1 },
          },
          shape: { type: "circle" },
          size: {
            value: { min: 2, max: 6 },
            animation: { enable: true, speed: 3, minimumValue: 1 },
          },
          life: { duration: { sync: false, value: 3 }, count: 0 },
        },
        detectRetina: true,
      };
    } else if (artworkTitle === "Celes - Remastered") {
      // Dark void/black hole effect for Celes
      return {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: { events: { onClick: { enable: false }, onHover: { enable: false }, resize: true } },
        particles: {
          color: { value: ["#4a0e4e", "#2d1b69", "#1a0033", "#6a0dad", "#8b00ff"] },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: true,
            speed: { min: 0.5, max: 2 },
            straight: false,
            attract: { enable: true, rotateX: 600, rotateY: 1200 },
          },
          number: { density: { enable: true, area: 800 }, value: 40 },
          opacity: {
            value: { min: 0.2, max: 0.8 },
            animation: { enable: true, speed: 1, minimumValue: 0.1 },
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: 4 },
            animation: { enable: true, speed: 2, minimumValue: 0.5 },
          },
          life: { duration: { sync: false, value: 4 }, count: 0 },
        },
        detectRetina: true,
      };
    }
    return {};
  };

  return (
    <ProjectsContainer>
      <AnimatedBackground />
      <Container>
        <MainSectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Featured Works
        </MainSectionTitle>

        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          A curated selection of my latest projects spanning development and digital art
        </SectionSubtitle>

        {/* Development Projects Section */}
        <CategorySection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <CategoryHeader>
            <CategoryTitle>
              <FiCode size={24} />
              Development Projects
            </CategoryTitle>
            <ViewAllButton
              to="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Projects
              <FiArrowRight size={16} />
            </ViewAllButton>
          </CategoryHeader>

          <ProjectsGrid>
            {featuredProjects.code.map((project, index) => (
              <ProjectCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => modal.openModal(project)}
              >
                <div style={{ position: 'relative' }}>
                  <ProjectImage src={project.imageUrl} alt={project.title} />
                  <ProjectOverlay className="project-overlay">
                    <FiExternalLink size={24} />
                  </ProjectOverlay>
                </div>

                <ProjectContent>
                  <ProjectHeader>
                    <div>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectType type={project.type}>
                        <FiCode size={14} />
                        Development
                      </ProjectType>
                    </div>
                  </ProjectHeader>

                  <ProjectDescription>{project.description}</ProjectDescription>

                  <ProjectTags>
                    {project.tags.map((tag, tagIndex) => (
                      <ProjectTag key={tagIndex}>{tag}</ProjectTag>
                    ))}
                  </ProjectTags>
                </ProjectContent>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </CategorySection>

        {/* Digital Art Section */}
        <CategorySection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <CategoryHeader>
            <CategoryTitle>
              <FiImage size={24} />
              Digital Art
            </CategoryTitle>
            <ViewAllButton
              to="/art"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Art Gallery
              <FiArrowRight size={16} />
            </ViewAllButton>
          </CategoryHeader>

          <ProjectsGrid>
            {featuredProjects.art.map((project, index) => {
              const isHovered = hoveredArt?.title === project.title;
              const theme = project.title === "Ashes Beneath the Orbit's Roar" ? 'fire' : 'void';

              return project.isTransparent ? (
                <SpecialArtCard
                  key={index}
                  data-theme={theme}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true, amount: 0.2 }}
                  onMouseEnter={() => setHoveredArt(project)}
                  onMouseLeave={() => setHoveredArt(null)}
                  onTouchStart={() => handleArtTouchStart(project)}
                  onTouchEnd={handleArtTouchEnd}
                  onTouchCancel={handleArtTouchEnd}
                  onClick={() => {
                    // For special art cards, show the background version in modal
                    const modalProject = {
                      ...project,
                      imageUrl: project.galleryImageUrl || project.imageUrl
                    };
                    modal.openModal(modalProject);
                  }}
                >
                  <FeaturedBadge>✨ Featured</FeaturedBadge>
                  <ParticlesContainer show={isHovered} theme={theme}>
                    <Particles
                      id={`particles-${index}`}
                      init={particlesInit}
                      options={getParticleConfig(project.title)}
                    />
                  </ParticlesContainer>
                  <SpecialArtImage src={project.imageUrl} alt={project.title} />
                  {/* Art title hidden as requested */}
                </SpecialArtCard>
              ) : (
                <ProjectCard
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  onTouchStart={() => handleArtTouchStart(project)}
                  onTouchEnd={handleArtTouchEnd}
                  onTouchCancel={handleArtTouchEnd}
                  onClick={() => modal.openModal(project)}
                >
                  <div style={{ position: 'relative' }}>
                    <ProjectImage src={project.imageUrl} alt={project.title} />
                    <ProjectOverlay className="project-overlay">
                      <FiExternalLink size={24} />
                    </ProjectOverlay>
                  </div>

                  <ProjectContent>
                    <ProjectHeader>
                      <div>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        <ProjectType type={project.type}>
                          <FiImage size={14} />
                          Digital Art
                        </ProjectType>
                      </div>
                    </ProjectHeader>

                    <ProjectDescription>{project.description}</ProjectDescription>

                    <ProjectTags>
                      {project.tags.map((tag, tagIndex) => (
                        <ProjectTag key={tagIndex}>{tag}</ProjectTag>
                      ))}
                    </ProjectTags>
                  </ProjectContent>
                </ProjectCard>
              );
            })}
          </ProjectsGrid>
        </CategorySection>
      </Container>

      {/* Modal for project details */}
      {modal.selectedItem && (
        <Modal
          isOpen={modal.isOpen}
          onClose={modal.closeModal}
          imageUrl={modal.selectedItem.imageUrl}
          imageAlt={modal.selectedItem.title}
          onNext={modal.navigateNext}
          onPrev={modal.navigatePrev}
          hasNext={modal.hasNext}
          hasPrev={modal.hasPrev}
          sidebarOpen={modal.sidebarOpen}
          onToggleSidebar={modal.toggleSidebar}
        >
          <Sidebar
            isOpen={modal.sidebarOpen}
            width="450px"
            onClick={(e) => e.stopPropagation()}
            header={
              <>
                <h2 style={{
                  fontSize: '1.8rem',
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  {modal.selectedItem.title}
                </h2>
                <span style={{
                  display: 'inline-block',
                  background: modal.selectedItem.type === 'code' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                  color: modal.selectedItem.type === 'code' ? '#00d4ff' : '#ff6b6b',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {modal.selectedItem.type === 'code' ? 'Development' : 'Digital Art'}
                </span>
              </>
            }
          >
            <Section>
              <SectionTitle>Description</SectionTitle>
              <Description>{modal.selectedItem.description}</Description>
            </Section>

            <Section>
              <SectionTitle>Technologies</SectionTitle>
              <TagsContainer>
                {modal.selectedItem.tags.map((tag) => (
                  <Tag key={tag} variant="accent">{tag}</Tag>
                ))}
              </TagsContainer>
            </Section>

            {modal.selectedItem.type === 'code' && modal.selectedItem.liveLink && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <a
                  href={modal.selectedItem.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '25px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    flex: '1',
                    textAlign: 'center'
                  }}
                >
                  🔗 Live Demo
                </a>
              </div>
            )}
          </Sidebar>
        </Modal>
      )}
    </ProjectsContainer>
  );
};

export default FeaturedProjects;