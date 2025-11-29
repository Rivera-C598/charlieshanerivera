import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Hook to fetch all technologies
 */
export const useTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const q = query(collection(db, 'technologies'), orderBy('usageCount', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTechnologies(data);
      } catch (error) {
        console.error('Error fetching technologies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  return { technologies, loading };
};

/**
 * Hook to fetch all features
 */
export const useFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const q = query(collection(db, 'features'), orderBy('usageCount', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeatures(data);
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return { features, loading };
};

/**
 * Hook to fetch all art tags
 */
export const useArtTags = () => {
  const [artTags, setArtTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtTags = async () => {
      try {
        const q = query(collection(db, 'artTags'), orderBy('usageCount', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setArtTags(data);
      } catch (error) {
        console.error('Error fetching art tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtTags();
  }, []);

  return { artTags, loading };
};
