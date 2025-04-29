'use client';

import PracticeSentence from '../../components/PracticeSentence';
import LanguageSelector from '../../components/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

export default function PracticePage() {
  // Get translations for this page
  const { translations } = useLanguage();
  
  // Sample sentences - in a real app, these would come from a database or API
  const exampleSentences = [
    "I finished the task.",
    "We need to talk about the project soon.",
    "I'm attaching the document you asked for.",
    "I can't make the meeting.",
    "Let me know if you need anything else."
  ];
  
  // For now, just use the first sentence as an example
  const sampleSentence = exampleSentences[0];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Business English Practice
          </h1>
          
          {/* Language selector */}
          <div className="w-32">
            <LanguageSelector />
          </div>
        </div>
        
        <PracticeSentence originalSentence={sampleSentence} />
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Practice makes perfect! Rewrite business sentences to improve your communication skills.
          </p>
        </div>
      </div>
    </div>
  );
}