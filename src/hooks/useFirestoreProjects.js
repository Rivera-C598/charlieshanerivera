import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Hook to fetch projects from Firestore for public portfolio
 */
export const useFirestoreProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsQuery = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(projectsQuery);
        const projectsData = snapshot.docs.map(doc => ({
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

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

/**
 * Hook to fetch featured projects only
 */
export const useFeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const featuredQuery = query(
          collection(db, 'projects'),
          where('featured', '==', true)
        );
        
        const snapshot = await getDocs(featuredQuery);
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort by createdAt client-side to avoid needing a composite index
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA; // Descending order (newest first)
        })
        // Limit to 2 featured projects
        .slice(0, 2);
        
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return { projects, loading, error };
};
