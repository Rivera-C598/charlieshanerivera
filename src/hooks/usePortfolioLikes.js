import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Custom hook for managing portfolio likes with Firestore
 */
export const usePortfolioLikes = () => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLikeId, setUserLikeId] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Get or create a unique visitor ID
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitor-id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor-id', visitorId);
    }
    return visitorId;
  };

  // Get visitor info (anonymized but useful)
  const getVisitorInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || 'Direct',
    };

    // Parse browser and OS from userAgent
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    // Detect OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    return { ...info, browser, os };
  };

  // Load likes data
  useEffect(() => {
    const loadLikes = async () => {
      try {
        const visitorId = getVisitorId();
        const likesRef = collection(db, 'portfolioLikes');

        // Get total likes count
        const allLikesQuery = query(likesRef);
        const allLikesSnapshot = await getDocs(allLikesQuery);
        setTotalLikes(allLikesSnapshot.size);

        // Check if current visitor has liked
        const userLikeQuery = query(likesRef, where('visitorId', '==', visitorId));
        const userLikeSnapshot = await getDocs(userLikeQuery);
        
        if (!userLikeSnapshot.empty) {
          setUserLiked(true);
          setUserLikeId(userLikeSnapshot.docs[0].id);
        }
      } catch (error) {
        console.error('Error loading likes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLikes();
  }, []);

  // Toggle like with debouncing to prevent spam
  const toggleLike = () => {
    // Clear any pending database write
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Capture current state before changing
    const currentLikeId = userLikeId;
    const newLikedState = !userLiked;
    
    // Immediately update UI for instant feedback
    setUserLiked(newLikedState);
    setTotalLikes(prev => newLikedState ? prev + 1 : prev - 1);

    // Debounce the actual database write (500ms delay)
    const timer = setTimeout(async () => {
      try {
        const visitorId = getVisitorId();
        const likesRef = collection(db, 'portfolioLikes');

        if (newLikedState) {
          // Add like to database
          const visitorInfo = getVisitorInfo();
          const docRef = await addDoc(likesRef, {
            visitorId,
            timestamp: serverTimestamp(),
            ...visitorInfo
          });
          setUserLikeId(docRef.id);
        } else {
          // Remove like from database - need to find it if we don't have the ID
          if (currentLikeId) {
            await deleteDoc(doc(db, 'portfolioLikes', currentLikeId));
            setUserLikeId(null);
          } else {
            // If no ID, query for it
            const userLikeQuery = query(likesRef, where('visitorId', '==', visitorId));
            const userLikeSnapshot = await getDocs(userLikeQuery);
            if (!userLikeSnapshot.empty) {
              await deleteDoc(userLikeSnapshot.docs[0].ref);
              setUserLikeId(null);
            }
          }
        }
      } catch (error) {
        console.error('Error updating like:', error);
        // Revert UI on error
        setUserLiked(!newLikedState);
        setTotalLikes(prev => newLikedState ? prev - 1 : prev + 1);
        alert('Failed to update like. Please try again.');
      }
    }, 500);

    setDebounceTimer(timer);
  };

  return {
    totalLikes,
    userLiked,
    loading,
    toggleLike
  };
};

/**
 * Hook for admin to fetch all likes with details
 */
export const useAllLikes = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    browsers: {},
    os: {},
    countries: {}
  });

  useEffect(() => {
    const loadAllLikes = async () => {
      try {
        const likesRef = collection(db, 'portfolioLikes');
        const q = query(likesRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);

        const likesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));

        setLikes(likesData);

        // Calculate stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const browsers = {};
        const os = {};
        const timezones = {};

        let todayCount = 0;
        let weekCount = 0;
        let monthCount = 0;

        likesData.forEach(like => {
          // Count by time period
          if (like.timestamp >= today) todayCount++;
          if (like.timestamp >= weekAgo) weekCount++;
          if (like.timestamp >= monthAgo) monthCount++;

          // Count by browser
          browsers[like.browser] = (browsers[like.browser] || 0) + 1;

          // Count by OS
          os[like.os] = (os[like.os] || 0) + 1;

          // Count by timezone (as proxy for location)
          timezones[like.timezone] = (timezones[like.timezone] || 0) + 1;
        });

        setStats({
          total: likesData.length,
          today: todayCount,
          thisWeek: weekCount,
          thisMonth: monthCount,
          browsers,
          os,
          timezones
        });
      } catch (error) {
        console.error('Error loading all likes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllLikes();
  }, []);

  return { likes, stats, loading };
};
