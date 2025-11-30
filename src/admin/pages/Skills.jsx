import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../components/AdminLayout';
import { ToastProvider } from '../components/Toast';
import { useToast } from '../hooks/useToast';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const AddButton = styled.button`
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background: ${props => props.active ? props.theme.gradients.primary : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const SkillCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const SkillTitle = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
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
`;

const SkillInfo = styled.div`
  display: grid;
  gap: 0.75rem;
  color: ${props => props.theme.colors.lightText};
  font-size: 0.95rem;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.85rem;
`;

const Modal = styled(motion.div)`
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
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    background: #1a1a2e;
  }
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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.lightText};
`;

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { toasts, removeToast, success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    level: 'Intermediate',
    progress: 50,
    description: '',
    tags: '',
    icon: 'FiCode'
  });

  const categories = ['all', 'frontend', 'backend', 'creative', 'mobile'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const icons = ['FiCode', 'FiServer', 'FiImage', 'FiSmartphone', 'FiDatabase', 'FiCloud', 'FiTool', 'FiMonitor', 'FiLayers', 'FiZap'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'skills'));
      const skillsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSkills(skillsData);
    } catch (err) {
      error('Error', 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillData = {
      ...formData,
      progress: parseInt(formData.progress),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingSkill) {
        await updateDoc(doc(db, 'skills', editingSkill.id), skillData);
        success('Updated', 'Skill updated successfully');
      } else {
        await addDoc(collection(db, 'skills'), {
          ...skillData,
          createdAt: new Date().toISOString()
        });
        success('Created', 'Skill created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchSkills();
    } catch (err) {
      error('Error', 'Failed to save skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      progress: skill.progress,
      description: skill.description,
      tags: skill.tags.join(', '),
      icon: skill.icon
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'skills', id));
        success('Deleted', 'Skill deleted successfully');
        fetchSkills();
      } catch (err) {
        error('Error', 'Failed to delete skill');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'frontend',
      level: 'Intermediate',
      progress: 50,
      description: '',
      tags: '',
      icon: 'FiCode'
    });
    setEditingSkill(null);
  };

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  return (
    <AdminLayout title="Skills Management">
      <ToastProvider toasts={toasts} onClose={removeToast} />
      
      <Header>
        <TabContainer>
          {categories.map(cat => (
            <Tab
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Tab>
          ))}
        </TabContainer>
        
        <AddButton onClick={() => { resetForm(); setShowModal(true); }}>
          <FiPlus size={20} />
          Add Skill
        </AddButton>
      </Header>

      {loading ? (
        <EmptyState>Loading skills...</EmptyState>
      ) : filteredSkills.length === 0 ? (
        <EmptyState>
          No skills yet. Click "Add Skill" to create one.
        </EmptyState>
      ) : (
        <SkillsGrid>
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkillHeader>
                <SkillTitle>{skill.name}</SkillTitle>
                <Actions>
                  <ActionButton onClick={() => handleEdit(skill)}>
                    <FiEdit size={16} />
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDelete(skill.id, skill.name)}>
                    <FiTrash2 size={16} />
                  </ActionButton>
                </Actions>
              </SkillHeader>
              
              <SkillInfo>
                <InfoRow>
                  <Label>Category:</Label> {skill.category}
                </InfoRow>
                <InfoRow>
                  <Label>Level:</Label> {skill.level} ({skill.progress}%)
                </InfoRow>
                <InfoRow>
                  <Label>Description:</Label> {skill.description}
                </InfoRow>
                <InfoRow>
                  <Label>Tags:</Label>
                  <Tags>
                    {skill.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Tags>
                </InfoRow>
              </SkillInfo>
            </SkillCard>
          ))}
        </SkillsGrid>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowModal(false); resetForm(); }}
          >
            <ModalContent
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</ModalTitle>
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel>Skill Name *</FormLabel>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="creative">Creative</option>
                    <option value="mobile">Mobile</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Level *</FormLabel>
                  <Select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    required
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Progress (0-100) *</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Icon *</FormLabel>
                  <Select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    required
                  >
                    {icons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Description *</FormLabel>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Tags (comma-separated) *</FormLabel>
                  <Input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, TypeScript, Next.js"
                    required
                  />
                </FormGroup>

                <ModalActions>
                  <Button type="button" onClick={() => { setShowModal(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    <FiSave size={18} style={{ marginRight: '0.5rem' }} />
                    {editingSkill ? 'Update' : 'Create'}
                  </Button>
                </ModalActions>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminSkills;
