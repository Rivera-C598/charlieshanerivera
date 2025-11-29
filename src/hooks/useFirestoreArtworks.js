import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Hook to fetch artworks from Firestore for public gallery
 */
export const useFirestoreArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const artworksQuery = query(
          collection(db, 'artworks'),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(artworksQuery);
        const artworksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setArtworks(artworksData);
        setError(null);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  return { artworks, loading, error };
};

/**
 * Hook to fetch featured artworks only
 */
export const useFeaturedArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        setLoading(true);
        const featuredQuery = query(
          collection(db, 'artworks'),
          where('featured', '==', true)
        );
        
        const snapshot = await getDocs(featuredQuery);
        const artworksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort by createdAt client-side
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        })
        // Limit to 2 featured artworks
        .slice(0, 2);
        
        setArtworks(artworksData);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured artworks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtworks();
  }, []);

  return { artworks, loading, error };
};
