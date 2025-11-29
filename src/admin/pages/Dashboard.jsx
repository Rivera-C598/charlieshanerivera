import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiImage, FiStar, FiPlus, FiDatabase } from 'react-icons/fi';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../components/AdminLayout';
import { ToastProvider } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { migrateProjects } from '../utils/migrateData';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.color || 'rgba(0, 212, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const QuickActions = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled(Link)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.text};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 212, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const ActionLabel = styled.div`
  font-weight: 600;
`;

const WelcomeCard = styled(motion.div)`
  background: ${props => props.theme.gradients.primary};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  color: white;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const ConfirmModal = styled(motion.div)`
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
  max-width: 500px;
  width: 100%;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ModalText = styled.p`
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ModalButtons = styled.div`
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

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    artworks: 0,
    featured: 0
  });
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  const handleMigrate = async () => {
    setShowConfirm(false);
    setMigrating(true);
    
    const result = await migrateProjects();
    
    if (result.success) {
      success('Migration Complete', `Successfully migrated ${result.count} projects!`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      error('Migration Failed', result.error);
      setMigrating(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count projects
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsCount = projectsSnapshot.size;

        // Count artworks
        const artworksSnapshot = await getDocs(collection(db, 'artworks'));
        const artworksCount = artworksSnapshot.size;

        // Count featured items
        const featuredProjectsQuery = query(
          collection(db, 'projects'),
          where('featured', '==', true)
        );
        const featuredArtworksQuery = query(
          collection(db, 'artworks'),
          where('featured', '==', true)
        );
        
        const featuredProjects = await getDocs(featuredProjectsQuery);
        const featuredArtworks = await getDocs(featuredArtworksQuery);
        const featuredCount = featuredProjects.size + featuredArtworks.size;

        setStats({
          projects: projectsCount,
          artworks: artworksCount,
          featured: featuredCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <ToastProvider toasts={toasts} onClose={removeToast} />
      
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>Migrate Projects?</ModalTitle>
              <ModalText>
                This will migrate all projects from your projects.js file to Firestore. 
                This action will make your projects editable through the admin panel.
              </ModalText>
              <ModalButtons>
                <Button onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleMigrate} disabled={migrating}>
                  {migrating ? 'Migrating...' : 'Migrate'}
                </Button>
              </ModalButtons>
            </ModalContent>
          </ConfirmModal>
        )}
      </AnimatePresence>

      <WelcomeCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <WelcomeTitle>Welcome back! 👋</WelcomeTitle>
        <WelcomeText>
          Manage your portfolio content from this dashboard
        </WelcomeText>
      </WelcomeCard>

      <DashboardGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon>
            <FiFolder size={24} />
          </StatIcon>
          <StatValue>{loading ? '...' : stats.projects}</StatValue>
          <StatLabel>Total Projects</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon color="rgba(124, 58, 237, 0.1)">
            <FiImage size={24} />
          </StatIcon>
          <StatValue>{loading ? '...' : stats.artworks}</StatValue>
          <StatLabel>Total Artworks</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon color="rgba(255, 107, 107, 0.1)">
            <FiStar size={24} />
          </StatIcon>
          <StatValue>{loading ? '...' : stats.featured}</StatValue>
          <StatLabel>Featured Items</StatLabel>
        </StatCard>
      </DashboardGrid>

      <QuickActions>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionsGrid>
          <ActionButton to="/admin/projects/new">
            <ActionIcon>
              <FiPlus size={20} />
            </ActionIcon>
            <ActionLabel>New Project</ActionLabel>
          </ActionButton>

          <ActionButton to="/admin/art/new">
            <ActionIcon>
              <FiPlus size={20} />
            </ActionIcon>
            <ActionLabel>New Artwork</ActionLabel>
          </ActionButton>

          <ActionButton to="/admin/projects">
            <ActionIcon>
              <FiFolder size={20} />
            </ActionIcon>
            <ActionLabel>Manage Projects</ActionLabel>
          </ActionButton>

          <ActionButton to="/admin/art">
            <ActionIcon>
              <FiImage size={20} />
            </ActionIcon>
            <ActionLabel>Manage Art</ActionLabel>
          </ActionButton>
        </ActionsGrid>
      </QuickActions>

      {!loading && stats.projects === 0 && (
        <QuickActions>
          <SectionTitle>Data Migration</SectionTitle>
          <ActionsGrid>
            <ActionButton 
              as="button"
              onClick={() => setShowConfirm(true)}
              disabled={migrating}
            >
              <ActionIcon>
                <FiDatabase size={20} />
              </ActionIcon>
              <ActionLabel>{migrating ? 'Migrating...' : 'Migrate Projects'}</ActionLabel>
            </ActionButton>
          </ActionsGrid>
        </QuickActions>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
