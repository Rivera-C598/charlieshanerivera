import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../components/AdminLayout';
import ImageUpload from '../components/ImageUpload';
import { useProjects } from '../hooks/useProjects';

const Form = styled.form`
  max-width: 800px;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
  }

  option {
    background: #1a1a2e;
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-height: 50px;
`;

const Tag = styled.span`
  background: rgba(0, 212, 255, 0.2);
  color: ${props => props.theme.colors.primary};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const TagInputField = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  padding: 0.4rem;
  font-size: 0.9rem;
  min-width: 150px;

  &:focus {
    outline: none;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : props.theme.gradients.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProject, updateProject } = useProjects();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web',
    imageUrl: '',
    technologies: [],
    features: [],
    liveUrl: '',
    githubUrl: '',
    featured: false
  });

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        alert('Project not found');
        navigate('/admin/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = (e) => {
    if (e.key === 'Enter' && featureInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = isEdit 
      ? await updateProject(id, formData)
      : await addProject(formData);

    if (result.success) {
      navigate('/admin/projects');
    } else {
      alert('Failed to save project: ' + result.error);
    }

    setLoading(false);
  };

  if (loadingData) {
    return (
      <AdminLayout title={isEdit ? 'Edit Project' : 'Add Project'}>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit Project' : 'Add Project'}>
      <Form onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label>Title *</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Project title"
            />
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Project description"
              rows={5}
            />
          </FormGroup>

          <FormGroup>
            <Label>Category *</Label>
            <Select name="category" value={formData.category} onChange={handleChange} required>
              <option value="Web">Web</option>
              <option value="AI">AI/ML</option>
              <option value="Desktop">Desktop</option>
            </Select>
          </FormGroup>

          <ImageUpload
            label="Project Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
            folder="projects"
          />

          <FormGroup>
            <Label>Technologies</Label>
            <TagInput>
              {formData.technologies.map((tech, index) => (
                <Tag key={index}>
                  {tech}
                  <TagRemove type="button" onClick={() => handleRemoveTech(index)}>
                    <FiX size={14} />
                  </TagRemove>
                </Tag>
              ))}
              <TagInputField
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="Type and press Enter"
              />
            </TagInput>
          </FormGroup>

          <FormGroup>
            <Label>Features</Label>
            <TagInput>
              {formData.features.map((feature, index) => (
                <Tag key={index}>
                  {feature}
                  <TagRemove type="button" onClick={() => handleRemoveFeature(index)}>
                    <FiX size={14} />
                  </TagRemove>
                </Tag>
              ))}
              <TagInputField
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleAddFeature}
                placeholder="Type and press Enter"
              />
            </TagInput>
          </FormGroup>

          <FormGroup>
            <Label>Live URL</Label>
            <Input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </FormGroup>

          <FormGroup>
            <Label>GitHub URL</Label>
            <Input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </FormGroup>

          <FormGroup>
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <Label style={{ marginBottom: 0 }}>Featured Project</Label>
            </CheckboxGroup>
          </FormGroup>
        </FormGrid>

        <ButtonGroup>
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSave size={18} />
            {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/projects')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiX size={18} />
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </AdminLayout>
  );
};

export default ProjectForm;
