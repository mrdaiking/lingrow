'use client';

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  getCountFromServer,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { startOfDay, endOfDay, eachDayOfInterval, subDays, isEqual } from 'date-fns';

const COLLECTION_NAME = 'practiceHistory';

/**
 * Get the total number of practice sessions for a user
 * @param {string} userId - The ID of the current user
 * @returns {Promise<number>} - Promise that resolves with the count
 */
export async function getTotalPracticeSessions(userId) {
  try {
    if (!userId) {
      console.warn('Cannot get practice count: No user ID provided');
      return 0;
    }

    const practiceQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );

    const snapshot = await getCountFromServer(practiceQuery);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting practice count:', error);
    throw error;
  }
}

/**
 * Get the recent practice scores for a user
 * @param {string} userId - The ID of the current user
 * @param {number} count - Number of scores to retrieve
 * @returns {Promise<Array>} - Promise that resolves with score data
 */
export async function getRecentScores(userId, count = 10) {
  try {
    if (!userId) {
      console.warn('Cannot get scores: No user ID provided');
      return [];
    }

    const scoresQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(count)
    );

    const querySnapshot = await getDocs(scoresQuery);
    
    const scores = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        score: data.score,
        language: data.language,
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
      });
    });
    console.log('Recent scores:', scores);

    return scores;
  } catch (error) {
    console.error('Error getting recent scores:', error);
    throw error;
  }
}

/**
 * Calculate the next review date using spaced repetition algorithm
 * @param {number} reviewCount - Number of times the item has been reviewed
 * @param {Date} lastReviewed - Date when the item was last reviewed
 * @returns {Date} - Date when the item should be reviewed next
 */
function calculateNextReviewDate(reviewCount = 0, lastReviewed = new Date()) {
  // Simple spaced repetition formula: each review doubles the interval
  // 1, 2, 4, 8, 16, 32 days, etc.
  const dayInMs = 24 * 60 * 60 * 1000;
  const interval = Math.pow(2, reviewCount) * dayInMs;
  
  return new Date(lastReviewed.getTime() + interval);
}

/**
 * Mark a practice item as reviewed and update its next review date
 * @param {string} practiceId - The ID of the practice item
 * @param {number} reviewCount - Current review count
 * @returns {Promise} - Promise that resolves when update is complete
 */
export async function markItemAsReviewed(practiceId, reviewCount) {
  try {
    const practiceRef = doc(db, COLLECTION_NAME, practiceId);
    const nextReview = calculateNextReviewDate(reviewCount, new Date());
    
    await updateDoc(practiceRef, {
      reviewCount: reviewCount + 1,
      lastReviewed: Timestamp.now(),
      nextReview: Timestamp.fromDate(nextReview)
    });
    
    return { success: true, nextReview };
  } catch (error) {
    console.error('Error marking item as reviewed:', error);
    throw error;
  }
}

/**
 * Get practice items due for review based on spaced repetition
 * @param {string} userId - The ID of the current user
 * @param {number} limit - Maximum number of items to retrieve
 * @returns {Promise<Array>} - Promise that resolves with items due for review
 */
export async function getItemsDueForReview(userId, itemLimit = 5) {
  try {
    if (!userId) {
      console.warn('Cannot get review items: No user ID provided');
      return [];
    }

    // Get items with a nextReview date in the past or items never reviewed yet
    const currentDate = new Date();
    const reviewQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('nextReview', '<=', Timestamp.fromDate(currentDate)),
      orderBy('nextReview', 'asc'),
      limit(itemLimit)
    );

    // Get items that have never been reviewed (no nextReview field)
    const newItemsQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('reviewCount', '==', 0),
      orderBy('timestamp', 'desc'),
      limit(itemLimit)
    );

    // Try to get due items first
    let querySnapshot = await getDocs(reviewQuery);
    let items = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        originalSentence: data.originalSentence,
        userSentence: data.userSentence,
        suggestedVersion: data.suggestedVersion,
        score: data.score,
        reviewCount: data.reviewCount || 0,
        lastReviewed: data.lastReviewed ? data.lastReviewed.toDate() : null,
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
      });
    });
    
    // If we didn't get enough items, add some new items that haven't been reviewed
    if (items.length < itemLimit) {
      const newItemsSnapshot = await getDocs(newItemsQuery);
      
      newItemsSnapshot.forEach((doc) => {
        if (items.length < itemLimit) {
          const data = doc.data();
          // Check if item is already in the list
          if (!items.some(item => item.id === doc.id)) {
            items.push({
              id: doc.id,
              originalSentence: data.originalSentence,
              userSentence: data.userSentence,
              suggestedVersion: data.suggestedVersion,
              score: data.score,
              reviewCount: 0,
              timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
            });
          }
        }
      });
    }

    return items;
  } catch (error) {
    console.error('Error getting items due for review:', error);
    throw error;
  }
}

