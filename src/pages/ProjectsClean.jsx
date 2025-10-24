import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Modal, Sidebar } from '../components/Modal';
import { Section, SectionTitle, Description, MetadataGrid, MetadataItem, MetadataLabel, MetadataValue, TagsContainer, Tag } from '../components/UI/Section';
import { useModal } from '../hooks/useModal';
import { projectsData, filterCategories } from '../data/projects';
import AnimatedBackground from '../components/AnimatedBackground';

// Page-specific styled components
const ProjectsContainer = styled.section`
  padding: var(--spacing-4xl) var(--spacing-lg) var(--spacing-2xl);
  min-height: 100vh;
  background: var(--gradient-dark);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const PageTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
`;

const PageSubtitle = styled(motion.p)`
  text-align: center;
  font-size: var(--font-xl);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-2xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
`;

const FilterButton = styled(({ active, ...props }) => <motion.button {...props} />)`
  background: ${props => props.active ? 
    'var(--gradient-primary)' : 
    'var(--color-white-10)'};
  color: ${props => props.active ? 
    'var(--color-background)' : 
    'var(--color-text)'};
  border: 2px solid ${props => props.active ? 
    'transparent' : 
    'var(--color-primary)'};
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 
      'var(--gradient-primary)' : 
      'var(--color-primary)'};
    color: var(--color-background);
    transform: translateY(-2px);
  }
`;

const ProjectGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const ProjectCard = styled(motion.div)`
  background: var(--gradient-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-white-10);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-large);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ProjectContent = styled.div`
  padding: 2rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ProjectCategory = styled.span`
  display: inline-block;
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 1.5rem;
`;

// Modal-specific components
const ProjectModalTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  color: ${props => props.theme.colors.lightText};
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;

  &:before {
    content: '✓';
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
    margin-right: 0.5rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ChallengeSection = styled.div`
  background: rgba(255, 107, 107, 0.05);
  border-left: 3px solid ${props => props.theme.colors.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const SolutionSection = styled.div`
  background: rgba(16, 185, 129, 0.05);
  border-left: 3px solid ${props => props.theme.colors.success};
  border-radius: 8px;
  padding: 1.5rem;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ProjectLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.primary ? props.theme.gradients.primary : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const CrossNavigation = styled(motion.div)`
  margin-top: 6rem;
  display: flex;
  justify-content: center;
`;

const CrossNavCard = styled.div`
  background: var(--gradient-card);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
`;

const CrossNavTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CrossNavDescription = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CrossNavButton = styled(motion.create(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gradient-primary);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-glow);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow-hover);
  }
`;

const ProjectsClean = () => {
  const [filter, setFilter] = useState('All');
  const modal = useModal(projectsData);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = projectsData.filter((project) =>
    filter === 'All' ? true : project.category === filter
  );

  const renderProjectModal = () => {
    if (!modal.selectedItem) return null;

    const project = modal.selectedItem;

    return (
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        imageUrl={project.imageUrl}
        imageAlt={project.title}
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
              <ProjectModalTitle>{project.title}</ProjectModalTitle>
              <ProjectCategory>{project.category}</ProjectCategory>
            </>
          }
        >
          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{project.longDescription}</Description>
          </Section>

          <Section>
            <SectionTitle>Details</SectionTitle>
            <MetadataGrid>
              <MetadataItem>
                <MetadataLabel>Duration</MetadataLabel>
                <MetadataValue>{project.duration}</MetadataValue>
              </MetadataItem>
              <MetadataItem>
                <MetadataLabel>Role</MetadataLabel>
                <MetadataValue>{project.role}</MetadataValue>
              </MetadataItem>
            </MetadataGrid>
          </Section>

          <Section>
            <SectionTitle>Technologies</SectionTitle>
            <TagsContainer>
              {project.technologies.map((tech) => (
                <Tag key={tech} variant="accent">{tech}</Tag>
              ))}
            </TagsContainer>
          </Section>

          <Section>
            <SectionTitle>Key Features</SectionTitle>
            <FeaturesList>
              {project.features.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </FeaturesList>
          </Section>

          <Section>
            <SectionTitle>Challenges & Solutions</SectionTitle>
            <ChallengeSection>
              <Description><strong>Challenge:</strong> {project.challenges}</Description>
            </ChallengeSection>
            <SolutionSection>
              <Description><strong>Solution:</strong> {project.solution}</Description>
            </SolutionSection>
          </Section>

          <ProjectLinks>
            {project.liveLink && (
              <ProjectLink href={project.liveLink} target="_blank" primary>
                🔗 Live Demo
              </ProjectLink>
            )}
          </ProjectLinks>
        </Sidebar>
      </Modal>
    );
  };

  return (
    <ProjectsContainer>
      <AnimatedBackground />
      <Container>
        <PageTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Featured Projects
        </PageTitle>
        <PageSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A showcase of my latest work spanning web development, mobile apps, 
          data science, and creative coding projects.
        </PageSubtitle>

        <FilterContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filterCategories.map(({ key, label }, index) => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => setFilter(key)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
            </FilterButton>
          ))}
        </FilterContainer>

        <ProjectGrid
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              onClick={() => modal.openModal(project)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <ProjectImage src={project.imageUrl} alt={project.title} />
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectCategory>{project.category}</ProjectCategory>
                <ProjectDescription>{project.description}</ProjectDescription>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectGrid>

        {/* Cross-Navigation to Art Gallery */}
        <CrossNavigation
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <CrossNavCard>
            <CrossNavTitle>Explore My Digital Art</CrossNavTitle>
            <CrossNavDescription>
              Discover my creative side through digital artwork, illustrations, and visual designs.
            </CrossNavDescription>
            <CrossNavButton
              to="/art"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Art Gallery
              <FiArrowRight size={18} />
            </CrossNavButton>
          </CrossNavCard>
        </CrossNavigation>
      </Container>

      {renderProjectModal()}
    </ProjectsContainer>
  );
};

export default ProjectsClean;