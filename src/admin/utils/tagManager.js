import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Save or update a technology tag
 */
export const saveTechnology = async (techName) => {
  if (!techName || !techName.trim()) return;
  
  const techId = techName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const techRef = doc(db, 'technologies', techId);
  
  try {
    const techDoc = await getDoc(techRef);
    
    if (techDoc.exists()) {
      // Increment usage count
      await updateDoc(techRef, {
        usageCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new technology
      await setDoc(techRef, {
        name: techName,
        usageCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving technology:', error);
  }
};

/**
 * Save or update a feature tag
 */
export const saveFeature = async (featureName) => {
  if (!featureName || !featureName.trim()) return;
  
  const featureId = featureName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const featureRef = doc(db, 'features', featureId);
  
  try {
    const featureDoc = await getDoc(featureRef);
    
    if (featureDoc.exists()) {
      // Increment usage count
      await updateDoc(featureRef, {
        usageCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new feature
      await setDoc(featureRef, {
        name: featureName,
        usageCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving feature:', error);
  }
};

/**
 * Save or update an art tag
 */
export const saveArtTag = async (tagName) => {
  if (!tagName || !tagName.trim()) return;
  
  const tagId = tagName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const tagRef = doc(db, 'artTags', tagId);
  
  try {
    const tagDoc = await getDoc(tagRef);
    
    if (tagDoc.exists()) {
      // Increment usage count
      await updateDoc(tagRef, {
        usageCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new art tag
      await setDoc(tagRef, {
        name: tagName,
        usageCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving art tag:', error);
  }
};

/**
 * Save all technologies from a project
 */
export const saveTechnologies = async (technologies) => {
  if (!technologies || !Array.isArray(technologies)) return;
  
  const promises = technologies.map(tech => saveTechnology(tech));
  await Promise.all(promises);
};

/**
 * Save all features from a project
 */
export const saveFeatures = async (features) => {
  if (!features || !Array.isArray(features)) return;
  
  const promises = features.map(feature => saveFeature(feature));
  await Promise.all(promises);
};

/**
 * Save all tags from an artwork
 */
export const saveArtTags = async (tags) => {
  if (!tags || !Array.isArray(tags)) return;
  
  const promises = tags.map(tag => saveArtTag(tag));
  await Promise.all(promises);
};

/**
 * One-time migration: Collect all existing tags from projects and artworks
 */
export const migrateExistingTags = async () => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('../../config/firebase');
    
    let techCount = 0;
    let featureCount = 0;
    let tagCount = 0;
    
    // Collect from projects
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    for (const doc of projectsSnapshot.docs) {
      const data = doc.data();
      
      if (data.technologies) {
        await saveTechnologies(data.technologies);
        techCount += data.technologies.length;
      }
      
      if (data.features) {
        await saveFeatures(data.features);
        featureCount += data.features.length;
      }
    }
    
    // Collect from artworks
    const artworksSnapshot = await getDocs(collection(db, 'artworks'));
    for (const doc of artworksSnapshot.docs) {
      const data = doc.data();
      
      if (data.tags) {
        await saveArtTags(data.tags);
        tagCount += data.tags.length;
      }
    }
    
    return {
      success: true,
      technologies: techCount,
      features: featureCount,
      artTags: tagCount
    };
  } catch (error) {
    console.error('Error migrating tags:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
