'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import MiniCalendar from '../../components/MiniCalendar';
import UserLevel from '../../components/UserLevel';
import { 
  getTotalPracticeSessions, 
  getRecentScores, 
  getItemsDueForReview,
  markItemAsReviewed,
  getPracticeStreak,
  getPracticeCalendar,
  analyzeFeedbackFocusAreas,
  calculateUserLevel
} from '../../services/dashboardService';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { translations } = useLanguage();
  const { dashboard: d = {} } = translations;
  
  const [totalSessions, setTotalSessions] = useState(0);
  const [recentScores, setRecentScores] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [dueItems, setDueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageScore, setAverageScore] = useState(0);
  
  const [streak, setStreak] = useState(0);
  const [calendarData, setCalendarData] = useState({});
  const [focusAreas, setFocusAreas] = useState([]);
  const [userLevel, setUserLevel] = useState({
    level: 1,
    title: "Beginner",
    progress: 0,
    letterGrade: "B"
  });

  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const count = await getTotalPracticeSessions(user.uid);
      setTotalSessions(count);

      const scores = await getRecentScores(user.uid, 10);
      if (scores.length > 0) {
        const sum = scores.reduce((acc, score) => acc + score.score, 0);
        const avg = (sum / scores.length).toFixed(1);
        setAverageScore(avg);
      }
      setRecentScores(scores.reverse());

      const submissions = await getRecentScores(user.uid, 5);
      setRecentSubmissions(submissions);

      const reviewItems = await getItemsDueForReview(user.uid, 5);
      setDueItems(reviewItems);

      const currentStreak = await getPracticeStreak(user.uid);
      setStreak(currentStreak);

      const calendar = await getPracticeCalendar(user.uid);
      setCalendarData(calendar);

      const feedbackAnalysis = await analyzeFeedbackFocusAreas(user.uid);
      setFocusAreas(feedbackAnalysis.focusAreas);

      const level = await calculateUserLevel(user.uid);
      setUserLevel(level);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(d.errorLoading || 'Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReviewed = async (itemId, reviewCount) => {
    try {
      await markItemAsReviewed(itemId, reviewCount);
      const updatedReviewItems = await getItemsDueForReview(user.uid, 5);
      setDueItems(updatedReviewItems);
    } catch (err) {
      console.error('Error marking item as reviewed:', err);
    }
  };

  const getPracticeTip = () => {
    if (focusAreas.length === 0) return null;
    const area = focusAreas[0];
    const { category } = area;
    const tips = {
      professionalism: d.tipProfessionalism || "Try using more formal language in your sentences",
      clarity: d.tipClarity || "Focus on making your sentences more clear and concise",
      tone: d.tipTone || "Work on adjusting your tone to match the context better",
      grammar: d.tipGrammar || "Pay special attention to grammar rules in your practice"
    };
    return tips[category] || null;
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 my-8 text-center">
        <p className="text-gray-500">{d.loading || 'Loading dashboard data...'}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-4 my-8">
        <div className="bg-white rounded-lg p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{d.notLoggedInTitle || 'Sign In Required'}</h2>
          <p className="text-gray-600 mb-6">{d.notLoggedInMessage || 'Please sign in to view your dashboard.'}</p>
          <div className="flex justify-center space-x-4">
            <Link href="/login" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
              {d.signIn || 'Sign In'}
            </Link>
            <Link href="/register" className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg">
              {d.register || 'Register'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{d.title || 'Your Dashboard'}</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">{d.totalSessions || 'Total Sessions'}</p>
            <p className="text-xl font-bold text-gray-800">{totalSessions}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">{d.averageScore || 'Average Score'}</p>
            <p className="text-xl font-bold text-gray-800">{averageScore}/10</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-orange-100 p-3 mr-3">
            <div className="text-2xl text-orange-600">🔥</div>
          </div>
          <div>
            <p className="text-sm text-gray-500">{d.currentStreak || 'Current Streak'}</p>
            <div className="flex items-center">
              <p className="text-xl font-bold text-gray-800">{streak}</p>
              <p className="ml-1 text-gray-600">{streak === 1 ? (d.day || 'day') : (d.days || 'days')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">{d.clarityScore || 'Clarity Score'}</p>
            <p className="text-xl font-bold text-gray-800">{userLevel.letterGrade}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <UserLevel userLevel={userLevel} translations={translations} />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{d.focusAreas || 'Your Focus Areas'}</h2>
            
            {focusAreas.length === 0 ? (
              <p className="text-gray-500">{d.noFocusAreas || 'Complete more practice sessions to see your focus areas.'}</p>
            ) : (
              <div className="space-y-3">
                {focusAreas.map((area, index) => (
                  <div key={area.category} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="text-md font-medium text-gray-800 capitalize">
                      {translations.feedback?.[area.category] || area.category}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {d[`tip${area.category.charAt(0).toUpperCase() + area.category.slice(1)}`] || 
                       `Focus on improving your ${area.category}.`}
                    </p>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Link 
                    href="/practice" 
                    className="text-sm inline-flex items-center text-blue-600 font-medium"
                  >
                    {d.practiceFocusAreas || 'Practice these areas'} 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{d.recentScores || 'Recent Scores'}</h2>
            {recentScores.length === 0 ? (
              <p className="text-gray-500">{d.noScores || 'No scores available yet.'}</p>
            ) : (
              <>
                <div className="flex items-end h-32 gap-1">
                  {recentScores.map((score, index) => (
                    <div key={score.id} className="relative flex-1">
                      <div 
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t" 
                        style={{ height: `${score.score * 10}%` }}
                      ></div>
                      <div className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
                        {index === 0 || index === recentScores.length - 1 ? format(score.timestamp, 'MMM d') : ''}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center text-sm text-gray-500">
                  {d.lastTenScores || 'Your last 10 practice scores'}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{d.dueForReview || 'Due for Review'}</h2>
            {dueItems.length === 0 ? (
              <p className="text-gray-500">{d.noReviewItems || 'No items due for review.'}</p>
            ) : (
              <div className="space-y-4">
                {dueItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{item.originalSentence}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.lastReviewed ? (
                            `${d.lastReviewed || 'Last reviewed'}: ${formatDistanceToNow(item.lastReviewed, { addSuffix: true })}`
                          ) : (
                            `${d.practiced || 'Practiced'}: ${formatDistanceToNow(item.timestamp, { addSuffix: true })}`
                          )}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {item.score}/10
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-3">
                      <button 
                        onClick={() => handleMarkAsReviewed(item.id, item.reviewCount)}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        {d.markReviewed || 'Mark as Reviewed'}
                      </button>
                      <Link 
                        href={`/practice?sentence=${encodeURIComponent(item.originalSentence)}`}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
                      >
                        {d.practiceSimilar || 'Practice Similar'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{d.practiceCalendar || 'Practice Calendar'}</h2>
            <MiniCalendar practiceDates={calendarData} translations={translations} />
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                <span>{d.practiceDays || 'Practice days'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{d.recentSubmissions || 'Recent Submissions'}</h2>
            {recentSubmissions.length === 0 ? (
              <p className="text-gray-500">{d.noSubmissions || 'No submissions available yet.'}</p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.slice(0, 5).map((submission, index) => (
                  <Link 
                    key={submission.id}
                    href={`/history?id=${submission.id}`}
                    className="block p-3 border border-gray-100 hover:border-gray-300 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">
                          {submission.score}/10
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-800">Sentence #{index + 1}</p>
                          <p className="text-gray-500">{format(submission.timestamp, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
                <div className="mt-4 text-center">
                  <Link 
                    href="/history"
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    {d.viewAllHistory || 'View all history'} 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}