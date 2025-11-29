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

export const useArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const artworksData = querySnapshot.docs.map(doc => ({
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

  useEffect(() => {
    fetchArtworks();
  }, []);

  const addArtwork = async (artworkData) => {
    try {
      const docRef = await addDoc(collection(db, 'artworks'), {
        ...artworkData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await fetchArtworks();
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding artwork:', err);
      return { success: false, error: err.message };
    }
  };

  const updateArtwork = async (id, artworkData) => {
    try {
      const artworkRef = doc(db, 'artworks', id);
      await updateDoc(artworkRef, {
        ...artworkData,
        updatedAt: serverTimestamp()
      });
      await fetchArtworks();
      return { success: true };
    } catch (err) {
      console.error('Error updating artwork:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteArtwork = async (id) => {
    try {
      await deleteDoc(doc(db, 'artworks', id));
      await fetchArtworks();
      return { success: true };
    } catch (err) {
      console.error('Error deleting artwork:', err);
      return { success: false, error: err.message };
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    return await updateArtwork(id, { featured: !currentStatus });
  };

  return {
    artworks,
    loading,
    error,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    toggleFeatured,
    refetch: fetchArtworks
  };
};
