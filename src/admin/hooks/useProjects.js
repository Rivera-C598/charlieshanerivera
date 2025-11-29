import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { saveTechnologies, saveFeatures } from '../utils/tagManager';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (projectData) => {
    try {
      // Check featured limit if trying to feature this project
      if (projectData.featured) {
        const featuredQuery = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(featuredQuery);
        const featuredCount = snapshot.docs.filter(doc => doc.data().featured).length;
        
        if (featuredCount >= 2) {
          return { 
            success: false, 
            error: 'Maximum 2 featured projects allowed. Please unfeature another project first.',
            needsSelection: true
          };
        }
      }
      
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Auto-save technologies and features
      await saveTechnologies(projectData.technologies);
      await saveFeatures(projectData.features);
      
      await fetchProjects();
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding project:', err);
      return { success: false, error: err.message };
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      // Check featured limit if trying to feature this project
      if (projectData.featured) {
        const featuredQuery = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(featuredQuery);
        const featuredProjects = snapshot.docs.filter(doc => 
          doc.data().featured && doc.id !== id // Exclude current project
        );
        
        if (featuredProjects.length >= 2) {
          return { 
            success: false, 
            error: 'Maximum 2 featured projects allowed. Please unfeature another project first.',
            needsSelection: true
          };
        }
      }
      
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      });
      
      // Auto-save technologies and features
      await saveTechnologies(projectData.technologies);
      await saveFeatures(projectData.features);
      
      await fetchProjects();
      return { success: true };
    } catch (err) {
      console.error('Error updating project:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      await fetchProjects();
      return { success: true };
    } catch (err) {
      console.error('Error deleting project:', err);
      return { success: false, error: err.message };
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    return await updateProject(id, { featured: !currentStatus });
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    refetch: fetchProjects
  };
};
