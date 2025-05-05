'use client';

import { useState } from 'react';
import PracticeSentence from '../../components/PracticeSentence';

export default function PracticePage() {
  // Sample keyword sets for the practice challenges
  const keywordSets = [
    ["I", "finish", "task"],
    ["we", "talk", "project", "soon"],
    ["attach", "document", "ask"],
    ["can't", "make", "meeting"],
    ["let", "know", "need", "else"]
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <PracticeSentence 
          mode="keywords" 
          keywords={keywordSets}
        />
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Practice makes perfect! Use keywords to craft clear, professional sentences.</p>
        </div>
      </div>
    </div>
  );
}