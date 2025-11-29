import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiStar, FiExternalLink } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { useProjects } from '../hooks/useProjects';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddButton = styled(Link)`
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ProjectCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.1);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ProjectInfo = styled.div`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeaturedBadge = styled.span`
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const MetaItem = styled.span`
  color: ${props => props.theme.colors.muted};
  font-size: 0.85rem;
`;

const Category = styled.span`
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const Actions = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: row;
    padding: 1rem;
  }
`;

const ActionButtonBase = styled.button`
  background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 212, 255, 0.1)'};
  color: ${props => props.variant === 'danger' ? props.theme.colors.secondary : props.theme.colors.primary};
  border: 1px solid ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 212, 255, 0.3)'};
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 212, 255, 0.2)'};
  }
`;

const ActionButton = motion(ActionButtonBase);
const ActionLink = motion(styled(Link)`
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 212, 255, 0.3);
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: rgba(0, 212, 255, 0.2);
  }
`);

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.lightText};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.lightText};
  font-size: 1.2rem;
`;

const Projects = () => {
  const { projects, loading, deleteProject, toggleFeatured } = useProjects();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setDeleting(id);
      const result = await deleteProject(id);
      if (!result.success) {
        alert('Failed to delete project');
      }
      setDeleting(null);
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    await toggleFeatured(id, currentStatus);
  };

  if (loading) {
    return (
      <AdminLayout title="Projects">
        <LoadingState>Loading projects...</LoadingState>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Projects">
      <Header>
        <div>
          <p style={{ color: '#a0a0a0', marginTop: '0.5rem' }}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <AddButton to="/admin/projects/new">
          <FiPlus size={20} />
          Add Project
        </AddButton>
      </Header>

      {projects.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📁</EmptyIcon>
          <EmptyText>No projects yet</EmptyText>
          <AddButton to="/admin/projects/new">
            <FiPlus size={20} />
            Create Your First Project
          </AddButton>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects
            .sort((a, b) => {
              // Featured projects first
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              // Then by creation date (newest first)
              const dateA = a.createdAt?.toDate?.() || new Date(0);
              const dateB = b.createdAt?.toDate?.() || new Date(0);
              return dateB - dateA;
            })
            .map((project, index) => (
            <ProjectCard
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectImage 
                src={project.imageUrl || 'https://via.placeholder.com/200x150/1a1a2e/00d4ff?text=No+Image'} 
                alt={project.title} 
              />
              
              <ProjectInfo>
                <ProjectTitle>
                  {project.title}
                  {project.featured && <FeaturedBadge>⭐ Featured</FeaturedBadge>}
                </ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectMeta>
                  <Category>{project.category}</Category>
                  {project.liveLink && (
                    <MetaItem>
                      <FiExternalLink size={14} style={{ verticalAlign: 'middle' }} /> Live
                    </MetaItem>
                  )}
                  <MetaItem>{project.technologies?.length || 0} technologies</MetaItem>
                </ProjectMeta>
              </ProjectInfo>

              <Actions>
                <ActionLink
                  to={`/admin/projects/edit/${project.id}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEdit size={16} />
                  Edit
                </ActionLink>
                
                <ActionButton
                  onClick={() => handleToggleFeatured(project.id, project.featured)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiStar size={16} />
                  {project.featured ? 'Unfeature' : 'Feature'}
                </ActionButton>
                
                <ActionButton
                  variant="danger"
                  onClick={() => handleDelete(project.id)}
                  disabled={deleting === project.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiTrash2 size={16} />
                  {deleting === project.id ? 'Deleting...' : 'Delete'}
                </ActionButton>
              </Actions>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}
    </AdminLayout>
  );
};

export default Projects;
