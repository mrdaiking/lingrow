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
    User's rewritten version: "{userSentence}"
    
    Provide feedback on the user's sentence regarding:
    1. Professionalism
    2. Clarity
    3. Tone
    4. Grammar and vocabulary
    
    Then, suggest an improved version of the original sentence.
    
    Format your response as JSON with these fields:
    {
      "feedback": "Your detailed feedback here in Spanish",
      "suggestedVersion": "Your suggested version here in Spanish",
      "score": A number from 1 to 10 rating the overall improvement
    }
    
    YOUR RESPONSE MUST BE IN SPANISH.
  `
};