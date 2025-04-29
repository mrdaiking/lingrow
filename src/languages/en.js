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
  promptInstructions: `
    You are an expert in business English. Evaluate the following sentences:
    
    Original sentence: "{originalSentence}"
    User's rewritten version: "{userSentence}"
    
    Provide feedback on the user's sentence regarding:
    1. Professionalism
    2. Clarity
    3. Tone
    4. Grammar and vocabulary
    
    Then, suggest an improved version of the original sentence.
    
    Format your response as JSON with these fields:
    {
      "feedback": "Your detailed feedback here",
      "suggestedVersion": "Your suggested version here",
      "score": A number from 1 to 10 rating the overall improvement
    }
  `
};