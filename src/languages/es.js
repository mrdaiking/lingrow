export default {
  practice: {
    title: "Mejora tu frase",
    subtitle: "Reescribe la frase a continuación en un tono más profesional o natural",
    originalSentence: "Frase original:",
    yourImprovedVersion: "Tu versión mejorada:",
    placeholder: "Reescribe la frase aquí...",
    getFeedback: "Obtener comentarios",
    analyzing: "Analizando...",
    cancel: "Cancelar",
    tryAnother: "Intentar otra",
    yourVersion: "Tu versión:",
    score: "Puntuación:",
    feedback: "Comentarios:",
    suggestedVersion: "Versión sugerida:",
    learningTips: "Gramática y frases para aprender:",
    howHelpful: "¿Qué tan útil fue este comentario?",
    errorMessage: "No se pudo obtener comentarios. Por favor intenta de nuevo."
  },
  feedback: {
    professionalism: "Profesionalismo",
    clarity: "Claridad",
    tone: "Tono",
    grammar: "Gramática y vocabulario",
    noFeedback: "No hay comentarios disponibles"
  },
  promptInstructions: `
    You are an expert in business English. Evaluate the following sentences:
    
    Original sentence: "{originalSentence}"
    Your rewritten version: "{userSentence}"
    
    Format your response as JSON with the following exact structure:
    {
      "feedback": {
        "professionalism": "Your analysis of professionalism here in Spanish",
        "clarity": "Your analysis of clarity here in Spanish",
        "tone": "Your analysis of tone here in Spanish",
        "grammar": "Your analysis of grammar and vocabulary here in Spanish"
      },
      "suggestedVersion": "Your suggested version here IN ENGLISH - do not translate this to Spanish",
      "learningTips": "Provide 1-2 specific grammar rules or useful phrases from the suggested version that the user should focus on learning (in Spanish)",
      "score": A number from 1 to 10 rating the overall improvement
    }
    
    All feedback should be in Spanish, but keep the suggestedVersion in English.
    
    YOUR RESPONSE MUST BE IN SPANISH (except for the suggestedVersion).
  `
};