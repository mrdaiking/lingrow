export default {
  practice: {
    title: "문장 개선하기",
    subtitle: "아래 문장을 더 전문적이거나 자연스러운 어조로 다시 작성하세요",
    originalSentence: "원래 문장:",
    yourImprovedVersion: "개선된 버전:",
    placeholder: "여기에 문장을 다시 작성하세요...",
    getFeedback: "피드백 받기",
    analyzing: "분석 중...",
    cancel: "취소",
    tryAnother: "다른 문장 시도하기",
    yourVersion: "당신의 버전:",
    score: "점수:",
    feedback: "피드백:",
    suggestedVersion: "제안된 버전:",
    howHelpful: "이 피드백이 얼마나 도움이 되었습니까?",
    errorMessage: "피드백을 가져오지 못했습니다. 다시 시도해 주세요."
  },
  feedback: {
    professionalism: "전문성",
    clarity: "명확성",
    tone: "어조",
    grammar: "문법 및 어휘",
    noFeedback: "이용 가능한 피드백이 없습니다"
  },
  promptInstructions: `
    당신은 비즈니스 영어 전문가입니다. 다음 문장들을 평가해 주세요:
    
    원래 문장: "{originalSentence}"
    사용자가 다시 작성한 버전: "{userSentence}"
    
    사용자의 문장에 관한 다음 사항에 대해 피드백을 제공하세요:
    1. 전문성
    2. 명확성
    3. 어조
    4. 문법 및 어휘
    
    그런 다음, 원래 문장의 개선된 버전을 제안하세요.
    
    다음 필드를 가진 JSON 형식으로 응답해 주세요:
    {
      "feedback": "한국어로 자세한 피드백을 여기에 작성하세요",
      "suggestedVersion": "한국어로 제안된 버전을 여기에 작성하세요",
      "score": 전반적인 개선도를 평가하는 1부터 10까지의 숫자
    }
    
    응답은 반드시 한국어로 작성해 주세요.
  `
};