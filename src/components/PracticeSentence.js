'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { savePracticeHistory } from '../services/practiceHistory';

export default function PracticeSentence({ originalSentence, mode = 'improve', keywords = [] }) {
  const { translations, language } = useLanguage();
  const { user } = useAuth();
  const { practice: t, feedback: f } = translations;

  const [userSentence, setUserSentence] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [suggestedVersion, setSuggestedVersion] = useState('');
  const [learningTips, setLearningTips] = useState('');
  const [reaction, setReaction] = useState(null);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historySaved, setHistorySaved] = useState(false);
  const abortControllerRef = useRef(null);
  const [currentKeywords, setCurrentKeywords] = useState(keywords);

  // Function to shuffle and pick a random set of keywords if in keyword mode
  const shuffleKeywords = () => {
    if (mode === 'keywords' && Array.isArray(keywords) && keywords.length > 0) {
      // If we have multiple keyword sets, select a random one
      if (Array.isArray(keywords[0])) {
        const randomIndex = Math.floor(Math.random() * keywords.length);
        setCurrentKeywords(keywords[randomIndex]);
      } else {
        setCurrentKeywords(keywords);
      }
      
      // Reset state when shuffling
      handleReset();
    }
  };

  // Initialize keywords on component mount
  useEffect(() => {
    if (mode === 'keywords') {
      shuffleKeywords();
    }
  }, [mode, keywords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHistorySaved(false);
    
    // Create a new AbortController instance
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    try {
      // Different API endpoints and data depending on mode
      if (mode === 'improve') {
        // Traditional sentence improvement mode
        const response = await fetch('/api/score-sentence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originalSentence,
            userSentence,
            language
          }),
          signal: signal,
        });
        
        if (!response.ok) {
          throw new Error('Failed to get feedback');
        }
        
        const data = await response.json();
        setFeedback(data.feedback);
        setSuggestedVersion(data.suggestedVersion);
        setLearningTips(data.learningTips || '');
        setScore(data.score);
        setIsSubmitted(true);
        
        // Save to practice history if user is logged in
        if (user) {
          try {
            await savePracticeHistory(user.uid, {
              originalSentence,
              userSentence,
              suggestedVersion: data.suggestedVersion,
              feedback: data.feedback,
              learningTips: data.learningTips || '',
              score: data.score,
              language
            });
            setHistorySaved(true);
          } catch (historyError) {
            console.error('Error saving practice history:', historyError);
          }
        }
      } else if (mode === 'keywords') {
        // Keyword challenge mode - Send to API directly without client-side keyword validation
        // Let the API handle tense variations and grammatical forms
        const response = await fetch('/api/validate-sentence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userSentence,
            keywords: currentKeywords,
            language
          }),
          signal: signal,
        });
        
        if (!response.ok) {
          throw new Error('Failed to get feedback');
        }
        
        const data = await response.json();
        setFeedback(data.feedback);
        setSuggestedVersion(data.suggestedVersion);
        setLearningTips(data.learningTips || '');
        setScore(data.score);
        setIsSubmitted(true);
        
        // Save to practice history if user is logged in
        if (user) {
          try {
            await savePracticeHistory(user.uid, {
              userSentence,
              suggestedVersion: data.suggestedVersion,
              feedback: data.feedback,
              learningTips: data.learningTips || '',
              score: data.score,
              language,
              keywords: currentKeywords
            });
            setHistorySaved(true);
          } catch (historyError) {
            console.error('Error saving practice history:', historyError);
          }
        }
      }
    } catch (err) {
      // Check if this was a cancellation error
      if (err.name === 'AbortError') {
        console.log('Request was cancelled');
      } else {
        console.error('Error getting feedback:', err);
        setError(t.errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update reaction in history when it changes
  useEffect(() => {
    const updateReaction = async () => {
      if (user && isSubmitted && reaction && historySaved) {
        try {
          const historyData = {
            userSentence,
            suggestedVersion,
            feedback,
            learningTips: learningTips || '',
            score,
            language,
            reaction
          };
          
          // Add mode-specific properties
          if (mode === 'improve') {
            historyData.originalSentence = originalSentence;
          } else if (mode === 'keywords') {
            historyData.keywords = currentKeywords;
          }
          
          await savePracticeHistory(user.uid, historyData);
        } catch (err) {
          console.error('Error updating reaction in history:', err);
        }
      }
    };
    
    updateReaction();
  }, [reaction]);

  const handleCancel = () => {
    // Cancel the ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsLoading(false);
  };
  
  const handleReaction = (emoji) => {
    setReaction(emoji);
    // In a real app, you might want to send this feedback to your backend
    console.log(`User reaction: ${emoji}`);
  };

  const handleReset = () => {
    setUserSentence('');
    setIsSubmitted(false);
    setReaction(null);
    setFeedback('');
    setSuggestedVersion('');
    setLearningTips('');
    setScore(null);
    setError(null);
    setHistorySaved(false);
  };

  const renderFeedback = () => {
    // If feedback is an object with feedbackMessage (keyword challenge format)
    if (typeof feedback === 'object' && feedback !== null && feedback.feedbackMessage) {
      return (
        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-blue-800">
          {feedback.feedbackMessage}
        </div>
      );
    }
    
    // If feedback is a string, try to parse it for common patterns like numbered points
    if (typeof feedback === 'string') {
      // Try to parse string feedback in case it's JSON
      try {
        const parsedFeedback = JSON.parse(feedback);
        if (parsedFeedback && typeof parsedFeedback === 'object') {
          // Handle the parsed object
          return renderObjectFeedback(parsedFeedback);
        }
      } catch (e) {
        // Not JSON, continue with string handling
      }
      
      // Check if the feedback contains numbered points (like "1. Professionalism:")
      if (feedback.match(/\d+\.\s+\w+:/)) {
        // Split by numbered points
        const feedbackPoints = feedback.split(/(?=\d+\.\s+\w+:)/).filter(point => point.trim());
        
        if (feedbackPoints.length > 0) {
          return (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              {feedbackPoints.map((point, index) => {
                // Try to extract the category name
                const categoryMatch = point.match(/^\d+\.\s+(\w+):/);
                const category = categoryMatch ? categoryMatch[1] : null;
                const content = category ? point.replace(/^\d+\.\s+\w+:\s*/, '') : point;
                
                return (
                  <div key={index} className={`${index > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''}`}>
                    {category && (
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 font-medium text-sm">
                          {index + 1}
                        </div>
                        <h4 className="font-medium text-blue-600">{category}</h4>
                      </div>
                    )}
                    <div className="ml-8 text-gray-700">{content.trim()}</div>
                  </div>
                );
              })}
            </div>
          );
        }
      }
      
      // Default string display if no patterns detected
      return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-gray-700">
          {feedback}
        </div>
      );
    }

    console.log('Rendering feedback object:', feedback);
    
    // Handle object-based feedback
    if (typeof feedback === 'object' && feedback !== null) {
      return renderObjectFeedback(feedback);
    }
    
    // Fallback for no feedback
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-gray-500 italic">
        {f.noFeedback}
      </div>
    );
  };
  
  // Helper function to render object-based feedback consistently
  const renderObjectFeedback = (feedbackObj) => {
    console.log('Rendering feedback object:', feedbackObj);
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        {Object.entries(feedbackObj).map(([category, content], index) => {
          // Skip if this is not a feedback category (like score or suggestedVersion)
          if (category === 'score' || category === 'suggestedVersion' || 
              category === 'suggestedSentence' || category === 'feedbackMessage') return null;
          
          // Try to translate the category
          const translatedCategory = f[category.toLowerCase()] || category;
          
          return (
            <div key={category} className={`${index > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''}`}>
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 font-medium text-sm">
                  {index + 1}
                </div>
                <h4 className="font-medium text-blue-600 capitalize">{translatedCategory}</h4>
              </div>
              <div className="ml-8 text-gray-700">{content}</div>
            </div>
          );
        }).filter(Boolean)}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 my-8">
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {mode === 'improve' ? t.title : 'Keyword Challenge'}
        </h2>
        <p className="text-gray-600">
          {mode === 'improve' ? t.subtitle : 'Create a complete sentence using all the keywords below'}
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Content differs based on mode */}
        {mode === 'improve' ? (
          /* Original sentence display for improve mode */
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">{t.originalSentence}</h3>
            <p className="text-gray-800 font-medium">{originalSentence}</p>
          </div>
        ) : (
          /* Keywords display for keyword mode */
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Keywords:</h3>
            <div className="flex flex-wrap gap-2">
              {currentKeywords.map((keyword, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium text-sm"
                >
                  {keyword}
                </div>
              ))}
            </div>
            {/* Shuffle button for keyword mode */}
            {Array.isArray(keywords) && keywords.length > 0 && (
              <div className="mt-4 text-center">
                <button 
                  onClick={shuffleKeywords}
                  className="inline-flex items-center px-4 py-1.5 bg-white border border-blue-100 hover:bg-gray-50 text-blue-700 rounded-lg transition-colors duration-200 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Shuffle Keywords
                </button>
              </div>
            )}
          </div>
        )}

        {/* User input section */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="userSentence" className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'improve' ? t.yourImprovedVersion : 'Write your sentence:'}
            </label>
            <textarea
              id="userSentence"
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 bg-transparent text-inherit"
              placeholder={mode === 'improve' ? t.placeholder : 'Type your sentence using all the keywords...'}
              required
              disabled={isSubmitted || isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {!isSubmitted ? (
            isLoading ? (
              <div className="flex gap-2">
                <div className="flex-grow bg-blue-400 text-white font-medium rounded-lg px-4 py-2.5 flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.analyzing}
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  {t.cancel}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200"
              >
                {mode === 'improve' ? t.getFeedback : 'Submit Sentence'}
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200"
            >
              {t.tryAnother}
            </button>
          )}
        </form>

        {/* Feedback section, shown after submission */}
        {isSubmitted && (
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t.yourVersion}</h3>
              <p className="bg-white p-3 rounded border border-gray-200 text-gray-800">{userSentence}</p>
            </div>
            
            {score && (
              <div className="mb-4 flex items-center">
                <h3 className="text-sm font-medium text-gray-700 mr-2">{t.score}</h3>
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {score}/10
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t.feedback}</h3>
              {renderFeedback()}
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t.suggestedVersion}</h3>
              <div className="bg-white p-3 rounded border border-gray-200 text-gray-800 font-medium">
                {suggestedVersion}
              </div>
            </div>

            {learningTips && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t.learningTips}</h3>
                <div className="bg-white p-3 rounded border border-gray-200 text-gray-800">
                  {learningTips}
                </div>
              </div>
            )}
            
            {/* Reaction buttons */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">{t.howHelpful}</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleReaction('👍')}
                  className={`p-2.5 rounded-full ${reaction === '👍' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  👍
                </button>
                <button 
                  onClick={() => handleReaction('🎯')}
                  className={`p-2.5 rounded-full ${reaction === '🎯' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  🎯
                </button>
                <button 
                  onClick={() => handleReaction('💡')}
                  className={`p-2.5 rounded-full ${reaction === '💡' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  💡
                </button>
                <button 
                  onClick={() => handleReaction('😕')}
                  className={`p-2.5 rounded-full ${reaction === '😕' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  😕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}