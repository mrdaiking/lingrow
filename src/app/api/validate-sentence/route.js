import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import en from '../../../languages/en';
import es from '../../../languages/es';
import zh from '../../../languages/zh';
import ja from '../../../languages/ja';
import ko from '../../../languages/ko';
import vi from '../../../languages/vi';

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Map of languages and their translation files
const languages = {
  en: en,
  es: es,
  zh: zh,
  ja: ja,
  ko: ko,
  vi: vi
};

export async function POST(request) {
  try {
    const { userSentence, keywords, language = 'en' } = await request.json();

    // Validate input
    if (!userSentence || !keywords) {
      return NextResponse.json(
        { error: 'User sentence and keywords are required' },
        { status: 400 }
      );
    }
    
    // Get the appropriate translations based on language
    const translations = languages[language] || languages.en;

    // Create a prompt for the keyword challenge with enhanced grammar and tense checking
    const promptInstructions = `
      You are a language tutor evaluating a sentence created using specific keywords.
      
      Keywords: ${keywords.join(', ')}
      User's sentence: ${userSentence}
      
      First, check if the user has included all the required keywords or their grammatical variants (different tenses, plurals, etc.).
      
      For each keyword, list whether it was used, including if a different form was used:
      
      {
        "keywordCheck": {
          ${keywords
            .map(
              (keyword) => `"${keyword}": { 
            "used": true/false, 
            "formFound": "actual word form found in the sentence or null", 
            "acceptable": true/false
          }`
            )
            .join(',')}
        }
      }
      
      Then, provide a complete analysis in JSON format with the following structure:
      {
        "keywordCheck": { ... as above ... },
        "feedback": {
          "feedbackMessage": "A specific, helpful message about the sentence structure, grammar, use of keywords, and any tense issues"
        },
        "suggestedVersion": "An improved version of the sentence that uses all the keywords appropriately",
        "learningTips": "A brief tip for improving similar sentences in the future, specifically addressing grammar and tense usage",
        "score": A score from 1 to 10 based on fluency, grammar, and natural use of keywords
      }
      
      Focus on:
      1. Whether each keyword or an acceptable grammatical variant is used appropriately
      2. Grammar correctness, especially tense consistency
      3. Sentence structure and clarity
      4. Natural flow and fluency
      
      Give lower scores when:
      - Keywords are missing or used in inappropriate forms
      - There are grammar or tense inconsistencies
      - The sentence is unclear or awkward
      - Keep the suggestedVersion in English
      
      Language: ${language}
    `

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: promptInstructions }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
    });

    // Extract the JSON response
    const responseData = JSON.parse(completion.choices[0].message.content);

    // Check if any keywords are missing based on the API's assessment
    const keywordCheck = responseData.keywordCheck || {};
    const missingKeywords = [];

    Object.entries(keywordCheck).forEach(([keyword, check]) => {
      if (!check.acceptable) {
        missingKeywords.push(keyword);
      }
    });

    // If keywords are missing, provide specific feedback
    if (missingKeywords.length > 0) {
      return NextResponse.json({
        feedback: {
          feedbackMessage: `You're missing or incorrectly using these keywords: ${missingKeywords.join(', ')}. Try using each keyword in an appropriate form.`
        },
        suggestedVersion: responseData.suggestedVersion || "Please try again using all the keywords in appropriate forms.",
        learningTips: responseData.learningTips || "Remember that you can modify keywords (change tense, make plural, etc.) as needed for your sentence to be grammatically correct.",
        score: 4.5,
        keywordCheck: responseData.keywordCheck
      });
    }

    // Return the complete feedback for valid sentences
    return NextResponse.json({
      feedback: responseData.feedback,
      suggestedVersion: responseData.suggestedVersion,
      learningTips: responseData.learningTips || '',
      score: responseData.score,
      keywordCheck: responseData.keywordCheck
    });
    
  } catch (error) {
    console.error('Error validating keyword sentence:', error);
    return NextResponse.json(
      { error: 'Failed to validate sentence' },
      { status: 500 }
    );
  }
}