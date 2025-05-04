export default {
  practice: {
    title: "提升您的句子",
    subtitle: "以更专业或自然的语调重写下面的句子",
    originalSentence: "原始句子：",
    yourImprovedVersion: "您的改进版本：",
    placeholder: "在此处重写句子...",
    getFeedback: "获取反馈",
    analyzing: "分析中...",
    cancel: "取消",
    tryAnother: "尝试另一个",
    yourVersion: "您的版本：",
    score: "得分：",
    feedback: "反馈：",
    suggestedVersion: "建议版本：",
    learningTips: "需要学习的语法和短语：",
    howHelpful: "这个反馈有多大帮助？",
    errorMessage: "无法获取反馈。请再试一次。"
  },
  feedback: {
    professionalism: "专业性",
    clarity: "清晰度",
    tone: "语调",
    grammar: "语法和词汇",
    noFeedback: "没有可用的反馈"
  },
  promptInstructions: `
    You are an expert in business English. Evaluate the following sentences:
    
    Original sentence: "{originalSentence}"
    Your rewritten version: "{userSentence}"
    
    Format your response as JSON with the following exact structure:
    {
      "feedback": {
        "professionalism": "Your analysis of professionalism here in Chinese",
        "clarity": "Your analysis of clarity here in Chinese",
        "tone": "Your analysis of tone here in Chinese",
        "grammar": "Your analysis of grammar and vocabulary here in Chinese"
      },
      "suggestedVersion": "Your suggested version here IN ENGLISH - do not translate this to Chinese",
      "learningTips": "Provide 1-2 specific grammar rules or useful phrases from the suggested version that the user should focus on learning (in Chinese)",
      "score": A number from 1 to 10 rating the overall improvement
    }
    
    All feedback should be in Chinese, but keep the suggestedVersion in English.
    
    YOUR RESPONSE MUST BE IN CHINESE (except for the suggestedVersion).
  `
};