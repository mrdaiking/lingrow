'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getPracticeHistory } from '../../services/practiceHistory';
import Link from 'next/link';
import { format } from 'date-fns';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { translations, language } = useLanguage();
  const { practice: t, history: h = {} } = translations;

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    if (user && !authLoading) {
      loadHistory();
    }
  }, [user, authLoading, selectedLanguage]);

  const loadHistory = async (reset = true) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const options = {
        pageSize: 10,
        lastVisible: reset ? null : lastVisible,
        language: selectedLanguage
      };

      const result = await getPracticeHistory(user.uid, options);
      
      setHistoryItems(reset ? result.items : [...historyItems, ...result.items]);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading practice history:', err);
      setError(h.errorLoading || 'Error loading your practice history');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadHistory(false);
    }
  };

  const handleLanguageFilter = (lang) => {
    setSelectedLanguage(lang === 'all' ? null : lang);
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 my-8 text-center">
        <p className="text-gray-500">{h.loading || 'Loading...'}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4 my-8">
        <div className="bg-white rounded-lg p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{h.notLoggedInTitle || 'Sign In Required'}</h2>
          <p className="text-gray-600 mb-6">{h.notLoggedInMessage || 'Please sign in to view your practice history.'}</p>
          <div className="flex justify-center space-x-4">
            <Link href="/login" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
              {h.signIn || 'Sign In'}
            </Link>
            <Link href="/register" className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg">
              {h.register || 'Register'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{h.title || 'Practice History'}</h1>
      
      {/* Language filter */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-2">{h.filterByLanguage || 'Filter by language:'}</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleLanguageFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${!selectedLanguage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {h.allLanguages || 'All Languages'}
          </button>
          {['en', 'es', 'zh', 'ja', 'ko', 'vi'].map(lang => (
            <button 
              key={lang}
              onClick={() => handleLanguageFilter(lang)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${selectedLanguage === lang ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {translations.languages ? translations.languages[lang] : lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {historyItems.length === 0 && !loading && (
        <div className="bg-white rounded-lg p-8 shadow-md text-center">
          <p className="text-gray-500">{h.noHistory || 'You have no practice history yet.'}</p>
          <Link href="/practice" className="mt-4 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
            {h.startPracticing || 'Start Practicing'}
          </Link>
        </div>
      )}

      {historyItems.length > 0 && (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <HistoryItem key={item.id} item={item} translations={translations} />
          ))}
          
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {loading ? (h.loading || 'Loading...') : (h.loadMore || 'Load More')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryItem({ item, translations }) {
  const [expanded, setExpanded] = useState(false);
  const { practice: t, history: h = {}, feedback: f } = translations;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">
                {item.score}/10
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {item.timestamp ? format(new Date(item.timestamp), 'PPP p') : ''}
                </p>
                <p className="text-xs text-gray-400">
                  {item.language ? `${translations.languages ? translations.languages[item.language] : item.language.toUpperCase()}` : ''}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">{t.originalSentence}</h3>
              <p className="text-gray-800 mb-3">{item.originalSentence}</p>
              
              <h3 className="text-sm font-medium text-gray-700">{t.yourVersion}</h3>
              <p className="text-gray-800 mb-3">{item.userSentence}</p>
              
              <h3 className="text-sm font-medium text-gray-700">{t.suggestedVersion}</h3>
              <p className="text-blue-600 font-medium">{item.suggestedVersion}</p>
            </div>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800"
          >
            {expanded ? (h.showLess || 'Show Less') : (h.showMore || 'Show More')}
          </button>
        </div>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t.feedback}</h3>
            {typeof item.feedback === 'object' && item.feedback !== null ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                {Object.entries(item.feedback).map(([category, content], index) => {
                  // Skip if this is not a feedback category (like score or suggestedVersion)
                  if (category === 'score' || category === 'suggestedVersion') return null;
                  
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
            ) : (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                {typeof item.feedback === 'string' ? item.feedback : (f.noFeedback || 'No feedback available')}
              </div>
            )}
            
            {item.learningTips && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t.learningTips}</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-gray-700">
                  {item.learningTips}
                </div>
              </div>
            )}
            
            {item.reaction && (
              <div className="mt-4 flex items-center">
                <h3 className="text-sm font-medium text-gray-700 mr-2">{h.yourReaction || 'Your Reaction:'}</h3>
                <div className="text-xl">{item.reaction}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}