/**
 * Calculate practice streak (consecutive days of practice)
 * @param {string} userId - The ID of the current user
 * @returns {Promise<number>} - Promise that resolves with the current streak count
 */
export async function getPracticeStreak(userId) {
  try {
    if (!userId) {
      console.warn('Cannot get practice streak: No user ID provided');
      return 0;
    }

    // Get all practice sessions ordered by date
    const sessionsQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(sessionsQuery);
    
    if (querySnapshot.empty) {
      return 0;
    }

    // Get unique practice dates (convert to YYYY-MM-DD format for comparison)
    const practiceDates = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.timestamp) {
        const date = data.timestamp.toDate();
        const dateString = date.toISOString().split('T')[0];
        
        if (!practiceDates.includes(dateString)) {
          practiceDates.push(dateString);
        }
      }
    });

    // Sort dates in descending order (newest first)
    practiceDates.sort().reverse();

    // Get today's date for comparison
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    
    // Check if user practiced today, if not, start checking from yesterday
    if (practiceDates[0] !== today) {
      currentDate = subDays(currentDate, 1);
    }
    
    // Check consecutive days
    for (let i = 0; i < practiceDates.length; i++) {
      const dateToCheck = currentDate.toISOString().split('T')[0];
      
      if (practiceDates.includes(dateToCheck)) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating practice streak:', error);
    throw error;
  }
}

/**
 * Get practice data for calendar view
 * @param {string} userId - The ID of the current user
 * @param {number} days - Number of days to include
 * @returns {Promise<Object>} - Promise that resolves with practice calendar data
 */
export async function getPracticeCalendar(userId, days = 30) {
  try {
    if (!userId) {
      console.warn('Cannot get practice calendar: No user ID provided');
      return [];
    }

    // Calculate date range (last X days)
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    // Query for practice sessions in date range
    const sessionsQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(sessionsQuery);
    
    // Create array of all days in the range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Create map of dates with practice count
    const practiceDates = {};
    dateRange.forEach(date => {
      practiceDates[date.toISOString().split('T')[0]] = 0;
    });

    // Count sessions per day
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.timestamp) {
        const date = data.timestamp.toDate();
        const dateString = date.toISOString().split('T')[0];
        practiceDates[dateString] = (practiceDates[dateString] || 0) + 1;
      }
    });
    
    return practiceDates;
  } catch (error) {
    console.error('Error getting practice calendar:', error);
    throw error;
  }
}

/**
 * Analyze feedback to identify focus areas
 * @param {string} userId - The ID of the current user
 * @param {number} limit - Maximum number of entries to analyze
 * @returns {Promise<Object>} - Promise that resolves with focus area analysis
 */
export async function analyzeFeedbackFocusAreas(userId, limit = 20) {
  try {
    if (!userId) {
      console.warn('Cannot analyze feedback: No user ID provided');
      return { focusAreas: [], rawScores: {} };
    }

    // Get recent practice sessions
    const sessionsQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(sessionsQuery);
    
    if (querySnapshot.empty) {
      return { focusAreas: [], rawScores: {} };
    }

    // Categories to analyze
    const categories = ['professionalism', 'clarity', 'tone', 'grammar'];
    const categoryScores = {
      professionalism: [],
      clarity: [],
      tone: [],
      grammar: []
    };
    
    // Keywords to look for in feedback for categorization
    const keywords = {
      professionalism: ['formal', 'professional', 'business', 'workplace'],
      clarity: ['clear', 'concise', 'specific', 'precise', 'ambiguous'],
      tone: ['tone', 'polite', 'assertive', 'friendly', 'direct', 'passive'],
      grammar: ['grammar', 'verb', 'tense', 'preposition', 'conjugation', 'plural', 'singular']
    };

    // Analyze feedback from each session
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Skip if no feedback
      if (!data.feedback) return;
      
      let feedback;
      // Parse feedback if it's a string
      if (typeof data.feedback === 'string') {
        try {
          feedback = JSON.parse(data.feedback);
        } catch (e) {
          feedback = data.feedback;
        }
      } else {
        feedback = data.feedback;
      }
      
      // Analyze structured feedback
      if (typeof feedback === 'object' && feedback !== null) {
        for (const category of categories) {
          if (feedback[category]) {
            // Check if there's already a score for this category
            if (data.score) {
              categoryScores[category].push(data.score);
            }
          }
        }
      } 
      // Analyze string feedback with keywords
      else if (typeof feedback === 'string') {
        const lowercaseFeedback = feedback.toLowerCase();
        
        for (const category of categories) {
          for (const keyword of keywords[category]) {
            if (lowercaseFeedback.includes(keyword)) {
              if (data.score) {
                categoryScores[category].push(data.score);
              }
              break;
            }
          }
        }
      }
    });
    
    // Calculate average scores and identify focus areas
    const averages = {};
    const focusAreas = [];
    
    for (const category of categories) {
      const scores = categoryScores[category];
      if (scores.length > 0) {
        const sum = scores.reduce((acc, score) => acc + score, 0);
        const average = sum / scores.length;
        averages[category] = parseFloat(average.toFixed(1));
        
        // Lower score indicates need for improvement
        if (average < 7.5) {
          focusAreas.push({ category, average });
        }
      }
    }
    
    // Sort focus areas by lowest score first
    focusAreas.sort((a, b) => a.average - b.average);
    
    return { 
      focusAreas: focusAreas.slice(0, 2), // Return top 2 areas needing improvement
      rawScores: averages
    };
  } catch (error) {
    console.error('Error analyzing feedback focus areas:', error);
    throw error;
  }
}

