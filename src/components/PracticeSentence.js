'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function PracticeSentence({ originalSentence = "I finished the task." }) {
  const { translations, language } = useLanguage();
  const { practice: t, feedback: f } = translations;

  const [userSentence, setUserSentence] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [suggestedVersion, setSuggestedVersion] = useState('');
  const [reaction, setReaction] = useState(null);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Create a new AbortController instance
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    try {
      // Call our API endpoint to get AI feedback
      const response = await fetch('/api/score-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalSentence,
          userSentence,
          language // Pass the selected language to the API
        }),
        signal: signal, // Pass the signal to the fetch request
      });
      
      if (!response.ok) {
        throw new Error('Failed to get feedback');
      }
      
      const data = await response.json();
      setFeedback(data.feedback);
      setSuggestedVersion(data.suggestedVersion);
      setScore(data.score);
      setIsSubmitted(true);
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
    setScore(null);
    setError(null);
  };

  const renderFeedback = () => {
    // If feedback is a string, try to parse it for common patterns like numbered points
    if (typeof feedback === 'string') {
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
    
    // Handle object-based feedback
    if (typeof feedback === 'object' && feedback !== null) {
      return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          {Object.entries(feedback).map(([category, content], index) => {
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
          })}
        </div>
      );
    }
    
    // Fallback for no feedback
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-gray-500 italic">
        {f.noFeedback}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 my-8">
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </header>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Original sentence display */}
        <div className="p-6 bg-blue-50 border-b border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">{t.originalSentence}</h3>
          <p className="text-gray-800 font-medium">{originalSentence}</p>
        </div>

        {/* User input section */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="userSentence" className="block text-sm font-medium text-gray-700 mb-2">
              {t.yourImprovedVersion}
            </label>
            <textarea
              id="userSentence"
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 bg-transparent text-inherit"
              placeholder={t.placeholder}
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
                {t.getFeedback}
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