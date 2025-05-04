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
    const { originalSentence, userSentence, language = 'en' } = await request.json();

    // Validate input
    if (!originalSentence || !userSentence) {
      return NextResponse.json(
        { error: 'Original sentence and user sentence are required' },
        { status: 400 }
      );
    }
    
    // Get the appropriate translations based on language
    const translations = languages[language] || languages.en;

    // Replace placeholders in prompt instructions with actual values
    const promptInstructions = translations.promptInstructions
      .replace('{originalSentence}', originalSentence)
      .replace('{userSentence}', userSentence);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: promptInstructions }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
    });

    // Extract the JSON response
    const responseData = JSON.parse(completion.choices[0].message.content);

    // Return the formatted response
    return NextResponse.json({
      feedback: responseData.feedback,
      suggestedVersion: responseData.suggestedVersion,
      learningTips: responseData.learningTips || '',
      score: responseData.score
    });
    
  } catch (error) {
    console.error('Error scoring sentence:', error);
    return NextResponse.json(
      { error: 'Failed to score sentence' },
      { status: 500 }
    );
  }
}