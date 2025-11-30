import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try with composite index first, fall back to simple query if it fails
    let q;
    try {
      q = query(
        collection(db, 'skills'),
        orderBy('category'),
        orderBy('progress', 'desc')
      );
    } catch (err) {
      // If composite index doesn't exist, just order by category
      q = query(
        collection(db, 'skills'),
        orderBy('category')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const skillsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSkills(skillsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching skills:', err);
        // If composite index error, try simple query
        if (err.code === 'failed-precondition') {
          const simpleQuery = query(collection(db, 'skills'));
          const unsubscribeSimple = onSnapshot(
            simpleQuery,
            (snapshot) => {
              const skillsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setSkills(skillsData);
              setLoading(false);
            },
            (error) => {
              console.error('Error with simple query:', error);
              setError(error.message);
              setLoading(false);
            }
          );
          return () => unsubscribeSimple();
        }
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return {
    skills,
    skillsByCategory,
    loading,
    error
  };
};
