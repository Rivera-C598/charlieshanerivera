import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiStar } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import FeaturedLimitModal from '../components/FeaturedLimitModal';
import { useArtworks } from '../hooks/useArtworks';

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

const ArtworksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ArtworkCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.1);
  }
`;

const ArtworkImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ArtworkInfo = styled.div`
  padding: 1.5rem;
`;

const ArtworkTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const FeaturedBadge = styled.span`
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ArtworkDescription = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButtonBase = styled.button`
  background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 212, 255, 0.1)'};
  color: ${props => props.variant === 'danger' ? props.theme.colors.secondary : props.theme.colors.primary};
  border: 1px solid ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 212, 255, 0.3)'};
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  flex: 1;
  justify-content: center;

  &:hover {
    background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 212, 255, 0.2)'};
  }
`;

const ActionButton = motion(ActionButtonBase);
const ActionLink = motion(styled(Link)`
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 212, 255, 0.3);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  flex: 1;

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
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.lightText};
  font-size: 1.2rem;
`;

const Artworks = () => {
  const { artworks, loading, deleteArtwork, toggleFeatured } = useArtworks();
  const [deleting, setDeleting] = useState(null);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [pendingFeatureId, setPendingFeatureId] = useState(null);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      setDeleting(id);
      await deleteArtwork(id);
      setDeleting(null);
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    // If trying to feature (not unfeature)
    if (!currentStatus) {
      const featuredArtworks = artworks.filter(a => a.featured);
      
      // Check if already at limit
      if (featuredArtworks.length >= 2) {
        setPendingFeatureId(id);
        setShowFeaturedModal(true);
        return;
      }
    }
    
    await toggleFeatured(id, currentStatus);
  };

  const handleUnfeatureFromModal = async (unfeaturedId) => {
    // Unfeature the selected artwork
    await toggleFeatured(unfeaturedId, true);
    
    // Feature the pending artwork
    if (pendingFeatureId) {
      await toggleFeatured(pendingFeatureId, false);
      setPendingFeatureId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Artworks">
        <LoadingState>Loading artworks...</LoadingState>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Artworks">
      <Header>
        <div>
          <p style={{ color: '#a0a0a0', marginTop: '0.5rem' }}>
            {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'}
          </p>
        </div>
        <AddButton to="/admin/art/new">
          <FiPlus size={20} />
          Add Artwork
        </AddButton>
      </Header>

      {artworks.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎨</EmptyIcon>
          <EmptyText>No artworks yet</EmptyText>
          <AddButton to="/admin/art/new">
            <FiPlus size={20} />
            Upload Your First Artwork
          </AddButton>
        </EmptyState>
      ) : (
        <ArtworksGrid>
          {artworks
            .sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              const dateA = a.createdAt?.toDate?.() || new Date(0);
              const dateB = b.createdAt?.toDate?.() || new Date(0);
              return dateB - dateA;
            })
            .map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArtworkImage 
                  src={artwork.imageUrl || 'https://via.placeholder.com/280x250/1a1a2e/00d4ff?text=No+Image'} 
                  alt={artwork.title} 
                />
                
                <ArtworkInfo>
                  <ArtworkTitle>
                    {artwork.title}
                    {artwork.featured && <FeaturedBadge>⭐ Featured</FeaturedBadge>}
                  </ArtworkTitle>
                  <ArtworkDescription>
                    {artwork.description?.substring(0, 100)}
                    {artwork.description?.length > 100 ? '...' : ''}
                  </ArtworkDescription>
                  
                  <Actions>
                    <ActionLink
                      to={`/admin/art/edit/${artwork.id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEdit size={14} />
                      Edit
                    </ActionLink>
                    
                    <ActionButton
                      onClick={() => handleToggleFeatured(artwork.id, artwork.featured)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiStar size={14} />
                      {artwork.featured ? 'Unfeature' : 'Feature'}
                    </ActionButton>
                    
                    <ActionButton
                      variant="danger"
                      onClick={() => handleDelete(artwork.id, artwork.title)}
                      disabled={deleting === artwork.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 size={14} />
                      {deleting === artwork.id ? 'Deleting...' : 'Delete'}
                    </ActionButton>
                  </Actions>
                </ArtworkInfo>
              </ArtworkCard>
            ))}
        </ArtworksGrid>
      )}

      <FeaturedLimitModal
        isOpen={showFeaturedModal}
        onClose={() => {
          setShowFeaturedModal(false);
          setPendingFeatureId(null);
        }}
        featuredItems={artworks.filter(a => a.featured)}
        onUnfeature={handleUnfeatureFromModal}
        type="artwork"
      />
    </AdminLayout>
  );
};

export default Artworks;
