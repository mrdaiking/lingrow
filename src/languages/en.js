export default {
  practice: {
    title: "Improve Your Sentence",
    subtitle: "Rewrite the sentence below in a more professional or natural tone",
    originalSentence: "Original Sentence:",
    yourImprovedVersion: "Your improved version:",
    placeholder: "Rewrite the sentence here...",
    getFeedback: "Get Feedback",
    analyzing: "Analyzing...",
    cancel: "Cancel",
    tryAnother: "Try Another",
    yourVersion: "Your Version:",
    score: "Score:",
    feedback: "Feedback:",
    suggestedVersion: "Suggested Version:",
    learningTips: "Grammar & Phrases to Learn:",
    howHelpful: "How helpful was this feedback?",
    errorMessage: "Failed to get feedback. Please try again."
  },
  feedback: {
    professionalism: "Professionalism",
    clarity: "Clarity",
    tone: "Tone",
    grammar: "Grammar and vocabulary",
    noFeedback: "No feedback available"
  },
  navbar: {
    practice: "Practice",
    dashboard: "Dashboard",
    history: "History",
    signIn: "Sign In",
    register: "Register",
    userMenu: "User Menu",
    signOut: "Sign Out"
  },
  history: {
    title: "Practice History",
    loading: "Loading your practice history...",
    errorLoading: "Failed to load your practice history. Please try again.",
    filterByLanguage: "Filter by language:",
    allLanguages: "All Languages",
    noHistory: "You have no practice history yet.",
    startPracticing: "Start Practicing",
    showMore: "Show More",
    showLess: "Show Less",
    loadMore: "Load More",
    yourReaction: "Your Reaction:",
    notLoggedInTitle: "Sign In Required",
    notLoggedInMessage: "Please sign in to view your practice history.",
    signIn: "Sign In",
    register: "Register"
  },
  dashboard: {
    title: "Your Dashboard",
    loading: "Loading dashboard data...",
    errorLoading: "Failed to load dashboard data. Please try again.",
    notLoggedInTitle: "Sign In Required",
    notLoggedInMessage: "Please sign in to view your dashboard.",
    signIn: "Sign In",
    register: "Register",
    totalSessions: "Total Practice Sessions",
    sessionCount: "sentences practiced",
    practiceMore: "Practice more",
    averageScore: "Average Score", 
    outOfTen: "out of 10",
    basedOn: "Based on your last",
    practices: "practices",
    recentScores: "Recent Scores",
    noScores: "No scores available yet.",
    lastTenScores: "Your last 10 practice scores",
    dueForReview: "Due for Review",
    noReviewItems: "No items due for review.",
    lastReviewed: "Last reviewed",
    practiced: "Practiced",
    markReviewed: "Mark as Reviewed",
    practiceSimilar: "Practice Similar",
    recentSubmissions: "Recent Submissions",
    noSubmissions: "No submissions available yet.",
    viewAllHistory: "View all history",
    currentStreak: "Current Streak",
    day: "day",
    days: "days",
    yourLevel: "Your Level",
    progressToNextLevel: "Progress to next level",
    practicesUntilNextLevel: "practices until next level",
    clarityScore: "Clarity Score",
    practiceCalendar: "Practice Calendar",
    practiceDays: "Practice days",
    focusAreas: "Your Focus Areas",
    noFocusAreas: "Complete more practice sessions to see your focus areas.",
    practiceFocusAreas: "Practice these areas",
    tipProfessionalism: "Try using more formal language and professional vocabulary in your sentences.",
    tipClarity: "Focus on making your sentences more clear and concise. Avoid ambiguity.",
    tipTone: "Work on adjusting your tone to match the context better. Check for overly passive or aggressive phrasing.",
    tipGrammar: "Pay special attention to grammar rules, verb tenses, and sentence structure in your practice."
  },
  languages: {
    en: "English",
    es: "Spanish",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    vi: "Vietnamese"
  },
  promptInstructions: `
    You are an expert in business English. Evaluate the following sentences:
    
    Original sentence: "{originalSentence}"
    Your rewritten version: "{userSentence}"
    
    Format your response as JSON with the following exact structure:
    {
      "feedback": {
        "professionalism": "Your analysis of professionalism here",
        "clarity": "Your analysis of clarity here",
        "tone": "Your analysis of tone here",
        "grammar": "Your analysis of grammar and vocabulary here"
      },
      "suggestedVersion": "Your suggested version here IN ENGLISH",
      "learningTips": "Provide 1-2 specific grammar rules or useful phrases from the suggested version that the user should focus on learning",
      "score": A number from 1 to 10 rating the overall improvement
    }
    
    Be thorough but concise in each section of your feedback.
  `
};