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
        // Fetch all projects without ordering (we'll sort client-side)
        const projectsQuery = query(collection(db, 'projects'));
        
        const snapshot = await getDocs(projectsQuery);
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort: Featured first, then by order field, then by createdAt
        const sortedProjects = projectsData.sort((a, b) => {
          // Featured items first
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // Then by order field (lower numbers first)
          const orderA = a.order ?? 999999;
          const orderB = b.order ?? 999999;
          if (orderA !== orderB) return orderA - orderB;
          
          // Finally by createdAt (newest first)
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        
        setProjects(sortedProjects);
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
