import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { projectsData } from '../../data/projects';

/**
 * Migrate projects from projects.js to Firestore
 */
export const migrateProjects = async () => {
  try {
    // Check if projects already exist
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    if (projectsSnapshot.size > 0) {
      return {
        success: false,
        error: 'Projects already exist in Firestore. Delete them first if you want to re-migrate.'
      };
    }

    let count = 0;
    const projectsCollection = collection(db, 'projects');

    // Migrate each project
    for (const project of projectsData) {
      const projectData = {
        title: project.title,
        description: project.longDescription || project.description,
        category: project.category,
        technologies: project.technologies || [],
        features: project.features || [],
        imageUrl: project.imageUrl || project.image || '',
        liveUrl: project.liveLink || project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(projectsCollection, projectData);
      count++;
    }

    return {
      success: true,
      count
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