/**
 * Calculate user's language proficiency level
 * @param {string} userId - The ID of the current user
 * @returns {Promise<Object>} - Promise that resolves with user level info
 */
export async function calculateUserLevel(userId) {
  try {
    if (!userId) {
      console.warn('Cannot calculate user level: No user ID provided');
      return { 
        level: 1, 
        title: "Beginner",
        progress: 0
      };
    }

    // Get total number of practice sessions
    const count = await getTotalPracticeSessions(userId);
    
    // Get average score
    const scoreQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(30) // Consider last 30 sessions for current level
    );

    const querySnapshot = await getDocs(scoreQuery);
    
    let averageScore = 0;
    let scoreCount = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.score) {
        averageScore += data.score;
        scoreCount++;
      }
    });
    
    if (scoreCount > 0) {
      averageScore = averageScore / scoreCount;
    }
    
    // Calculate level based on practice count and average score
    const levels = [
      { threshold: 0, title: "Beginner" },
      { threshold: 5, title: "Novice Communicator" },
      { threshold: 15, title: "Developing Communicator" },
      { threshold: 30, title: "Competent Communicator" },
      { threshold: 50, title: "Proficient Communicator" },
      { threshold: 75, title: "Advanced Communicator" },
      { threshold: 100, title: "Expert Communicator" },
      { threshold: 150, title: "Master Communicator" }
    ];
    
    let level = 1;
    let title = "Beginner";
    let nextThreshold = 5;
    let currentThreshold = 0;
    
    // Find current level
    for (let i = 0; i < levels.length; i++) {
      if (count >= levels[i].threshold) {
        level = i + 1;
        title = levels[i].title;
        currentThreshold = levels[i].threshold;
        nextThreshold = i < levels.length - 1 ? levels[i + 1].threshold : levels[i].threshold * 1.5;
      } else {
        break;
      }
    }
    
    // Adjust for score (higher average score can boost level)
    if (averageScore > 8.5 && level < levels.length) {
      level += 0.5;
      title = `Advanced ${title}`;
    } else if (averageScore < 6 && level > 1) {
      level -= 0.5;
    }
    
    // Calculate progress to next level
    const progressPercentage = Math.min(
      100,
      Math.round(((count - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    );
    
    return {
      level,
      title,
      progress: progressPercentage,
      nextMilestone: nextThreshold,
      letterGrade: convertScoreToLetterGrade(averageScore)
    };
  } catch (error) {
    console.error('Error calculating user level:', error);
    throw error;
  }
}

/**
 * Helper function to convert numeric score to letter grade
 * @param {number} score - Numeric score (0-10)
 * @returns {string} - Letter grade
 */
function convertScoreToLetterGrade(score) {
  if (score >= 9.5) return 'A+';
  if (score >= 9.0) return 'A';
  if (score >= 8.5) return 'A-';
  if (score >= 8.0) return 'B+';
  if (score >= 7.5) return 'B';
  if (score >= 7.0) return 'B-';
  if (score >= 6.5) return 'C+';
  if (score >= 6.0) return 'C';
  if (score >= 5.5) return 'C-';
  if (score >= 5.0) return 'D+';
  if (score >= 4.0) return 'D';
  return 'F';
}