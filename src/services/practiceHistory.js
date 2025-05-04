'use client';

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'practiceHistory';

/**
 * Save a new practice entry to Firestore
 * @param {string} userId - The ID of the current user
 * @param {Object} practiceData - Data about the practice session
 * @returns {Promise} - Promise that resolves with the document reference
 */
export async function savePracticeHistory(userId, practiceData) {
  try {
    if (!userId) {
      console.warn('Cannot save practice history: No user ID provided');
      return null;
    }

    const entryData = {
      userId,
      originalSentence: practiceData.originalSentence,
      userSentence: practiceData.userSentence,
      suggestedVersion: practiceData.suggestedVersion,
      feedback: practiceData.feedback,
      learningTips: practiceData.learningTips || '',
      score: practiceData.score,
      language: practiceData.language,
      reaction: practiceData.reaction || null,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), entryData);
    return docRef;
  } catch (error) {
    console.error('Error saving practice history:', error);
    throw error;
  }
}

/**
 * Get practice history entries for a specific user
 * @param {string} userId - The ID of the current user
 * @param {Object} options - Query options like page size, language filter
 * @returns {Promise} - Promise that resolves with history items and pagination info
 */
export async function getPracticeHistory(userId, options = {}) {
    console.log('Fetching practice history for user:', userId);
  try {
    if (!userId) {
      console.warn('Cannot get practice history: No user ID provided');
      return { items: [], lastVisible: null, hasMore: false };
    }

    const { pageSize = 10, lastVisible = null, language = null } = options;

    // Create base query
    let historyQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    // Note: This query requires a composite index in Firestore.
    // If you encounter an error, look for a URL in the error message
    // that will take you directly to the Firebase console to create the index.
    // Or manually create an index with:
    // - Collection: practiceHistory
    // - Fields to index: userId (Ascending), timestamp (Descending)

    // Add language filter if provided
    if (language) {
      historyQuery = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('language', '==', language),
        orderBy('timestamp', 'desc')
      );
      // Note: This query with language filter requires another composite index:
      // - Collection: practiceHistory
      // - Fields to index: userId (Ascending), language (Ascending), timestamp (Descending)
    }

    // Add pagination if we have a last visible document
    if (lastVisible) {
      historyQuery = query(
        historyQuery,
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      historyQuery = query(
        historyQuery,
        limit(pageSize)
      );
    }

    // Execute query
    const querySnapshot = await getDocs(historyQuery);
    
    // Extract data and get the last visible document for pagination
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JS Date if it exists
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date()
      });
    });

    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    // Determine if there are more results to load
    let hasMore = false;
    if (items.length === pageSize) {
      const nextQuery = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        ...(language ? [where('language', '==', language)] : []),
        orderBy('timestamp', 'desc'),
        startAfter(newLastVisible),
        limit(1)
      );
      const nextSnapshot = await getDocs(nextQuery);
      hasMore = !nextSnapshot.empty;
    }

    return {
      items,
      lastVisible: newLastVisible,
      hasMore
    };
  } catch (error) {
    console.error('Error getting practice history:', error);
    // If this is an indexing error, provide more helpful information
    if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
      console.log('This query requires a Firestore index. Look for a URL in the error message to create it automatically.');
    }
    throw error;
  }
}