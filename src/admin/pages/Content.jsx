import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiSearch, FiGitMerge, FiCheck, FiX, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { doc, deleteDoc, updateDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../components/AdminLayout';
import { useTechnologies, useFeatures, useArtTags } from '../hooks/useTags';

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.lightText};
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SearchBar = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.lightText};
`;

const TagsTable = styled.div`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 120px;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const SortButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 100px 120px;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const TagName = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

const UsageCount = styled.div`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 212, 255, 0.1)'};
  color: ${props => props.variant === 'danger' ? props.theme.colors.secondary : props.theme.colors.primary};
  border: 1px solid ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 212, 255, 0.3)'};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 212, 255, 0.2)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.lightText};
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex: 1;
  min-width: 200px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
`;

const MergeButton = styled.button`
  background: ${props => props.theme.gradients.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const MergeSection = styled.div`
  margin-bottom: 2rem;
`;

const MergeLabel = styled.label`
  display: block;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    background: #1a1a2e;
    color: white;
  }
`;

const MergePreview = styled.div`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  ${props => props.variant === 'primary' ? `
    background: ${props.theme.gradients.primary};
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: ${props.theme.colors.lightText};
    
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

const EditActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.5);
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
`;

const Content = () => {
  const [activeTab, setActiveTab] = useState('technologies');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeFrom, setMergeFrom] = useState('');
  const [mergeTo, setMergeTo] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'usage'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const { technologies, loading: loadingTech } = useTechnologies();
  const { features, loading: loadingFeatures } = useFeatures();
  const { artTags, loading: loadingTags } = useArtTags();

  const getCurrentData = () => {
    switch (activeTab) {
      case 'technologies': return technologies;
      case 'features': return features;
      case 'artTags': return artTags;
      default: return [];
    }
  };

  const getCurrentCollection = () => {
    switch (activeTab) {
      case 'technologies': return 'technologies';
      case 'features': return 'features';
      case 'artTags': return 'artTags';
      default: return '';
    }
  };

  const isLoading = loadingTech || loadingFeatures || loadingTags;
  const currentData = getCurrentData();
  
  // Filter and sort data
  let filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort data
  filteredData = [...filteredData].sort((a, b) => {
    if (sortBy === 'name') {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    } else {
      const comparison = a.usageCount - b.usageCount;
      return sortOrder === 'asc' ? comparison : -comparison;
    }
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) {
      alert('Name cannot be empty');
      return;
    }
    
    try {
      const docRef = doc(db, getCurrentCollection(), id);
      await updateDoc(docRef, { name: editValue.trim() });
      setEditingId(null);
      window.location.reload();
    } catch (error) {
      alert('Failed to update: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleMerge = async () => {
    if (!mergeFrom || !mergeTo) {
      alert('Please select both tags to merge');
      return;
    }

    if (mergeFrom === mergeTo) {
      alert('Cannot merge a tag with itself');
      return;
    }

    const collectionName = getCurrentCollection();
    const fromItem = currentData.find(item => item.id === mergeFrom);
    const toItem = currentData.find(item => item.id === mergeTo);

    if (!window.confirm(
      `Merge "${fromItem.name}" into "${toItem.name}"?\n\n` +
      `This will:\n` +
      `• Update all projects/artworks using "${fromItem.name}" to use "${toItem.name}"\n` +
      `• Delete "${fromItem.name}"\n` +
      `• Combine usage counts\n\n` +
      `This action cannot be undone.`
    )) {
      return;
    }

    try {
      // Get all projects or artworks
      const itemsCollection = collectionName === 'artTags' ? 'artworks' : 'projects';
      const fieldName = collectionName === 'technologies' ? 'technologies' : 
                       collectionName === 'features' ? 'features' : 'tags';
      
      const snapshot = await getDocs(collection(db, itemsCollection));
      const batch = writeBatch(db);

      // Update all items that use the old tag
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const tags = data[fieldName] || [];
        
        if (tags.includes(fromItem.name)) {
          const updatedTags = tags.map(tag => 
            tag === fromItem.name ? toItem.name : tag
          );
          // Remove duplicates
          const uniqueTags = [...new Set(updatedTags)];
          batch.update(docSnap.ref, { [fieldName]: uniqueTags });
        }
      });

      // Update the target tag's usage count
      const toRef = doc(db, collectionName, mergeTo);
      batch.update(toRef, {
        usageCount: toItem.usageCount + fromItem.usageCount
      });

      // Delete the source tag
      const fromRef = doc(db, collectionName, mergeFrom);
      batch.delete(fromRef);

      await batch.commit();
      
      setShowMergeModal(false);
      setMergeFrom('');
      setMergeTo('');
      window.location.reload();
    } catch (error) {
      alert('Failed to merge: ' + error.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"? This won't affect existing projects/artworks.`)) {
      try {
        await deleteDoc(doc(db, getCurrentCollection(), id));
        window.location.reload();
      } catch (error) {
        alert('Failed to delete: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout title="Tag Management">
      <TabContainer>
        <Tab active={activeTab === 'technologies'} onClick={() => setActiveTab('technologies')}>
          Technologies
        </Tab>
        <Tab active={activeTab === 'features'} onClick={() => setActiveTab('features')}>
          Features
        </Tab>
        <Tab active={activeTab === 'artTags'} onClick={() => setActiveTab('artTags')}>
          Art Tags
        </Tab>
      </TabContainer>

      <Stats>
        <StatCard>
          <StatValue>{technologies.length}</StatValue>
          <StatLabel>Technologies</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{features.length}</StatValue>
          <StatLabel>Features</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{artTags.length}</StatValue>
          <StatLabel>Art Tags</StatLabel>
        </StatCard>
      </Stats>

      <MergeButton 
        onClick={() => setShowMergeModal(true)}
        disabled={currentData.length < 2}
      >
        <FiGitMerge size={18} />
        Merge Tags
      </MergeButton>

      <SearchBar>
        <SearchIcon size={20} />
        <SearchInput
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      {isLoading ? (
        <EmptyState>Loading...</EmptyState>
      ) : filteredData.length === 0 ? (
        <EmptyState>
          {searchQuery ? 'No results found' : `No ${activeTab} yet. They'll appear as you create content.`}
        </EmptyState>
      ) : (
        <TagsTable>
          <TableHeader>
            <SortButton onClick={() => toggleSort('name')}>
              Name
              {sortBy === 'name' && (sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />)}
            </SortButton>
            <SortButton onClick={() => toggleSort('usage')} style={{ justifyContent: 'center' }}>
              Used
              {sortBy === 'usage' && (sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />)}
            </SortButton>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </TableHeader>
          {filteredData.map((item, index) => (
            <TableRow
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {editingId === item.id ? (
                <>
                  <EditInput
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(item.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <UsageCount>{item.usageCount}×</UsageCount>
                  <EditActions>
                    <ActionButton onClick={() => handleSaveEdit(item.id)}>
                      <FiCheck size={16} />
                    </ActionButton>
                    <ActionButton variant="danger" onClick={handleCancelEdit}>
                      <FiX size={16} />
                    </ActionButton>
                  </EditActions>
                </>
              ) : (
                <>
                  <TagName>{item.name}</TagName>
                  <UsageCount>{item.usageCount}×</UsageCount>
                  <Actions>
                    <ActionButton onClick={() => handleEdit(item)}>
                      <FiEdit2 size={16} />
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDelete(item.id, item.name)}>
                      <FiTrash2 size={16} />
                    </ActionButton>
                  </Actions>
                </>
              )}
            </TableRow>
          ))}
        </TagsTable>
      )}

      <AnimatePresence>
        {showMergeModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMergeModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>
                <FiGitMerge style={{ marginRight: '0.5rem' }} />
                Merge Tags
              </ModalTitle>

              <MergeSection>
                <MergeLabel>Merge from (will be deleted):</MergeLabel>
                <Select value={mergeFrom} onChange={(e) => setMergeFrom(e.target.value)}>
                  <option value="">Select a tag...</option>
                  {currentData.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.usageCount}×)
                    </option>
                  ))}
                </Select>
              </MergeSection>

              <MergeSection>
                <MergeLabel>Merge into (will be kept):</MergeLabel>
                <Select value={mergeTo} onChange={(e) => setMergeTo(e.target.value)}>
                  <option value="">Select a tag...</option>
                  {currentData.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.usageCount}×)
                    </option>
                  ))}
                </Select>
              </MergeSection>

              {mergeFrom && mergeTo && mergeFrom !== mergeTo && (
                <MergePreview>
                  <strong>Preview:</strong><br />
                  "{currentData.find(i => i.id === mergeFrom)?.name}" will be merged into "{currentData.find(i => i.id === mergeTo)?.name}"<br />
                  New usage count: {(currentData.find(i => i.id === mergeFrom)?.usageCount || 0) + (currentData.find(i => i.id === mergeTo)?.usageCount || 0)}×
                </MergePreview>
              )}

              <ModalActions>
                <Button onClick={() => setShowMergeModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleMerge}
                  disabled={!mergeFrom || !mergeTo || mergeFrom === mergeTo}
                >
                  Merge Tags
                </Button>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Content;
