import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { projectsData } from '../../data/projects';

// Hardcoded artwork data to migrate
const artworksData = [
  {
    title: "Ashes Beneath the Orbit's Roar",
    description: "My best work so far - a powerful character piece that showcases advanced digital art techniques and storytelling.",
    imageUrl: "/assets/art/ashes-beneath-orbits-roar.png",
    tags: ["Character Design", "Digital Art", "Concept Art"],
    featured: true
  },
  {
    title: "Celes - Remastered",
    description: "An original character design showcasing detailed illustration work and character development mastery.",
    imageUrl: "/assets/art/celes-remastered.png",
    tags: ["Original Character", "Character Design", "Digital Art"],
    featured: true
  }
];

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

/**
 * Migrate artworks to Firestore
 */
export const migrateArtworks = async () => {
  try {
    // Check if artworks already exist
    const artworksSnapshot = await getDocs(collection(db, 'artworks'));
    if (artworksSnapshot.size > 0) {
      return {
        success: false,
        error: 'Artworks already exist in Firestore. Delete them first if you want to re-migrate.'
      };
    }

    let count = 0;
    const artworksCollection = collection(db, 'artworks');

    // Migrate each artwork
    for (const artwork of artworksData) {
      const artworkData = {
        title: artwork.title,
        description: artwork.description,
        imageUrl: artwork.imageUrl,
        tags: artwork.tags || [],
        featured: artwork.featured || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(artworksCollection, artworkData);
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
